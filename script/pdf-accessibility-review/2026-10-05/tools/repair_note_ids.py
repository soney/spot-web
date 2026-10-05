"""Register IDs for the three publication notices newly classified as Notes.

PDF/UA requires an ID on Note elements. This final metadata-only step preserves
existing IDs and makes an IDTree entry for each newly introduced identifier.
"""
import gzip
import hashlib
import json
from pathlib import Path

import pikepdf
import pymupdf

HERE = Path(__file__).resolve().parent.parent
REPO = HERE.parents[2]


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def repair(filename):
    path = REPO / 'assets/pdfs' / filename
    archive = REPO / 'script/publication-markdown/source-tags' / (path.stem + '.json.gz')
    data = json.loads(gzip.decompress(archive.read_bytes()))
    before = sha(path)
    assert data['pdf_sha256'] == before
    changes = []
    with pikepdf.open(path) as native, pymupdf.open(path) as pdf:
        ids = {}

        def names(node):
            values = node.get('/Names', [])
            for i in range(0, len(values), 2):
                ids[str(values[i])] = values[i + 1].objgen
            for child in node.get('/Kids', []):
                names(child)

        names(native.Root.StructTreeRoot.get('/IDTree', {}))
        for obj in native.objects:
            if not isinstance(obj, pikepdf.Dictionary) or str(obj.get('/S')) != '/Note' or obj.get('/ID'):
                continue
            xref, gen = obj.objgen
            assert xref and gen == 0
            ident = f'spot-notice-{xref}'
            assert ident not in ids
            pdf.xref_set_key(xref, 'ID', pymupdf.get_pdf_str(ident))
            ids[ident] = obj.objgen
            changes.append({'node': f'{xref}:0', 'id': ident})
        assert changes
        serialized = ' '.join(pikepdf.String(name).unparse().decode('ascii')
                              + f' {xref} {gen} R' for name, (xref, gen) in sorted(ids.items()))
        pdf.xref_set_key(native.Root.StructTreeRoot.objgen[0], 'IDTree', f'<< /Names [{serialized}] >>')
        pdf.saveIncr()
    data['pdf_sha256'] = sha(path)
    data.setdefault('structure_revisions', []).append(
        {'date': '2026-10-05', 'baseline_pdf_sha256': before, 'kind': 'note_identifiers', 'changes': changes})
    archive.write_bytes(gzip.compress((json.dumps(data, ensure_ascii=False, separators=(',', ':'))
                                       + '\n').encode(), mtime=0))
    return {'file': filename, 'before_sha256': before, 'after_sha256': sha(path), 'changes': changes}


if __name__ == '__main__':
    results = [repair(name) for name in ['chen-hybrid-crowd-machine-workflow-vlhcc2020.pdf',
                                         'krosnick-scrapeviz-vlhcc2024.pdf']]
    (HERE / 'note-id-repairs.json').write_text(json.dumps(results, indent=2) + '\n')
    print('Registered three Note IDs in two PDFs')
