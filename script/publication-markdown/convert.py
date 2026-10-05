"""Render reviewed PDF tag trees as local Markdown drafts and source figure crops.

Input archives bind native text, logical order and table attributes to the PDF
hash. They are review inputs, not a new PDF parser. Nothing writes to _site.
"""
from __future__ import annotations

import argparse
import collections
import gzip
import hashlib
import html
import json
from pathlib import Path
import re
import unicodedata
from urllib.parse import quote

import pymupdf

from table_renderer import render_table
from code_layout import recover_code

HERE = Path(__file__).resolve().parent
REPO = HERE.parent.parent
CONTAINERS = {'Document', 'Part', 'Art', 'Sect', 'Div', 'NonStruct', 'Private', 'LBody'}
BLOCKS = {'P', 'Table', 'L', 'LI', 'Code', 'Formula', 'Figure', 'Caption',
          'BlockQuote', 'Note', 'TOC', 'TOCI', 'H', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6'}
LIGATURES = str.maketrans({'ﬀ': 'ff', 'ﬁ': 'fi', 'ﬂ': 'fl', 'ﬃ': 'ffi', 'ﬄ': 'ffl', 'ﬅ': 'st', 'ﬆ': 'st'})


def sha(path):
    return hashlib.sha256(Path(path).read_bytes()).hexdigest()


def children(node):
    value = node.get('children', [])
    return value if isinstance(value, list) else [value]


def walk(node):
    if isinstance(node, list):
        for value in node:
            yield from walk(value)
    elif isinstance(node, dict):
        yield node
        for value in children(node):
            yield from walk(value)


def md_escape(text):
    # Source markup and comparison operators must remain literal text.
    text = html.escape(text, quote=False)
    return re.sub(r'([\\`*_\[\]|])', r'\\\1', text)


def fence(text):
    ticks = max([2] + [len(m[0]) for m in re.finditer(r'`+', text)]) + 1
    return '`' * ticks + '\n' + text.rstrip('\n') + '\n' + '`' * ticks


class Converter:
    def __init__(self, data, output=HERE):
        self.data = data
        self.output = Path(output)
        self.stem = Path(data['file']).stem
        self.pdf_path = REPO / 'assets/pdfs' / data['file']
        assert sha(self.pdf_path) == data['pdf_sha256'], self.pdf_path
        self.pdf = pymupdf.open(self.pdf_path)
        self.rolemap = data.get('rolemap', {})
        self.links = data.get('links', {})
        self.attrs = data.get('table_attributes', {})
        self.seen_content = collections.Counter()
        self.seen_elements = set()
        self.assets = []
        self.blocks = []
        self.tables = []
        self.code_layout = []
        self.warnings = []
        self.pages_marked = set()
        self.asset_counter = collections.Counter()
        self.used_title = False
        self.normalization = collections.Counter()
        self.vocabulary = set(data.get('vocabulary', []))
        self.overrides = data.get('reviewed_overrides', {})
        self.join_overrides = data.get('reviewed_join_overrides', [])
        layout_path = HERE / 'reviewed-layout.json'
        self.layout_repairs = [r for r in json.loads(layout_path.read_text()) if r['pdf'] == data['file']] if layout_path.exists() else []
        assert all(r['source_sha256'] == data['pdf_sha256'] for r in self.layout_repairs)
        crops_path = HERE / 'reviewed-crops.json'
        self.crop_repairs = [r for r in json.loads(crops_path.read_text()) if r['pdf'] == data['file']] if crops_path.exists() else []
        assert all(r['source_sha256'] == data['pdf_sha256'] for r in self.crop_repairs)
        paths_file = HERE / 'image-paths.json'
        self.image_names = [r for r in json.loads(paths_file.read_text())['names']
                            if r['pdf'] == data['file']] if paths_file.exists() else []
        assert all(r['source_sha256'] == data['pdf_sha256'] for r in self.image_names)
        self.used_image_names = set()
        code_reviews_path = HERE / 'reviewed-code-layout.json'
        self.code_reviews = [r for r in json.loads(code_reviews_path.read_text())
                             if r['pdf'] == data['file']] if code_reviews_path.exists() else []
        assert all(r['source_sha256'] == data['pdf_sha256'] for r in self.code_reviews)

    def role(self, node):
        role = node.get('role', '')
        seen = set()
        while role in self.rolemap and role not in seen:
            seen.add(role)
            role = self.rolemap[role]
        return role

    def normalize(self, text, node=None):
        text = text.replace('\r\n', '\n').replace('\r', '\n').translate(LIGATURES)
        text = re.sub(r'\u00ad\s*\n\s*', '', text).replace('\u00ad', '')

        def repair(match):
            left, right = match.group(1), match.group(2)
            together = (left + right).lower()
            compound = (left + '-' + right).lower()
            node_ids = {value.get('id') for value in walk(node)} if node else set()
            for override in self.join_overrides:
                if left.lower() == override['left'].lower() and right.lower() == override['right'].lower():
                    scopes = override.get('scopes')
                    if not scopes or any(scope['pdf'] == self.data['file'] and scope['node'] in node_ids for scope in scopes):
                        self.normalization['reviewed_wrap_repairs'] += 1
                        return left + right
            if together in self.vocabulary and compound not in self.vocabulary:
                self.normalization['line_wrap_hyphens_removed'] += 1
                return left + right
            self.normalization['line_wrap_hyphens_retained'] += 1
            return left + '-' + right

        text = re.sub(r'([A-Za-z]{2,})-\s*\n\s*([a-z][A-Za-z]*)', repair, text)
        text = re.sub(r'\s+', ' ', text).strip()
        return text

    def consume(self, node):
        for value in walk(node):
            if value.get('kind') == 'content':
                self.seen_content[tuple(value['key'])] += 1
            elif value.get('kind') == 'element':
                self.seen_elements.add(value.get('id'))

    def page_anchors(self, node):
        pages = node.get('pages', []) or ([node['page']] if node.get('page') else [])
        result = []
        for page in pages:
            if page not in self.pages_marked:
                result.append(f'<a id="page-{page}"></a>')
                self.pages_marked.add(page)
        return '\n'.join(result)

    def url(self, node):
        targets = []
        for value in walk(node):
            if value.get('kind') == 'annotation':
                target = self.links.get(value.get('object'))
                if target and target not in targets:
                    targets.append(target)
        return targets[0] if len(targets) == 1 else None

    @staticmethod
    def bounds(node):
        ops = [op for value in walk(node) if value.get('kind') == 'content'
               for op in value.get('ops', []) if op.get('text') or op.get('actual')]
        return (ops[0], ops[-1]) if ops else (None, None)

    def segments(self, node, format='markdown', suppress_links=False):
        if not isinstance(node, dict):
            return []
        escape = html.escape if format == 'html' else md_escape
        if node.get('kind') == 'content':
            return [{'raw': op['actual'] if op.get('actual') is not None else op.get('text', ''),
                     'first': op, 'last': op} for op in node.get('ops', [])
                    if op.get('actual') or (op.get('actual') is None and op.get('text'))]
        if node.get('kind') != 'element':
            return []
        role = self.role(node)
        first, last = self.bounds(node)
        if node.get('id') in self.overrides and role != 'Code':
            value = self.overrides[node['id']]['text']
            return [{'raw': value, 'first': first, 'last': last}]
        if node.get('actual'):
            return [{'raw': node['actual'], 'first': first, 'last': last}]
        if role == 'Formula':
            value = node.get('alt') or node.get('text', '')
            return [{'raw': value, 'first': first, 'last': last}]
        if role == 'Figure':
            value = node.get('alt') or node.get('text', '')
            # Sentence-length icon descriptions are asides within prose;
            # short letter/number callouts retain the source's punctuation.
            if ':' in value and value.rstrip().endswith(('.', '!', '?')):
                value = '(' + value + ')'
            return [{'raw': value, 'first': first, 'last': last}]
        target = self.url(node) if role in {'Link', 'Reference'} and not suppress_links else None
        if target:
            inside = self.inline(node, format=format, suppress_links=True)
            if inside:
                if format == 'html':
                    rendered = f'<a href="{html.escape(target, quote=True)}">{inside}</a>'
                else:
                    destination = quote(target, safe=":/?#[]@!$&'()*+,;=%~._-")
                    rendered = f'[{inside}](<{destination}>)'
                # An image-only link has meaningful Alt content but no painted
                # text. Keep that description as its visible Markdown label.
                raw = node.get('text') or inside
                rendered = (' ' if raw[:1].isspace() else '') + rendered + (' ' if raw[-1:].isspace() else '')
                return [{'raw': raw, 'rendered': rendered, 'first': first, 'last': last}]
        if role in {'Sub', 'Sup'}:
            inside = self.inline(node, format=format, suppress_links=True)
            return [{'raw': node.get('text', ''), 'rendered': f'<{role.lower()}>{inside}</{role.lower()}>', 'first': first, 'last': last}]
        result = []
        for child in children(node):
            result.extend(self.segments(child, format, suppress_links))
        if not result and node.get('text'):
            result = [{'raw': node['text'], 'first': first, 'last': last}]
        return result

    def inline(self, node, format='markdown', suppress_links=False):
        # Descendants are visited once; parent aggregate text is never appended
        # alongside child text. Geometry supplies only lost whitespace.
        if node.get('id') in self.overrides:
            raw = self.overrides[node['id']]['text']
            return html.escape(raw) if format == 'html' else md_escape(raw)
        if node.get('actual'):
            raw = self.normalize(node['actual'])
            return html.escape(raw) if format == 'html' else md_escape(raw)
        segments = []
        for child in children(node):
            segments.extend(self.segments(child, format, suppress_links))
        if not segments:
            raw = self.normalize(node.get('text', ''))
            return html.escape(raw) if format == 'html' else md_escape(raw)
        if self.role(node) not in {'Code', 'Formula', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6'}:
            segments = self.reorder_scripts(segments, format)
        result = []
        previous = None
        for segment in segments:
            raw = segment['raw']
            if not raw:
                continue
            if previous:
                a, b = previous.get('last'), segment.get('first')
                separator = ''
                if a and b and a.get('bbox') and b.get('bbox'):
                    ay = previous.get('baseline', a.get('line_y'))
                    by = segment.get('baseline', b.get('line_y'))
                    if a.get('page') != b.get('page') or (ay is not None and by is not None and abs(ay - by) > 2):
                        separator = '\n'
                    elif b['bbox'][0] - a['bbox'][2] > 1.3:
                        separator = ' '
                elif not previous['raw'].endswith((' ', '\n')) and not raw.startswith((' ', '\n')):
                    separator = ' '
                if not separator and previous['raw'].endswith((' ', '\n')):
                    separator = ' '
                if separator and result and not result[-1].endswith((' ', '\n')) and not raw.startswith((' ', '\n')):
                    result.append(separator)
            rendered = segment.get('rendered')
            if rendered is None:
                rendered = html.escape(raw) if format == 'html' else md_escape(raw)
            result.append(rendered)
            previous = segment
        return self.normalize(''.join(result), node)

    def reorder_scripts(self, segments, format):
        """Attach small raised/lowered runs to their printed prose baseline.

        This is a local correction inside a logical paragraph, never a page or
        column sort. Main-text runs keep their order. Small script runs painted
        before/after that text are inserted by x position on the nearest line.
        Multi-line links and ActualText regions are left atomic.
        """
        groups = []
        current = []
        previous = None
        for segment in segments:
            first, last = segment.get('first'), segment.get('last')
            if previous and first and previous.get('last'):
                old = previous['last']
                if first.get('page') != old.get('page') or (first.get('line_y') is not None and old.get('line_y') is not None and old['line_y'] - first['line_y'] > 25):
                    groups.append(current)
                    current = []
            current.append(segment)
            previous = segment
        if current:
            groups.append(current)
        output = []
        for group in groups:
            rows = collections.defaultdict(list)
            for i, segment in enumerate(group):
                a, b = segment.get('first'), segment.get('last')
                if a and b and a.get('bbox') and b.get('bbox') and a.get('line_y') is not None and a.get('page') == b.get('page') and abs(a['line_y'] - (b.get('line_y') or a['line_y'])) < .4:
                    rows[a['line_y']].append((i, segment))
            weights = {y: sum(len(s['raw'].strip()) for _, s in row) for y, row in rows.items()}
            attached = {}
            for y, row in rows.items():
                if weights[y] > 18:
                    continue
                options = [base for base in rows if .7 < abs(y - base) <= 6 and weights[base] > max(18, weights[y] * 2)]
                if not options:
                    continue
                base = min(options, key=lambda value: abs(value - y))
                heights = [s['first']['bbox'][3] - s['first']['bbox'][1] for _, s in rows[base] if len(s['raw'].strip()) >= 3]
                typical = sorted(heights)[len(heights) // 2] if heights else 0
                for i, segment in row:
                    a = segment['first']
                    height = a['bbox'][3] - a['bbox'][1]
                    if typical and height < typical * .82 and len(segment['raw'].strip()) <= 16:
                        attached[i] = base
                        segment['baseline'] = base
                        tag = 'sup' if y < base else 'sub'
                        if not segment.get('rendered'):
                            value = html.escape(segment['raw'].strip()) if format == 'html' else md_escape(segment['raw'].strip())
                            segment['rendered'] = f'<{tag}>{value}</{tag}>'
                        self.normalization['script_runs_positioned'] += 1
            if not attached:
                output.extend(group)
                continue
            buckets = collections.defaultdict(list)
            for i, base in attached.items():
                buckets[base].append((i, group[i]))
            emitted = set()
            emitted_indices = set()
            for i, segment in enumerate(group):
                if i in attached:
                    continue
                a = segment.get('first')
                y = a.get('line_y') if a else None
                if y in buckets and y not in emitted:
                    # Only reorder the one printed line to place its scripts;
                    # all other logical lines retain native tag order.
                    indices = {j for j, _ in rows[y]}
                    line = rows[y] + buckets[y]
                    output.extend(s for _, s in sorted(line, key=lambda item: item[1]['first']['bbox'][0]))
                    emitted_indices.update(j for j, _ in line)
                    emitted.add(y)
                elif i not in emitted_indices:
                    output.append(segment)
        return output

    def flow_blocks(self, trees):
        """Reflow split prose while keeping source floats and notices intact."""
        flat = []

        def flatten(node):
            if isinstance(node, list):
                for child in node:
                    flatten(child)
            elif isinstance(node, dict):
                if self.role(node) in CONTAINERS and all(isinstance(c, dict) and c.get('kind') == 'element' for c in children(node)):
                    for child in children(node):
                        flatten(child)
                else:
                    flat.append(node)

        flatten(trees)
        # Put publication permissions and author notes together with frontmatter.
        notices = []
        remainder = []
        for node in flat:
            text = node.get('text', '')
            is_notice = self.role(node) in {'P', 'Note'} and node.get('pages') == [1] and (
                re.search(r'Permission to make digital|Copyright|©|arXiv:', text, re.I)
                or (self.data['file'] == 'pandey-inclusive-source-code-chi2024.pdf' and node.get('id') == '450:0'))
            (notices if is_notice else remainder).append(node)
        if notices:
            position = next((i for i, node in enumerate(remainder) if self.role(node) in {'H2', 'H3'}), min(1, len(remainder)))
            flat = remainder[:position] + notices + remainder[position:]
            self.normalization['frontmatter_notices_grouped'] = len(notices)
        result = []
        i = 0

        def paragraph(node):
            return self.role(node) == 'P' and node.get('id') not in self.overrides

        def floating(node):
            return self.role(node) in {'Figure', 'Caption', 'Note'} or (
                self.role(node) == 'P' and re.match(r'^(?:Figure|Fig\.|Table)\s*\d+[.:\s]', node.get('text', '')))

        while i < len(flat):
            first = flat[i]
            if not paragraph(first):
                result.append(first)
                i += 1
                continue
            parts, floats = [first], []
            end = i
            while True:
                j = end + 1
                pending = []
                while j < len(flat) and floating(flat[j]):
                    pending.append(flat[j])
                    j += 1
                if j >= len(flat) or not paragraph(flat[j]):
                    break
                left = self.normalize(parts[-1].get('text', ''))
                right = self.normalize(flat[j].get('text', ''))
                # A lower-case continuation after an unfinished source line is
                # sufficient; a completed sentence or new heading is a boundary.
                if not left or left[-1] in '.!?:;' or not re.match(r'^[a-z,)]', right):
                    break
                parts.append(flat[j])
                floats.extend(pending)
                end = j
            if len(parts) == 1:
                result.append(first)
            else:
                merged = {'kind': 'element', 'id': 'joined-' + first['id'], 'role': 'P',
                          'children': parts, 'text': '\n'.join(p.get('text', '') for p in parts),
                          'pages': sorted({page for p in parts for page in p.get('pages', [])})}
                result.append(merged)
                result.extend(floats)
                self.normalization['paragraph_fragments_joined'] += len(parts) - 1
            i = end + 1
        return result

    def apply_layout_repairs(self, trees):
        for repair in self.layout_repairs:
            lookup = {node.get('id'): node for node in walk(trees) if node.get('kind') == 'element'}
            pieces = [lookup[node_id] for node_id in repair['nodes']]
            merged = {'kind': 'element', 'id': 'reviewed-join-' + repair['replace_at'],
                      'role': 'LI', 'children': pieces, 'rendered_text': repair['text'],
                      'pages': sorted({page for piece in pieces for page in piece.get('pages', [])})}

            def replace(value):
                if isinstance(value, list):
                    return [result for child in value if (result := replace(child)) is not None]
                if not isinstance(value, dict):
                    return value
                if value.get('id') == repair['replace_at']:
                    return merged
                if value.get('id') in repair['nodes']:
                    return None
                if 'children' in value:
                    value = dict(value, children=replace(value['children']))
                return value

            trees = replace(trees)
        return trees

    def crop(self, node, category, format='markdown'):
        result = []
        alt = self.normalize(node.get('alt') or node.get('text') or category.capitalize())
        for page_key, box in node.get('bbox_by_page', {}).items():
            if not box:
                continue
            page = self.pdf[int(page_key) - 1]
            rect = (pymupdf.Rect(box) + (-2, -2, 2, 2)) & page.rect
            repair = next((r for r in self.crop_repairs if r['node'] == node['id']
                           and r['page'] == int(page_key)), None)
            if repair:
                rect = pymupdf.Rect(repair['bbox']) & page.rect
            if rect.is_empty or rect.width < 2 or rect.height < 2:
                continue
            self.asset_counter[category] += 1
            name = f'{category}-{self.asset_counter[category]:03d}-p{int(page_key):03d}.png'
            preserved = next((r for r in self.image_names if r['node'] == node['id']
                              and r['page'] == int(page_key)), None)
            if preserved:
                name = preserved['name']
                assert re.fullmatch(rf'{category}-\d+-p{int(page_key):03d}\.png', name)
            else:
                reserved = {r['name'] for r in self.image_names}
                while name in reserved or name in self.used_image_names:
                    self.asset_counter[category] += 1
                    name = f'{category}-{self.asset_counter[category]:03d}-p{int(page_key):03d}.png'
            assert name not in self.used_image_names, (self.stem, 'duplicate image name', name)
            self.used_image_names.add(name)
            path = self.output / 'figures' / self.stem / name
            path.parent.mkdir(parents=True, exist_ok=True)
            pix = page.get_pixmap(matrix=pymupdf.Matrix(2, 2), clip=rect, alpha=False)
            pix.save(path)
            url = f'../figures/{self.stem}/{name}'
            result.append(f'<img src="{url}" alt="{html.escape(alt, quote=True)}">' if format == 'html'
                          else f'![{md_escape(alt)}]({url})')
            self.assets.append({'path': str(path.relative_to(self.output)), 'node': node['id'],
                                'page': int(page_key), 'bbox': list(rect), 'sha256': sha(path),
                                'kind': category, 'alt': alt})
            if rect.get_area() > page.rect.get_area() * 0.75:
                self.warnings.append({'kind': 'large_crop', 'node': node['id'], 'page': int(page_key)})
        return '\n\n'.join(result)

    def cell_content(self, node, format='markdown'):
        if format == 'markdown':
            return self.inline(node)

        def render_html(value):
            role = self.role(value)
            if role == 'Code':
                text, _ = recover_code(value)
                return '<pre><code>' + html.escape(text) + '</code></pre>'
            if role == 'Figure':
                return self.crop(value, 'figure', format='html') or html.escape(value.get('alt', ''))
            if role == 'Formula':
                return html.escape(self.normalize(value.get('actual') or value.get('alt') or value.get('text', '')))
            if role == 'Table':
                rendered, _ = render_table(value, self.attrs, self.cell_content)
                return rendered
            if role in {'L', 'LI', 'BlockQuote', 'P'}:
                tag = {'L': 'ul', 'LI': 'li', 'BlockQuote': 'blockquote', 'P': 'p'}[role]
                inner = html_children(value)
                return f'<{tag}>' + inner + f'</{tag}>'
            return html_children(value)

        def html_children(value):
            special = {'Code', 'Table', 'Figure', 'Formula', 'L', 'LI', 'BlockQuote', 'P'}
            if not any(isinstance(c, dict) and self.role(c) in special for c in children(value)):
                return self.inline(value, format='html')
            output, pending = [], []
            for child in children(value):
                if not isinstance(child, dict):
                    continue
                if self.role(child) in special:
                    if pending:
                        output.append(self.inline({'children': list(pending)}, format='html'))
                        pending.clear()
                    output.append(render_html(child))
                else:
                    pending.append(child)
            if pending:
                output.append(self.inline({'children': pending}, format='html'))
            return ''.join(output)

        return html_children(node)

    def paragraph(self, node):
        # Keep small callout symbols in their sentence. Other nested figures,
        # code and tables retain their block presentation.
        special = {'Code', 'Table', 'Figure'}
        if any(isinstance(c, dict) and self.role(c) in special
               and not self.inline_callout(c) for c in children(node)):
            return self.render_children(node)
        self.consume(node)
        return self.inline(node)

    def inline_callout(self, node):
        if self.role(node) != 'Figure' or len(node.get('alt', '')) > 80:
            return False
        boxes = list(node.get('bbox_by_page', {}).values())
        return bool(boxes) and all(0 < b[2] - b[0] <= 30 and
                                   0 < b[3] - b[1] <= 30 for b in boxes)

    def render_children(self, node):
        output, pending = [], []

        def flush():
            if pending:
                synthetic = {'kind': 'element', 'role': 'P', 'children': list(pending)}
                self.consume(synthetic)
                text = self.inline(synthetic)
                if text:
                    output.append(text)
                pending.clear()

        for child in children(node):
            if not isinstance(child, dict):
                continue
            role = self.role(child)
            if (child.get('kind') == 'element' and (role in BLOCKS or role in CONTAINERS)
                    and not self.inline_callout(child)):
                flush()
                output.append(self.render(child))
            else:
                pending.append(child)
        flush()
        return '\n\n'.join(s for s in output if s.strip())

    def list_item(self, node):
        anchors = self.page_anchors(node)
        if node.get('rendered_text'):
            self.consume(node)
            return (anchors + '\n\n' if anchors else '') + '- ' + md_escape(node['rendered_text'])
        if node.get('id') in self.overrides:
            self.consume(node)
            text = md_escape(self.overrides[node['id']]['text'])
            return (anchors + '\n\n' if anchors else '') + text
        self.seen_elements.add(node['id'])
        labels = [c for c in children(node) if isinstance(c, dict) and self.role(c) == 'Lbl']
        label = ' '.join(self.normalize(c.get('text', '')) for c in labels)
        for value in labels:
            self.consume(value)
        rest = [c for c in children(node) if c not in labels]
        synthetic = {'kind': 'element', 'role': 'Div', 'children': rest}
        text = self.render_children(synthetic)
        if not text.strip():
            text = md_escape(self.normalize(node.get('text', '')))
        # Numeric source labels remain explicit (including bibliography [1]).
        if label and label not in {'•', '●', '◦', '▪', '■', '–', '—', '-'}:
            text = md_escape(label) + ' ' + text
        if self.data['file'] == 'pandey-inclusive-source-code-chi2024.pdf' and text.startswith('(1) RQ1.') and ' (2) RQ2.' in text:
            first, second = text.split(' (2) RQ2.', 1)
            self.normalization['reviewed_research_questions_separated'] += 1
            return (anchors + '\n\n' if anchors else '') + '- ' + first + '\n\n- (2) RQ2.' + second
        lines = text.splitlines()
        return (anchors + '\n\n' if anchors else '') + '- ' + (lines[0] if lines else '') + ''.join(
            '\n' + ('  ' + line if line else '') for line in lines[1:])

    def render(self, node):
        if not isinstance(node, dict):
            return ''
        role = self.role(node)
        self.seen_elements.add(node.get('id'))
        anchors = '' if role in CONTAINERS or role in {'L', 'LI', 'TOC'} else self.page_anchors(node)
        result = ''
        override = self.overrides.get(node.get('id'))
        if override and role not in {'Code', 'P', 'Note'}:
            self.consume(node)
            result = md_escape(override['text'])
        elif role in CONTAINERS:
            result = self.render_children(node)
        elif re.fullmatch(r'H[1-6]', role) or role == 'H':
            self.consume(node)
            text = self.inline(node)
            if role == 'H1' and not self.used_title:
                self.used_title = True
                result = '# ' + text + '\n\n' + self.source_line()
            elif text:
                result = '#' * (int(role[1]) if role != 'H' else 2) + ' ' + text
        elif role == 'Table':
            self.consume(node)
            result, metadata = render_table(node, self.attrs, self.cell_content)
            metadata['node'] = node['id']
            self.tables.append(metadata)
        elif role in {'L', 'TOC'}:
            results = []
            for child in children(node):
                if isinstance(child, dict):
                    results.append(self.list_item(child) if self.role(child) == 'LI' else self.render(child))
            result = '\n\n'.join(s for s in results if s)
        elif role == 'LI':
            result = self.list_item(node)
        elif role == 'TOCI':
            self.consume(node)
            result = '- ' + self.inline(node)
        elif role == 'Code':
            self.consume(node)
            override = self.overrides.get(node['id'])
            if override:
                text, layout = override['text'], {'method': 'reviewed_pseudocode_transcription'}
            else:
                text, layout = recover_code(node)
            self.code_layout.append({'node': node['id'], 'pages': node.get('pages', []), **layout})
            result = fence(text)
            if override:
                result += '\n\n' + md_escape(override.get('caption', ''))
                self.warnings.append({'kind': 'reviewed_pseudocode_transcription', 'node': node['id'], 'note': override['review']})
            elif layout['method'] == 'native_text_preserved':
                reviewed = next((r for r in self.code_reviews if r['node'] == node['id']), None)
                if reviewed:
                    assert text == reviewed['text'], (self.stem, node['id'], 'reviewed code changed')
                    self.code_layout[-1]['source_review'] = reviewed['review']
                else:
                    self.warnings.append({'kind': 'code_whitespace_needs_review', 'node': node['id'], 'pages': node.get('pages', []), 'reason': layout['reason']})
        elif role == 'Formula':
            self.consume(node)
            description = self.normalize(node.get('actual') or node.get('alt') or node.get('text', ''))
            result = self.crop(node, 'formula')
            if description:
                result += ('\n\n' if result else '') + '**Formula:** ' + md_escape(description)
        elif role == 'Figure':
            self.consume(node)
            result = self.crop(node, 'figure')
            if not result:
                result = '**Figure description:** ' + md_escape(self.normalize(node.get('alt') or node.get('text', '')))
                self.warnings.append({'kind': 'figure_without_crop', 'node': node['id']})
        elif role == 'BlockQuote':
            result = self.paragraph(node)
            result = '\n'.join('> ' + line for line in result.splitlines())
        elif role == 'Caption':
            result = self.paragraph(node)
        elif role == 'Note':
            result = self.paragraph(node)
            if result:
                result = '> ' + result.replace('\n', '\n> ')
        elif role == 'P':
            result = self.paragraph(node)
        else:
            result = self.render_children(node)
            if not result and (node.get('text') or node.get('actual')):
                self.consume(node)
                result = self.inline(node)
        if result and role not in CONTAINERS:
            self.blocks.append({'node': node.get('id'), 'role': role, 'pages': node.get('pages', []), 'characters': len(result)})
        return (anchors + '\n\n' if anchors and result else '') + result

    def source_line(self):
        url = 'https://from.so/assets/pdfs/' + quote(self.data['file'])
        text = f'[Source PDF]({url})'
        if self.data.get('doi'):
            text += ' · [Publisher page](https://doi.org/' + quote(self.data['doi'], safe='/') + ')'
        return text

    def convert(self):
        trees = self.data['tree']
        if not isinstance(trees, list):
            trees = [trees]
        rendered = '\n\n'.join(self.render(node) for node in self.flow_blocks(self.apply_layout_repairs(trees)))
        if not self.used_title:
            rendered = '# ' + md_escape(self.data['title']) + '\n\n' + self.source_line() + '\n\n' + rendered
        # Preserve anchors for intentionally blank pages without adding body text.
        for page in range(1, len(self.pdf) + 1):
            if page not in self.pages_marked:
                rendered += f'\n\n<a id="page-{page}"></a>'
        content = '<!-- Source PDF SHA-256: ' + self.data['pdf_sha256'] + ' -->\n\n' + rendered.strip() + '\n'
        path = self.output / 'publications' / (self.stem + '.md')
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(content)
        expected = {tuple(v['key']) for v in walk(trees) if v.get('kind') == 'content'}
        missing = sorted(expected - self.seen_content.keys())
        duplicates = sorted(k for k, count in self.seen_content.items() if count > 1)
        assert not missing and not duplicates, (self.stem, 'content coverage', missing[:10], duplicates[:10])
        self.pdf.close()
        return {'file': self.data['file'], 'title': self.data['title'], 'publication_id': self.data.get('publication_id'),
                'pdf_sha256': self.data['pdf_sha256'], 'markdown': str(path.relative_to(self.output)),
                'markdown_sha256': sha(path), 'pages': self.data['pages'], 'blocks': self.blocks,
                'tagged_content_items': len(expected), 'all_tagged_content_accounted_for_once': True,
                'assets': self.assets, 'tables': self.tables, 'code_layout': self.code_layout, 'normalization': dict(self.normalization),
                'review_notes': self.warnings}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('names', nargs='*', help='Optional PDF stems; default all archived sources')
    args = parser.parse_args()
    results = []
    for archive in sorted((HERE / 'source-tags').glob('*.json.gz')):
        if args.names and archive.name.removesuffix('.json.gz') not in args.names:
            continue
        data = json.loads(gzip.decompress(archive.read_bytes()))
        converter = Converter(data)
        result = converter.convert()
        result['source_tags'] = str(archive.relative_to(HERE))
        result['source_tags_sha256'] = sha(archive)
        (HERE / 'review').mkdir(exist_ok=True)
        (HERE / 'review' / (Path(data['file']).stem + '.json')).write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n')
        results.append(result)
        print(data['file'], len(result['assets']), 'assets', len(result['tables']), 'tables', flush=True)
    if not args.names:
        manifest = {'scope': 'Local Markdown drafts from reviewed PDF logical structure', 'website_publication': False,
                    'documents': results, 'files': len(results), 'pages': sum(d['pages'] for d in results)}
        (HERE / 'manifest.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n')


if __name__ == '__main__':
    main()
