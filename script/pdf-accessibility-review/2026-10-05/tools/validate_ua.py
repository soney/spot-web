"""Run veraPDF's PDF/UA-1 profile on all PDFs; pass the CLI path as argument.

The profile cannot establish semantic accuracy. Missing PDF/UA declarations are
reported as failures; this script never adds conformance claims to documents.
"""
from concurrent.futures import ThreadPoolExecutor
import hashlib
import json
from pathlib import Path
import subprocess
import sys

HERE = Path(__file__).resolve().parent.parent
REPO = HERE.parents[2]


def audit(path):
    result = subprocess.run([sys.argv[1], '--flavour', 'ua1', '--format', 'json',
                             '--maxfailuresdisplayed', '10', str(path)],
                            capture_output=True, timeout=300)
    report = json.loads(result.stdout)
    job, = report['report']['jobs']
    validation, = job['validationResult']
    assert validation['jobEndStatus'] == 'normal', path
    assert validation['profileName'] == 'PDF/UA-1 validation profile'
    assert job['itemDetails']['size'] == path.stat().st_size
    rules = validation['details'].get('ruleSummaries', [])
    failed = [r for r in rules if r['ruleStatus'] == 'FAILED']
    other = [r for r in failed if not (r['clause'] == '5' and r['testNumber'] == 1)]
    report['file'] = path.name
    report['pdf_sha256'] = hashlib.sha256(path.read_bytes()).hexdigest()
    report['stderr'] = result.stderr.decode(errors='replace')
    (HERE / 'verapdf' / (path.stem + '.json')).write_text(json.dumps(report, indent=2) + '\n')
    return {'file': path.name, 'pdf_sha256': report['pdf_sha256'],
            'compliant': validation['compliant'],
            'missing_identification_only': bool(failed) and not other,
            'failed_rules': [{'clause': r['clause'], 'test': r['testNumber'],
                              'description': r['description'], 'failed_checks': r['failedChecks']}
                             for r in failed]}


if __name__ == '__main__':
    (HERE / 'verapdf').mkdir(exist_ok=True)
    with ThreadPoolExecutor(max_workers=3) as executor:
        results = list(executor.map(audit, sorted((REPO / 'assets/pdfs').glob('*.pdf'))))
    (HERE / 'verapdf-summary.json').write_text(json.dumps(results, indent=2) + '\n')
    print(json.dumps({'files': len(results), 'passes': sum(d['compliant'] for d in results),
                      'missing_identification_only': sum(d['missing_identification_only'] for d in results),
                      'other_failures': [d for d in results if not d['compliant'] and not d['missing_identification_only']]}, indent=2))
