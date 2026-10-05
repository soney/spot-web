"""Repair five source-verified structure issues with incremental PDF updates.
Default repairs temporary copies; --apply updates the supplied repository.
Reads each current hash-bound PDF/archive pair, preserving earlier alt changes.
No page content, font, image, annotation or drawing objects are modified.
"""
import argparse,copy,gzip,hashlib,json,shutil
from pathlib import Path
import pikepdf
import pymupdf
FILES=['arab-co-advisor-vlhcc2025.pdf','zhang-vizprog-chi2023.pdf','pandey-explore-create-annotate-chi2020.pdf','chen-sifter-imx2020.pdf','krosnick-scrapeviz-vlhcc2024.pdf']
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def walk(n):
 if isinstance(n,list):
  for c in n:yield from walk(c)
 elif isinstance(n,dict):
  yield n;yield from walk(n.get('children',[]))
def token(v):
 if v is None:return 'null'
 return v.unparse().decode('ascii') if hasattr(v,'unparse') else str(v)
def array(vs):return '[ '+' '.join(token(v) for v in vs)+' ]'
def update_boxes(n):
 boxes={}
 for c in walk(n.get('children',[])):
  for o in c.get('ops',[]):
   if o.get('bbox') is not None:boxes.setdefault(str(o['page']),[]).append(o['bbox'])
 n['bbox_by_page']={p:[min(b[0] for b in bs),min(b[1] for b in bs),max(b[2] for b in bs),max(b[3] for b in bs)] for p,bs in boxes.items()}
 n['pages']=sorted(map(int,boxes))
def rewrite_parenttree(native,page_id,old_owner,assignments,writes):
 page=native.get_object((page_id,0));key=int(page.StructParents)
 def leaves(n):
  if '/Nums' in n:yield n
  for k in n.get('/Kids',[]):yield from leaves(k)
 matches=[]
 for leaf in leaves(native.Root.StructTreeRoot.ParentTree):
  nums=leaf.Nums
  for off in range(0,len(nums),2):
   if int(nums[off])==key:matches.append((leaf,nums,off+1))
 assert len(matches)==1
 leaf,nums,slot=matches[0];owners=nums[slot]
 for m in assignments:assert owners[m].objgen==(old_owner,0),(m,owners[m].objgen)
 owned='[ '+' '.join(f'{assignments[i]} 0 R' if i in assignments else token(o) for i,o in enumerate(owners))+' ]'
 if owners.is_indirect:writes.append((owners.objgen[0],None,owned))
 else:
  assert leaf.is_indirect
  writes.append((leaf.objgen[0],'Nums','[ '+' '.join(owned if i==slot else token(v) for i,v in enumerate(nums))+' ]'))
def repair_file(path,archive_path):
 data=json.loads(gzip.decompress(archive_path.read_bytes()));before=sha(path)
 assert data['pdf_sha256']==before,'Current PDF and archive must have matching hashes'
 nodes={n['id']:n for n in walk(data['tree']) if n.get('id')};writes=[];changes=[]
 with pikepdf.open(path) as native,pymupdf.open(path) as pdf:
  file=path.name
  if file==FILES[0]:
   assert str(native.get_object((515,0)).S)=='/P';writes.append((515,'S','/H3'));nodes['515:0']['role']='H3'
   changes.append(dict(kind='heading_role',node='515:0',page=7,old='P',new='H3',reason='Visible RQ1 subsection A matches subsection B level.'))
  elif file==FILES[1]:
   heading=native.get_object((1083,0));paragraph=native.get_object((1084,0));ms=list(range(956,963));hk=list(heading.K);pk=list(paragraph.K)
   assert str(heading.S)=='/H4' and str(paragraph.S)=='/P' and hk==[954,955,973,974,975,976]
   assert pk[:7]==ms and heading.P.objgen==paragraph.P.objgen==(1060,0)
   hk[2:2]=ms;pk=pk[7:];writes.extend([(1083,'K',array(hk)),(1084,'K',array(pk))])
   rewrite_parenttree(native,388,1084,{m:1083 for m in ms},writes)
   hn=nodes['1083:0'];pn=nodes['1084:0'];moved=pn['children'][:7]
   assert [c.get('key') for c in moved]==[['388:0',m] for m in ms]
   pn['children']=pn['children'][7:];hn['children'][2:2]=moved
   prefix=' helps participants understand issues faster in live\n';assert pn['text'].startswith(prefix)
   pn['text']=pn['text'][len(prefix):].lstrip();hn['text']='5.2.2 VizProg helps participants understand issues faster in live\nsettings than the baseline.'
   update_boxes(hn);update_boxes(pn)
   changes.append(dict(kind='heading_content',heading='1083:0',paragraph='1084:0',page=11,mcids=ms,heading_text=hn['text']))
  elif file==FILES[2]:
   old=native.get_object((783,0));new=native.get_object((779,0));node=native.get_object((502,0))
   assert node.P.objgen==(783,0)
   oks=list(old.K);nks=list(new.K);assert sum(k.objgen==(502,0) for k in oks)==1
   oks=[k for k in oks if k.objgen!=(502,0)];pos=next(i for i,k in enumerate(nks) if k.objgen==(489,0))+1;nks.insert(pos,node)
   writes.extend([(783,'K',array(oks)),(779,'K',array(nks)),(502,'P','779 0 R')])
   oldkids=nodes['783:0']['children'];newkids=nodes['779:0']['children'];child=nodes['502:0'];oldkids.remove(child);newkids.insert(newkids.index(nodes['489:0'])+1,child)
   update_boxes(nodes['783:0']);update_boxes(nodes['814:0']);update_boxes(nodes['779:0'])
   changes.append(dict(kind='affiliation_order',page=1,node='502:0',old_parent='783:0',new_parent='779:0',after='489:0'))
  elif file==FILES[3]:
   original=native.get_object((409,0));assert original.P.objgen==(407,0) and str(original.S)=='/P'
   groups=[[10,11,16,17,18,23,24,25,33],[12,13,19,20,26,27,28,34],[36,37,43,44,45,51,52,53,54,63],[38,39,40,46,47,48,55,56,57,58,64]]
   assert sorted(sum(groups,[]))==sorted(list(original.K))
   ids=[409]+[pdf.get_new_xref() for _ in range(3)]
   texts=['Yan Chen\nUniversity of Michigan\nAnn Arbor, Michigan\nyanchenm@umich.edu','Andrés Monroy-Hernández\nSnap Inc.\nSeattle, WA, USA\namh@snap.com','Steve Oney\nUniversity of Michigan\nAnn Arbor, MI, USA\nsoney@umich.edu','Walter S. Lasecki\nUniversity of Michigan\nAnn Arbor, MI, USA\nwlasecki@umich.edu']
   base=copy.deepcopy(nodes['409:0']);created=[];assign={}
   for obj,ms,txt in zip(ids,groups,texts):
    if obj==409:writes.append((obj,'K',array(ms)))
    else:writes.append((obj,None,f'<< /Type /StructElem /S /P /P 407 0 R /Pg 22 0 R /K {array(ms)} >>'))
    child=copy.deepcopy(base);child['id']=f'{obj}:0';child['children']=[c for c in base['children'] if c.get('key',[None,None])[1] in ms];child['text']=txt
    assert [c['key'][1] for c in child['children']]==ms;update_boxes(child);created.append(child)
    assign.update({m:obj for m in ms})
   nativekids=list(native.get_object((407,0)).K);ix=next(i for i,k in enumerate(nativekids) if k.objgen==(409,0))
   assert [k.objgen for k in nativekids[ix:ix+3]]==[(409,0),(410,0),(411,0)]
   order=[ids[0],ids[1],410,ids[2],ids[3],411]
   kt=[token(k) for k in nativekids];kt[ix:ix+3]=[f'{x} 0 R' for x in order];writes.append((407,'K','[ '+' '.join(kt)+' ]'))
   kids=nodes['407:0']['children'];idx=kids.index(nodes['409:0']);assert [n['id'] for n in kids[idx:idx+3]]==['409:0','410:0','411:0']
   kids[idx:idx+3]=[created[0],created[1],nodes['410:0'],created[2],created[3],nodes['411:0']]
   rewrite_parenttree(native,22,409,assign,writes)
   changes.append(dict(kind='author_columns',page=1,original='409:0',author_order=[f'{x}:0' for x in order],author_groups=[dict(node=f'{x}:0',mcids=ms,text=txt) for x,ms,txt in zip(ids,groups,texts)]))
  elif file==FILES[4]:
   parent=native.get_object((38,0));kids=list(parent.K);targets=[47,200]
   assert all(native.get_object((x,0)).P.objgen==(38,0) for x in targets)
   moved=[next(k for k in kids if k.objgen==(x,0)) for x in targets];kids=[k for k in kids if k.objgen[0] not in targets];ix=next(i for i,k in enumerate(kids) if k.objgen==(43,0));kids[ix:ix]=moved
   writes.append((38,'K',array(kids)))
   children=nodes['38:0']['children'];m=[nodes[f'{x}:0'] for x in targets]
   for n in m:children.remove(n)
   ix=children.index(nodes['43:0']);children[ix:ix]=m
   for x in targets:writes.append((x,'S','/Note'));nodes[f'{x}:0']['role']='Note'
   changes.append(dict(kind='notes_order',page=1,nodes=['47:0','200:0'],before='43:0',role='Note',reason='Restore sentence continuity between paragraphs46 and201.'))
  else:raise ValueError(file)
  for x,k,v in writes:
   if k is None:pdf.update_object(x,v)
   else:pdf.xref_set_key(x,k,v)
  pdf.saveIncr()
 data['pdf_sha256']=sha(path)
 for override in data.get('reviewed_overrides',{}).values():
  if override.get('source_sha256')==before:override['source_sha256']=data['pdf_sha256']
 data.setdefault('structure_revisions',[]).append(dict(date='2026-10-05',baseline_pdf_sha256=before,changes=changes))
 archive_path.write_bytes(gzip.compress((json.dumps(data,ensure_ascii=False,separators=(',',':'))+'\n').encode(),mtime=0))
 return dict(file=path.name,before_sha256=before,after_sha256=data['pdf_sha256'],source_tags_sha256=sha(archive_path),changes=changes,painted_content_changed=False)
def main():
 p=argparse.ArgumentParser();p.add_argument('--repo',type=Path,default=Path('/home/soney/nucode/spot-web'));p.add_argument('--output-dir',type=Path,default=Path('/tmp/spot-pdf-oct-review/group2-structure-repaired'));p.add_argument('--apply',action='store_true');a=p.parse_args();out=[]
 for file in FILES:
  pdf=a.repo/'assets/pdfs'/file;arc=a.repo/'script/publication-markdown/source-tags'/(Path(file).stem+'.json.gz')
  if not a.apply:
   a.output_dir.mkdir(parents=True,exist_ok=True);po=a.output_dir/file;ao=a.output_dir/arc.name;shutil.copy2(pdf,po);shutil.copy2(arc,ao);pdf,arc=po,ao
  out.append(repair_file(pdf,arc))
 print(json.dumps(out,ensure_ascii=False,indent=2))
if __name__=='__main__':main()
