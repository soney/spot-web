"""Repair five visually verified heading/paragraph splits without painting changes.
Default makes repaired copies in --output-dir. --apply explicitly updates --repo.
Only structure /K arrays and ParentTree assignments change in native PDFs;
PyMuPDF incremental save preserves object IDs and existing content streams.
Archive content children move identically; heading/P text and boxes are updated.
"""
import argparse,copy,gzip,hashlib,json,shutil
from pathlib import Path
import pikepdf
import pymupdf
REPAIRS={
'wang-colaroid-chi2023.pdf':[
 dict(heading=949,paragraph=950,parent=944,page_object=105,mcids=[505,506,507,508],insert_at=2,prefix=' Git for Code Versioning.',text='4.7.1 Leveraging Git for Code Versioning.'),
 dict(heading=1109,paragraph=1110,parent=1105,page_object=626,mcids=[488,489,490],insert_at=2,prefix=' Benefits for Learners.',text='6.2.3 Perceived Benefits for Learners.'),
 dict(heading=1119,paragraph=1120,parent=1105,page_object=626,mcids=[406],insert_at=2,prefix=' Setup.',text='7.1.2 Study Setup.')],
'zhang-editrail-uist2026.pdf':[
 dict(heading=967,paragraph=968,parent=958,page_object=485,mcids=[644],insert_at=2,prefix=' analysis.',text='3.1.2 Data analysis.'),
 dict(heading=1108,paragraph=1109,parent=1096,page_object=198,mcids=list(range(564,572)),insert_at=2,prefix=' using the baseline, participants believed they had a\n',text='6.3.2 When using the baseline, participants believed they had a\nbetter understanding of students’ AI usage than they actually demon-\nstrated.')]
}
def walk(n):
 if isinstance(n,list):
  for c in n:yield from walk(c)
 elif isinstance(n,dict):
  yield n;yield from walk(n.get('children',[]))
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def update_box(n):
 boxes={}
 for c in walk(n.get('children',[])):
  for o in c.get('ops',[]):
   if o.get('bbox') is not None:boxes.setdefault(str(o['page']),[]).append(o['bbox'])
 n['bbox_by_page']={p:[min(b[0] for b in bs),min(b[1] for b in bs),max(b[2] for b in bs),max(b[3] for b in bs)] for p,bs in boxes.items()}
 n['pages']=sorted(map(int,boxes))
def repair_file(pdf_path,archive_path,repairs):
 archive=json.load(gzip.open(archive_path));assert sha(pdf_path)==archive['pdf_sha256'], 'PDF/archive hash mismatch'
 nodes={n.get('id'):n for n in walk(archive['tree']) if n.get('id')};writes=[];changed_trees={};changed_arrays={};before=sha(pdf_path)
 with pikepdf.open(pdf_path) as pdf:
  trees={}
  def number_tree(n):
   nums=n.get('/Nums',[])
   for i in range(0,len(nums),2):trees[int(nums[i])]=(n,nums,i+1)
   for k in n.get('/Kids',[]):number_tree(k)
  number_tree(pdf.Root.StructTreeRoot.ParentTree)
  for r in repairs:
   h=pdf.get_object((r['heading'],0));p=pdf.get_object((r['paragraph'],0));page=pdf.get_object((r['page_object'],0))
   assert str(h.S)=='/H4' and str(p.S)=='/P'
   assert h.P.objgen==p.P.objgen==(r['parent'],0)
   hk=list(h.K);pk=list(p.K);ms=r['mcids'];assert all(pk.count(m)==1 and m not in hk for m in ms)
   removed=[k for k in pk if isinstance(k,int) and k in ms];assert removed==ms
   pk=[k for k in pk if not(isinstance(k,int) and k in ms)];hk[r['insert_at']:r['insert_at']]=ms
   writes.append((r['heading'],'K',pikepdf.Array(hk).unparse().decode('ascii')))
   writes.append((r['paragraph'],'K',pikepdf.Array(pk).unparse().decode('ascii')))
   tree,nums,slot=trees[int(page.StructParents)];arr=nums[slot]
   for m in ms:
    assert arr[m].objgen==(r['paragraph'],0),f'Unexpected ParentTree owner for {m}'
    arr[m]=h
   if arr.is_indirect:changed_arrays[arr.objgen[0]]=arr
   else:changed_trees[tree.objgen[0]]=tree
   hn=nodes[f"{r['heading']}:0"];pn=nodes[f"{r['paragraph']}:0"]
   keypage=f"{r['page_object']}:0";moved=[c for c in pn['children'] if c.get('key',[None,None])[0]==keypage and c.get('key',[None,None])[1] in ms]
   assert [c['key'][1] for c in moved]==ms
   pn['children']=[c for c in pn['children'] if c not in moved];hn['children'][r['insert_at']:r['insert_at']]=moved
   assert pn['text'].startswith(r['prefix']),repr(pn['text'][:120]);pn['text']=pn['text'][len(r['prefix']):].lstrip();hn['text']=r['text']
   update_box(hn);update_box(pn)
  for x,n in changed_trees.items():
   assert x>0,'Direct ParentTree leaf not supported';writes.append((x,'Nums',n.Nums.unparse().decode('ascii')))
  array_writes=[(x,pikepdf.Array(list(a)).unparse().decode('ascii')) for x,a in changed_arrays.items()]
 with pymupdf.open(pdf_path) as native:
  for x,k,v in writes:native.xref_set_key(x,k,v)
  for x,v in array_writes:native.update_object(x,v)
  native.saveIncr()
 archive['pdf_sha256']=sha(pdf_path)
 for override in archive.get('reviewed_overrides',{}).values():
  if override.get('source_sha256')==before:override['source_sha256']=archive['pdf_sha256']
 with gzip.GzipFile(filename=str(archive_path),mode='wb',mtime=0) as out:out.write(json.dumps(archive,ensure_ascii=False,separators=(',',':')).encode())
 return dict(file=Path(pdf_path).name,before=before,after=archive['pdf_sha256'],repairs=repairs,painted_content_changed=False)
def main():
 a=argparse.ArgumentParser();a.add_argument('--repo',type=Path,default=Path('/home/soney/nucode/spot-web'));a.add_argument('--output-dir',type=Path,default=Path('/tmp/spot-pdf-oct-review/group3-heading-repaired'));a.add_argument('--apply',action='store_true');args=a.parse_args();results=[]
 for file,rs in REPAIRS.items():
  pdf=args.repo/'assets/pdfs'/file;arc=args.repo/'script/publication-markdown/source-tags'/(Path(file).stem+'.json.gz')
  if not args.apply:
   args.output_dir.mkdir(parents=True,exist_ok=True);pdfout=args.output_dir/file;arcout=args.output_dir/arc.name;shutil.copy2(pdf,pdfout);shutil.copy2(arc,arcout);pdf,arc=pdfout,arcout
  results.append(repair_file(pdf,arc,rs))
 print(json.dumps(results,ensure_ascii=False,indent=2))
if __name__=='__main__':main()
