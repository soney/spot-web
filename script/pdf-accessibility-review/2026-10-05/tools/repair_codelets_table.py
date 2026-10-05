"""Restore table navigation for Codelets' raster-only Table1 without repainting it.

Works from any hash-matched current PDF/archive pair; existing IDs and changes
are preserved by incremental save. Default creates copies in /tmp; --apply
explicitly mutates the supplied PDF and archive. New text is invisible (3 Tr),
using an existing embedded font and /ActualText at both content and cell level.
Only the image's semantic wrapper is changed to Artifact, not the image bytes
or painting operations. Exact source means, SDs, capitalization and asterisks
are copied to scoped native cells and the archived tree used by the converter.
"""
import argparse,copy,gzip,hashlib,json,re,shutil,sys
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
 d={'kind':'element','id':f'{x}:0','role':role,'page':5,'pages':[5],'bbox_by_page':{'5':box},'alt':'','actual':text,'children':children or []}
 if role not in ['Table','THead','TBody','TR']:d['text']=text
 return d

VALUES=[['Codelets','2.09 (0.78)**','1.70 (0.67)','1.75 (1.22)','1.0 (0.00)**','5.57 (2.72)**','4.30 (3.59)*','3.26 (1.73)','2.3 (2.11)'],['Control','4.04 (1.84)**','2.90 (1.66)','2.54 (1.04)','2.44 (0.88)**','10.40 (3.91)**','8.78 (4.55)*','5.26 (3.46)','4.78 (3.63)']]

def repair(pdf_path,archive_path,repo):
 data=json.load(gzip.open(archive_path));before=sha(pdf_path);assert data['pdf_sha256']==before,'PDF/archive hash mismatch'
 ns={n['id']:n for n in walk(data['tree']) if n.get('kind')=='element'}
 assert ns['219:0']['role']=='Figure' and ns['220:0']['role']=='Caption'
 mapping=[];htmlids={};streams=[];pgref='31:0';pageheight=792
 with pikepdf.open(pdf_path) as native,pymupdf.open(pdf_path) as pdf:
  old=native.get_object((219,0));assert str(old.S)=='/Figure' and list(old.K)==[0] and old.P.objgen==(218,0) and old.Pg.objgen==(31,0)
  assert str(old.get('/Alt'))==ns['219:0']['alt'],'Source alt/archive mismatch'
  old_alt=str(old.Alt);page=native.pages[4];assert page.obj.objgen==(31,0) and int(page.obj.StructParents)==4
  assert page.Resources.XObject['/Im29'].objgen==(126,0)
  assert page.Contents.is_indirect and isinstance(page.Contents,pikepdf.Stream)
  contents=page.Contents.read_bytes();pattern=rb'/Figure\s*<<\s*/MCID\s+0\s*>>\s*BDC(?=\s*/Im29\s+Do)'
  replaced,count=re.subn(pattern,b'/Artifact BMC',contents);assert count==1
  pdf.update_stream(page.Contents.objgen[0],replaced)
  # Locate page ownership array in the ParentTree, preserving other entries.
  locations={}
  def nwalk(n):
   nums=n.get('/Nums',[])
   for k in range(0,len(nums),2):locations[int(nums[k])]=(n,nums,k+1)
   for c in n.get('/Kids',[]):nwalk(c)
  nwalk(native.Root.StructTreeRoot.ParentTree);leaf,nums,slot=locations[4];owners=list(nums[slot]);assert owners[0].objgen==(219,0)
  owner_tokens=[tok(v) for v in owners];owner_tokens[0]='null';nextmcid=len(owners)
  def newobj(raw):
   x=pdf.get_new_xref();pdf.update_object(x,raw);return x
  def group(role,parent,box):
   x=newobj(f'<< /Type /StructElem /S /{role} /P {parent} 0 R /Pg 31 0 R /K [] >>');return x,node(x,role,box)
  def cell(role,parent,text,box,scope=None,rowspan=1,colspan=1,ident=None,headers=None):
   nonlocal nextmcid
   attributes='/O /Table'
   if scope:attributes+=f' /Scope /{scope}'
   if rowspan>1:attributes+=f' /RowSpan {rowspan}'
   if colspan>1:attributes+=f' /ColSpan {colspan}'
   if headers:attributes+=' /Headers [ '+' '.join(string(v)for v in headers)+' ]'
   layout=f'/O /Layout /BBox [{box[0]} {792-box[3]} {box[2]} {792-box[1]}]'
   raw=f'<< /Type /StructElem /S /{role} /P {parent} 0 R /Pg 31 0 R /A [ << {attributes} >> << {layout} >> ]'
   if ident:raw+=' /ID '+string(ident)
   mcid=nextmcid if text else None
   if text:raw+=' /ActualText '+string(text)+f' /K [{mcid}]'
   else:raw+=' /K []'
   x=newobj(raw+' >>');n=node(x,role,box,text=text)
   if ident:htmlids[ident]=f'{x} 0 R'
   if text:
    owner_tokens.append(f'{x} 0 R');nextmcid+=1
    # All invisible content is isolated before the original stream. The x glyph
    # has exact text replacement; source geometry/paint remains untouched.
    cx=box[0]+1;cy=(box[1]+box[3])/2
    streams.append(f'/{role} << /MCID {mcid} /ActualText {string(text)} >> BDC\nq\nBT\n/TT12.0 1 Tf\n3 Tr\n1 0 0 1 {cx:.3f} {792-cy:.3f} Tm\n(x) Tj\nET\nQ\nEMC\n')
    n['children']=[{'kind':'content','key':[pgref,mcid],'ops':[{'text':'x','actual':text,'bbox':box,'line_y':cy,'page':5,'kind':'text'}]}]
   mapping.append({'node':n['id'],'role':role,'text':text,'mcid':mcid,'bbox_mupdf':box,'scope':scope,'rowspan':rowspan,'colspan':colspan,'id':ident,'headers':headers or []});return x,n
  def setchildren(x,n,pairs):
   pdf.xref_set_key(x,'K','[ '+' '.join(f'{a} 0 R'for a,b in pairs)+' ]');n['children']=[b for a,b in pairs]
  xb=[54,101.7,158.4,215.1,271.8,328.5,385.2,441.9,498.6,558]
  tablebox=[54,61.2,558,123.9];hx,hn=group('THead',219,[54,61.2,558,92.6]);bx,bn=group('TBody',219,[54,92.6,558,123.9]);headerrows=[]
  rx,rn=group('TR',hx,[54,61.2,558,79]);pairs=[cell('TH',rx,'',[54,61.2,101.7,92.6],scope='Column',rowspan=2)]
  for s in range(4):pairs.append(cell('TH',rx,f'Step {s+1}',[xb[1+s*2],61.2,xb[3+s*2],79],scope='Column',colspan=2,ident=f'codelets-table1-step{s+1}'))
  setchildren(rx,rn,pairs);headerrows.append((rx,rn))
  rx,rn=group('TR',hx,[101.7,79,558,92.6]);pairs=[]
  for i in range(8):pairs.append(cell('TH',rx,'Time' if i%2==0 else '# Refreshes',[xb[i+1],79,xb[i+2],92.6],scope='Column',ident=f'codelets-table1-step{i//2+1}-'+('time' if i%2==0 else 'refreshes'),headers=[f'codelets-table1-step{i//2+1}']))
  setchildren(rx,rn,pairs);headerrows.append((rx,rn));setchildren(hx,hn,headerrows)
  bodyrows=[]
  for ri,values in enumerate(VALUES):
   y0,y1=([92.6,107.8]if ri==0 else[107.8,123.9]);rx,rn=group('TR',bx,[54,y0,558,y1]);pairs=[];rowid='codelets-table1-'+values[0].lower()
   pairs.append(cell('TH',rx,values[0],[54,y0,101.7,y1],scope='Row',ident=rowid))
   for ci,text in enumerate(values[1:]):
    step=f'codelets-table1-step{ci//2+1}';measurement=step+('-time'if ci%2==0 else'-refreshes')
    pairs.append(cell('TD',rx,text,[xb[ci+1],y0,xb[ci+2],y1],headers=[rowid,step,measurement]))
   setchildren(rx,rn,pairs);bodyrows.append((rx,rn))
  setchildren(bx,bn,bodyrows)
  # Nest existing native caption once. It retains all original MCID ownership.
  pdf.xref_set_key(220,'P','219 0 R');parent=native.get_object((218,0));pdf.xref_set_key(218,'K',arr([c for c in parent.K if c.objgen!=(220,0)]))
  pdf.xref_set_key(219,'S','/Table');pdf.xref_set_key(219,'Alt','null');pdf.xref_set_key(219,'K',f'[220 0 R {hx} 0 R {bx} 0 R]')
  if nums[slot].is_indirect:pdf.update_object(nums[slot].objgen[0],'[ '+' '.join(owner_tokens)+' ]')
  else:
   nt=[tok(v)for v in nums];nt[slot]='[ '+' '.join(owner_tokens)+' ]';assert leaf.objgen[0];pdf.xref_set_key(leaf.objgen[0],'Nums','[ '+' '.join(nt)+' ]')
  # Header /ID references are registered in the root IDTree.
  ids={}
  def idwalk(n):
   names=n.get('/Names',[])
   for i in range(0,len(names),2):ids[str(names[i])]=tok(names[i+1])
   for c in n.get('/Kids',[]):idwalk(c)
  idwalk(native.Root.StructTreeRoot.get('/IDTree',{}));assert not set(ids)&set(htmlids);ids.update(htmlids)
  pdf.xref_set_key(native.Root.StructTreeRoot.objgen[0],'IDTree','<< /Names [ '+' '.join(string(k)+' '+ids[k]for k in sorted(ids))+' ] >>')
  streamref=newobj('<< >>');pdf.update_stream(streamref,''.join(streams).encode('ascii'));pdf.xref_set_key(31,'Contents',f'[{streamref} 0 R {page.Contents.objgen[0]} 0 R]')
  pdf.saveIncr()
 # Mirror exact changed native structure without losing independent repairs.
 parent=ns['218:0'];parent['children'].remove(ns['220:0']);table=ns['219:0'];table.clear();table.update(node(219,'Table',tablebox,[ns['220:0'],hn,bn]));table.pop('actual',None)
 sys.path.insert(0,str(repo/'script/publication-markdown'));from table_renderer import build_attrs_by_id,render_table
 data['table_attributes']=build_attrs_by_id(pdf_path);data['pdf_sha256']=sha(pdf_path)
 for override in data.get('reviewed_overrides',{}).values():
  if override.get('source_sha256')==before:override['source_sha256']=data['pdf_sha256']
 change={'date':'2026-10-05','baseline_pdf_sha256':before,'kind':'raster_table_semantics','page':5,'table':'219:0','caption':'220:0','removed_figure_mcid':0,'new_text_mcids':[m['mcid']for m in mapping if m['mcid'] is not None],'description':'Native Table with two heading rows, four grouped step headings, metric headings and Codelets/Control row headers. Invisible text carries exact bitmap cell text; original raster painting remains an artifact.','former_figure_alt':old_alt}
 data.setdefault('structure_revisions',[]).append(change)
 archive_path.write_bytes(gzip.compress((json.dumps(data,ensure_ascii=False,separators=(',',':'))+'\n').encode(),mtime=0))
 html,metadata=render_table(table,data['table_attributes']);assert not metadata['warnings'];assert metadata['row_count']==4 and metadata['column_count']==9 and metadata['cell_count']==31 and metadata['header_count']==15
 report={'file':pdf_path.name,'before_sha256':before,'after_sha256':data['pdf_sha256'],'change':change,'mapping':mapping,'table_rendering':metadata,'output_pdf':str(pdf_path),'output_archive':str(archive_path)}
 return report,html

def main():
 a=argparse.ArgumentParser();a.add_argument('--repo',type=Path,default=Path('/home/soney/nucode/spot-web'));a.add_argument('--pdf',type=Path);a.add_argument('--archive',type=Path);a.add_argument('--output-dir',type=Path,default=Path('/tmp/spot-pdf-oct-review/codelets-table-candidate'));a.add_argument('--apply',action='store_true');args=a.parse_args()
 pdf=args.pdf or args.repo/'assets/pdfs/oney-codelets-chi2012.pdf';arc=args.archive or args.repo/'script/publication-markdown/source-tags/oney-codelets-chi2012.json.gz';args.output_dir.mkdir(parents=True,exist_ok=True)
 if not args.apply:
  po=args.output_dir/pdf.name;ao=args.output_dir/arc.name;shutil.copy2(pdf,po);shutil.copy2(arc,ao);pdf,arc=po,ao
 report,html=repair(pdf,arc,args.repo);(args.output_dir/'repair-report.json').write_text(json.dumps(report,indent=2)+'\n');(args.output_dir/'table.html').write_text('<!DOCTYPE html><meta charset="utf-8"><style>table{border-collapse:collapse}th,td{border:1px solid #bbb;padding:.5em}caption{margin-bottom:1em}</style>'+html);print(json.dumps(report['table_rendering'],indent=2))
if __name__=='__main__':main()
