"""Recover code whitespace from reviewed tag-operation geometry.

No source glyphs are inserted, deleted, reordered, or rewritten. Native
ActualText takes priority. Uncertain geometry returns the existing extraction
with an explicit fallback reason. This helper is independent of PDF libraries.
"""
from __future__ import annotations
import math
import re
import statistics


def _glyphs(text):
    return re.sub(r'\s', '', text)


def _walk(node):
    if isinstance(node, dict):
        yield node
        for child in node.get('children', []):
            yield from _walk(child)


def _fallback(node, reason, **extra):
    return node.get('actual') or node.get('text', ''), {
        'method': 'native_text_preserved', 'changed': False,
        'reason': reason, **extra,
    }


def recover_code(node):
    """Return (code text, metadata), preserving ActualText and every glyph.

    Layout recovery only changes whitespace. It preserves logical operation
    order, uses baseline changes for lines, and estimates a character column
    from the median advance of the printed runs. Indentation is relative to
    the leftmost printed glyph in this tagged code block; printed line-number
    gutters therefore remain in place. No language formatter is involved.
    """
    if node.get('actual'):
        return node['actual'], {'method': 'native_actual_text', 'changed': False}
    native = node.get('text', '')
    values = list(_walk(node))
    # A nested semantic replacement may have no correspondence to painted
    # glyph positions. Respect it rather than treating it as a geometric run.
    if any(v is not node and v.get('kind') == 'element' and v.get('actual') for v in values):
        return _fallback(node, 'nested_actual_text')
    ops = [op for v in values if v.get('kind') == 'content'
           for op in v.get('ops', []) if op.get('kind') == 'text'
           and (op.get('actual') if op.get('actual') is not None else op.get('text', ''))]
    if not ops:
        return _fallback(node, 'no_text_operations')
    raw = [(op.get('actual') if op.get('actual') is not None else op.get('text', '')) for op in ops]
    if _glyphs(''.join(raw)) != _glyphs(native):
        return _fallback(node, 'operation_glyph_sequence_differs_from_native')
    if any('\n' in text or '\r' in text for text in raw):
        return _fallback(node, 'multiline_operation_text')
    if any(not isinstance(op.get('bbox'), (list, tuple)) or len(op['bbox']) != 4
           or op.get('line_y') is None or not all(math.isfinite(float(x)) for x in op['bbox'])
           for op in ops):
        return _fallback(node, 'incomplete_geometry')
    if len({op.get('page') for op in ops}) != 1:
        return _fallback(node, 'code_spans_multiple_pages')
    # Runs retain their internal spaces. Estimate pitch from visible text,
    # including advance occupied by spaces already included in its bounds.
    estimates = []
    for op, text in zip(ops, raw):
        if len(text) >= 2 and text.strip():
            width = op['bbox'][2] - op['bbox'][0]
            if width > 0:
                estimates.append(width / len(text))
    if not estimates:
        estimates = [(op['bbox'][2] - op['bbox'][0]) / len(text)
                     for op, text in zip(ops, raw) if text.strip() and op['bbox'][2] > op['bbox'][0]]
    if not estimates:
        return _fallback(node, 'no_character_pitch_evidence')
    pitch = statistics.median(estimates)
    deviation = statistics.median(abs(x - pitch) for x in estimates) / pitch
    consistency = sum(abs(x - pitch) <= 0.20 * pitch for x in estimates) / len(estimates)
    if not 1.0 <= pitch <= 30.0 or deviation > 0.10 or consistency < 0.70:
        return _fallback(node, 'variable_or_uncertain_character_pitch',
                         estimated_pitch=round(pitch, 4), relative_median_deviation=round(deviation, 4))
    lines = []
    for op, text in zip(ops, raw):
        y = float(op['line_y'])
        if not lines or abs(y - lines[-1][0]) > 0.6:
            if lines and y < lines[-1][0] - 0.6:
                return _fallback(node, 'nonmonotonic_line_order')
            lines.append((y, []))
        row = lines[-1][1]
        if row and op['bbox'][0] < row[-1][0]['bbox'][0] - max(0.6, pitch * 0.2):
            return _fallback(node, 'nonmonotonic_horizontal_order')
        row.append((op, text))
    # Whitespace-only operations can have no true visible origin. Keep their
    # literal characters but base line indentation on the first printed run.
    origins = [next((op['bbox'][0] for op, text in row if text.strip()), row[0][0]['bbox'][0])
               for _, row in lines]
    origin = min(origins)
    rendered = []
    inserted_spaces = 0
    leading_spaces = 0
    large_gaps = []
    for (_, row), x0 in zip(lines, origins):
        indent = max(0, round((x0 - origin) / pitch))
        if indent > 80:
            return _fallback(node, 'excessive_leading_indent', columns=indent)
        # Avoid doubling explicit leading spaces, which are already native.
        explicit_leading = len(row[0][1]) - len(row[0][1].lstrip(' '))
        indent = max(0, indent - explicit_leading)
        parts = [' ' * indent]
        leading_spaces += indent
        prev = None
        for op, text in row:
            if prev is not None:
                gap = op['bbox'][0] - prev['bbox'][2]
                count = max(0, round(gap / pitch)) if gap >= pitch * 0.55 else 0
                if count > 80:
                    return _fallback(node, 'excessive_interrun_gap', columns=count)
                if count:
                    parts.append(' ' * count)
                    inserted_spaces += count
                if count > 8:
                    large_gaps.append(count)
            parts.append(text)
            prev = op
        rendered.append(''.join(parts).rstrip(' \t'))
    result = '\n'.join(rendered)
    if _glyphs(result) != _glyphs(native):
        return _fallback(node, 'postcondition_glyph_sequence_changed')
    return result, {
        'method': 'printed_geometry_whitespace', 'changed': result != native,
        'source_line_count': len(lines), 'character_pitch': round(pitch, 4),
        'relative_median_deviation': round(deviation, 4),
        'pitch_consistency': round(consistency, 4),
        'inserted_gap_spaces': inserted_spaces, 'inserted_leading_spaces': leading_spaces,
        'large_gap_columns': large_gaps, 'glyph_sequence_preserved': True,
        'scope': 'Whitespace only; printed line numbers retained; no syntax rewriting.',
    }
