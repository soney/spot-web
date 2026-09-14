"""Archive exact reviewed tag-inspection inputs for the local Markdown converter.

Usage: python prepare_sources.py /path/to/inspections/index.json
The inspection index must describe every current PDF with matching SHA-256.
This command does not change the original PDFs or the website's data.
"""
from pathlib import Path
import collections
import gzip
import hashlib
import json
import re
import sys
from urllib.parse import urlsplit

import pikepdf
import yaml

from table_renderer import build_attrs_by_id

HERE = Path(__file__).resolve().parent
REPO = HERE.parent.parent


def sha(path):
    return hashlib.sha256(Path(path).read_bytes()).hexdigest()


def key(obj):
    return ':'.join(map(str, getattr(obj, 'objgen', (0, 0))))


def compact(node):
    if isinstance(node, list):
        return [compact(v) for v in node if v is not None]
    if not isinstance(node, dict):
        return node
    if node.get('kind') == 'content':
        return {'kind': 'content', 'key': node['key'], 'ops': [
            {k: op.get(k) for k in ['text', 'actual', 'bbox', 'line_y', 'page', 'kind']}
            for op in node.get('ops', [])]}
    keep = ['kind', 'id', 'role', 'page', 'pages', 'bbox_by_page', 'text', 'alt', 'actual',
            'attributes', 'object', 'contents']
    result = {k: node[k] for k in keep if k in node}
    if 'children' in node:
        result['children'] = compact(node['children'])
    if node.get('role') in {'Document', 'Part', 'Art', 'Sect', 'Div', 'NonStruct', 'Private', 'L', 'Table', 'TR', 'THead', 'TBody', 'TFoot'}:
        result.pop('text', None)
    return result


def native_metadata(path):
    with pikepdf.open(path) as pdf:
        page_ids = {key(page.obj): n for n, page in enumerate(pdf.pages, 1)}
        named = {}

        def collect_names(node):
            names = node.get('/Names', [])
            for i in range(0, len(names), 2):
                named[str(names[i])] = names[i + 1]
            for child in node.get('/Kids', []):
                collect_names(child)

        collect_names(pdf.Root.get('/Names', {}).get('/Dests', {}))
        named.update({str(k).lstrip('/'): v for k, v in pdf.Root.get('/Dests', {}).items()})

        def destination(value, seen=()):
            if isinstance(value, (pikepdf.String, pikepdf.Name)):
                name = str(value).lstrip('/')
                if name in seen:
                    return None
                return destination(named.get(name), seen + (name,))
            if isinstance(value, pikepdf.Dictionary):
                return destination(value.get('/D'))
            if isinstance(value, pikepdf.Array) and len(value):
                first = value[0]
                page = first + 1 if isinstance(first, int) else page_ids.get(key(first))
                return f'#page-{page}' if page else None
            return None

        links, skipped = {}, []
        for page in pdf.pages:
            for annot in page.obj.get('/Annots', []):
                action = annot.get('/A', {})
                target = None
                if str(action.get('/S')) == '/URI':
                    uri = str(action.get('/URI', '')).strip()
                    if urlsplit(uri).scheme.lower() in {'http', 'https', 'mailto'}:
                        target = uri
                    elif uri:
                        skipped.append({'annotation': key(annot), 'target': uri})
                elif str(action.get('/S')) == '/GoTo':
                    target = destination(action.get('/D'))
                elif '/Dest' in annot:
                    target = destination(annot.Dest)
                if target:
                    links[key(annot)] = target
        rolemap = {str(k).lstrip('/'): str(v).lstrip('/') for k, v in pdf.Root.StructTreeRoot.get('/RoleMap', {}).items()}
        return {'links': links, 'unconverted_annotation_targets': skipped, 'rolemap': rolemap,
                'table_attributes': build_attrs_by_id(pdf)}


def main():
    index = json.loads(Path(sys.argv[1]).read_text())
    assert index['complete'] and index['ready_documents'] == len(index['documents'])
    publications = yaml.safe_load((REPO / '_data/publications.yaml').read_text())
    by_pdf = {Path(p['pdf']).name: p for p in publications if p.get('pdf')}
    assert {doc['file'] for doc in index['documents']} == set(by_pdf), 'Inspection index must cover every publication PDF'
    vocabulary = set()
    for doc in index['documents']:
        inspection = json.loads(Path(doc['tags_path']).read_text())
        for node in inspection['nodes']:
            if node['role'] not in {'Document', 'Part', 'Sect', 'Div', 'Code', 'Table', 'L'}:
                vocabulary.update(word.lower() for word in re.findall(r'\b[A-Za-z]+(?:-[A-Za-z]+)*\b', node.get('text', '')))
    overrides_path = HERE / 'reviewed-overrides.json'
    overrides = json.loads(overrides_path.read_text()) if overrides_path.exists() else []
    normalization_path = HERE / 'reviewed-normalization.json'
    joins = json.loads(normalization_path.read_text())['reviewed_join_overrides'] if normalization_path.exists() else []
    for doc in index['documents']:
        path = REPO / 'assets/pdfs' / doc['file']
        inspection = json.loads(Path(doc['tags_path']).read_text())
        assert sha(path) == doc['pdf_sha256'] == inspection['sha256']
        assert not any(inspection[k] for k in ['issues', 'unmarked', 'unreferenced_mcids'])
        publication = by_pdf[doc['file']]
        matching = [o for o in overrides if o['pdf'] == doc['file']]
        assert all(o['source_sha256'] == doc['pdf_sha256'] for o in matching)
        archive = {'file': doc['file'], 'pdf_sha256': doc['pdf_sha256'], 'title': publication['title'],
                   'publication_id': publication['id'], 'doi': publication.get('doi'),
                   'pages': doc['page_count'], 'tree': compact(inspection['tree']),
                   'vocabulary': sorted(vocabulary), 'reviewed_overrides': {o['node']: o for o in matching},
                   'reviewed_join_overrides': joins,
                   'inspection_sha256': sha(doc['tags_path']), **native_metadata(path)}
        output = HERE / 'source-tags' / (Path(doc['file']).stem + '.json.gz')
        output.parent.mkdir(exist_ok=True)
        with gzip.GzipFile(filename=str(output), mode='wb', mtime=0) as stream:
            stream.write(json.dumps(archive, ensure_ascii=False, separators=(',', ':')).encode())
        print(doc['file'], flush=True)


if __name__ == '__main__':
    main()
