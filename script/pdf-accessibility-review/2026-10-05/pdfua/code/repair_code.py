from pathlib import Path
import sys,shutil,gzip,json,hashlib
sys.path.insert(0,'/tmp/spot-order-fixes')
from order_editor import Editor,walk
import pymupdf,pikepdf
ROOT=Path('/home/soney/nucode/spot-web')
OUT=Path('/tmp/spot-ua-final/code')
texts={
 'oney-interstate-uist2014':('389:0', '''obj.prototypes = proto_1
proto_1.prototypes = proto_2
…
proto_(N-1).prototypes = proto_N'''),
 'pandita-inferring-method-specifications-icse2012':('377:0', '''Algorithm 1 Expression Augmentation generator
Input: Expr e, Meta-data d
Output: Expr e′
 1: Expr e′ = e
 2: if (d.description == return) then
 3:   if (e′.root == “→”)&&(e′.right is variable) then
 4:     Term t = e′.right
 5:     if findType(t) == d.returnType then
 6:       Predicate p = new Predicate(“returns”)
 7:       p.term = t
 8:       e′.right = p
 9:     end if
10:   end if
11: end if
12: if (d.description == exception) then
13:   if (e′.root == “→”)&&(e′.right is empty) then
14:     Term t = d.exception_name
15:     Predicate p = new Predicate (“throw”)
16:     p.term = t
17:     e′.right = p
18:   end if
19:   if (e′.root! == “→”) then
20:     Term t = d.exception_name
21:     Predicate p = new Predicate (“throw”)
22:     p.term = t
23:     Expr e′′ = new Expr(“→”)
24:     e′′.left = e′
25:     e′′.right = p
26:     e′ = e′′
27:   end if
28: end if

29: return e′''')
}
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
results=[]
for stem,(node,actual) in texts.items():
 src=ROOT/'assets/pdfs'/(stem+'.pdf');ap=ROOT/'script/publication-markdown/source-tags'/(stem+'.json.gz')
 dst=OUT/(stem+'.pdf');outap=OUT/(stem+'.json.gz');shutil.copy2(src,dst);shutil.copy2(ap,outap)
 e=Editor(src.name,pdf_path=dst,archive_path=outap);old=e.nodes[node]['text'];page=e.nodes[node]['page']
 e.set_actual(node,actual)
 change={'kind':'source-reviewed-code-ActualText','node':node,'page':page,'before_text':old,'actual_text':actual}
 proof=e.save([change])
 a=pymupdf.open(src);b=pymupdf.open(dst)
 changes=[]
 for ix in range(len(a)):
  if a[ix].rect!=b[ix].rect or a[ix].get_pixmap(dpi=144,alpha=False).samples!=b[ix].get_pixmap(dpi=144,alpha=False).samples:changes.append(ix+1)
 assert not changes,changes
 with pikepdf.open(dst) as p:
  assert str(p.get_object(tuple(map(int,node.split(':')))).ActualText)==actual
 proof['mupdf_144dpi_all_pages_identical']=True;proof['pages']=len(a)
 proof['native_actual_text_matches_reviewed_transcription']=True
 results.append(proof)
report={
 'date':'2026-10-05','scope':'Source review of all four remaining code spacing/order warnings before PDF/UA declaration. Candidates only; reviewed against printed page images at 108 dpi and relevant code crops at 288 dpi.',
 'repairs':results,
 'source_notes':[
 {'file':'oney-interstate-uist2014.pdf','node':'389:0','page':8,'finding':'Printed subscript indices had been detached and moved to line ends. ActualText uses explicit underscore notation for source subscripts; all four source lines remain in printed order.'},
 {'file':'pandita-inferring-method-specifications-icse2012.pdf','node':'377:0','page':6,'finding':'Printed primes were detached onto preceding lines, leading to incorrect assignments. Source review reattaches every prime, reconstructs indentation from the nested printed if/end-if blocks, restores the printed exception_name underscore and removes extraction-created token spaces. All 29 numbered lines, input/output and title remain. The source line 19 spelling root! == and curly quotation marks are retained; this is a transcription, not an algorithm correction.'}],
 'cleared_without_pdf_change':[
 {'file':'oney-expressing-interactivity-states-cmu2015.pdf','node':'4241:0','page':169,'pdf_sha256':sha(ROOT/'assets/pdfs/oney-expressing-interactivity-states-cmu2015.pdf'),'status':'Source wording, punctuation, and order verified; no content or indentation defect. One line mixes serif introductory prose and monospace code, causing uncertain uniform-pitch estimation. The source itself has malformed </strong city markup, retained exactly.', 'text':"called with { title: cjs('hello'), subtext: '<strong>steel</strong city'}:"},
 {'file':'oney-expressing-interactivity-states-cmu2015.pdf','node':'6315:0','page':216,'pdf_sha256':sha(ROOT/'assets/pdfs/oney-expressing-interactivity-states-cmu2015.pdf'),'status':'Source wording, punctuation, and order verified; no content or indentation defect. One line mixes the monospace wildcard and serif explanation, causing uncertain uniform-pitch estimation.', 'text':"'*': any state"}
 ]
}
(OUT/'review.json').write_text(json.dumps(report,indent=2,ensure_ascii=False)+'\n')
print(json.dumps(report,indent=2,ensure_ascii=False))
