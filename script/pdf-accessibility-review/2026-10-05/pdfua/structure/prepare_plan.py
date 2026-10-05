from pathlib import Path
import sys,json,gzip,re,hashlib,collections,pikepdf
ROOT=Path('/home/soney/nucode/spot-web');OUT=Path('/tmp/spot-ua-final/artifacts')
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def walk(n):
 if isinstance(n,list):
  for v in n:yield from walk(v)
 elif isinstance(n,dict):
  yield n
  for v in n.get('children',[]):yield from walk(v)
# Explicitly reviewed text-origin bands; generic margin tests are not used.
# All bands were inspected as decoded text; exclusions below contain real-content
# alternatives/duplicates and do not receive pagination typing.
manual={
'oney-expressing-interactivity-states-cmu2015':{'Header':[(745.6,746.5)],'Footer':[(53.9,54.1)]},
'oney-natural-language-search-mit2008':{'Footer':[(52.7,52.9)]},
'chen-expert-crowd-support-ci2016':{'Header':[(699.6,701.4),(760.8,761)],'Footer':[(106.8,107.1)]},
'chen-on-demand-collaboration-programming-msnfws2020':{'Header':[(713.2,713.5)],'Footer':[(127,127.2)]},
'oney-creating-guided-code-cscw2018':{'Header':[(652.7,653)],'Footer':[(39.4,39.8),(125.2,125.5)]},
'oney-edbooks-preprint2024':{'Header':[(714.1,714.3)],'Footer':[(127,127.2),(149.8,150.1)]},
'oney-euclase-live2013':{'Footer':[(34.1,34.3)]},
'oney-implementing-multi-touch-gestures-chi2019':{'Header':[(729.9,730.1)]},
'oney-interstate-uist2014':{},'oney-playbook-iseud2011':{},
'pandey-understanding-accessibility-collaboration-cscw2021':{'Header':[(652.2,652.5),(665.3,665.5)],'Footer':[(39.4,39.8),(75.5,75.7),(98,98.2)]},
'wang-colaroid-chi2023':{'Header':[(724.6,724.8)]},
'wang-how-data-scientists-cscw2019':{'Header':[(652.8,653)],'Footer':[(39.4,39.8),(125.2,125.5)]},
'wang-puzzleme-cscw2021':{'Header':[(652.2,652.5)],'Footer':[(39.4,39.8),(125.2,125.5)]},
'wang-redesigning-notebooks-data-husdat2019':{'Header':[(530.8,531)]},
'zhang-codestream-chi2026':{'Header':[(724.6,724.8)]},
'zhang-editrail-uist2026':{'Header':[(724.6,724.8)]},
}
# Remaining documents' artifact text occupies only these verified publication
# header/page-number/footer bands (read in the saved inventory).
common_headers=[(623.3,623.6),(646.7,646.9),(658.7,658.9),(724.6,724.8),(725.4,725.6),(760.7,760.9),(761.9,762.1),(776.9,777.1),(786.9,787.1)]
common_footers=[(14.9,15.1),(21.8,22),(29.9,30.1),(30.4,30.6),(34.1,34.3),(35,35.2),(37.9,38.1),(44.1,44.6),(47.7,47.9),(53.9,54.1),(63.7,63.9)]
files=[];untouched_text=[]
for ip in sorted((OUT/'inventory').glob('*.json')):
 inv=json.loads(ip.read_text());name=inv['file'];src=ROOT/'assets/pdfs'/name;stem=src.stem
 # Code repairs can change non-content PDF objects; bind to CURRENT PDF and
 # rely on stream hashes for exact artifact target identity.
 rec={'file':name,'pdf_sha256':sha(src),'artifacts':[],'lists':[]}
 bands=manual.get(stem,{'Header':common_headers,'Footer':common_footers})
 for a in inv['artifacts']:
  if not a['points']:continue
  lo,hi=a['bbox_y'];matches=[kind for kind,bs in bands.items()if any(l<=lo<=hi<=h for l,h in bs)]
  if not matches:
   if a['text'].strip():untouched_text.append({'file':name,'page':a['page'],'text':a['text'],'bbox_y':a['bbox_y']})
   continue
  assert len(matches)==1
  kind=matches[0]
  if not a['text'].strip():
   # A blank text chunk alone cannot establish pagination purpose. Require
   # same-page, same-baseline reviewed nonblank furniture as its anchor.
   anchors=[x for x in inv['artifacts']if x['page']==a['page']and x['text'].strip()and x['bbox_y']and abs(x['bbox_y'][0]-lo)<0.2 and abs(x['bbox_y'][1]-hi)<0.2]
   if not anchors:continue
  if a['attrs'].get('/Type')=='/Pagination'and a['attrs'].get('/Subtype')=='/'+kind:continue
  assert not a['nontext_ops'] or (name=='pandey-understanding-accessibility-collaboration-cscw2021.pdf'and a['page']==1 and a['text']=='129 'and a['nontext_ops']=={'f':1}),(name,a) # reviewed shaded first-page article number
  rec['artifacts'].append({**{k:a[k]for k in ['page','stream','marked_ordinal','instruction','operator','attrs','text','bbox_y','stream_sha256']},**({'streams':a['streams']}if a.get('streams')else{}),'subtype':kind})
 data=json.loads(gzip.decompress((ROOT/'script/publication-markdown/source-tags'/(stem+'.json.gz')).read_bytes()));pdf=pikepdf.open(src)
 for n in walk(data['tree']):
  if n.get('role')!='L':continue
  labels=[x for child in n.get('children',[])if child.get('role')=='LI' for x in child.get('children',[])if x.get('role')=='Lbl'];texts=[(l.get('actual')or l.get('text','')).strip()for l in labels]
  if not texts:continue
  obj=pdf.get_object(tuple(map(int,n['id'].split(':'))));a=obj.get('/A');attrs=list(a)if isinstance(a,pikepdf.Array)else[a]if a is not None else[]
  clas=obj.get('/C');classes=list(clas)if isinstance(clas,pikepdf.Array)else[clas]if clas is not None else[]
  cm=pdf.Root.StructTreeRoot.get('/ClassMap',{})
  for cl in classes:
   if isinstance(cl,pikepdf.Name):
    av=cm.get(cl);attrs.extend(list(av)if isinstance(av,pikepdf.Array)else[av]if av is not None else[])
  numberings=[str(o.get('/ListNumbering'))for o in attrs if isinstance(o,pikepdf.Dictionary)and o.get('/ListNumbering')is not None]
  types=[]
  for t in texts:
   if re.fullmatch(r'[\[(]?\d+[.)\]:]?',t):types.append('Decimal')
   elif re.fullmatch(r'[a-z][.)]',t):types.append('LowerAlpha')
   elif re.fullmatch(r'[A-Z][.)]',t):types.append('UpperAlpha')
   else:types.append(None)
  # Reference lists may lack Lbl on inherited entries; consider all extant
  # labels and make no inference from the number of list items.
  if not all(types)or len(set(types))!=1:continue
  expected=types[0]
  if numberings==['/'+expected]:continue
  if numberings:raise AssertionError((name,n['id'],numberings,expected))
  rec['lists'].append({'node':n['id'],'pages':n.get('pages'),'labels':texts,'ListNumbering':expected,'before_A':a.unparse().decode()if a is not None else None,'class_attributes':list(map(str,classes))})
 if rec['artifacts']or rec['lists']:files.append(rec)
plan={'review':'Explicit decoded artifact text bands reviewed against running publisher/chapter/author titles, page numbers and publication footers. Body/reference text, code/figure alternatives and footnotes excluded. Ordered-list labels individually inspected for decimal/letter numbering.','requirements':['Matterhorn 18-001','Matterhorn 18-002','Matterhorn 16-001'],'files':files,'counts':{'pdfs':len(files),'artifact_pdfs':sum(bool(f['artifacts'])for f in files),'artifacts':sum(len(f['artifacts'])for f in files),'list_pdfs':sum(bool(f['lists'])for f in files),'lists':sum(len(f['lists'])for f in files)},'exclusions':untouched_text}
(OUT/'plan.json').write_text(json.dumps(plan,ensure_ascii=False,indent=2)+'\n');print(json.dumps(plan['counts']));print('listtypes',collections.Counter(x['ListNumbering']for f in files for x in f['lists']));print('artifact streams',collections.Counter('multiple'if a.get('streams')else'single'for f in files for a in f['artifacts']))
