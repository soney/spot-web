"""Compare repaired PDFs with saved originals in two renderers at 144 DPI.

Pass --baseline with the folder of PDFs saved before this review. No PDF is
modified. MuPDF supplies per-page hashes; Poppler's complete PPM output is
hashed as a stream to avoid storing large raster files.
"""
import argparse
from concurrent.futures import ProcessPoolExecutor
import hashlib
import json
import multiprocessing
from pathlib import Path
import subprocess
import tempfile

import pymupdf

HERE = Path(__file__).resolve().parent.parent
REPO = HERE.parents[2]


def digest(data):
    return hashlib.sha256(data).hexdigest()


def poppler(path):
    with tempfile.TemporaryFile() as errors:
        process = subprocess.Popen(['pdftoppm', '-r', '144', str(path)],
                                   stdout=subprocess.PIPE, stderr=errors)
        checksum = hashlib.sha256()
        size = 0
        while chunk := process.stdout.read(1024 * 1024):
            checksum.update(chunk)
            size += len(chunk)
        assert process.wait() == 0 and size > 0, path
        errors.seek(0)
        return {'sha256': checksum.hexdigest(), 'bytes': size,
                'warnings': errors.read().decode(errors='replace')}


def compare(paths):
    before, after = paths
    before_sha, after_sha = digest(before.read_bytes()), digest(after.read_bytes())
    if before_sha == after_sha:
        return {'file': after.name, 'before_sha256': before_sha, 'after_sha256': after_sha,
                'unchanged_bytes': True}
    pages = []
    with pymupdf.open(before) as left, pymupdf.open(after) as right:
        assert len(left) == len(right), after
        for number, (a, b) in enumerate(zip(left, right), 1):
            geometry = a.mediabox == b.mediabox and a.cropbox == b.cropbox and a.rotation == b.rotation
            images = [page.get_pixmap(matrix=pymupdf.Matrix(2, 2), alpha=False)
                      for page in (a, b)]
            hashes = [digest(image.samples) for image in images]
            equal = hashes[0] == hashes[1] and images[0].irect == images[1].irect
            assert equal and geometry, (after, number)
            pages.append({'page': number, 'sha256': hashes[0],
                          'pixels_equal': equal, 'geometry_equal': geometry})
    a, b = poppler(before), poppler(after)
    assert a['sha256'] == b['sha256'] and a['bytes'] == b['bytes'], after
    return {'file': after.name, 'before_sha256': before_sha, 'after_sha256': after_sha,
            'unchanged_bytes': False, 'dpi': 144, 'mupdf_pages': pages,
            'poppler_before': a, 'poppler_after': b, 'all_pixels_equal': True}


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--baseline', required=True, type=Path)
    args = parser.parse_args()
    paths = [(args.baseline / path.name, path) for path in sorted((REPO / 'assets/pdfs').glob('*.pdf'))]
    assert all(a.is_file() for a, b in paths)
    with ProcessPoolExecutor(max_workers=3, mp_context=multiprocessing.get_context('fork')) as executor:
        results = list(executor.map(compare, paths))
    report = {'mupdf_version': pymupdf.VersionBind,
              'poppler_version': subprocess.run(['pdftoppm', '-v'], capture_output=True).stderr.decode().splitlines()[0],
              'files': len(results), 'changed_files': sum(not r['unchanged_bytes'] for r in results),
              'changed_file_pages': sum(len(r.get('mupdf_pages', [])) for r in results),
              'all_checks_passed': True, 'documents': results}
    (HERE / 'appearance-comparison.json').write_text(json.dumps(report, indent=2) + '\n')
    print(json.dumps({k: v for k, v in report.items() if k != 'documents'}))
