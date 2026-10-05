"""Add reviewed PDF/UA-1 identification without altering existing XMP fields or page content.

This is the declaration step after structure/semantic review, not a validator
or an automatic promise of conformance. Use only on the reviewed input hashes.
"""
from pathlib import Path
import argparse,hashlib,json,re,shutil
from xml.dom import minidom
import pymupdf
NS='http://www.aiim.org/pdfua/ns/id/'
RDF='http://www.w3.org/1999/02/22-rdf-syntax-ns#'
def sha(data):return hashlib.sha256(data).hexdigest()
def apply(source,destination):
 with pymupdf.open(source) as before:
  original=before.get_xml_metadata(); tree=minidom.parseString(original)
  parts=tree.getElementsByTagNameNS(NS,'part')
  if parts:
   assert len(parts)==1 and parts[0].firstChild.nodeValue.strip()=='1'
   return {'file':source.name,'before_sha256':sha(source.read_bytes()),'after_sha256':sha(source.read_bytes()),'already_identified':True}
  roots=tree.getElementsByTagNameNS(RDF,'RDF');assert len(roots)==1
  tag=roots[0].tagName;prefix=tag.split(':')[0];assert ':' in tag
  addition=f'<{prefix}:Description {prefix}:about="" xmlns:pdfuaid="{NS}"><pdfuaid:part>1</pdfuaid:part></{prefix}:Description>'
  closing='</'+tag+'>';assert original.count(closing)==1
  updated=original.replace(closing,addition+closing);parsed=minidom.parseString(updated)
  assert parsed.getElementsByTagNameNS(NS,'part')[0].firstChild.nodeValue=='1'
  assert updated.replace(addition,'',1)==original
  metadata_xref=before.xref_xml_metadata();assert metadata_xref>0
  shutil.copy2(source,destination)
  with pymupdf.open(destination) as doc:
   doc.update_stream(metadata_xref,updated.encode("utf-8"),compress=False);doc.saveIncr()
  with pymupdf.open(destination) as after:
   assert after.xref_xml_metadata()==metadata_xref
   extra=list(range(before.xref_length(),after.xref_length()))
   assert all(after.xref_get_key(x,'Type')==('name','/XRef') for x in extra)
   altered=[]
   for xref in range(1,before.xref_length()):
    if before.xref_object(xref)!=after.xref_object(xref) or before.xref_stream_raw(xref)!=after.xref_stream_raw(xref):altered.append(xref)
   assert altered==[metadata_xref],(source,altered,metadata_xref)
   assert after.get_xml_metadata()==updated
  return {'file':source.name,'before_sha256':sha(source.read_bytes()),'after_sha256':sha(destination.read_bytes()),'already_identified':False,'modified_objects':[metadata_xref],'only_metadata_object_changed':True,'existing_xmp_bytes_preserved':True,'added_namespace':NS,'added_property':'pdfuaid:part','added_value':1}
if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('sources',nargs='+',type=Path);p.add_argument('--output',type=Path,required=True);a=p.parse_args();a.output.mkdir(parents=True,exist_ok=True)
 results=[apply(s,a.output/s.name) for s in a.sources];(a.output/'identification.json').write_text(json.dumps(results,indent=2)+'\n');print('Identified',sum(not x['already_identified'] for x in results),'documents;',sum(x['already_identified'] for x in results),'already identified')
