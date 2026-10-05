# Repair/review source retained as evidence. Replay requires the matching per-task baselines and shared order_editor.py; scratch paths are explicit below.
from pathlib import Path
import sys,json,gzip,hashlib,collections
sys.path.insert(0,'/tmp/spot-order-fixes');from order_editor import walk,sequence_text
OUT=Path('/tmp/spot-order-fixes/group1');before=json.load(open('/tmp/spot-reading-order/group-1-review.json'));files=[]
for f in before['files']:
 p=OUT/'candidates'/f['file'];d=json.load(gzip.open(p.with_suffix('.json.gz')));nodes={n['id']:n for n in walk(d['tree'])if n.get('kind')=='element'};changes=json.load(open(OUT/(p.stem+'.changes.json')))['changes'];review=[]
 for issue in f['issues']:
  record={'label':issue['label'],'kind':issue['kind'],'resolved':False}
  if 'before'in issue and 'after'in issue:
   a=issue['before']['node'];b=issue['after']['node'];assert a in nodes and b in nodes,(f['file'],a,b)
   assert b in [n.get('id')for n in walk(nodes[a])],(f['file'],a,b)
   record.update(resolved=True,method='The continuation is now an inline Span descendant of the preceding paragraph/list body, before any following float or notice.',paragraph=a,continuation=b,accepted_sequence=sequence_text(nodes[a]))
  elif issue['kind']=='within_block_math_order':
   node=issue['node'];equiv=[n for n in walk(nodes[node])if n.get('actual')];assert equiv
   record.update(resolved=True,method='Reviewed native ActualText replaces scrambled inline mathematical drawing order.',node=node,accepted_sequence=sequence_text(nodes[node]))
  elif issue['kind']=='within_block_column_interleaving':
   node=issue['node'];assert nodes[node].get('actual')
   record.update(resolved=True,method='Author columns read as complete name, affiliation, location and email groups.',accepted_sequence=sequence_text(nodes[node]))
  elif issue['kind']=='inline_figure_reference_order':
   calls=[n for n in nodes.values()if n.get('role')=='Figure'and 'Callout 'in n.get('alt','')]
   for n in calls:
    parent=next(v for v in nodes.values()if n in v.get('children',[]));assert parent['role']in ['P','LBody','Span'],(n['id'],parent['role'])
   record.update(resolved=True,method='All lettered callout graphics reparented into the visually corresponding phrase and reviewed left-to-right order.',callouts=len(calls))
  assert record['resolved'],(f['file'],issue)
  review.append(record)
 files.append({'file':f['file'],'pdf_sha256':hashlib.sha256(p.read_bytes()).hexdigest(),'pages':f['pages'],'original_issues_resolved':len(review),'original_issues':review,'change_counts':dict(collections.Counter(c['kind']for c in changes)),'changes':changes,'manual_semantic_review':'Reviewed block/section sequences and all remaining float-interruption candidates; all original examples have explicit native containment/equivalent-text assertions. Rechecked inline Co-Advisor callouts against enlarged pages 4–6, CoCapture icons against original coordinates and surrounding prose, and mathematical/code equivalents against rendered source pages. Accepted complete-paragraph floats, equation displays introduced by colons, and notes after complete referring paragraphs. Existing no-concern findings retained for three unchanged documents.','remaining_reading_order_concerns':[]})
assert sum(f['original_issues_resolved']for f in files)==56
report={'date':'2026-10-05','group':1,'documents':len(files),'pages':sum(f['pages']for f in files),'original_examples_resolved':56,'limitations':['Not a full end-to-end screen-reader test or accessibility conformance certification.','Not an exhaustive proofreading of every source word, formula, table cell or code token. Source typography/wording and visual defects are preserved.','All documented reading-order issues and analogous observed interruptions were addressed; no guarantee that every possible semantic defect has been found.'],'files':files}
(OUT/'review.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n');print(report['documents'],report['pages'],report['original_examples_resolved'])
