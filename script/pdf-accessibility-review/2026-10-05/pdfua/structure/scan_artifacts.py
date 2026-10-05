"""Read-only inventory of artifact marked content and its decoded text/positions."""
from pathlib import Path
import sys,json,hashlib,logging,copy,collections
import pikepdf,pymupdf
from pypdf import PdfReader
from pypdf.generic import IndirectObject
from pypdf._cmap import get_encoding
logging.getLogger('pypdf').setLevel(logging.ERROR)
REPO=Path('/home/soney/nucode/spot-web');OUT=Path('/tmp/spot-ua-final/artifacts')
def sha(b):return hashlib.sha256(b).hexdigest()
def mm(a,b):
 return [a[0]*b[0]+a[1]*b[2],a[0]*b[1]+a[1]*b[3],a[2]*b[0]+a[3]*b[2],a[2]*b[1]+a[3]*b[3],a[4]*b[0]+a[5]*b[2]+b[4],a[4]*b[1]+a[5]*b[3]+b[5]]
def scan(path):
 p=pikepdf.open(path);reader=PdfReader(path); records=[];fonts={};mup=pymupdf.open(path)
 def decode(o,font):
  if font is None:return '[NO FONT]'
  key=font.objgen
  if key not in fonts:
   ft=reader.get_object(IndirectObject(key[0],key[1],reader));fonts[key]=get_encoding(ft)
  enc,mp=fonts[key];b=bytes(o)
  try:t=b.decode(enc) if isinstance(enc,str) else ''.join(enc.get(i,chr(i))for i in b)
  except Exception:t=b.decode('latin1')
  return ''.join(mp.get(c,c)for c in t)
 def run(stream,res,state,page,marks,depth=0):
  assert depth<12
  instructions=pikepdf.parse_content_stream(stream);saves=[];ordinal=0;raw=stream.read_bytes()
  for ix,ins in enumerate(instructions):
   op=str(ins.operator);a=ins.operands
   if op in ['BMC','BDC']:
    ordinal+=1;tag=str(a[0]);prop=a[1]if len(a)>1 else None
    if prop is not None and isinstance(prop,pikepdf.Name):prop=res.get('/Properties',{}).get(prop,{})
    rec=None
    if tag=='/Artifact':
     attrs={str(k):str(v)for k,v in prop.items()} if isinstance(prop,pikepdf.Dictionary)else{}
     rec={'page':page,'stream':stream.objgen[0],'marked_ordinal':ordinal,'instruction':ix,'operator':op,'attrs':attrs,'texts':[],'points':[],'nontext_ops':collections.Counter(),'stream_sha256':sha(raw)};records.append(rec)
    marks.append(rec)
   elif op=='EMC':
    if marks:marks.pop()
   elif op=='q':saves.append({k:(v.copy()if isinstance(v,list)else v)for k,v in state.items()})
   elif op=='Q':
    if saves:state=saves.pop()
   elif op=='cm':state['ctm']=mm(list(map(float,a)),state['ctm'])
   elif op=='BT':state['tm']=[1,0,0,1,0,0];state['tlm']=[1,0,0,1,0,0]
   elif op=='Tf':state['font']=res.get('/Font',{}).get(a[0]);state['size']=float(a[1])
   elif op=='Tm':state['tm']=list(map(float,a));state['tlm']=state['tm'].copy()
   elif op=='TL':state['leading']=float(a[0])
   elif op in ['Td','TD']:
    x,y=map(float,a);state['tlm']=mm([1,0,0,1,x,y],state['tlm']);state['tm']=state['tlm'].copy()
    if op=='TD':state['leading']=-y
   elif op in ['T*',"'",'"']:
    state['tlm']=mm([1,0,0,1,0,-state['leading']],state['tlm']);state['tm']=state['tlm'].copy()
   if op in ['TJ','Tj',"'",'"']:
    arr=a[0]if op=='TJ'else[a[-1]];t=''.join(decode(x,state['font'])for x in arr if isinstance(x,pikepdf.String))
    pt=mm(state['tm'],state['ctm']);point=[round(pt[4],3),round(pt[5],3),state['size']]
    for rec in marks:
     if rec is not None:rec['texts'].append(t);rec['points'].append(point)
   elif op=='Do':
    obj=res.get('/XObject',{}).get(a[0]);
    if obj is not None and str(obj.get('/Subtype',''))=='/Form':
     substate={k:(v.copy()if isinstance(v,list)else v)for k,v in state.items()};substate['ctm']=mm(list(map(float,obj.get('/Matrix',[1,0,0,1,0,0]))),state['ctm']);run(obj,obj.get('/Resources',res),substate,page,marks.copy(),depth+1)
    else:
     for rec in marks:
      if rec is not None:rec['nontext_ops'][op]+=1
   elif op in ['S','s','f','F','f*','B','B*','b','b*','sh','INLINE IMAGE']:
    for rec in marks:
     if rec is not None:rec['nontext_ops'][op]+=1
  return state
 for pn,page in enumerate(p.pages,1):
  res=page.obj.get('/Resources',{});state={'ctm':[1,0,0,1,0,0],'tm':[1,0,0,1,0,0],'tlm':[1,0,0,1,0,0],'font':None,'size':0,'leading':0};marks=[]
  cs=page.obj.get('/Contents',[]);streams=list(cs) if isinstance(cs,pikepdf.Array) else [cs]

  if len(streams)>1:
   combined=p.make_stream(b'\n'.join(s.read_bytes()for s in streams));before=len(records);state=run(combined,res,state,pn,marks)
   for r in records[before:]:
    if r['stream']==combined.objgen[0]:r['streams']=[s.objgen[0]for s in streams];r['stream']=None
  else:
   for s in streams:state=run(s,res,state,pn,marks)
 for r in records:
  r['text']=''.join(r.pop('texts'));r['bbox_y']=[min(v[1]for v in r['points']),max(v[1]for v in r['points'])]if r['points']else[]
  r['page_box']=list(map(float,p.pages[r['page']-1].obj.MediaBox));r['nontext_ops']=dict(r['nontext_ops'])
 return {'file':path.name,'pdf_sha256':sha(path.read_bytes()),'artifacts':records}
if __name__=='__main__':
 names=sys.argv[1:] or [p.name for p in sorted((REPO/'assets/pdfs').glob('*.pdf'))]
 for name in names:
  dest=OUT/'inventory'/(Path(name).stem+'.json');dest.parent.mkdir(exist_ok=True)
  d=scan(REPO/'assets/pdfs'/name);dest.write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n');print(name,len(d['artifacts']),sum(bool(a['text'].strip())for a in d['artifacts']),flush=True)
