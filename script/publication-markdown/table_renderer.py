"""Render actual PDF Table tags to portable Markdown or semantic inline HTML.

API:
    attrs = build_attrs_by_id(pdf_path)  # native pikepdf attributes, read only
    text, metadata = render_table(table_node, attrs, inline_text_fn)

``table_node`` is an inspect_tags.py element dictionary. A format-aware callback
``inline_text_fn(cell_node, format='markdown'|'html')`` returns already escaped
content for that format, including links/images/nested blocks where needed. A
one-argument callback is treated as plain text; HTML then escapes its result.
Without a callback, ActualText takes precedence over the inspected native text.

GFM tables are used only when their first-row-header semantics represent the PDF:
one rectangular TH column-header row, TD-only body, no merged cells, no explicit
Headers relationships, and no captions/complex block content. Everything else
uses HTML. PDF Scope=Both has no literal HTML scope value; it is retained as
``data-pdf-scope="Both"`` plus explicit ``headers`` associations for both axes.
No source table cell, including empty cells, is discarded or flattened.
"""
from __future__ import annotations

from contextlib import nullcontext
import hashlib
import html
import inspect
import re
from typing import Callable

GROUPS = {'THead': 'thead', 'TBody': 'tbody', 'TFoot': 'tfoot'}


def _children(node):
    return [c for c in node.get('children', []) if c.get('kind', 'element') == 'element']


def _plain(node):
    actual = node.get('actual', node.get('actual_text'))
    return str(actual if actual not in (None, '') else node.get('text', ''))


def _has_content(node):
    return bool(_plain(node).strip() or str(node.get('alt', '')).strip() or any(_has_content(c) for c in _children(node)))


def _block_cell(node):
    return node.get('role') in ('L', 'LI', 'Table', 'Code', 'BlockQuote', 'TOC') or any(_block_cell(c) for c in _children(node))


def _safe_id(value):
    value = str(value)
    readable = re.sub(r'[^A-Za-z0-9_.:-]+', '-', value).strip('-')[:70]
    return (readable or 'cell') + '-' + hashlib.sha256(value.encode()).hexdigest()[:8]


def build_attrs_by_id(pdf_path_or_pdf):
    """Read resolved Table attributes and native IDs without modifying the PDF.

    Keys match inspect_tags.py IDs (``object:generation``). Class attributes are
    resolved before direct /A attributes. ``headers`` contains native PDF /ID
    strings, not object numbers. Returned values contain only JSON-safe types.
    """
    import pikepdf

    def seq(value):
        return list(value) if isinstance(value, pikepdf.Array) else [] if value is None else [value]

    context = nullcontext(pdf_path_or_pdf) if isinstance(pdf_path_or_pdf, pikepdf.Pdf) else pikepdf.open(pdf_path_or_pdf)
    with context as pdf:
        root = pdf.Root.get('/StructTreeRoot', {})
        classes = root.get('/ClassMap', {})
        result, seen = {}, set()

        def walk(node):
            if not isinstance(node, pikepdf.Dictionary):
                return
            key = ':'.join(map(str, node.objgen))
            if node.is_indirect:
                if node.objgen in seen:
                    return
                seen.add(node.objgen)
            if '/S' in node:
                attrs = {'role': str(node.S).lstrip('/')}
                sources = []
                for name in seq(node.get('/C')):
                    if isinstance(name, pikepdf.Name):
                        sources.extend(seq(classes.get(str(name))))
                sources.extend(seq(node.get('/A')))
                for a in sources:
                    if not isinstance(a, pikepdf.Dictionary) or str(a.get('/O')) != '/Table':
                        continue
                    for source, dest in [('/RowSpan', 'rowspan'), ('/ColSpan', 'colspan')]:
                        if source in a:
                            attrs[dest] = int(a[source])
                    if '/Scope' in a:
                        attrs['scope'] = str(a.Scope).lstrip('/')
                    if '/Headers' in a:
                        attrs['headers'] = [str(x) for x in seq(a.Headers)]
                if '/ID' in node:
                    attrs['id'] = str(node.ID)
                if '/Lang' in node:
                    attrs['lang'] = str(node.Lang)
                result[key] = attrs
            for child in seq(node.get('/K')):
                if isinstance(child, pikepdf.Dictionary) and '/S' in child:
                    walk(child)

        walk(root)
        return result


def _attrs(node, lookup):
    attrs = dict((lookup or {}).get(node.get('id'), {}))
    # Support callers supplying the direct PDF-style dictionary as well.
    for k, dest in [('/Scope', 'scope'), ('/RowSpan', 'rowspan'), ('/ColSpan', 'colspan'), ('/Headers', 'headers'), ('/ID', 'id')]:
        if k in attrs and dest not in attrs:
            attrs[dest] = attrs[k]
    # The inspector's human-readable /A string is a limited, safe fallback.
    # Native lookup is preferred, especially for explicit header IDs/classes.
    raw = node.get('attributes', '')
    if isinstance(raw, str):
        if 'scope' not in attrs:
            m = re.search(r'"/Scope"\s*:\s*"/?(Row|Column|Both)"', raw)
            if m:
                attrs['scope'] = m.group(1)
        for field, dest in [('RowSpan', 'rowspan'), ('ColSpan', 'colspan')]:
            if dest not in attrs:
                m = re.search(r'"/' + field + r'"\s*:\s*(?:Decimal\([\'\"])?(\d+)', raw)
                if m:
                    attrs[dest] = int(m.group(1))
        if 'headers' not in attrs:
            m = re.search(r'"/Headers"\s*:\s*\[([^\]]*)\]', raw, re.S)
            if m:
                attrs['headers'] = re.findall(r'"([^"\n]*)"', m.group(1))
    attrs['scope'] = str(attrs.get('scope', '')).lstrip('/') or None
    attrs['rowspan'] = int(attrs.get('rowspan', 1))
    attrs['colspan'] = int(attrs.get('colspan', 1))
    if attrs['rowspan'] < 1 or attrs['colspan'] < 1:
        raise ValueError(f"Invalid cell span in {node.get('id')}: {attrs}")
    attrs['headers'] = [str(x) for x in attrs.get('headers', [])]
    return attrs


def _callback_mode(callback):
    if callback is None:
        return 'plain'
    try:
        parameters = inspect.signature(callback).parameters
    except (TypeError, ValueError):
        return 'plain'
    if 'format' in parameters or any(p.kind == inspect.Parameter.VAR_KEYWORD for p in parameters.values()):
        return 'format'
    return 'plain'


def _cell_content(node, callback, mode, output_format):
    text = str(callback(node, format=output_format) if mode == 'format' else callback(node) if callback else _plain(node)).strip()
    if output_format == 'html':
        return text if mode == 'format' else html.escape(text).replace('\n', '<br>')
    # GFM cells cannot contain literal newlines or unescaped delimiter pipes.
    text = text.replace('\r\n', '\n').replace('\r', '\n').replace('\n', '<br>')
    return re.sub(r'(?<!\\)\|', r'\\|', text)


def render_table(node, attrs_by_id=None, inline_text_fn: Callable | None = None):
    """Return ``(rendered_text, metadata)`` for one actual Table element.

    The caller should not separately render descendants of the consumed Table.
    HTML uses deterministic header IDs, resolved explicit PDF Headers, and
    derived associations for merged and row headers. Native empty cells remain
    empty. Grid holes are reported and select HTML; no guessed cells are added.
    """
    if node.get('role') != 'Table':
        raise ValueError('render_table expects a Table element')
    rows, captions, warnings = [], [], []

    def collect(parent, group=None, group_id=None):
        for child in _children(parent):
            role = child.get('role')
            if role in GROUPS:
                collect(child, GROUPS[role], child.get('id'))
            elif role == 'TR':
                cells = _children(child)
                invalid = [c for c in cells if c.get('role') not in ('TH', 'TD')]
                if invalid:
                    raise ValueError(f"Non-cell children in TR {child.get('id')}: {[x.get('role') for x in invalid]}")
                rows.append({'node': child, 'group': group, 'group_id': group_id, 'cells': [
                    {'node': c, 'attrs': _attrs(c, attrs_by_id), 'role': c['role']} for c in cells]})
            elif role == 'Caption':
                captions.append(child)
            elif role in ('Div', 'Sect', 'Part'):
                # Semantic wrappers are permitted; row order remains unchanged.
                collect(child, group, group_id)
            elif _plain(child).strip():
                raise ValueError(f"Unrepresented meaningful {role} inside Table {node.get('id')}")

    collect(node)
    if not rows:
        raise ValueError(f"Table {node.get('id')} contains no rows")
    occupied, cells, holes = {}, [], []
    column_count = 0
    for ri, row in enumerate(rows):
        ci = 0
        for cell in row['cells']:
            while (ri, ci) in occupied:
                ci += 1
            attrs = cell['attrs']
            if ri + attrs['rowspan'] > len(rows):
                warnings.append(f"Cell {cell['node'].get('id')} extends beyond the tagged row count")
            cell.update(row=ri, column=ci)
            for r in range(ri, ri + attrs['rowspan']):
                for c in range(ci, ci + attrs['colspan']):
                    if (r, c) in occupied:
                        raise ValueError(f"Overlapping cells at row {r + 1}, column {c + 1}")
                    occupied[(r, c)] = cell
            cells.append(cell)
            ci += attrs['colspan']
            column_count = max(column_count, ci)
    for r in range(len(rows)):
        for c in range(column_count):
            if (r, c) not in occupied:
                holes.append([r + 1, c + 1])
    if holes:
        warnings.append('Tagged grid contains uncovered positions; retained original cell structure without adding guessed cells')

    mode = _callback_mode(inline_text_fn)
    first = rows[0]['cells']
    first_header = bool(first) and all(c['role'] == 'TH' and c['attrs']['scope'] in (None, 'Column') for c in first)
    simple = (first_header and len(rows) > 1 and not holes and not captions
              and all(c['role'] == 'TD' for row in rows[1:] for c in row['cells'])
              and all(c['attrs']['rowspan'] == c['attrs']['colspan'] == 1 and not c['attrs']['headers'] for c in cells)
              and not any(_block_cell(c['node']) or c['attrs'].get('lang') for c in cells)
              and not any(row['group'] == 'tfoot' for row in rows)
              and all(row['group'] != 'thead' for row in rows[1:]))
    md_contents = {}
    if simple:
        for cell in cells:
            value = _cell_content(cell['node'], inline_text_fn, mode, 'markdown')
            md_contents[id(cell)] = value
            # GFM tables cannot reliably contain block structures, nested tables,
            # or lists; preserve such cell content through inline HTML instead.
            if re.search(r'<\s*(?:table|p|ul|ol|li|pre|blockquote|div|h[1-6])\b', value, re.I):
                simple = False
    metadata = {
        'source_table_id': node.get('id'), 'source_pages': node.get('pages', []),
        'format': 'markdown' if simple else 'html', 'row_count': len(rows),
        'column_count': column_count, 'cell_count': len(cells),
        'header_count': sum(c['role'] == 'TH' for c in cells),
        'empty_cell_count': sum(not _has_content(c['node']) for c in cells),
        'has_spans': any(c['attrs']['rowspan'] > 1 or c['attrs']['colspan'] > 1 for c in cells),
        'grid_holes': holes, 'warnings': warnings,
        'scope_both_strategy': 'explicit headers for both axes; data-pdf-scope retains native Both value' if any(c['attrs']['scope'] == 'Both' for c in cells) else None,
    }
    if simple:
        lines = ['| ' + ' | '.join(md_contents[id(c)] for c in rows[0]['cells']) + ' |',
                 '| ' + ' | '.join('---' for _ in range(column_count)) + ' |']
        lines.extend('| ' + ' | '.join(md_contents[id(c)] for c in row['cells']) + ' |' for row in rows[1:])
        metadata['header_semantics'] = 'GFM first-row THs serve as column headers; there are no row headers, spans or explicit header relationships'
        return '\n'.join(lines), metadata

    prefix = 'pdf-table-' + _safe_id(node.get('id', 'table'))
    native_ids = {}
    for ci, cell in enumerate(cells):
        if cell['role'] == 'TH':
            native = cell['attrs'].get('id') or cell['node'].get('id') or str(ci)
            cell['html_id'] = prefix + '-' + _safe_id(native)
            native_ids[str(native)] = cell['html_id']
            native_ids[str(cell['node'].get('id'))] = cell['html_id']
    headers = [c for c in cells if c['role'] == 'TH']
    # A repeated column-header row following data begins a distinct section
    # (for example Callisto Table 4's S1 and S2 studies). Consecutive header
    # rows remain one band, preserving nested/merged heading tiers.
    band_start, seen_data = 0, False
    for ri, row in enumerate(rows):
        column_header_row = bool(row['cells']) and all(
            c['role'] == 'TH' and c['attrs']['scope'] in (None, 'Column', 'Both')
            for c in row['cells'])
        if column_header_row:
            if seen_data:
                band_start, seen_data = ri, False
        else:
            seen_data = True
        row['column_header_band_start'] = band_start
    metadata['column_header_band_count'] = len({r['column_header_band_start'] for r in rows})

    def associated_headers(cell):
        explicit = cell['attrs']['headers']
        if explicit:
            result = []
            for native in explicit:
                if native not in native_ids:
                    warnings.append(f"Unresolved explicit header ID {native!r} in cell {cell['node'].get('id')}")
                result.append(native_ids.get(native, prefix + '-' + _safe_id(native)))
            return list(dict.fromkeys(result))
        r, c = cell['row'], cell['column']
        rs, cs = cell['attrs']['rowspan'], cell['attrs']['colspan']
        result = []
        for header in headers:
            if header is cell:
                continue
            hr, hc = header['row'], header['column']
            hrs, hcs, scope = header['attrs']['rowspan'], header['attrs']['colspan'], header['attrs']['scope']
            row_match = max(r, hr) < min(r + rs, hr + hrs)
            col_match = max(c, hc) < min(c + cs, hc + hcs)
            if (scope in ('Row', 'Both') and row_match and hc < c) or (scope in ('Column', 'Both') and col_match and rows[r]['column_header_band_start'] <= hr < r):
                result.append(header['html_id'])
        return list(dict.fromkeys(result))

    table_attr = ''
    if node.get('alt'):
        table_attr = ' aria-label="' + html.escape(str(node['alt']), quote=True) + '"'
    lines = ['<table' + table_attr + '>']
    if captions:
        lines.append('  <caption>' + '<br>'.join(_cell_content(c, inline_text_fn, mode, 'html') for c in captions) + '</caption>')
    leading_header_count = 0
    for row in rows:
        if row['cells'] and all(c['role'] == 'TH' and c['attrs']['scope'] in (None, 'Column', 'Both') for c in row['cells']):
            leading_header_count += 1
        else:
            break
    active_group = None
    for ri, row in enumerate(rows):
        group = row['group'] or ('thead' if ri < leading_header_count else 'tbody')
        # Preserve separate source row groups even when their HTML type matches.
        identity = (group, row['group_id'])
        if identity != active_group:
            if active_group is not None:
                lines.append('  </' + active_group[0] + '>')
            lines.append('  <' + group + '>')
            active_group = identity
        lines.append('    <tr>')
        for cell in row['cells']:
            role = cell['role'].lower()
            attrs = cell['attrs']
            values = []
            if cell['role'] == 'TH':
                values.append(('id', cell['html_id']))
                if attrs['scope'] in ('Row', 'Column', 'Both'):
                    values.append(('scope', 'row' if attrs['scope'] == 'Row' else 'col'))
                if attrs['scope'] == 'Both':
                    values.append(('data-pdf-scope', 'Both'))
            for key in ('rowspan', 'colspan'):
                if attrs[key] > 1:
                    values.append((key, str(attrs[key])))
            ids = associated_headers(cell)
            if ids:
                values.append(('headers', ' '.join(ids)))
            if attrs.get('lang'):
                values.append(('lang', str(attrs['lang'])))
            rendered_attrs = ''.join(' ' + key + '="' + html.escape(value, quote=True) + '"' for key, value in values)
            content = _cell_content(cell['node'], inline_text_fn, mode, 'html')
            lines.append('      <' + role + rendered_attrs + '>' + content + '</' + role + '>')
        lines.append('    </tr>')
    if active_group is not None:
        lines.append('  </' + active_group[0] + '>')
    lines.append('</table>')
    return '\n'.join(lines), metadata
