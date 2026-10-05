"""Read-only comparison of current publication PDFs with source-tag archives.
Checks SHA-256, complete reachable element set, mapped roles, Alt/ActualText,
structure parents, and exact ordered K child identities/content references/OBJRs.
Also verifies every accepted proposed_alt from the final visual-review JSONs.
Derived archive text/bboxes and marked-content stream semantics are outside this
comparison; use the structural validator for marked-content/ParentTree validity.
"""
import argparse,collections,gzip,hashlib,json
from pathlib import Path
import pikepdf

def ident(obj):
 if obj is None:return None
 pair=getattr(obj,'objgen',(0,0))
 return ':'.join(map(str,pair))
def values(v):
 if v is None:return []
 return list(v) if isinstance(v,pikepdf.Array) else [v]
def avalues(v):return v if isinstance(v,list) else [v]
def role(raw,mapping):
 seen=set()
 while raw in mapping and raw not in seen:seen.add(raw);raw=mapping[raw]
 return raw

def check(pdf_path,archive_path,proposals):
 data=json.loads(gzip.decompress(archive_path.read_bytes()));issues=[];aliases=[];counts=collections.Counter()
 def issue(code,**detail):issues.append(dict(code=code,**detail))
 pdf_hash=hashlib.sha256(pdf_path.read_bytes()).hexdigest()
 if data['pdf_sha256']!=pdf_hash:issue('pdf_hash',archive=data['pdf_sha256'],native=pdf_hash)
 with pikepdf.open(pdf_path) as pdf:
  root=pdf.Root.StructTreeRoot;root_id=ident(root);mapping={str(k).lstrip('/'):str(v).lstrip('/') for k,v in root.get('/RoleMap',{}).items()};amapping=data.get('rolemap',{})
  if mapping!=amapping:issue('rolemap',archive=amapping,native=mapping)
  native={};archive={}
  def ntoken(k,page,parent):
   if isinstance(k,int):counts['native_content_references']+=1;return ['content',ident(page),int(k)]
   if not hasattr(k,'get'):issue('native_unknown_child',parent=parent,value=str(k));return ['unknown',str(k)]
   kp=k.get('/Pg',page);kind=str(k.get('/Type',''))
   if kind=='/MCR' or '/MCID' in k:
    counts['native_content_references']+=1;return ['content',ident(k.get('/Stm',kp)),int(k.MCID)]
   if kind=='/OBJR':counts['native_annotations']+=1;return ['annotation',ident(k.get('/Obj'))]
   id=ident(k)
   if id in native:issue('native_repeated_element',node=id)
   else:
    rec={'role':str(k.get('/S','')).lstrip('/'),'alt':str(k.get('/Alt','')),'actual':str(k.get('/ActualText','')),'parent':ident(k.get('/P')),'children':[]}
    native[id]=rec
    if rec['parent']!=parent:issue('native_parent_inconsistent_with_tree',node=id,field=rec['parent'],tree=parent)
    rec['children']=[ntoken(c,kp,id) for c in values(k.get('/K'))]
   return ['element',id]
  nroots=[ntoken(k,None,root_id) for k in values(root.get('/K'))]
  def atoken(n,parent):
   kind=n.get('kind')
   if kind=='content':counts['archive_content_references']+=1;return ['content',*n['key']]
   if kind=='annotation':counts['archive_annotations']+=1;return ['annotation',n['object']]
   if kind!='element':issue('archive_unknown_child',parent=parent,kind=kind);return ['unknown',kind]
   id=n['id']
   if id in archive:issue('archive_repeated_element',node=id)
   else:
    rec={'role':n.get('role',''),'alt':n.get('alt',''),'actual':n.get('actual',''),'parent':parent,'children':[]};archive[id]=rec
    rec['children']=[atoken(c,id) for c in n.get('children',[])]
   return ['element',id]
  aroots=[atoken(n,root_id) for n in avalues(data['tree'])]
  if nroots!=aroots:issue('root_order',archive=aroots,native=nroots)
  if set(native)!=set(archive):issue('element_set',missing_from_archive=sorted(set(native)-set(archive)),missing_from_native=sorted(set(archive)-set(native)))
  for id in sorted(set(native)&set(archive)):
   nr,ar=native[id],archive[id]
   if role(nr['role'],mapping)!=role(ar['role'],amapping):issue('element_role',node=id,archive=ar['role'],native=nr['role'])
   elif nr['role']!=ar['role']:aliases.append({'node':id,'archive':ar['role'],'native':nr['role'],'resolved':role(nr['role'],mapping)})
   for field in ['alt','actual','parent']:
    if nr[field]!=ar[field]:issue('element_'+field,node=id,archive=ar[field],native=nr[field])
   if nr['children']!=ar['children']:
    # Include full ordered tokens: enough evidence to reproduce an ownership/order discrepancy.
    issue('child_order_or_reference',node=id,archive=ar['children'],native=nr['children'])
  proposal_checks=[]
  for prop in proposals:
   id=prop['node'];native_obj=pdf.get_object(tuple(map(int,id.split(':'))));alt=str(native_obj.get('/Alt',''));actual=str(native_obj.get('/ActualText',''))
   ok=alt==prop['proposed_alt'];proposal_checks.append({'node':id,'page':prop.get('page'),'matches':ok,'actual_text_empty':not actual})
   if not ok:issue('accepted_proposal_alt',node=id,expected=prop['proposed_alt'],native=alt)
   if actual:issue('accepted_proposal_actualtext_override',node=id,actual=actual)
 counts['native_elements']=len(native);counts['archive_elements']=len(archive);counts['proposals_checked']=len(proposal_checks)
 return dict(file=pdf_path.name,pdf_sha256=pdf_hash,archive_sha256=hashlib.sha256(archive_path.read_bytes()).hexdigest(),counts=dict(counts),role_alias_equivalences=aliases,proposal_checks=proposal_checks,passed=not issues,issues=issues)

def main():
 p=argparse.ArgumentParser(description=__doc__);p.add_argument('--repo',type=Path,default=Path('/home/soney/nucode/spot-web'));p.add_argument('--review-dir',type=Path);p.add_argument('--output',type=Path,default=Path('/tmp/spot-pdf-oct-review/archive-native-sync.json'));args=p.parse_args()
 review=args.review_dir or args.repo/'script/pdf-accessibility-review/2026-10-05/visual-review';proposals=collections.defaultdict(dict);review_docs=set();proposal_conflicts=[]
 for rfile in sorted(review.glob('*.json')):
  for rec in json.loads(rfile.read_text()):
   review_docs.add(rec['file'])
   for f in rec['figures']:
    if not f.get('proposed_alt'):continue
    old=proposals[rec['file']].get(f['node'])
    if old and old['proposed_alt']!=f['proposed_alt']:proposal_conflicts.append({'file':rec['file'],'node':f['node']})
    proposals[rec['file']][f['node']]=f
 archive_dir=args.repo/'script/publication-markdown/source-tags';archive_paths=sorted(archive_dir.glob('*.json.gz'));reports=[]
 for archive in archive_paths:
  file=archive.name.removesuffix('.json.gz')+'.pdf';path=args.repo/'assets/pdfs'/file
  if not path.exists():reports.append({'file':file,'passed':False,'issues':[{'code':'missing_pdf'}]});continue
  try:reports.append(check(path,archive,list(proposals[file].values())))
  except Exception as e:reports.append({'file':file,'passed':False,'issues':[{'code':'exception','message':repr(e)}]})
 pdfs={p.name for p in (args.repo/'assets/pdfs').glob('*.pdf')};archived={r['file'] for r in reports};totals=collections.Counter()
 for r in reports:totals.update(r.get('counts',{}))
 summary={'pdf_count':len(pdfs),'archive_count':len(archive_paths),'review_document_count':len(review_docs),'passed_documents':sum(r['passed'] for r in reports),'counts':dict(totals),'missing_archives':sorted(pdfs-archived),'missing_review_records':sorted(pdfs-review_docs),'proposal_conflicts':proposal_conflicts,'issue_counts':dict(collections.Counter(i['code'] for r in reports for i in r['issues'])),'unexpected_differences':sum(len(r['issues']) for r in reports)}
 result={'method':__doc__,'summary':summary,'documents':reports};args.output.parent.mkdir(parents=True,exist_ok=True);args.output.write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n');print(json.dumps(summary,indent=2))
 raise SystemExit(0 if not summary['unexpected_differences'] and not summary['missing_archives'] and not proposal_conflicts else 1)
if __name__=='__main__':main()
