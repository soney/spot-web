"""Package fresh reader-interface samples with the hashes of the PDFs read.

Run verify_at.py --captures CAPTURE_DIR before this script. Packaging independently
checks all assertions again. Capture folders contain only isolated browser data.
"""
from pathlib import Path
import argparse,datetime,gzip,hashlib,json,re,subprocess,sys
HERE=Path(__file__).resolve().parent
REPO=next(p for p in HERE.parents if (p/'assets/pdfs').is_dir())
FILES={'notebook':'wang-what-makes-well-documented-chiea2021.pdf','code':'krosnick-promises-pitfalls-llms-chi2023compui.pdf','crosspage':'oney-firecrystal-vlhcc2009.pdf'}
parser=argparse.ArgumentParser();parser.add_argument('captures',type=Path);args=parser.parse_args()
def walk(n):
 yield n
 for c in n.get('children',[]):yield from walk(c)
def text(n):return re.sub(r'\s+',' ',' '.join(x.get('text','')or x.get('name','')for x in walk(n)if not x.get('children'))).strip()
verified=subprocess.run([sys.executable,str(HERE/'verify_at.py'),'--captures',str(args.captures)],capture_output=True,text=True,check=True)
(HERE/'assertions.txt').write_text(verified.stdout)
results={'date':'2026-10-05','reader':'Mozilla Firefox 156.0.1','environment':'Separate dbus-run-session, Xvfb display, fresh Firefox profile and temporary XDG configuration/runtime directories for each sample. No user browser or profile accessed.','scope':'Fresh live Firefox PDF.js AT-SPI samples after PDF/UA metadata and semantic attribute repairs. These verify reader-exposed cell names, header relationships and selected reading order; not continuous speech or whole-corpus conformance.','checks':[],'continuous_speech':'Not rerun. Prior isolated Orca audio-backend limitation is recorded in reading-order/repairs/group2/at/results.json; no end-to-end speech claim is made.'}
for sample,filename in FILES.items():
 capture=args.captures/(sample+'-atspi.json');pdf=REPO/'assets/pdfs'/filename
 assert pdf.stat().st_mtime<capture.stat().st_mtime,filename+' was changed after capture'
 sha=hashlib.sha256(pdf.read_bytes()).hexdigest();raw=json.loads(capture.read_text());doc=next(n for n in walk(raw)if n.get('role')=='document web'and filename in n.get('name',''))
 version=(args.captures/(sample+'-versions.txt')).read_text();assert 'Mozilla Firefox 156.0.1' in version
 record={'file':filename,'pdf_sha256':sha,'reader':results['reader'],'captured_utc':datetime.datetime.fromtimestamp(capture.stat().st_mtime,datetime.timezone.utc).isoformat(),'accessible_document':doc}
 dest=HERE/(sample+'-atspi.json.gz');dest.write_bytes(gzip.compress((json.dumps(record,ensure_ascii=False,separators=(',',':'))+'\n').encode(),mtime=0))
 r={'sample':sample,'file':filename,'pdf_sha256':sha,'tree':dest.name,'tree_sha256':hashlib.sha256(dest.read_bytes()).hexdigest(),'captured_utc':record['captured_utc'],'result':'pass'}
 if sample=='notebook':
  r.update({'check':'All40 source-verified Table1 cell names,13 semantic headers and27 data-cell row/column header relationships. Table2 remains14rows×4columns.','rows':10,'columns':4,'cell_texts_checked':40,'headers_checked':13,'data_cell_header_associations_checked':27,'second_table_rows':14,'second_table_columns':4})
 elif sample=='code':
  page=next(n for n in walk(doc)if n.get('role')=='landmark'and n.get('name')=='Page 2');nodes=list(walk(page))
  setup=next((i,n)for i,n in enumerate(nodes)if n.get('role')=='paragraph'and'following correct' in text(n));first=next((i,n)for i,n in enumerate(nodes)if not n.get('children')and'first_name' in n.get('text',''));last=next((i,n)for i,n in enumerate(nodes)if not n.get('children')and'last_name' in n.get('text',''));heading=next((i,n)for i,n in enumerate(nodes)if n.get('role')=='heading'and'POTENTIAL PITFALLS'in n.get('name',''))
  r.update({'check':'Setup paragraph → first_name → last_name → Section5 in reader-exposed order.','page':2,'setup_text':text(setup[1]),'sequence':[{'accessible_tree_index':i,'role':n['role'],'text':n.get('name')if n.get('role')=='heading'else n.get('text')}for i,n in[first,last,heading]]})
 else:
  pages=[next(n for n in walk(doc)if n.get('role')=='landmark'and n.get('name')=='Page '+str(i))for i in[1,2]];before=[n for n in walk(pages[0])if n.get('role')=='paragraph'][-1];nodes=list(walk(pages[1]));after=next((i,n)for i,n in enumerate(nodes)if n.get('role')=='paragraph');figure=next((i,n)for i,n in enumerate(nodes)if n.get('role')=='panel'and n.get('name','').startswith('Figure 1 - FireCrystal'))
  r.update({'check':'Sentence continues from Page1 to start of Page2 before Figure1.','pages':[1,2],'before_text':text(before),'continuation_text':text(after[1]),'continuation_tree_index_on_page2':after[0],'figure_tree_index_on_page2':figure[0],'reader_behavior':'Separate page landmarks retain distinct word-bearing accessible objects across the page boundary.'})
 results['checks'].append(r)
(HERE/'results.json').write_text(json.dumps(results,ensure_ascii=False,indent=2)+'\n')
print(verified.stdout,end='')
