# Repair/review source retained as evidence. Replay requires the matching per-task baselines and shared order_editor.py; scratch paths are explicit below.
from pathlib import Path
import sys,json,gzip,copy,collections,re,shutil,html
sys.path.insert(0,'/tmp/spot-order-fixes');from order_editor import Editor,walk,refresh,sequence_text
from plan import PLANS
from math_text import ACTUAL
BASE=Path('/tmp/spot-order-fixes');OUT=BASE/'group1';CAND=OUT/'candidates';CAND.mkdir(exist_ok=True)
def ID(v):return str(v)+':0' if isinstance(v,int) else v
def chtext(n):return sequence_text(n)
def coords(n):
 ops=[o for v in walk(n)for o in v.get('ops',[])if (o.get('text')or o.get('actual'))and o.get('bbox')]
 return ops

def reorder_scripts(n):
 # Exactly the conservative per-line superscript/subscript placement already
 # used in Markdown, here applied to native /K children. No crossline/page sort.
 kids=n.get('children',[]);rows=collections.defaultdict(list)
 for i,c in enumerate(kids):
  oo=coords(c)
  if not oo:continue
  a,b=oo[0],oo[-1]
  if a.get('line_y')is not None and b.get('line_y')is not None and a['page']==b['page']and abs(a['line_y']-b['line_y'])<.4:
   rows[(a['page'],a['line_y'])].append((i,c,oo))
 weights={y:sum(len(chtext(c).strip())for _,c,_ in row)for y,row in rows.items()};attached={}
 for y,row in rows.items():
  if weights[y]>18:continue
  options=[base for base in rows if y[0]==base[0] and .7<abs(y[1]-base[1])<=6 and weights[base]>max(18,weights[y]*2)]
  if not options:continue
  base=min(options,key=lambda v:abs(v[1]-y[1]));heights=[oo[0]['bbox'][3]-oo[0]['bbox'][1]for _,c,oo in rows[base]if len(chtext(c).strip())>=3];typ=sorted(heights)[len(heights)//2]if heights else 0
  for i,c,oo in row:
   a=oo[0];h=a['bbox'][3]-a['bbox'][1]
   if typ and h<typ*.82 and len(chtext(c).strip())<=16:attached[i]=base
 if not attached:return False
 buckets=collections.defaultdict(list)
 for i,base in attached.items():buckets[base].append((i,kids[i],coords(kids[i])))
 emitted=set();indices=set();result=[]
 for i,c in enumerate(kids):
  if i in attached:continue
  oo=coords(c);y=(oo[0]['page'],oo[0]['line_y'])if oo else None
  if y in buckets and y not in emitted:
   line=rows[y]+buckets[y];result.extend(c for _,c,_ in sorted(line,key=lambda a:a[2][0]['bbox'][0]));indices.update(j for j,_,_ in line);emitted.add(y)
  elif i not in indices:result.append(c)
 assert sorted(map(id,result))==sorted(map(id,kids))
 if list(map(id,result))!=list(map(id,kids)):n['children']=result;return True
 return False

def merge(e,a,b,log):
 a,b=e.node(ID(a)),e.node(ID(b));before=[chtext(a),chtext(b)]
 if a.get('actual'):
  wrapper=e.new_element('Span',a['children'],actual=a['actual']);a['children']=[wrapper];a['actual']=''
  assert a['id']not in e.data.get('reviewed_overrides',{})
 target=a
 if a['role']=='LI':target=next((c for c in a['children']if c.get('role')=='LBody'),a)
 e.detach(b);b['role']='Span';target['children'].append(b);refresh(target);refresh(a)
 log.append({'kind':'join_continuation','first':a['id'],'continuation':b['id'],'before_tail':before[0][-180:],'after_beginning':before[1][:180],'after_text':chtext(a)})

def actual(e,id,text,log,why):
 n=e.node(ID(id));before=chtext(n);e.set_actual(n,text);log.append({'kind':'actual_text','node':n['id'],'before':before,'after':text,'reason':why})

def fix_callouts(e,log):
 # Reconnect each lettered graphic to its same visual text baseline, preserving
 # punctuation already tagged alongside some of those graphics.
 calls=[n for n in list(e.nodes.values())if n.get('role')=='Figure'and n.get('alt','').startswith('Callout ')]
 ps=[n for n in e.nodes.values()if n.get('role')in ['P','LBody']and n.get('page')in [4,5,6]]
 for n in calls:
  boxes=n['bbox_by_page'];p=int(next(iter(boxes)));box=boxes[str(p)];x=(box[0]+box[2])/2;y=box[3]
  candidates=[]
  for para in ps:
   oo=[o for o in coords(para)if o['page']==p and o.get('line_y')is not None]
   if not oo:continue
   bb=para.get('bbox_by_page',{}).get(str(p))
   if not bb or not (bb[0]-20<=x<=bb[2]+25):continue
   dy=min(abs(o['line_y']-y)for o in oo)
   if dy<5:candidates.append((dy,para))
  assert candidates,(n['id'],box)
  para=min(candidates,key=lambda a:a[0])[1];e.detach(n)
  # Insert among top-level content/inline children on the closest native line.
  options=[]
  for i,c in enumerate(para['children']):
   for o in coords(c):
    if o['page']==p and o.get('line_y')is not None:options.append((abs(o['line_y']-y),abs(o['bbox'][2]-box[0]),i,o))
  best=min(options,key=lambda v:(v[0],v[1]));base=best[3]['line_y']
  indices=[(i,c,coords(c))for i,c in enumerate(para['children'])if any(o['page']==p and o.get('line_y')is not None and abs(o['line_y']-base)<.4 for o in coords(c))]
  # Last token ending to left of callout; default before first right token.
  left=[(i,c,oo)for i,c,oo in indices if oo[-1]['bbox'][0]<box[0]]
  ix=max((i for i,_,_ in left),default=min(i for i,_,_ in indices)-1)+1
  para['children'].insert(ix,n)
  punctuation=''.join(o.get('text','')for v in walk(n)for o in v.get('ops',[]))
  n['alt']=' ('+n['alt']+')'+punctuation+' '
  log.append({'kind':'inline_callout','node':n['id'],'paragraph':para['id'],'alternative':n['alt'],'page':p,'line_y':base,'position':ix})


def run(stem):
 src=BASE/'baseline'/(stem+'.pdf');arch=BASE/'baseline-tags'/(stem+'.json.gz');pdf=CAND/(stem+'.pdf');tag=CAND/(stem+'.json.gz');shutil.copy2(src,pdf);shutil.copy2(arch,tag)
 e=Editor(pdf.name,pdf,tag);log=[];plan=PLANS[stem]
 # Promote all prior, visually reviewed textual equivalents into native tags.
 for nid,ov in e.data.get('reviewed_overrides',{}).items():
  value=ov['text']+(('\n'+ov['caption'])if ov.get('caption')else'')
  actual(e,nid,value,log,'Previously visually reviewed exact transcription, promoted from Markdown to native PDF ActualText.')
 for nid,value in ACTUAL.get(stem,{}).items():actual(e,nid,value,log,'Read against rendered source page at 144 DPI; inline mathematical tokens restored in grammatical order.')
 # Whole running header nodes become actual content-stream artifacts.
 for n in plan.get('artifacts',[]):
  log.append({'kind':'artifact_header','node':ID(n),'text':chtext(e.node(ID(n)))});e.artifact(ID(n))
 if stem=='chen-expert-crowd-support-ci2016':
  n=e.node('81:0');keys=[v['key']for v in walk(n)if v.get('kind')=='content'and any(o.get('bbox',[0,0,0,0])[1]>695 for o in v.get('ops',[]))]
  assert keys;log.append({'kind':'artifact_footer','node':'81:0','keys':keys,'text':''.join(chtext(v)for v in walk(n)if v.get('kind')=='content'and v['key']in keys)});e.artifact_keys(keys)
 # Small raised/lowered text runs move to the correct native inline position.
 for n in [x for x in walk(e.data['tree']) if x.get('kind')=='element']:
  if n.get('role')not in ['P','Note','Caption','LBody','TH','TD']or n.get('actual'):continue
  if stem=='oney-natural-language-search-mit2008' or (stem=='lin-adasa-uist2018' and n['id']=='700:0') or (stem=='krosnick-expresso-vlhcc2018' and n['id']in ['389:0','423:0']):continue
  before=chtext(n)
  if reorder_scripts(n):log.append({'kind':'inline_script_order','node':n['id'],'before':before,'after':chtext(n)})
 # Group author columns rather than alternating rows (visually checked page 1).
 if stem=='spinelli-attention-patterns-for-code-animations-px182018':
  n=e.node('230:0');left=[];right=[]
  for c in n['children']:
   oo=coords(c);assert oo
   (left if oo[0]['bbox'][0]<210 else right).append(c)
  assert left and right
  n['children']=left+right
  actual(e,230,'Louis Spinelli*. Information School, University of Washington, Seattle, WA, USA. spinelli@uw.edu. Maulishree Pandey*. School of Information, University of Michigan, Ann Arbor, MI, USA. maupande@umich.edu.',log,'Author names, affiliations and emails read as complete columns, confirmed from page 1.')
 if stem=='arab-co-advisor-vlhcc2025':
  fix_callouts(e,log)
  # Each affected unmerged paragraph occupies one printed column. Cluster
  # subpixel baseline differences before sorting its inline MCIDs and graphics.
  affected={x['paragraph']for x in log if x['kind']=='inline_callout'}|{'218:0'}
  for nid in affected:
   n=e.node(nid);textops=coords(n);lines=[]
   for y in sorted(set(o['line_y']for o in textops if o.get('line_y')is not None)):
    if not lines or y-lines[-1]>.5:lines.append(y)
   def order(c):
    oo=coords(c)
    if oo:y=oo[0]['line_y'];x=oo[0]['bbox'][0]
    else:
     bb=next(iter(c['bbox_by_page'].values()));y=bb[3];x=bb[0]
    return min(lines,key=lambda v:abs(v-y)),x
   n['children'].sort(key=order)
   log.append({'kind':'native_line_order','node':nid,'reason':'Visually verified single-column paragraph; line-cluster/x ordering restores detached inline callouts and punctuation.'})
 for a,b in plan.get('joins',[]):merge(e,a,b,log)
 # Frontmatter notices remain searchable/accessibly readable, before introduction.
 for a,b in plan.get('front',[]):
  n=e.node(ID(a));
  if n['role']=='P':n['role']='Note'
  e.move_before(ID(a),ID(b));log.append({'kind':'frontmatter_notice','node':ID(a),'before':ID(b)})
 # Move groups of notes in citation/number order after their complete paragraph.
 groups=collections.defaultdict(list)
 for a,b in plan.get('notes',[]):groups[b].append(a)
 for b,aa in groups.items():
  for a in aa:e.node(ID(a))['role']='Note'
  e.move_after([ID(a)for a in aa],ID(b));log.append({'kind':'place_referenced_notes','nodes':[ID(a)for a in aa],'after':ID(b)})
 if stem=='chen-cocapture-chi2021':
  # The three small icons belong inside the animation-properties list, not
  # after the participant sentence several sections later.
  n=e.node('1088:0')
  for nid,needle in [(1112,'rotation'),(1113,'font size'),(1114,'visibility')]:
   icon=e.node(ID(nid));e.detach(icon);n['children'].append(icon)
   log.append({'kind':'inline_icon','node':ID(nid),'paragraph':'1088:0','meaning':needle})
  textops=coords(n);lines=[]
  for y in sorted(set(o['line_y']for o in textops if o.get('line_y')is not None)):
   if not lines or y-lines[-1]>.5:lines.append(y)
  def order(c):
   oo=coords(c)
   if oo:y=oo[0]['line_y'];x=oo[0]['bbox'][0]
   else:
    bb=next(iter(c['bbox_by_page'].values()));y=bb[3];x=bb[0]
   return min(lines,key=lambda v:abs(v-y)),x
  n['children'].sort(key=order)
 if stem=='zhang-vizprog-chi2023':
  code=[(821,[822,823],'my_variable = 10\nmy_dictionary = {}\n\nfor key, value in my_dictionary.items():\n    other_value = value + 1\n    print(key, other_value)'),(824,[825,826,827],"v = 10\nd = {}\n\n# loop over all of the items in d\nfor k, v in d.items():\n    w = v + 1  # add 1 to the value\n    print(k, w)\nprint('Done!')"),(900,[901],'v0 = 10\nv1 = {}\n\nfor v2, v3 in v1.items():\n    v4 = v3 + 1'),(923,[924],'NEAR_APPROACH = sorted(filter(is_correct, PAST_CODE),\n    key=lambda p: vec_sim(c, p))[n_vec_sim:]'),(937,[938],'NEAR_EDIT = sorted(filter(is_correct, PAST_CODE),\n    key=lambda p: edit_distance(c, p))[:n_edit_sim]')]
  for a,bb,value in code:
   for b in bb:merge(e,a,b,log)
   e.node(ID(a))['role']='Code';actual(e,a,value,log,'Visually transcribed source code in printed order and indentation; source indexing retained, not corrected.')
  # Keep the normalized listing adjacent to the sentence introducing it.
  e.move_after('900:0','842:0');log.append({'kind':'place_code','node':'900:0','after':'842:0'})
 if log:
  e.save(log)
 else:e.pdf.close();e.native.close()
 (OUT/(stem+'.changes.json')).write_text(json.dumps({'file':stem+'.pdf','changes':log},ensure_ascii=False,indent=2)+'\n')
 print(stem,len(log),flush=True)
if __name__=='__main__':
 for stem in sys.argv[1:]or PLANS:run(stem)
