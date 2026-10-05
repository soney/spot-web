"""Incremental native PDF structure editing from a hash-bound archive.
Only explicit artifact requests touch content streams; all drawing bytes remain.
"""
from pathlib import Path
import copy,gzip,hashlib,json,re,sys
import pikepdf,pymupdf
REPO=Path('/home/soney/nucode/spot-web')
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def walk(n):
 if isinstance(n,list):
  for c in n:yield from walk(c)
 elif isinstance(n,dict):
  yield n
  for c in n.get('children',[]):yield from walk(c)
def ref(s):return s.replace(':',' ')+' R'
def string(s):return '<'+(b'\xfe\xff'+s.encode('utf-16-be')).hex()+'>'
def tok(v):return v.unparse().decode('ascii') if hasattr(v,'unparse') else str(v)
def sequence_text(n):
 if n.get('actual'):return n['actual']
 if n.get('kind')=='content':return ''.join(o['actual'] if o.get('actual') is not None else o.get('text','') for o in n.get('ops',[]))
 if n.get('role') in ['Figure','Formula'] and n.get('alt'):return n['alt']
 return ''.join(sequence_text(c) for c in n.get('children',[]))
def refresh(n):
 boxes={}
 for x in walk(n):
  for o in x.get('ops',[]):
   if o.get('bbox') and o.get('page'):boxes.setdefault(str(o['page']),[]).append(o['bbox'])
 if boxes:
  n['bbox_by_page']={p:[min(b[0]for b in bs),min(b[1]for b in bs),max(b[2]for b in bs),max(b[3]for b in bs)]for p,bs in boxes.items()};n['pages']=sorted(map(int,boxes))
  n['page']=n['pages'][0]
 n['text']=sequence_text(n)
 return n
class Editor:
 def __init__(self,filename,pdf_path=None,archive_path=None):
  self.path=Path(pdf_path)if pdf_path else REPO/'assets/pdfs'/filename
  self.archive=Path(archive_path)if archive_path else REPO/'script/publication-markdown/source-tags'/(Path(filename).stem+'.json.gz')
  self.data=json.loads(gzip.decompress(self.archive.read_bytes()));self.before=sha(self.path);assert self.before==self.data['pdf_sha256']
  if not isinstance(self.data['tree'],list):self.data['tree']=[self.data['tree']]
  self.original=copy.deepcopy(self.data);self.nodes={n['id']:n for n in walk(self.data['tree'])if n.get('kind')=='element'}
  self.native=pikepdf.open(self.path);self.pdf=pymupdf.open(self.path);self.root_id=':'.join(map(str,self.native.Root.StructTreeRoot.objgen))
  self.page_ids={i:':'.join(map(str,p.obj.objgen))for i,p in enumerate(self.native.pages,1)};self.page_numbers={v:k for k,v in self.page_ids.items()}
  self.artifacts=set();self.attributes={};self.ids={};self.changes=[];self.created=set();self.dirty=set()
  self.original_nodes={n['id']:n for n in walk(self.original['tree'])if n.get('kind')=='element'}
 def node(self,id):return id if isinstance(id,dict)else self.nodes[id]
 def parent(self,id):
  n=self.node(id)
  for p in walk(self.data['tree']):
   if any(c is n for c in p.get('children',[])):return p
  if any(c is n for c in self.data['tree']):return None
  raise KeyError('detached '+n['id'])
 def detach(self,id):
  n=self.node(id);p=self.parent(n);kids=p['children']if p else self.data['tree'];kids.remove(n)
  if p:self.dirty.add(p['id'])
  return n
 def move_before(self,ids,anchor):self._move(ids,anchor,False)
 def move_after(self,ids,anchor):self._move(ids,anchor,True)
 def _move(self,ids,anchor,after):
  if isinstance(ids,(str,dict)):ids=[ids]
  a=self.node(anchor);m=[self.node(x)for x in ids];assert all(x is not a for x in m)
  for x in m:
   try:self.detach(x)
   except KeyError:
    assert x['id']in self.created,('unattached existing node',x['id'])
  p=self.parent(a);kids=p['children']if p else self.data['tree'];ix=kids.index(a)+int(after);kids[ix:ix]=m
  if p:self.dirty.add(p['id'])
 def merge(self,first,continuation):
  a,b=self.node(first),self.node(continuation);assert a is not b
  assert not a.get('actual')and not b.get('actual'),'Merge ActualText explicitly before merging'
  assert not any(n is a for n in walk(b))and not any(n is b for n in walk(a))
  self.detach(b);a.setdefault('children',[]).extend(b.get('children',[]));self.dirty.add(a['id']);refresh(a)
  # Preserve a donor transcription on a wrapper rather than discard its override.
  assert b['id']not in self.data.get('reviewed_overrides',{}),'Donor has reviewed override; retain it as an inline child instead'
  return a
 def new_element(self,role,children,page=None,alt='',actual=''):
  x=self.pdf.get_new_xref();self.pdf.update_object(x,'<< /Type /StructElem >>');id=f'{x}:0'
  n={'kind':'element','id':id,'role':role,'page':page,'pages':[page]if page else[],'bbox_by_page':{},'alt':alt,'actual':actual,'children':children}
  self.nodes[id]=n;self.created.add(id);self.dirty.add(id);refresh(n);return n
 def set_actual(self,id,text):n=self.node(id);n['actual']=text;self.dirty.add(n['id'])
 def artifact(self,id):
  n=self.node(id);assert not any(v.get('kind')=='annotation'for v in walk(n)),'Artifact has annotations'
  keys=[tuple(v['key'])for v in walk(n)if v.get('kind')=='content'];self.detach(n);self.artifacts.update(keys)
 def artifact_keys(self,keys):
  keys={tuple(k)for k in keys};self.artifacts.update(keys)
  def prune(n):
   old=n.get('children',[]);kids=[]
   for c in old:
    if c.get('kind')=='content'and tuple(c['key'])in keys:continue
    if c.get('kind')=='element':
     had=bool(c.get('children'));prune(c)
     if had and not c.get('children')and not c.get('alt')and not c.get('actual'):continue
    kids.append(c)
   if len(kids)!=len(old):n['children']=kids;self.dirty.add(n['id'])
  for root in self.data['tree']:prune(root)
 def _artifact_streams(self):
  grouped={}
  for container,mcid in self.artifacts:grouped.setdefault(container,set()).add(mcid)
  for container,targets in grouped.items():
   obj=self.native.get_object(tuple(map(int,container.split(':'))))
   if str(obj.get('/Type',''))=='/Page':
    content=obj.Contents;streams=list(content)if isinstance(content,pikepdf.Array)else[content];resources=obj.get('/Resources',{})
   else:streams=[obj];resources=obj.get('/Resources',{})
   hits=set()
   for stream in streams:
    x=stream.objgen[0];raw=self.pdf.xref_stream(x)
    pattern=rb'/[^\s<>\[\]()]+\s*<<(.*?)>>\s*BDC'
    def replace(m):
     found=re.search(rb'/MCID\s+(\d+)\b',m[1])
     if found and int(found[1])in targets:
      mid=int(found[1]);assert mid not in hits,(container,mid);hits.add(mid);return b'/Artifact BMC'
     return m[0]
    result=re.sub(pattern,replace,raw,flags=re.S)
    # Named property dictionaries in publisher-produced PDFs.
    def named(m):
     prop=resources.get('/Properties',{}).get(m[2].decode(),{});mid=prop.get('/MCID')
     if mid is not None and int(mid)in targets:
      assert int(mid)not in hits;hits.add(int(mid));return b'/Artifact BMC'
     return m[0]
    result=re.sub(rb'(/[^\s<>\[\]()]+)\s+(/[^\s<>\[\]()]+)\s+BDC',named,result)
    if result!=raw:self.pdf.update_stream(x,result)
   assert hits==targets,(container,'artifact targets unmatched',targets-hits)
 def save(self,changes=None):
  self._artifact_streams();reachable={};parent={};content_owner={};annotation_owner={}
  def visit(n,p):
   assert n['id']not in reachable,('duplicate node',n['id']);reachable[n['id']]=n;parent[n['id']]=p
   for c in n.get('children',[]):
    if c.get('kind')=='element':visit(c,n['id'])
    elif c.get('kind')=='content':
     key=tuple(c['key']);assert key not in content_owner,('duplicateMCID',key);content_owner[key]=n['id']
    elif c.get('kind')=='annotation':assert c['object']not in annotation_owner;annotation_owner[c['object']]=n['id']
  for n in self.data['tree']:visit(n,self.root_id)
  assert not set(content_owner)&self.artifacts
  # Refresh metadata on changed ancestors too.
  for id,n in reversed(list(reachable.items())):
   old=self.original_nodes.get(id)
   if old is None or n.get('children')!=old.get('children')or id in self.dirty:refresh(n)
  owners={};containers={k[0]for k in content_owner}|{k[0]for k in self.artifacts}
  for container in containers:
   obj=self.native.get_object(tuple(map(int,container.split(':'))));key=int(obj.StructParents);entries={m:owner for (c,m),owner in content_owner.items()if c==container}
   maxid=max([m for c,m in set(content_owner)|self.artifacts if c==container],default=-1)
   owners[key]='[ '+' '.join(ref(entries[m])if m in entries else'null'for m in range(maxid+1))+' ]'
  annotation_pages={':'.join(map(str,a.objgen)):self.page_ids[i]for i,p in enumerate(self.native.pages,1)for a in p.obj.get('/Annots',[])}
  for annot,owner in annotation_owner.items():
   a=self.native.get_object(tuple(map(int,annot.split(':'))));owners[int(a.StructParent)]=ref(owner)
  for id,n in reachable.items():
   x=int(id.split(':')[0]);old=self.original_nodes.get(id);pg=n.get('page')or next(iter(n.get('pages',[])),None)
   if pg not in self.page_ids:
    pg=next((o['page']for v in walk(n)for o in v.get('ops',[])if o.get('page')),None)
   pageid=self.page_ids.get(pg);self.pdf.xref_set_key(x,'Type','/StructElem');self.pdf.xref_set_key(x,'P',ref(parent[id]))
   if old is None or n.get('role')!=old.get('role'):self.pdf.xref_set_key(x,'S','/'+n['role'])
   if pageid:self.pdf.xref_set_key(x,'Pg',ref(pageid))
   for field,key in [('actual','ActualText'),('alt','Alt')]:
    if old is None or n.get(field,'')!=old.get(field,''):self.pdf.xref_set_key(x,key,string(n[field])if n.get(field)else'null')
   ks=[]
   for c in n.get('children',[]):
    kind=c['kind']
    if kind=='element':ks.append(ref(c['id']))
    elif kind=='content':
     container,mcid=c['key'];cp=next((o['page']for o in c.get('ops',[])if o.get('page')),pg);cpid=self.page_ids.get(cp,pageid)
     if container==pageid:ks.append(str(mcid))
     else:
      assert cpid,('content has no page',id,c['key'])
      ks.append('<< /Type /MCR /Pg '+ref(cpid)+(' /Stm '+ref(container)if container not in self.page_numbers else'')+' /MCID '+str(mcid)+' >>')
    elif kind=='annotation':
     ap=annotation_pages.get(c['object'],pageid);ks.append('<< /Type /OBJR /Obj '+ref(c['object'])+(' /Pg '+ref(ap)if ap else'')+' >>')
    else:raise ValueError(kind)
   self.pdf.xref_set_key(x,'K','[ '+' '.join(ks)+' ]')
   if id in self.attributes:self.pdf.xref_set_key(x,'A',self.attributes[id])
  self.pdf.xref_set_key(int(self.root_id.split(':')[0]),'K','[ '+' '.join(ref(n['id'])for n in self.data['tree'])+' ]')
  pt=self.pdf.get_new_xref();self.pdf.update_object(pt,'<< /Nums [ '+' '.join(str(k)+' '+v for k,v in sorted(owners.items()))+' ] >>')
  self.pdf.xref_set_key(int(self.root_id.split(':')[0]),'ParentTree',f'{pt} 0 R');self.pdf.xref_set_key(int(self.root_id.split(':')[0]),'ParentTreeNextKey',str(max(owners,default=-1)+1))
  ids=[]
  for id,n in reachable.items():
   native=self.native.get_object(tuple(map(int,id.split(':'))))if id not in self.created else{}
   value=self.ids.get(id)
   if value is not None:raw=string(value);bs=b'\xfe\xff'+value.encode('utf-16-be');self.pdf.xref_set_key(int(id.split(':')[0]),'ID',raw)
   elif '/ID'in native:raw=tok(native.ID);bs=bytes(native.ID)
   elif n.get('role')=='Note':
    value='order-note-'+id.replace(':','-');raw=string(value);bs=b'\xfe\xff'+value.encode('utf-16-be');self.pdf.xref_set_key(int(id.split(':')[0]),'ID',raw)
   else:continue
   ids.append((bs,raw,id))
  assert len({a for a,b,c in ids})==len(ids),'duplicate IDs'
  if ids:
   ix=self.pdf.get_new_xref();self.pdf.update_object(ix,'<< /Names [ '+' '.join(raw+' '+ref(id)for _,raw,id in sorted(ids))+' ] >>');self.pdf.xref_set_key(int(self.root_id.split(':')[0]),'IDTree',f'{ix} 0 R')
  else:self.pdf.xref_set_key(int(self.root_id.split(':')[0]),'IDTree','null')
  self.pdf.saveIncr();self.pdf.close();self.native.close();after=sha(self.path);self.data['pdf_sha256']=after
  for override in self.data.get('reviewed_overrides',{}).values():
   if override.get('source_sha256')==self.before:override['source_sha256']=after
  self.data.setdefault('structure_revisions',[]).append({'date':'2026-10-05','baseline_pdf_sha256':self.before,'changes':changes or self.changes,'artifact_content_keys':[list(k)for k in sorted(self.artifacts)]})
  if self.attributes:
   sys.path.insert(0,str(REPO/'script/publication-markdown'));from table_renderer import build_attrs_by_id
   with pikepdf.open(self.path)as native:self.data['table_attributes']=build_attrs_by_id(native)
  self.archive.write_bytes(gzip.compress((json.dumps(self.data,ensure_ascii=False,separators=(',',':'))+'\n').encode(),mtime=0))
  return {'file':self.path.name,'before_sha256':self.before,'after_sha256':after,'changes':changes or self.changes,'artifact_content_keys':[list(k)for k in sorted(self.artifacts)],'elements':len(reachable),'content_references':len(content_owner)}
