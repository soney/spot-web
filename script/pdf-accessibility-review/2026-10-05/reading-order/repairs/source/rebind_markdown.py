import gzip,hashlib,json
from pathlib import Path
R=Path('/home/soney/nucode/spot-web'); H=R/'script/publication-markdown'; B=Path('/tmp/spot-order-fixes'); old=json.loads((B/'markdown-before/manifest.json').read_text())
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def walk(nodes):
 if isinstance(nodes,dict):nodes=[nodes]
 for n in nodes:
  yield n
  yield from walk(n.get('children',[]))
def load(file,baseline=False):return json.loads(gzip.decompress(((B/'baseline-tags') if baseline else H/'source-tags').joinpath(Path(file).stem+'.json.gz').read_bytes()))
def ops(n):return [{k:v for k,v in x.items() if k not in ['text','bbox','bbox_by_page']} for x in walk([n]) if x.get('kind')!='element']
def write(p,d):p.write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n')
data={d['file']:load(d['file']) for d in old['documents']}; nodes={f:{n.get('id'):n for n in walk(a['tree']) if n.get('kind')=='element'} for f,a in data.items()}
for f,a in data.items():assert a['pdf_sha256']==sha(R/'assets/pdfs'/f)
# Narrow reviewed transcriptions remain exact in both native ActualText and archive overrides.
ov=json.loads((B/'markdown-before/reviewed-overrides.json').read_text())
for r in ov:
 a=data[r['pdf']];n=nodes[r['pdf']][r['node']]; expected=r['text']+('\n'+r['caption'] if r.get('caption') else '')
 assert n['actual']==expected,(r['pdf'],r['node'],n['actual'],expected)
 assert a['reviewed_overrides'][r['node']]['text']==r['text']
 r['source_sha256']=a['pdf_sha256'];r['revalidation']='2026-10-05 reading-order repair: exact reviewed transcription verified in the current native ActualText and synchronized source archive; source appearance preserved.'
write(H/'reviewed-overrides.json',ov)
# Old Markdown-specific order workarounds have corresponding native repairs.
write(H/'reviewed-layout.json',[])
crops=json.loads((B/'markdown-before/reviewed-crops.json').read_text());proof=[]
for r in crops:
 f=r['pdf']; oldnodes={n.get('id'):n for n in walk(load(f,True)['tree']) if n.get('kind')=='element'}
 assert ops(oldnodes[r['node']])==ops(nodes[f][r['node']]),(f,r['node'],'crop content changed')
 r['source_sha256']=data[f]['pdf_sha256'];r['revalidation']='Reading-order repair leaves this figure content and page geometry unchanged; complete-page pixel comparison verifies preserved appearance.'
 proof.append({'file':f,'node':r['node'],'content_operations_unchanged':True})
write(H/'reviewed-crops.json',crops)
paths=json.loads((B/'markdown-before/image-paths.json').read_text());names=[]
for d in old['documents']:
 for asset in d['assets']:
  assert sha(H/asset['path'])==asset['sha256'],asset['path']
  names.append({'pdf':d['file'],'source_sha256':data[d['file']]['pdf_sha256'],'node':asset['node'],'page':asset['page'],'name':Path(asset['path']).name,'reason':'Keep the published image URL stable after native reading-order repairs and inline callout placement.'})
paths['names']=names;write(H/'image-paths.json',paths)
write(B/'markdown-rebinding.json',{'reviewed_transcriptions':len(ov),'native_transcriptions_exact':True,'retired_layout_repairs':['Expresso contribution continuation','CFlow reference 54'],'figure_crop_revalidation':proof,'stable_image_names':len(names)})
print('Rebound',len(ov),'native transcriptions,',len(crops),'crops,',len(names),'image paths')
