"""Apply reviewed figure descriptions without changing page content or object IDs.

Pass one or more review JSON files. Each is a list of documents containing
figures with node, status, and proposed_alt. The original native /Alt is checked
against the archived tree before any write. Originals are saved in a supplied
--backup folder; incremental PDF updates change only structure-element /Alt.
Re-run the Markdown converter/exporter and validators after this command.
"""
import argparse
import gzip
import hashlib
import json
from pathlib import Path
import shutil

import pikepdf
import pymupdf

HERE = Path(__file__).resolve().parent.parent
REPO = HERE.parents[2]
MARKDOWN = REPO / 'script/publication-markdown'


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def walk(value):
    if isinstance(value, list):
        for node in value:
            yield from walk(node)
    elif isinstance(value, dict):
        yield value
        yield from walk(value.get('children', []))


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('reviews', nargs='+', type=Path)
    parser.add_argument('--backup', required=True, type=Path)
    args = parser.parse_args()
    plans = []
    for review in args.reviews:
        for record in json.loads(review.read_text()):
            proposals = [f for f in record['figures'] if f.get('proposed_alt')]
            if not proposals:
                continue
            path = REPO / 'assets/pdfs' / record['file']
            assert path.name == record['file'] and path.suffix == '.pdf'
            archive = MARKDOWN / 'source-tags' / (path.stem + '.json.gz')
            data = json.loads(gzip.decompress(archive.read_bytes()))
            before = sha(path)
            assert before == record['pdf_sha256'] == data['pdf_sha256'], path
            nodes = {n['id']: n for n in walk(data['tree']) if n.get('kind') == 'element'}
            edits = []
            with pikepdf.open(path) as pdf:
                for figure in proposals:
                    key = figure['node']
                    if any(e['node'] == key for e in edits):
                        assert next(e['after'] for e in edits if e['node'] == key) == figure['proposed_alt']
                        continue
                    node = nodes[key]
                    native = pdf.get_object(tuple(map(int, key.split(':'))))
                    assert str(native.get('/Alt', '')) == node['alt'], (path, key)
                    assert not native.get('/ActualText'), (path, key, 'ActualText takes precedence')
                    assert node['alt'] != figure['proposed_alt']
                    edits.append({'node': key, 'page': figure['page'],
                                  'before': node['alt'], 'after': figure['proposed_alt'],
                                  'reason': figure['reason']})
                    node['alt'] = figure['proposed_alt']
            plans.append((path, archive, data, before, edits))
    assert len({p[0] for p in plans}) == len(plans), 'Repeated document across review files'
    args.backup.mkdir(parents=True, exist_ok=True)
    layout_file = MARKDOWN / 'reviewed-layout.json'
    layouts = json.loads(layout_file.read_text())
    report = []
    for path, archive, data, before, edits in plans:
        backup = args.backup / path.name
        if backup.exists():
            assert sha(backup) == before
        else:
            shutil.copy2(path, backup)
        with pymupdf.open(path) as pdf:
            assert pdf.can_save_incrementally(), path
            for edit in edits:
                xref, generation = map(int, edit['node'].split(':'))
                assert generation == 0
                pdf.xref_set_key(xref, 'Alt', pymupdf.get_pdf_str(edit['after']))
            pdf.saveIncr()
        after = sha(path)
        data['pdf_sha256'] = after
        data['accessibility_revision'] = {'date': '2026-10-05', 'baseline_pdf_sha256': before,
                                          'changes': edits}
        archive.write_bytes(gzip.compress((json.dumps(data, ensure_ascii=False, separators=(',', ':'))
                                            + '\n').encode(), mtime=0))
        for layout in layouts:
            if layout['pdf'] == path.name:
                assert layout['source_sha256'] == before
                layout['source_sha256'] = after
        report.append({'file': path.name, 'before_sha256': before, 'after_sha256': after,
                       'changes': edits})
    layout_file.write_text(json.dumps(layouts, ensure_ascii=False, indent=2) + '\n')
    (HERE / 'alternative-repairs.json').write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n')
    print(f'Updated {sum(len(d[4]) for d in plans)} alternatives in {len(plans)} PDFs')


if __name__ == '__main__':
    main()
