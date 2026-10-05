from pathlib import Path
import sys,json,shutil,copy,gzip,hashlib,subprocess,tempfile
sys.path.insert(0,'/tmp/spot-order-fixes')
sys.path.insert(0,'/home/soney/nucode/spot-web/script/pdf-accessibility-review/2026-10-05/tools')
from order_editor import Editor,walk,sequence_text
from validate_tags import Validator
from pypdf import PdfReader
import pymupdf
OUT=Path('/tmp/spot-order-fixes/group2/role-fixes');OUT.mkdir(exist_ok=True)
files=['chen-sifter-imx2020.pdf','oney-constraintjs-uist2012.pdf','oney-implementing-multi-touch-gestures-chi2019.pdf']
results=[]
for filename in files:
 e=Editor(filename);before=copy.deepcopy(e.data);backup=OUT/filename;assert not backup.exists();shutil.copy2(e.path,backup)
 changes=[]
 def role(id,new,why):
  n=e.node(id);assert n['role']=='LBody';changes.append({'kind':'list_role_constraint','node':id,'before_role':n['role'],'after_role':new,'parent':e.parent(id)['id'],'reason':why});n['role']=new
 if filename.startswith('chen-sifter'):
  role('664:0','Span','Continuation retained inline inside the first list item body; preserve its reviewed text and content sequence.')
 elif filename.startswith('oney-constraintjs'):
  role('342:0','P','Footnote content is a paragraph within Note, not a list body.')
  assert e.node('196:0')['children'][-1]['id']=='200:0'
  e.move_after('200:0','196:0')
  changes.append({'kind':'list_role_constraint','note':'200:0','before_parent':'196:0','after_parent':'188:0','reason':'End-of-list note moved immediately after the list; flattened reading order unchanged.'})
 else:
  role('443:0','Span','Page continuation retained inline inside the second list item body; preserve its reviewed text and content sequence.')
 def content(d):return [(n.get('kind'),n.get('key'),n.get('object'),n.get('ops'))for n in walk(d['tree'])if n.get('kind')in['content','annotation']]
 assert content(before)==content(e.data)
 assert ''.join(sequence_text(n)for n in before['tree'])==''.join(sequence_text(n)for n in e.data['tree'])
 for n in walk(e.data['tree']):
  if n.get('role')=='LBody':assert e.parent(n)['role']=='LI'
  if n.get('role')=='L':assert all(c.get('role') in ['L','LI','Caption']for c in n.get('children',[])if c.get('kind')=='element')
 result=e.save(changes)
 with pymupdf.open(backup)as a,pymupdf.open(e.path)as b:
  assert len(a)==len(b)
  for i in range(len(a)):
   assert a[i].get_pixmap(matrix=pymupdf.Matrix(2,2),alpha=False).digest==b[i].get_pixmap(matrix=pymupdf.Matrix(2,2),alpha=False).digest
  for x in range(a.xref_length()):
   if a.xref_is_stream(x):assert a.xref_stream(x)==b.xref_stream(x)
  pages=len(a)
 with tempfile.TemporaryDirectory()as tmp:
  norm=Path(tmp)/'normalized.pdf';subprocess.run(['mutool','clean',str(e.path),str(norm)],check=True,capture_output=True);struct=Validator(PdfReader(norm)).validate();assert struct['checks_passed'],struct['issue_counts']
 result.update(pages=pages,pixel_identical_144dpi=True,all_existing_stream_bytes_identical=True,content_ops_and_order_identical=True,flattened_reading_text_identical=True,list_children_valid=True,structure_checks_passed=True)
 results.append(result);print(filename,result['after_sha256'],flush=True)
(OUT/'report.json').write_text(json.dumps({'date':'2026-10-05','files':results},indent=2)+'\n')
rp=Path('/tmp/spot-order-fixes/group2/final-report.json');r=json.loads(rp.read_text());r['supplemental_role_constraint_repairs']=results
for item in r['results']:
 if item['file']==files[-1]:
  result=results[-1];item['pdf_sha256']=item['after_sha256']=result['after_sha256'];item['changes']+=result['changes']
r['changes']['list_role_constraint']=4
rp.write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n')
