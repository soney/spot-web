# Repair/review source retained as evidence. Replay requires the matching per-task baselines and shared order_editor.py; scratch paths are explicit below.
from pathlib import Path
import json,gzip,sys,hashlib,re
sys.path.insert(0,'/tmp/spot-order-fixes');from order_editor import walk,sequence_text
sys.path.insert(0,'/home/soney/nucode/spot-web/script/pdf-accessibility-review/2026-10-05/tools');from check_archive_native_sync import check
ROOT=Path('/home/soney/nucode/spot-web');OUT=Path('/tmp/spot-order-fixes/group1');BASE=Path('/tmp/spot-order-fixes');docs=[]
source=json.loads(Path('/tmp/spot-reading-order/group-0-review.json').read_text())
def getnodes(d):return {n['id']:n for n in walk(d['tree'])if n.get('kind')=='element'}
def keys(n):return [v['key']for v in walk(n)if v.get('kind')=='content']
def flat(d):
 out=[]
 def visit(n):
  if isinstance(n,list):
   for c in n:visit(c)
  elif isinstance(n,dict):
   if n.get('kind')=='element'and n.get('role')not in ['Document','Sect','Part','Div','L']:out.append(n)
   else:
    for c in n.get('children',[]):visit(c)
 visit(d['tree']);return out
for old in source['files']:
 name=old['file'];stem=Path(name).stem;a=ROOT/'script/publication-markdown/source-tags'/(stem+'.json.gz');p=ROOT/'assets/pdfs'/name;data=json.load(gzip.open(a));nodes=getnodes(data);original=getnodes(json.load(gzip.open(BASE/'baseline-tags'/(stem+'.json.gz'))));blocks=flat(data);indices={n['id']:i for i,n in enumerate(blocks)};issues=[]
 for issue in old['issues']:
  nid=issue['node'];kind=issue['kind'];rec={'kind':kind,'node':nid,'pages':issue['pages'],'resolved':False}
  if kind=='superscript_marker_before_heading_number':
   actual=sequence_text(nodes[nid]);assert actual=='3ConstraintJS2',actual;rec.update(resolved=True,assertion='Chapter number 3 and heading ConstraintJS precede footnote marker2.',accepted_text=actual)
  elif kind=='footnote_inside_bibliography_item':
   text=sequence_text(nodes[nid]);notes=[n for n in nodes.values()if n.get('role')=='Note'and 'processing.org' in sequence_text(n)];assert 'processing.org'not in text and len(notes)==1;note=notes[0];assert indices[note['id']]==indices['57:0']+1;assert sorted(map(str,keys(nodes[nid])+keys(note)))==sorted(map(str,keys(original[nid])));rec.update(resolved=True,assertion='Reference6 remains intact; its former URL footnote is Note immediately after referring Impact paragraph57.',note=note['id'],accepted_reference=text,accepted_note=sequence_text(note))
  elif kind=='footnote_inside_code':
   donor=issue['after_node'];assert indices[donor]==indices[nid]+1;assert keys(nodes[nid])==keys(original[nid])and keys(nodes[donor])==keys(original[donor]);assert indices['2091:0']==indices['2085:0']+1;rec.update(resolved=True,assertion='Code line3 is followed directly by line4; note3 now follows its referencing paragraph2085 before the code.',next_node=donor)
  else:
   donor=issue['after_node'];assert keys(nodes[nid])==keys(original[nid])+keys(original[donor]),(name,nid);assert donor not in nodes
   rec.update(resolved=True,assertion='One native paragraph owns original first-fragment content followed exactly by continuation; original float/header/note cannot interrupt its sentence.',continuation=donor,accepted_text=sequence_text(nodes[nid]))
  issues.append(rec)
 sync=check(p,a,[]);assert sync['passed'],sync['issues']
 rec={'file':name,'pdf_sha256':data['pdf_sha256'],'pages':data['pages'],'native_archive_sync':sync,'original_examples_resolved':len(issues),'original_examples':issues,'review':'Read native block summaries across all seven short documents, plus all original issue contexts; CMU chapter/appendix heading flow, all running headers, selected prose/code/caption/footnote transitions and inline note references checked.'}
 residual=OUT/(stem+'.residual-changes.json')
 if residual.exists():rec['independent_residual_repairs']=json.loads(residual.read_text());rec['residual_validation']=json.loads((OUT/'root-residual-candidates'/(stem+'.validation.json')).read_text())
 docs.append(rec)
report={'date':'2026-10-05','documents':len(docs),'pages':sum(d['pages']for d in docs),'original_examples_resolved':sum(d['original_examples_resolved']for d in docs),'documents_reviewed':docs,'residual_status':'All17 originally documented Group0 examples have native-order assertions. Independent review found and repaired12 more inline footnote positions (8 CMU,4 ScrapeViz), corrected the missing CMU Note role, and moved9 notes to relevant paragraph boundaries. No remaining disruptive native block-order candidate in the focused scan.','rendered_evidence':[{'document':'krosnick-scrapeviz-vlhcc2024.pdf','page':4,'path':'/tmp/spot-order-fixes/group1/root-review-scrapeviz-p4.png','confirmed':'Footnote markers3,4,5,6 follow WTA tennis, Wayfair furniture, Google Scholar, Yelp respectively.'},{'document':'oney-expressing-interactivity-states-cmu2015.pdf','pages':[30,42,45,47,48,82,86,87,95],'paths':['/tmp/spot-order-fixes/group1/root-review-cmu-node'+str(n)+'.png'for n in [644,2085,2107,2131,2141,2468,2649]]+['/tmp/spot-order-fixes/group1/root-review-cmu-p86.png','/tmp/spot-order-fixes/group1/root-review-cmu-p87.png'],'confirmed':'Reviewed every affected superscript in the rendered paragraph; marker8 already correctly followed instance and was preserved.'}],'limitations':['Not an end-to-end screen-reader test or a conformance certification.','CMU thesis received targeted semantic review, not a line-by-line proofreading of all227pages or every API table row.','Original visual source typography and wording preserved; no source errors silently corrected.']}
(OUT/'root-independent-review.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n');print({'documents':report['documents'],'pages':report['pages'],'original_examples_resolved':report['original_examples_resolved']})
