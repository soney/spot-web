"""Repair two source-verified opening-page reading-order problems.

ConstraintJS: finish the author block before Figure 1. BashOn: separate the
copyright line from an interrupted introduction paragraph as a native Note.
Only structure objects and the reverse ownership map change, incrementally.
"""
import gzip
import hashlib
import json
from pathlib import Path

import pikepdf
import pymupdf

from repair_alternatives import walk

HERE = Path(__file__).resolve().parent.parent
REPO = HERE.parents[2]
MARKDOWN = REPO / 'script/publication-markdown'


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def token(value):
    return value.unparse().decode('ascii') if hasattr(value, 'unparse') else str(value)


def array(values):
    return '[ ' + ' '.join(token(v) for v in values) + ' ]'


def repair(filename):
    path = REPO / 'assets/pdfs' / filename
    archive = MARKDOWN / 'source-tags' / (path.stem + '.json.gz')
    data = json.loads(gzip.decompress(archive.read_bytes()))
    before = sha(path)
    assert data['pdf_sha256'] == before
    nodes = {n['id']: n for n in walk(data['tree']) if n.get('kind') == 'element'}
    with pikepdf.open(path) as native, pymupdf.open(path) as pdf:
        if filename == 'oney-constraintjs-uist2012.pdf':
            parent = native.get_object((168, 0))
            kids = list(parent.K)
            refs = [c.objgen for c in kids]
            assert refs.index((170, 0)) < refs.index((171, 0)) < refs.index((172, 0)) < refs.index((173, 0))
            figure = kids.pop(refs.index((171, 0)))
            after_author = next(i for i, c in enumerate(kids) if c.objgen == (173, 0)) + 1
            kids.insert(after_author, figure)
            pdf.xref_set_key(168, 'K', array(kids))
            children = nodes['168:0']['children']
            children.remove(nodes['171:0'])
            children.insert(children.index(nodes['173:0']) + 1, nodes['171:0'])
            changes = [{'kind': 'reading_order', 'page': 1, 'parent': '168:0',
                        'description': 'Move Figure171 after author and affiliation nodes172 and173.'}]
        else:
            assert filename == 'chen-hybrid-crowd-machine-workflow-vlhcc2020.pdf'
            mcids = [632, 633, 634]
            paragraph = native.get_object((373, 0))
            assert list(paragraph.K)[-3:] == mcids
            pdf.xref_set_key(373, 'K', array(list(paragraph.K)[:-3]))
            note_id = pdf.get_new_xref()
            pdf.update_object(note_id, f'<< /Type /StructElem /S /Note /P 142 0 R /Pg 6 0 R /K [632 633 634] >>')
            kids = list(native.get_object((142, 0)).K)
            # Copyright follows the abstract, before the introduction heading.
            position = next(i for i, c in enumerate(kids) if c.objgen == (370, 0))
            tokens = [token(v) for v in kids]
            tokens.insert(position, f'{note_id} 0 R')
            pdf.xref_set_key(142, 'K', '[ ' + ' '.join(tokens) + ' ]')
            nums = list(native.get_object((367, 0)).Nums)
            assert nums[0] == 0
            owners = list(nums[1])
            assert all(owners[m].objgen == (373, 0) for m in mcids)
            owner_tokens = [f'{note_id} 0 R' if i in mcids else token(v) for i, v in enumerate(owners)]
            rest = ' '.join(token(v) for v in nums[2:])
            pdf.xref_set_key(367, 'Nums', '[ 0 [ ' + ' '.join(owner_tokens) + ' ] ' + rest + ' ]')
            body = nodes['373:0']
            moved = [n for n in body['children'] if n.get('key') in [['6:0', m] for m in mcids]]
            assert len(moved) == 3
            body['children'] = [n for n in body['children'] if n not in moved]
            lines = body['text'].splitlines()
            assert lines[-1].endswith('©2020 IEEE')
            body['text'] = '\n'.join(lines[:-1])
            boxes = [op['bbox'] for c in moved for op in c['ops'] if op.get('bbox')]
            box = [min(b[0] for b in boxes), min(b[1] for b in boxes),
                   max(b[2] for b in boxes), max(b[3] for b in boxes)]
            note = {'kind': 'element', 'id': f'{note_id}:0', 'role': 'Note', 'page': 1,
                    'pages': [1], 'bbox_by_page': {'1': box}, 'text': lines[-1],
                    'alt': '', 'actual': '', 'children': moved}
            children = nodes['142:0']['children']
            children.insert(children.index(nodes['370:0']), note)
            changes = [{'kind': 'separate_notice', 'page': 1, 'paragraph': '373:0',
                        'note': note['id'], 'mcids': mcids,
                        'description': 'Move copyright from introduction paragraph to a Note before the introduction.'}]
        pdf.saveIncr()
    data['pdf_sha256'] = sha(path)
    revisions = data.setdefault('structure_revisions', [])
    revisions.append({'date': '2026-10-05', 'baseline_pdf_sha256': before, 'changes': changes})
    archive.write_bytes(gzip.compress((json.dumps(data, ensure_ascii=False, separators=(',', ':'))
                                       + '\n').encode(), mtime=0))
    return {'file': filename, 'before_sha256': before, 'after_sha256': sha(path), 'changes': changes}


if __name__ == '__main__':
    results = [repair(name) for name in ['oney-constraintjs-uist2012.pdf',
                                         'chen-hybrid-crowd-machine-workflow-vlhcc2020.pdf']]
    (HERE / 'reading-order-repairs.json').write_text(json.dumps(results, indent=2) + '\n')
    print('Repaired two opening-page tag orders and synchronized archived trees')
