from pathlib import Path
import gzip,hashlib,json,shutil
R=Path('/home/soney/nucode/spot-web'); C=Path('/tmp/spot-ua-final/final-metadata'); H=R/'script/publication-markdown'
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def write(p,d):p.write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n')
def walk(nodes):
 if isinstance(nodes,dict):nodes=[nodes]
 for n in nodes:
  yield n
  yield from walk(n.get('children',[]))
report=json.loads((C/'identification.json').read_text())
for row in report:
 f=row['file']; pdf=R/'assets/pdfs'/f; archive=H/'source-tags'/Path(f).with_suffix('.json.gz');data=json.loads(gzip.decompress(archive.read_bytes()))
 assert sha(pdf)==row['before_sha256']==data['pdf_sha256'],f
 if not row['already_identified']:
  assert sha(C/f)==row['after_sha256'];shutil.copy2(C/f,pdf)
  data.setdefault('formal_pdfua_revisions',[]).append({'date':'2026-10-05','before_sha256':row['before_sha256'],'after_sha256':row['after_sha256'],'change':'Add PDF/UA-1 identification to existing XMP after reviewed structural and semantic repairs; only the metadata object changes.'})
  data['pdf_sha256']=row['after_sha256']
  for x in data.get('reviewed_overrides',{}).values():x['source_sha256']=data['pdf_sha256']
  archive.write_bytes(gzip.compress((json.dumps(data,ensure_ascii=False,separators=(',',':'))+'\n').encode(),mtime=0))
# Rebind narrow reviewed decisions only after matching their current content.
archives={p.name.removesuffix('.json.gz')+'.pdf':json.loads(gzip.decompress(p.read_bytes())) for p in (H/'source-tags').glob('*.gz')}
nodes={f:{n.get('id'):n for n in walk(a['tree']) if n.get('kind')=='element'} for f,a in archives.items()}
for name in ['reviewed-overrides.json','reviewed-crops.json','reviewed-code-layout.json']:
 p=H/name;rows=json.loads(p.read_text())
 for x in rows:
  f=x['pdf'];n=nodes[f][x['node']]
  if name=='reviewed-overrides.json':assert n['actual']==x['text']+('\n'+x['caption'] if x.get('caption') else ''),(f,x['node'])
  if name=='reviewed-code-layout.json':assert n['text']==x['text'],(f,x['node'])
  x['source_sha256']=archives[f]['pdf_sha256'];x['formal_pdfua_revalidation']='Source node content remains exact after nonvisual artifact/list/metadata repairs; complete page appearance comparison recorded separately.'
 write(p,rows)
p=H/'image-paths.json';d=json.loads(p.read_text())
for x in d['names']:
 assert x['node'] in nodes[x['pdf']],(x['pdf'],x['node'])
 x['source_sha256']=archives[x['pdf']]['pdf_sha256']
write(p,d)
print('Installed metadata and rebound',len(report),'source archives plus reviewed decisions')
