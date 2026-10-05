"""Embed renderer-matching Nimbus programs in one reviewed PDF candidate.

This deliberately leaves XMP identification unchanged. It requires the documented
source hash and writes a new file; it never replaces the website's publication.
"""
import argparse,hashlib,shutil
from pathlib import Path
import pymupdf as fitz
EXPECTED='5896c2425f702d93a96791e1c9a64f4d21ecb837f40ab81dff5cd4b297976222'
FONTS=[(67,'Times-Roman','NimbusRoman-Regular'),(69,'Helvetica-Bold','NimbusSans-Bold'),(71,'Times-Bold','NimbusRoman-Bold'),(73,'Times-Italic','NimbusRoman-Italic')]
def create(source,output):
 assert hashlib.sha256(source.read_bytes()).hexdigest()==EXPECTED,'Unexpected source PDF'
 assert source.resolve()!=output.resolve(),'Use a new candidate destination'
 shutil.copy2(source,output)
 d=fitz.open(output)
 for xref,code,name in FONTS:
  descriptor=int(d.xref_get_key(xref,'FontDescriptor')[1].split()[0])
  stream=d.get_new_xref();d.update_object(stream,'<< /Subtype /Type1C >>');d.update_stream(stream,fitz.Font(code).buffer)
  d.xref_set_key(descriptor,'FontFile3',f'{stream} 0 R')
  d.xref_set_key(xref,'Subtype','/Type1');d.xref_set_key(xref,'BaseFont','/'+name)
  d.xref_set_key(descriptor,'FontName','/'+name);d.xref_set_key(descriptor,'FontFamily',fitz.get_pdf_str(name.split('-')[0]))
 d.saveIncr();d.close()
if __name__=='__main__':
 parser=argparse.ArgumentParser(description=__doc__);parser.add_argument('source',type=Path);parser.add_argument('output',type=Path);args=parser.parse_args();create(args.source,args.output)
