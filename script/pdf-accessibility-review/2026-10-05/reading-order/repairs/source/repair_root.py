from pathlib import Path
import copy,gzip,json,re,shutil,sys
from order_editor import Editor,walk,refresh,sequence_text
BASE=Path('/tmp/spot-order-fixes');OUT=BASE/'root-candidates';OUT.mkdir(exist_ok=True)
PLANS={
 'xu-how-pairing-code-chilbw2023': {'merge':[('287','322'),('327','335'),('341','342'),('383','384'),('394','401'),('420','421')],'notices':(['288','289'],'286')},
 'krosnick-scrapeviz-vlhcc2024':{'merge':[('46','201'),('206','210'),('214','215'),('218','49'),('80','83'),('87','220')]},
 'chen-edcode-vlhcc2020':{'merge':[('292','297'),('304','307'),('310','327'),('341','351')],'notices':(['161'],'158')},
 'oney-zoomboard-chi2013':{'merge':[('46','48'),('52','59'),('61','62'),('69','73')],'notices':(['47','55'],'44')},
 'oney-development-tools-interactive-iseuddc2011':{'merge':[('37','39'),('52','54')]},
 'chen-on-demand-collaboration-programming-msnfws2020':{'merge':[('233','240')],'notices':(['169','170'],'166'),'artifacts':['174','227','238','239']},
 'oney-democratizing-computational-tools-vlhccgc2010':{'merge':[('33','34'),('42','43')]}}
# Each pair was read in context in the native-order candidate report. Adjacent
# fragments and float/note interruptions are the same printed paragraph.
cmu_pairs=[]
for line in (BASE/'root-candidates.txt').read_text().split('FILE xu-')[0].splitlines():
 m=re.match(r'(?:page|interrupted) (\d+):0 .*?-> (\d+):0 ',line)
 if m:cmu_pairs.append(m.groups())
cmu_pairs += [('1853','1856'),('1972','1974'),('2317','2320'),('2580','2582'),('3012','3016')]
PLANS['oney-expressing-interactivity-states-cmu2015']={'merge':cmu_pairs}
reports=[]
for stem,plan in PLANS.items():
 file=stem+'.pdf';ap=stem+'.json.gz';p=OUT/file;a=OUT/ap;shutil.copy2(BASE/'baseline'/file,p);shutil.copy2(BASE/'baseline-tags'/ap,a);e=Editor(file,pdf_path=p,archive_path=a);changes=[]
 def nid(x):return x if ':'in x else x+':0'
 def record(kind,**data):changes.append({'kind':kind,**data})
 if stem=='oney-expressing-interactivity-states-cmu2015':
  for id,n in list(e.nodes.items()):
   if n.get('role')=='P'and re.match(r'(?:\d+)?Chapter\s*\d+\s*:|Appendix [AB]:',n.get('text',''))and all(b[3]<65 for b in n.get('bbox_by_page',{}).values()):
    record('artifact_running_header',node=id,text=n.get('text'));e.artifact(id)
  for id in ['2047:0','2310:0']:
   n=e.node(id);before=sequence_text(n);n['children'].append(n['children'].pop(0));record('heading_note_marker_order',node=id,before=before,after=sequence_text(n))
  # The two panel labels were interleaved by printed line. Read each panel's
  # three-line label completely, without changing either label or its figure.
  n=e.node('2920:0');cs=n['children'];assert len(cs)==6
  n['children']=[cs[i]for i in [0,2,4,1,3,5]];record('panel_label_columns',node=n['id'],before=sequence_text({'children':cs}),after=sequence_text(n))
  # Footnote3 concerns the preceding paragraph, not the code listing.
  e.move_after('2091:0','2088:0');record('footnote_placement',node='2091:0',after='2088:0')
 for id in plan.get('artifacts',[]):
  n=e.node(nid(id));record('artifact_running_header',node=n['id'],text=n.get('text'));e.artifact(n['id'])
 if 'notices'in plan:
  ids,anchor=plan['notices'];ids=list(map(nid,ids))
  for id in ids:e.node(id)['role']='Note'
  e.move_before(ids,nid(anchor));record('publication_notices_before_intro',nodes=ids,before=nid(anchor))
 for aa,bb in plan.get('merge',[]):
  aa,bb=nid(aa),nid(bb);a1,b1=e.node(aa),e.node(bb);record('join_paragraph_continuation',first=aa,continuation=bb,before_end=sequence_text(a1)[-150:],after_start=sequence_text(b1)[:150]);e.merge(aa,bb)
 if stem=='chen-edcode-vlhcc2020':
  text='Yan Chen (affiliation 1), Jaylin Herskovitz (affiliation 1), Gabriel Matute (affiliation 1), April Wang (affiliation 1), Sang Won Lee (affiliation 2), Walter S. Lasecki (affiliation 1), Steve Oney (affiliation 1).'
  e.set_actual('154:0',text);record('author_affiliation_order',node='154:0',actual=text)
 if stem=='oney-development-tools-interactive-iseuddc2011':
  n=e.node('76:0');moved=[]
  def take(parent):
   keep=[]
   for child in parent.get('children',[]):
    if child.get('kind')=='content'and child['key'][0]=='16:0'and child['key'][1]in[250,251,252,253]:moved.append(child)
    else:
     if child.get('kind')=='element':take(child)
     keep.append(child)
   parent['children']=keep
  take(n);assert len(moved)==4;note=e.new_element('Note',moved,page=4);e.move_after(note,'57:0');record('separate_footnote_from_bibliography',reference='76:0',note=note['id'],after='57:0',text=sequence_text(note))
 # Explicitly mark four website footnotes as notes, preserving their content.
 if stem=='krosnick-scrapeviz-vlhcc2024':
  for id in ['255:0','256:0','257:0','258:0']:e.node(id)['role']='Note'
  record('note_roles',nodes=['255:0','256:0','257:0','258:0'])
 report=e.save(changes);reports.append(report);print(file,len(changes),'changes',flush=True)
(BASE/'root-repairs.json').write_text(json.dumps(reports,ensure_ascii=False,indent=2)+'\n')
