# Repair/review source retained as evidence. Replay requires the matching per-task baselines and shared order_editor.py; scratch paths are explicit below.
from pathlib import Path
import sys,shutil,json
sys.path.insert(0,'/tmp/spot-order-fixes');sys.path.insert(0,'/tmp/spot-order-fixes/group1')
exec(Path('/tmp/spot-order-fixes/group1/repair.py').read_text().split('def merge(')[0])
ROOT=Path('/home/soney/nucode/spot-web');TARGET=OUT/'root-residual-candidates';SNAP=OUT/'root-residual-baseline';TARGET.mkdir(exist_ok=True);SNAP.mkdir(exist_ok=True)
PLANS2={
 'oney-expressing-interactivity-states-cmu2015': {'inline':['644:0','2085:0','2107:0','2131:0','2141:0','2497:0','2505:0','2649:0'],'notes':[('648:0','644:0'),('2054:0','2048:0'),('2091:0','2085:0'),('2113:0','2107:0'),('2318:0','2311:0'),('2472:0','2468:0'),('2499:0','2497:0'),('2509:0','2505:0'),('2654:0','2649:0')]},
 'krosnick-scrapeviz-vlhcc2024': {'inline':['239:0','242:0','249:0','252:0']}}
for stem,plan in PLANS2.items():
 for source in [ROOT/'assets/pdfs'/(stem+'.pdf'),ROOT/'script/publication-markdown/source-tags'/(stem+'.json.gz')]:
  snap=SNAP/source.name
  if not snap.exists():shutil.copy2(source,snap)
  shutil.copy2(snap,TARGET/source.name)
 e=Editor(stem+'.pdf',pdf_path=TARGET/(stem+'.pdf'),archive_path=TARGET/(stem+'.json.gz'));changes=[]
 for nid in plan['inline']:
  n=e.node(nid);before=sequence_text(n)
  for v in list(walk(n)):
   if v.get('kind')=='element':reorder_scripts(v)
  after=sequence_text(n);assert before!=after
  changes.append({'kind':'inline_footnote_order','node':nid,'before':before,'after':after,'evidence':'Read raised footnote marker against the rendered source paragraph; only same-line native children reordered.'})
 if 'notes'in plan:
  e.node('2499:0')['role']='Note'
  changes.append({'kind':'footnote_role','node':'2499:0','before':'P','after':'Note'})
  for note,anchor in plan['notes']:
   e.move_after(note,anchor);changes.append({'kind':'footnote_after_reference_paragraph','node':note,'after':anchor,'text':sequence_text(e.node(note))})
 report=e.save(changes);(OUT/(stem+'.residual-changes.json')).write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n');print(stem,len(changes),report['after_sha256'])
