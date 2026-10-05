import json,hashlib
from pathlib import Path
H=Path('/home/soney/nucode/spot-web/script/publication-markdown'); B=Path('/tmp/spot-order-fixes/markdown-before')
old=json.loads((B/'manifest.json').read_text());now=json.loads((H/'manifest.json').read_text());paths=json.loads((H/'image-paths.json').read_text())
oldassets={a['path']:a for d in old['documents'] for a in d['assets']}; assets={a['path']:a for d in now['documents'] for a in d['assets']}
assert not assets.keys()-oldassets.keys(),assets.keys()-oldassets.keys()
assert all(a['sha256']==oldassets[p]['sha256'] for p,a in assets.items()),'An existing image changed pixels'
retained=json.loads((B/'image-paths.json').read_text())['retained']
for p in sorted(oldassets.keys()-assets.keys()):retained.append({'path':p,'sha256':oldassets[p]['sha256'],'reason':'Preserve the image URL used by earlier Markdown downloads; current downloads read this callout inline in the relevant sentence.'})
assert not set(a['path'] for a in retained)&assets.keys()
for a in retained: assert hashlib.sha256((H/a['path']).read_bytes()).hexdigest()==a['sha256']
paths['retained']=retained;(H/'image-paths.json').write_text(json.dumps(paths,indent=2)+'\n')
report={'before_reading_order_images':len(oldassets),'current_images':len(assets),'retained_images':len(retained),'published_urls':len(assets)+len(retained),'all_existing_image_bytes_unchanged_this_round':True,'retained':retained}
Path('/tmp/spot-order-fixes/markdown-image-compatibility.json').write_text(json.dumps(report,indent=2)+'\n');print({k:v for k,v in report.items() if k!='retained'})
