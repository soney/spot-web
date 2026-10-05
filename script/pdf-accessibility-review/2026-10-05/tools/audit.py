"""Re-run structural checks on every publication PDF without changing it.

Use Python with pypdf installed and mutool on PATH. Reports retain source hashes;
normalization is temporary and only avoids stale incremental objects in pypdf.
This checks tag mechanics, not semantic accuracy or accessibility conformance.
"""
from concurrent.futures import ProcessPoolExecutor
import hashlib
import json
import multiprocessing
from pathlib import Path
import subprocess
import tempfile

from pypdf import PdfReader
from validate_tags import Validator

HERE = Path(__file__).resolve().parent.parent
REPO = HERE.parents[2]


def audit(path):
    with tempfile.TemporaryDirectory(prefix='spot-structure-') as temporary:
        normalized = Path(temporary) / 'normalized.pdf'
        result = subprocess.run(['mutool', 'clean', str(path), str(normalized)],
                                capture_output=True, check=True)
        report = Validator(PdfReader(normalized)).validate()
    report = {'file': path.name, 'pdf_sha256': hashlib.sha256(path.read_bytes()).hexdigest(),
              'normalization_warnings': result.stderr.decode(errors='replace'), **report}
    (HERE / 'structure' / (path.stem + '.json')).write_text(
        json.dumps(report, ensure_ascii=False, indent=2) + '\n')
    return {'file': path.name, 'pdf_sha256': report['pdf_sha256'],
            'pages': report['page_count'], 'roles': report['roles'],
            'checks_passed': report['checks_passed'], 'issue_counts': report['issue_counts']}


if __name__ == '__main__':
    (HERE / 'structure').mkdir(exist_ok=True)
    with ProcessPoolExecutor(max_workers=3, mp_context=multiprocessing.get_context('fork')) as executor:
        results = list(executor.map(audit, sorted((REPO / 'assets/pdfs').glob('*.pdf'))))
    (HERE / 'structure-summary.json').write_text(json.dumps(results, indent=2) + '\n')
    print(json.dumps({'files': len(results), 'passes': sum(d['checks_passed'] for d in results),
                      'pages': sum(d['pages'] for d in results),
                      'issues': {d['file']: d['issue_counts'] for d in results if d['issue_counts']}}, indent=2))
    raise SystemExit(0 if all(d['checks_passed'] for d in results) else 1)
