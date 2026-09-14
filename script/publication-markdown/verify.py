"""Verify draft hashes, rendered Markdown, local links and source content.

Run after convert.py. --rendered points to HTML produced by a GFM renderer;
this checks what a Markdown reader actually receives, including table headers.
"""
from pathlib import Path
import argparse
import collections
import gzip
import hashlib
from html.parser import HTMLParser
import json
import re
import unicodedata
from urllib.parse import unquote, urlsplit

HERE = Path(__file__).resolve().parent
REPO = HERE.parent.parent


def sha(path):
    return hashlib.sha256(Path(path).read_bytes()).hexdigest()


def walk(node):
    if isinstance(node, list):
        for child in node:
            yield from walk(child)
    elif isinstance(node, dict):
        yield node
        yield from walk(node.get('children', []))


def normalized(text):
    return re.sub(r'\s+', '', text)


def alternative_normalized(text):
    return re.sub(r'[-\s\u00ad]+', '', unicodedata.normalize('NFKC', text)).casefold()


class Rendered(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.ids = []
        self.links = []
        self.images = []
        self.tables = []
        self.cells = []
        self.text = []
        self.code = []
        self.in_pre = 0
        self.headings = 0

    def handle_starttag(self, tag, attrs):
        values = dict(attrs)
        if values.get('id'):
            self.ids.append(values['id'])
        if tag == 'a' and values.get('href'):
            self.links.append(values['href'])
        if tag == 'img':
            self.images.append(values)
        if tag == 'table':
            self.tables.append(values)
        if tag in {'th', 'td'}:
            self.cells.append({'tag': tag, **values})
        if re.fullmatch('h[1-6]', tag):
            self.headings += 1
        if tag == 'pre':
            self.in_pre += 1
            self.code.append('')

    def handle_endtag(self, tag):
        if tag == 'pre':
            self.in_pre -= 1

    def handle_data(self, text):
        self.text.append(text)
        if self.in_pre:
            self.code[-1] += text


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--rendered', type=Path, required=True)
    args = parser.parse_args()
    review_files = sorted((HERE / 'review').glob('*.json'))
    reviewed = {path.stem for path in review_files}
    archived = {path.name.removesuffix('.json.gz') for path in (HERE / 'source-tags').glob('*.json.gz')}
    drafts = {path.stem for path in (HERE / 'publications').glob('*.md')}
    assert reviewed and reviewed == archived == drafts, 'Draft, source archive and review inventories differ'
    documents, results = [], []
    for review_file in review_files:
        document = json.loads(review_file.read_text())
        source = json.loads(gzip.decompress((HERE / document['source_tags']).read_bytes()))
        markdown = HERE / document['markdown']
        pdf = REPO / 'assets/pdfs' / document['file']
        assert sha(pdf) == document['pdf_sha256'] == source['pdf_sha256']
        assert sha(markdown) == document['markdown_sha256']
        assert sha(HERE / document['source_tags']) == document['source_tags_sha256']
        html_file = args.rendered / (markdown.stem + '.html')
        rendered = Rendered()
        rendered.feed(html_file.read_text())
        assert rendered.in_pre == 0
        assert len(rendered.ids) == len(set(rendered.ids)), (document['file'], 'duplicate HTML ids')
        for link in rendered.links:
            if link.startswith('#'):
                assert unquote(link[1:]) in rendered.ids, (document['file'], 'missing anchor', link)
        for image in rendered.images:
            path = (markdown.parent / unquote(urlsplit(image['src']).path)).resolve()
            assert path.is_relative_to(HERE) and path.is_file(), (document['file'], image)
            assert image.get('alt'), (document['file'], 'empty image description')
        for cell in rendered.cells:
            for header in cell.get('headers', '').split():
                assert header in rendered.ids, (document['file'], 'missing table header', header)
            assert cell.get('scope') in {None, 'row', 'col', 'rowgroup', 'colgroup'}
        assert len(rendered.tables) == len(document['tables']), (document['file'], 'unexpected rendered table', len(rendered.tables), len(document['tables']))
        assert len(rendered.cells) == sum(table['cell_count'] for table in document['tables']), (document['file'], 'table cells changed')
        assert sum(cell['tag'] == 'th' for cell in rendered.cells) == sum(table['header_count'] for table in document['tables']), (document['file'], 'table header roles changed')
        assert not any(table['warnings'] for table in document['tables'])
        assert rendered.headings > 0
        accessible_text = alternative_normalized(' '.join(rendered.text + [image.get('alt', '') for image in rendered.images]))
        alternatives = collections.Counter()
        for node in walk(source['tree']):
            if node.get('role') in {'Figure', 'Formula'}:
                alternatives[node['role']] += 1
                text = node.get('actual') or node.get('alt') or node.get('text', '')
                assert alternative_normalized(text) in accessible_text, (document['file'], 'missing alternative', node['id'])
        code_text = normalized('\n'.join(rendered.code))
        code_nodes = [n for n in walk(source['tree']) if n.get('role') == 'Code']
        for node in code_nodes:
            override = source.get('reviewed_overrides', {}).get(node['id'])
            text = override['text'] if override else node.get('actual') or node.get('text', '')
            assert normalized(text) in code_text, (document['file'], 'code glyphs missing', node['id'])
            if node.get('actual') and not override:
                assert node['actual'].rstrip('\n') in '\n'.join(rendered.code), (document['file'], 'Code ActualText whitespace changed', node['id'])
        for asset in document['assets']:
            assert sha(HERE / asset['path']) == asset['sha256']
        assert len(rendered.images) == len(document['assets'])
        assert document['all_tagged_content_accounted_for_once']
        results.append({'file': document['file'], 'markdown_sha256': document['markdown_sha256'],
                        'rendered_html_sha256': sha(html_file), 'tables': len(rendered.tables),
                        'table_cells': len(rendered.cells), 'images': len(rendered.images),
                        'native_code_elements_accounted_for': len(code_nodes),
                        'code_actual_text_preserved': sum(bool(n.get('actual')) for n in code_nodes),
                        'alternatives_preserved': dict(alternatives),
                        'local_images_and_anchors_valid': True, 'all_checks_passed': True})
        documents.append(document)
    summary = {'files': len(results), 'pages': sum(d['pages'] for d in documents),
               'images': sum(r['images'] for r in results), 'tables': sum(r['tables'] for r in results),
               'native_code_elements': sum(r['native_code_elements_accounted_for'] for r in results),
               'figure_alternatives': sum(r['alternatives_preserved'].get('Figure', 0) for r in results),
               'formula_alternatives': sum(r['alternatives_preserved'].get('Formula', 0) for r in results),
               'all_checks_passed': True, 'documents': results}
    (HERE / 'verification.json').write_text(json.dumps(summary, ensure_ascii=False, indent=2) + '\n')
    manifest = {'scope': 'Local Markdown drafts from reviewed PDF logical structure',
                'website_publication': False, 'files': len(documents), 'pages': summary['pages'], 'documents': documents}
    (HERE / 'manifest.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps({k: v for k, v in summary.items() if k != 'documents'}))


if __name__ == '__main__':
    main()
