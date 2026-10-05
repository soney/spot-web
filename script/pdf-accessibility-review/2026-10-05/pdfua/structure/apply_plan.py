"""Apply reviewed pagination and ordered-list attributes to temporary candidates.
No painting operator, glyph, tag content/order or image is changed.
"""
from pathlib import Path
import sys,json,gzip,re,hashlib,shutil,collections,pikepdf,pymupdf
HERE=Path(__file__).resolve().parent;REPO=Path('/home/soney/nucode/spot-web')
def sha(b):return hashlib.sha256(b).hexdigest()
WS=b'\x00\t\n\x0c\r ';DEL=b'()<>[]{}/%'
def tokendata(raw):
 n=len(raw)
 def skip(i):
  while i<n:
   if raw[i]in WS:i+=1
   elif raw[i]==37:
    while i<n and raw[i]not in b'\r\n':i+=1
   else:break
  return i
 def endobj(i):
  start=i;c=raw[i]
  if c==40:
   depth=1;i+=1
   while depth:
    assert i<n
    if raw[i]==92:i+=2;continue
    if raw[i]==40:depth+=1
    if raw[i]==41:depth-=1
    i+=1
   return i
  if raw[i:i+2]==b'<<':
   i+=2
   while True:
    i=skip(i)
    if raw[i:i+2]==b'>>':return i+2
    i=endobj(i)
  if c==60:return raw.index(b'>',i+1)+1
  if c==91:
   i+=1
   while True:
    i=skip(i)
    if raw[i]==93:return i+1
    i=endobj(i)
  if c==47:i+=1
  while i<n and raw[i]not in WS and raw[i]not in DEL:i+=1
  assert i>start,(i,raw[i:i+50]);return i
 i=0;operands=[];marks=[]
 while (i:=skip(i))<n:
  start=i;i=endobj(i);token=raw[start:i]
  bare=token[0]not in DEL
  if not bare or token in [b'true',b'false',b'null']or re.fullmatch(rb'[+-]?(?:\d+\.?\d*|\.\d+)',token):operands.append((start,i,token));continue
  if token in [b'BMC',b'BDC']:
   num=1 if token==b'BMC' else 2;assert len(operands)==num,(token,operands)
   marks.append((operands[0][0],i,operands[0][2],token))
  elif token==b'BI':
   # Parse image dictionary, then skip binary payload using the PDF-required
   # whitespace around EI. The pikepdf marker sequence cross-check below
   # prevents an ambiguous inline-image boundary from being accepted.
   m=re.search(rb'\sID\s',raw[i:]);assert m
   data=i+m.end();ei=re.search(rb'\sEI(?=\s|$)',raw[data:]);assert ei;i=data+ei.end()
  operands=[]
 return marks

def apply(rec):
 src=REPO/'assets/pdfs'/rec['file'];assert sha(src.read_bytes())==rec['pdf_sha256'],('source changed',src.name)
 dest=HERE/'candidates'/src.name;dest.parent.mkdir(exist_ok=True);shutil.copyfile(src,dest)
 p=pikepdf.open(src);m=pymupdf.open(dest);groups=collections.defaultdict(list)
 for a in rec['artifacts']:groups[tuple(a.get('streams')or[a['stream']])].append(a)
 stream_updates={};spansproof=[]
 for ids,arts in groups.items():
  streams=[p.get_object((x,0))for x in ids];parts=[s.read_bytes()for s in streams];raw=b'\n'.join(parts);assert all(sha(raw)==a['stream_sha256']for a in arts)
  marks=tokendata(raw);temp=p.make_stream(raw);ops=pikepdf.parse_content_stream(temp);markedops=[o for o in ops if str(o.operator)in ['BMC','BDC']]
  assert len(marks)==len(markedops),(src.name,ids,len(marks),len(markedops))
  assert all(str(o.operands[0]).encode()==b[2]and str(o.operator).encode()==b[3]for o,b in zip(markedops,marks))
  patches=[]
  for a in arts:
   ordinal=a['marked_ordinal']-1;start,end,tag,op=marks[ordinal];assert tag==b'/Artifact';ins=markedops[ordinal]
   if str(ins.operator)=='BDC':
    prop=ins.operands[1]
    if isinstance(prop,pikepdf.Name):
     res=p.pages[a['page']-1].obj.get('/Resources',{}) if a.get('streams')else streams[0].get('/Resources',p.pages[a['page']-1].obj.get('/Resources',{}));prop=res['/Properties'][prop]
    assert isinstance(prop,pikepdf.Dictionary);d=pikepdf.Dictionary(prop)
   else:d=pikepdf.Dictionary()
   d['/Type']=pikepdf.Name('/Pagination');d['/Subtype']=pikepdf.Name('/'+a['subtype'])
   new=b'/Artifact '+d.unparse()+b' BDC';patches.append((start,end,new))
  assert len({(a,b)for a,b,c in patches})==len(patches)
  # Modify exact marker bytes in their original stream. Never merge or clear
  # source streams: other pages could share them.
  offsets=[];pos=0
  for part in parts:offsets.append(pos);pos+=len(part)+1
  perstream=collections.defaultdict(list)
  for a,b,new in patches:
   matches=[i for i,(s,v)in enumerate(zip(offsets,parts))if s<=a<b<=s+len(v)]
   assert len(matches)==1,('marker crosses stream boundary',src.name,ids,a,b)
   i=matches[0];perstream[i].append((a-offsets[i],b-offsets[i],new))
  for i,patch in perstream.items():
   old=parts[i];updated=old
   for a,b,new in sorted(patch,reverse=True):updated=updated[:a]+new+updated[b:]
   if ids[i]in stream_updates:assert stream_updates[ids[i]]==updated
   stream_updates[ids[i]]=updated
   # Preserve all raw bytes between markers, not merely equivalent operators.
   spansproof.append({'stream':ids[i],'before_sha256':sha(old),'after_sha256':sha(updated),'replacements':len(patch),'only_marked_content_openers_changed':True})
 for x,data in stream_updates.items():m.update_stream(x,data)
 for l in rec['lists']:
  x=int(l['node'].split(':')[0]);o=p.get_object((x,0));a=o.get('/A');assert(a.unparse().decode()if a is not None else None)==l['before_A']
  new='<< /O /List /ListNumbering /'+l['ListNumbering']+' >>'
  if a is not None:
   if isinstance(a,pikepdf.Array):new='[ '+' '.join(v.unparse().decode()if hasattr(v,'unparse')else str(v)for v in a)+' '+new+' ]'
   else:new='[ '+a.unparse().decode()+' '+new+' ]'
  m.xref_set_key(x,'A',new)
 m.saveIncr();m.close();p.close()
 # Prove no pixel changes before handing candidates to parent.
 old=pymupdf.open(src);new=pymupdf.open(dest)
 for i in range(len(old)):
  assert old[i].rect==new[i].rect
  assert old[i].get_pixmap(matrix=pymupdf.Matrix(2,2),alpha=False).samples==new[i].get_pixmap(matrix=pymupdf.Matrix(2,2),alpha=False).samples,(src.name,i+1)
 beforearchive=REPO/'script/publication-markdown/source-tags'/(src.stem+'.json.gz');d=json.loads(gzip.decompress(beforearchive.read_bytes()));assert d['pdf_sha256']==rec['pdf_sha256'];d['pdf_sha256']=sha(dest.read_bytes());d.setdefault('formal_ua_repairs',[]).append({'date':'2026-10-05','kind':'pagination_artifact_and_ordered_list_attributes','previous_pdf_sha256':rec['pdf_sha256'],'artifact_markers':len(rec['artifacts']),'ordered_lists':len(rec['lists']),'structure_and_text_preserved':True,'reviewed_plan_sha256':sha((HERE/'plan.json').read_bytes())})
 for l in rec['lists']:d.setdefault('list_attributes',{})[l['node']]={'O':'List','ListNumbering':l['ListNumbering']}

 for override in d.get('reviewed_overrides',{}).values():
  if override.get('source_sha256')==rec['pdf_sha256']:override['source_sha256']=d['pdf_sha256']
 archive=HERE/'candidates'/beforearchive.name;archive.write_bytes(gzip.compress((json.dumps(d,ensure_ascii=False,separators=(',',':'))+'\n').encode(),mtime=0))
 return {'file':src.name,'before_sha256':rec['pdf_sha256'],'after_sha256':d['pdf_sha256'],'pages':len(old),'MuPDF144DPI_pixel_identical':True,'tag_tree_archive_unchanged':True,'artifacts':len(rec['artifacts']),'lists':len(rec['lists']),'stream_changes':spansproof}
if __name__=='__main__':
 from concurrent.futures import ProcessPoolExecutor
 import multiprocessing
 plan=json.loads((HERE/'plan.json').read_text());selected=plan['files'];results=[]
 if len(sys.argv)>1:selected=[f for f in selected if f['file']in sys.argv[1:]]
 with ProcessPoolExecutor(max_workers=3,mp_context=multiprocessing.get_context('fork'))as pool:
  for result in pool.map(apply,selected):results.append(result);print(result['file'],result['artifacts'],result['lists'],'PASS',flush=True)
 (HERE/'candidate-validation.json').write_text(json.dumps(results,indent=2)+'\n')
