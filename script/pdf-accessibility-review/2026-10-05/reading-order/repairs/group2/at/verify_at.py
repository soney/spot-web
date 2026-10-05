"""Verify the recorded AT-SPI samples, or fresh run_at.py captures.

Usage: python3 verify_at.py [--captures /tmp/spot-at-check-...]
This reads actual accessible objects, not PDF extraction or archive tag order.
"""
from pathlib import Path
import argparse,gzip,hashlib,json,re
HERE=Path(__file__).resolve().parent
REPO=next(p for p in HERE.parents if (p/'assets/pdfs').is_dir())
FILES={'notebook':'wang-what-makes-well-documented-chiea2021.pdf','code':'krosnick-promises-pitfalls-llms-chi2023compui.pdf','crosspage':'oney-firecrystal-vlhcc2009.pdf'}
p=argparse.ArgumentParser();p.add_argument('--captures',type=Path);args=p.parse_args()
def walk(n):
 yield n
 for c in n.get('children',[]):yield from walk(c)
def text(n):
 return re.sub(r'\s+',' ',' '.join(x.get('text','')or x.get('name','')for x in walk(n)if not x.get('children'))).strip()
for sample,filename in FILES.items():
 if args.captures:
  raw=json.loads((args.captures/(sample+'-atspi.json')).read_text())
  doc=next(n for n in walk(raw)if n.get('role')=='document web'and filename in n.get('name',''))
 else:
  record=json.loads(gzip.decompress((HERE/(sample+'-atspi.json.gz')).read_bytes()))
  assert record['pdf_sha256']==hashlib.sha256((REPO/'assets/pdfs'/filename).read_bytes()).hexdigest(),filename+' changed after capture'
  doc=record['accessible_document']
 if sample=='notebook':
  expected=json.loads((HERE/'table1-verified-text.json').read_text());table=next(n for n in walk(doc)if n.get('table',{}).get('rows')==10)
  assert table['table']['columns']==4
  rows=table['children'];assert [[c['name']for c in r['children']]for r in rows]==expected
  for ri,row in enumerate(rows):
   for ci,cell in enumerate(row['children']):
    assert cell['role']==('column header'if ri==0 else 'row header'if ci==0 else'table cell')
    if ri and ci:assert cell['cell_headers']=={'columns':[expected[0][ci]],'rows':[expected[ri][0]]}
  table2=next(n for n in walk(doc)if n.get('table',{}).get('rows')==14);assert table2['table']['columns']==4
  print('PASS: Notebook Table1:40 exact cell texts,13 headers,27 correct row/column header associations; Table2:14×4.')
 elif sample=='code':
  page=next(n for n in walk(doc)if n.get('role')=='landmark'and n.get('name')=='Page 2');nodes=list(walk(page))
  setup=next(i for i,n in enumerate(nodes)if n.get('role')=='paragraph'and'following correct' in text(n))
  first=next(i for i,n in enumerate(nodes)if not n.get('children')and'first_name' in n.get('text',''))
  last=next(i for i,n in enumerate(nodes)if not n.get('children')and'last_name' in n.get('text',''))
  heading=next(i for i,n in enumerate(nodes)if n.get('role')=='heading'and'POTENTIAL PITFALLS' in n.get('name',''))
  assert setup<first<last<heading
  print('PASS: Promises/Pitfalls: setup → Python first_name/last_name example → Section5.')
 else:
  pages=[next(n for n in walk(doc)if n.get('role')=='landmark'and n.get('name')=='Page '+str(i))for i in [1,2]]
  paragraphs1=[n for n in walk(pages[0])if n.get('role')=='paragraph'];nodes2=list(walk(pages[1]));paragraphs2=[(i,n)for i,n in enumerate(nodes2)if n.get('role')=='paragraph']
  assert text(paragraphs1[-1]).endswith('unreadable through')
  assert text(paragraphs2[0][1]).startswith('code obfuscation methods')
  fig=next(i for i,n in enumerate(nodes2)if n.get('role')=='panel'and n.get('name','').startswith('Figure 1 - FireCrystal'))
  assert paragraphs2[0][0]<fig
  print('PASS: FireCrystal: Page1 sentence continues on Page2 before Figure1; word-bearing objects remain separate.')
print('Scope: three Firefox AT-SPI samples. This does not establish end-to-end speech or whole-corpus accessibility.')
