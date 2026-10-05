from pathlib import Path
import collections,gzip,hashlib,json,sys,pikepdf,pymupdf
BASE=Path('/tmp/spot-ua-final/artifacts');ROOT=Path('/home/soney/nucode/spot-web')
def val(o):return o.unparse() if hasattr(o,'unparse') else str(o).encode()
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def check(f):
 old=ROOT/'assets/pdfs'/f['file'];new=BASE/'candidates'/f['file'];assert sha(old)==f['pdf_sha256']
 a=pikepdf.open(old);b=pikepdf.open(new);am=pymupdf.open(old);bm=pymupdf.open(new)
 targets={int(l['node'].split(':')[0]):l for l in f['lists']};streamids={x for t in f['artifacts']for x in(t.get('streams')or[t['stream']])}
 assert bm.xref_length()>=am.xref_length()
 for x in range(am.xref_length(),bm.xref_length()):assert bm.xref_get_key(x,'Type')==('name','/XRef'),(old.name,x,'unexpected new object')
 streamdiffs=[];listdiffs=[];otherdiffs=[]
 for x in range(1,am.xref_length()):
  if am.xref_object(x)==bm.xref_object(x) and (not am.xref_is_stream(x)or am.xref_stream(x)==bm.xref_stream(x)):continue
  ao=a.get_object((x,0));bo=b.get_object((x,0))
  if x in targets:
   assert set(bo)==set(ao)|{'/A'},(old.name,x,'list keys')
   assert all(val(ao[k])==val(bo[k]) for k in ao),(old.name,x,'changed list property')
   assert str(bo.A.O)=='/List'and str(bo.A.ListNumbering)=='/Decimal'and set(bo.A)=={'/O','/ListNumbering'}
   listdiffs.append(x)
  elif x in streamids:
   assert all(val(ao.get(k))==val(bo.get(k))for k in (set(ao)|set(bo))-{'/Length','/Filter','/DecodeParms'}),(old.name,x,'stream dictionary')
   ax=pikepdf.parse_content_stream(ao);bx=pikepdf.parse_content_stream(bo)
   assert len(ax)==len(bx),(old.name,x,'instruction count')
   diffs=[]
   for i,(ai,bi)in enumerate(zip(ax,bx)):
    if val(ai)==val(bi):continue
    # Instructions do not expose unparse; compare normalized serialized single instruction.
    aby=pikepdf.unparse_content_stream([ai]);bby=pikepdf.unparse_content_stream([bi])
    if aby==bby:continue
    assert str(ai.operator)in['BMC','BDC']and str(bi.operator)=='BDC'and str(ai.operands[0])==str(bi.operands[0])=='/Artifact',(old.name,x,i,aby,bby)
    prop=bi.operands[1];assert str(prop.Type)=='/Pagination'and str(prop.Subtype)in ['/Header','/Footer']
    diffs.append(i)
   streamdiffs.append({'stream':x,'marker_changes':len(diffs)})
  else:otherdiffs.append(x)
 assert not otherdiffs,(old.name,otherdiffs)
 assert set(listdiffs)==set(targets),(old.name,'list coverage')
 assert sum(s['marker_changes']for s in streamdiffs)==len(f['artifacts']),(old.name,'artifact count')
 for ids,arts in __import__('itertools').groupby(sorted(f['artifacts'],key=lambda r:tuple(r.get('streams')or[r['stream']])),key=lambda r:tuple(r.get('streams')or[r['stream']])):
  arts=list(arts);orig=a.make_stream(b'\n'.join(a.get_object((x,0)).read_bytes()for x in ids));updated=b.make_stream(b'\n'.join(b.get_object((x,0)).read_bytes()for x in ids))
  oldmarks=[i for i in pikepdf.parse_content_stream(orig)if str(i.operator)in['BMC','BDC']];newmarks=[i for i in pikepdf.parse_content_stream(updated)if str(i.operator)in['BMC','BDC']]
  assert len(oldmarks)==len(newmarks)
  for r in arts:
   before=oldmarks[r['marked_ordinal']-1];after=newmarks[r['marked_ordinal']-1];attrs=after.operands[1]
   assert str(attrs.Type)=='/Pagination'and str(attrs.Subtype)=='/'+r['subtype']
   if str(before.operator)=='BDC':
    original=before.operands[1]
    if isinstance(original,pikepdf.Name):
     obj=a.get_object((ids[0],0));res=obj.get('/Resources',a.pages[r['page']-1].obj.get('/Resources',{}));original=res['/Properties'][original]
    for k in set(original)-{'/Type','/Subtype'}:assert val(original[k])==val(attrs[k]),(old.name,'dropped artifact attr',k)
 oldar=json.loads(gzip.decompress((ROOT/'script/publication-markdown/source-tags'/old.with_suffix('.json.gz').name).read_bytes()));newar=json.loads(gzip.decompress((BASE/'candidates'/new.with_suffix('.json.gz').name).read_bytes()))
 assert oldar['tree']==newar['tree']
 assert newar['pdf_sha256']==sha(new)
 return {'file':old.name,'before_sha256':sha(old),'after_sha256':sha(new),'all_original_objects_accounted_for':True,'only_planned_artifact_openers_and_list_attributes_changed':True,'all_prior_artifact_and_list_class_attributes_preserved':True,'native_tree_archive_unchanged':True,'artifact_count':len(f['artifacts']),'list_count':len(targets),'changed_streams':len(streamdiffs)}
if __name__=='__main__':
 plan=json.loads((BASE/'plan.json').read_text());r=[]
 for f in plan['files']:
  r.append(check(f));print(f['file'],'PASS',flush=True)
 (BASE/'independent-candidate-review.json').write_text(json.dumps({'plan_sha256':sha(BASE/'plan.json'),'pdfs':len(r),'passed':True,'files':r},indent=2)+'\n')
