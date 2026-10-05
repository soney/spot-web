"""Tag Arboretum Figure 5's existing vector text as two navigable data tables.

Default writes temporary copies; --apply edits only a supplied hash-matched pair.
Keeps all original font, glyph, drawing and transformation operations. Splits
TJ arrays only at inter-cell advances and inserts content tags, with native MCR
references to the existing Form XObject. No invisible text layer is needed.
The original shared Figure 5 caption remains once, after the two tables.
"""
import argparse,gzip,hashlib,json,re,shutil,sys
from pathlib import Path
import pikepdf,pymupdf

def walk(n):
 if isinstance(n,list):
  for c in n:yield from walk(c)
 elif isinstance(n,dict):
  yield n;yield from walk(n.get('children',[]))
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def tok(v):return v.unparse().decode('ascii') if hasattr(v,'unparse') else str(v)
def arr(v):return '[ '+' '.join(tok(x) for x in v)+' ]'
def string(s):return '<'+(b'\xfe\xff'+s.encode('utf-16-be')).hex()+'>'
def node(x,role,box,children=None,text=''):
 d={'kind':'element','id':f'{x}:0','role':role,'page':9,'pages':[9],'bbox_by_page':{'9':box},'alt':'','actual':'','children':children or []}
 if role not in ['Table','TR']:d['text']=text
 return d
VALUES=[[
 ['Accuracy (%)','Counter','Video','Menu'],
 ['Blind (Solo)','0','63','14'],
 ['Sighted (Solo)','100','90','86'],
 ['Blind+Sighted (Arbility)','100','89','89']],
 [['Average Time to Success (s)','Counter','Video','Menu'],
 ['Blind (Solo)','n/a','108','133'],
 ['Sighted (Solo)','62','93','82'],
 ['Blind+Sighted (Arbility)','418','240','304']]]

def repair(pdf_path,archive_path,repo):
 data=json.load(gzip.open(archive_path));before=sha(pdf_path);assert data['pdf_sha256']==before,'PDF/archive hash mismatch'
 ns={n['id']:n for n in walk(data['tree']) if n.get('kind')=='element'}
 assert ns['1463:0']['role']=='Figure' and ns['1464:0']['role']=='P'
 mapping=[];htmlids={};tablepairs=[];mcid=0
 with pikepdf.open(pdf_path)as native,pymupdf.open(pdf_path)as pdf:
  old=native.get_object((1463,0));assert str(old.S)=='/Figure' and list(old.K)==[0] and old.P.objgen==(1452,0) and old.Pg.objgen==(791,0)
  assert str(old.Alt)==ns['1463:0']['alt'];old_alt=str(old.Alt)
  page=native.pages[8];assert page.obj.objgen==(791,0) and int(page.obj.StructParents)==17
  form=page.Resources.XObject.Fm0;assert form.objgen==(1137,0) and not form.get('/StructParents')
  assert page.Contents.objgen==(1136,0)
  # This form is used only once; its new content ownership is unambiguous.
  uses=sum(str(ins.operator)=='Do' and str(ins.operands[0])=='/Fm0' for ins in pikepdf.parse_content_stream(page))
  assert uses==1
  for i,p in enumerate(native.pages):
   if i!=8:assert all(v.objgen!=form.objgen for v in p.Resources.get('/XObject',{}).values())
  contents=page.Contents.read_bytes();pattern=rb'^/Figure\s*<<\s*/MCID\s+0\s*>>\s*BDC\s*(q\s+0\.69452 0 0 0\.69452 53\.929 621\.293 cm\s+0 TL/Fm0 Do\s+Q)\s*EMC'
  replaced,count=re.subn(pattern,rb'\1',contents);assert count==1
  pdf.update_stream(1136,replaced)
  pt=native.Root.StructTreeRoot.ParentTree;assert '/Nums'in pt and '/Kids'not in pt
  nums=list(pt.Nums);locations={int(nums[i]):i+1 for i in range(0,len(nums),2)}
  slot=locations[17];owners=list(nums[slot]);assert owners[0].objgen==(1463,0)
  owner_tokens=[tok(v) for v in owners];owner_tokens[0]='null'
  formkey=int(native.Root.StructTreeRoot.ParentTreeNextKey);assert formkey>max(locations)
  def newobj(raw):
   x=pdf.get_new_xref();pdf.update_object(x,raw);return x
  def group(role,parent,box,x=None):
   if x is None:x=newobj(f'<< /Type /StructElem /S /{role} /P {parent} 0 R /Pg 791 0 R /K [] >>')
   else:
    pdf.xref_set_key(x,'S','/'+role);pdf.xref_set_key(x,'Alt','null')
   pdf.xref_set_key(x,'A',f'<< /O /Layout /BBox [{box[0]} {792-box[3]} {box[2]} {792-box[1]}] >>')
   return x,node(x,role,box)
  def cell(role,parent,text,box,scope=None,ident=None,headers=None):
   nonlocal mcid
   attributes='/O /Table'
   if scope:attributes+=f' /Scope /{scope}'
   if headers:attributes+=' /Headers [ '+' '.join(string(v)for v in headers)+' ]'
   layout=f'/O /Layout /BBox [{box[0]} {792-box[3]} {box[2]} {792-box[1]}]'
   raw=f'<< /Type /StructElem /S /{role} /P {parent} 0 R /Pg 791 0 R /A [ << {attributes} >> << {layout} >> ]'
   if ident:raw+=' /ID '+string(ident)
   raw+=f' /K [ << /Type /MCR /Pg 791 0 R /Stm 1137 0 R /MCID {mcid} >> ] >>'
   x=newobj(raw);n=node(x,role,box,text=text)
   if ident:htmlids[ident]=f'{x} 0 R'
   n['children']=[{'kind':'content','key':['1137:0',mcid],'ops':[{'text':text,'actual':None,'bbox':box,'line_y':round((box[1]+box[3])/2,4),'page':9,'kind':'text'}]}]
   mapping.append({'node':n['id'],'role':role,'text':text,'mcid':mcid,'bbox_mupdf':box,'scope':scope,'id':ident,'headers':headers or []});mcid+=1
   return x,n
  def setchildren(x,n,pairs):
   pdf.xref_set_key(x,'K','[ '+' '.join(f'{a} 0 R'for a,b in pairs)+' ]');n['children']=[b for a,b in pairs]
  # Source Form grid boundaries transformed to page coordinates (MuPDF).
  scale=.69452;left=53.929;bottom=170.707
  xs=[[4.75,166.5,233.7,292.5,346.25],[4.75,167,233.95,291.9,346.25]]
  ys=[[149.75,132.1502,114.5503,96.9505,79.3506],[74.8506,57.2507,39.6509,22.051,4.4512]]
  for ti,values in enumerate(VALUES):
   xb=[round(left+scale*v,5)for v in xs[ti]];yb=[round(bottom-scale*v,5)for v in ys[ti]]
   prefix='arbility-figure5-'+('accuracy'if ti==0 else'time');metric=prefix+'-metric'
   tx,tn=group('Table',1452,[xb[0],yb[0],xb[-1],yb[-1]],x=1463 if ti==0 else None);rows=[]
   for ri,row in enumerate(values):
    rx,rn=group('TR',tx,[xb[0],yb[ri],xb[-1],yb[ri+1]]);cells=[];rowid=prefix+'-row'+str(ri)
    for ci,value in enumerate(row):
     scope='Column'if ri==0 else'Row'if ci==0 else None
     ident=metric if ri==0 and ci==0 else prefix+'-col'+str(ci)if ri==0 else rowid if ci==0 else None
     headers=([metric]if ri==0 and ci>0 else [metric,rowid,prefix+'-col'+str(ci)]if ri>0 and ci>0 else [])
     cells.append(cell('TH'if scope else'TD',rx,value,[xb[ci],yb[ri],xb[ci+1],yb[ri+1]],scope,ident,headers))
    setchildren(rx,rn,cells);rows.append((rx,rn))
   setchildren(tx,tn,rows);tablepairs.append((tx,tn))
  assert len(mapping)==32
  # Split each text-show array at large positioning gaps between cells. Each
  # numeric operand stays in order; neither glyph bytes nor advances change.
  formbytes=form.read_bytes();showins=[ins for ins in pikepdf.parse_content_stream(form)if str(ins.operator)in ['Tj','TJ']]
  matches=list(re.finditer(rb'(?m)^.*(?:TJ|Tj)\s*$',formbytes));assert len(matches)==len(showins)==12
  segments=[];start=0;mi=0;expected=[]
  for match,ins in zip(matches,showins):
   segments.append(b'/Artifact BMC\n'+formbytes[start:match.start()]+b'\nEMC\n')
   source=list(ins.operands[0])if str(ins.operator)=='TJ'else[ins.operands[0]]
   chunks=[[]]
   for operand in source:
    if not isinstance(operand,pikepdf.String)and float(operand)<-1000:chunks.append([])
    chunks[-1].append(operand)
   for chunk in chunks:
    visible=''.join(str(v)for v in chunk if isinstance(v,pikepdf.String));assert visible==mapping[mi]['text'],(mi,visible,mapping[mi])
    expected.append(visible);role=mapping[mi]['role']
    segments.append(f'/{role} << /MCID {mi} >> BDC\n'.encode()+pikepdf.Array(chunk).unparse()+b' TJ\nEMC\n');mi+=1
   start=match.end()
  segments.append(b'/Artifact BMC\n'+formbytes[start:]+b'\nEMC\n');assert mi==32
  pdf.update_stream(1137,b''.join(segments));pdf.xref_set_key(1137,'StructParents',str(formkey))
  # Assign real form-text MCIDs to the new cells, retire the old page wrapper.
  nt=[tok(v)for v in nums];nt[slot]='[ '+' '.join(owner_tokens)+' ]'
  nt.extend([str(formkey),'[ '+' '.join(m['node'].replace(':',' ')+' R'for m in mapping)+' ]'])
  pdf.xref_set_key(pt.objgen[0],'Nums','[ '+' '.join(nt)+' ]');pdf.xref_set_key(native.Root.StructTreeRoot.objgen[0],'ParentTreeNextKey',str(formkey+1))
  parent=native.get_object((1452,0));kids=[]
  for c in parent.K:
   kids.append(tok(c))
   if c.objgen==(1463,0):kids.append(f'{tablepairs[1][0]} 0 R')
  pdf.xref_set_key(1452,'K','[ '+' '.join(kids)+' ]')
  ids={}
  def idwalk(n):
   names=n.get('/Names',[])
   for i in range(0,len(names),2):ids[str(names[i])]=tok(names[i+1])
   for c in n.get('/Kids',[]):idwalk(c)
  idwalk(native.Root.StructTreeRoot.get('/IDTree',{}));assert not set(ids)&set(htmlids);ids.update(htmlids)
  pdf.xref_set_key(native.Root.StructTreeRoot.objgen[0],'IDTree','<< /Names [ '+' '.join(string(k)+' '+ids[k]for k in sorted(ids))+' ] >>')
  pdf.saveIncr()
 # Synchronize the same structure/content references used by the Markdown export.
 parent=ns['1452:0'];oldnode=ns['1463:0'];at=parent['children'].index(oldnode);parent['children'][at:at+1]=[n for x,n in tablepairs]
 sys.path.insert(0,str(repo/'script/publication-markdown'));from table_renderer import build_attrs_by_id,render_table
 data['table_attributes']=build_attrs_by_id(pdf_path);data['pdf_sha256']=sha(pdf_path)
 for override in data.get('reviewed_overrides',{}).values():
  if override.get('source_sha256')==before:override['source_sha256']=data['pdf_sha256']
 change={'date':'2026-10-05','baseline_pdf_sha256':before,'kind':'vector_table_semantics','page':9,'tables':[n['id']for x,n in tablepairs],'caption':'1464:0','removed_figure_mcid':0,'form':'1137:0','form_structparents':formkey,'new_form_mcids':list(range(32)),'description':'Two native 4 by 4 tables tag existing vector text. Scope and explicit header IDs associate metric/units, participant group and task for every value. Original grid painting is artifact; no additional text or visual content. Original shared Figure 5 caption remains once after both tables.','former_figure_alt':old_alt}
 data.setdefault('structure_revisions',[]).append(change)
 archive_path.write_bytes(gzip.compress((json.dumps(data,ensure_ascii=False,separators=(',',':'))+'\n').encode(),mtime=0))
 html=[];metas=[]
 for x,table in tablepairs:
  h,meta=render_table(table,data['table_attributes']);assert not meta['warnings'];assert meta['row_count']==4 and meta['column_count']==4 and meta['cell_count']==16 and meta['header_count']==7
  html.append(h);metas.append(meta)
 report={'file':pdf_path.name,'before_sha256':before,'after_sha256':data['pdf_sha256'],'change':change,'mapping':mapping,'table_rendering':metas,'output_pdf':str(pdf_path),'output_archive':str(archive_path)}
 return report,'\n\n'.join(html)

def main():
 a=argparse.ArgumentParser();a.add_argument('--repo',type=Path,default=Path('/home/soney/nucode/spot-web'));a.add_argument('--pdf',type=Path);a.add_argument('--archive',type=Path);a.add_argument('--output-dir',type=Path,default=Path('/tmp/spot-pdf-oct-review/arboretum-table-candidate'));a.add_argument('--apply',action='store_true');args=a.parse_args()
 pdf=args.pdf or args.repo/'assets/pdfs/oney-arboretum-and-arbility-uist2018.pdf';arc=args.archive or args.repo/'script/publication-markdown/source-tags/oney-arboretum-and-arbility-uist2018.json.gz';args.output_dir.mkdir(parents=True,exist_ok=True)
 if not args.apply:
  po=args.output_dir/pdf.name;ao=args.output_dir/arc.name;shutil.copy2(pdf,po);shutil.copy2(arc,ao);pdf,arc=po,ao
 report,html=repair(pdf,arc,args.repo);(args.output_dir/'repair-report.json').write_text(json.dumps(report,indent=2)+'\n');(args.output_dir/'table.html').write_text('<!DOCTYPE html><meta charset="utf-8"><style>table{border-collapse:collapse}th,td{border:1px solid #bbb;padding:.5em}caption{margin-bottom:1em}</style>'+html);print(json.dumps(report['table_rendering'],indent=2))
if __name__=='__main__':main()
