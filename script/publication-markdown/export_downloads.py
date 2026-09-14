"""Export reviewed Markdown and its referenced images as static site downloads.

Run with the existing publication-markdown Python environment. Source drafts
stay unchanged; only image destinations change in the downloadable copies so
figures also load when a reader opens a downloaded file outside this website.
Jekyll copies these files unchanged because they have no YAML front matter.
"""
from collections import Counter
import hashlib
import json
from pathlib import Path, PurePosixPath
import re
from urllib.parse import urlsplit

import yaml


HERE = Path(__file__).resolve().parent
REPO = HERE.parent.parent
DESTINATION = REPO / 'assets/markdown'

# The converter emits standalone Markdown images and HTML images inside
# semantic tables. Match destinations only, leaving alt text and markup intact.
IMAGE = re.compile(
    r'(?P<markdown>^!\[(?:\\.|[^\]\\])*\]\()'
    r'(?P<markdown_path>\.\./figures/[^\s)]+)(?=\)$)'
    r'|(?P<html><img\s+src=")'
    r'(?P<html_path>\.\./figures/[^"\s]+)(?=")',
    re.MULTILINE,
)


def sha(data):
    return hashlib.sha256(data).hexdigest()


def relative_path(value, directory, suffix, stem=None):
    path = PurePosixPath(value)
    parts = path.parts
    expected_length = 3 if directory == 'figures' else 2
    if (len(parts) != expected_length or parts[0] != directory
            or path.suffix != suffix or str(path) != value
            or any(not re.fullmatch(r'[A-Za-z0-9][A-Za-z0-9._-]*', p) for p in parts)
            or (stem is not None and parts[1] != stem)):
        raise ValueError(f'Unexpected or unsafe source path: {value}')
    return path


def read_source(relative, expected_hash, root=HERE):
    path = (root / relative).resolve()
    if not path.is_relative_to(root) or not path.is_file():
        raise ValueError(f'Missing or unsafe source file: {relative}')
    data = path.read_bytes()
    if sha(data) != expected_hash:
        raise ValueError(f'Source no longer matches its reviewed hash: {relative}')
    return data


def canonical_base():
    config = yaml.safe_load((REPO / '_config.yml').read_text())
    url = config.get('url', '')
    baseurl = config.get('baseurl', '')
    if not isinstance(url, str) or not isinstance(baseurl, str):
        raise ValueError('The site url and baseurl must be strings')
    parsed = urlsplit(url)
    if (parsed.scheme not in {'http', 'https'} or not parsed.netloc
            or parsed.query or parsed.fragment or parsed.username or parsed.password
            or any(c.isspace() or c in '<>"\\' for c in url)
            or '..' in PurePosixPath(parsed.path).parts):
        raise ValueError('The site url must be an absolute HTTP(S) URL')
    if (baseurl and not baseurl.startswith('/')
            or not re.fullmatch(r'[/A-Za-z0-9._~-]*', baseurl)
            or '..' in PurePosixPath(baseurl).parts):
        raise ValueError('The site baseurl must be a safe URL path')
    return url.rstrip('/') + baseurl.rstrip('/')


def build_exports():
    manifest = json.loads((HERE / 'manifest.json').read_text())
    documents = manifest['documents']
    if len(documents) != manifest['files']:
        raise ValueError('The manifest document count does not match its files count')
    base = canonical_base() + '/assets/markdown/'
    outputs = {}
    markdown_sources = set()
    image_count = 0
    for document in documents:
        source = relative_path(document['markdown'], 'publications', '.md')
        pdf_name = document['file']
        if (not re.fullmatch(r'[A-Za-z0-9][A-Za-z0-9._-]*\.pdf', pdf_name)
                or PurePosixPath(pdf_name).stem != source.stem):
            raise ValueError(f'Unexpected or unsafe PDF name: {pdf_name}')
        read_source(Path('assets/pdfs') / pdf_name, document['pdf_sha256'], REPO)
        if str(source) in markdown_sources:
            raise ValueError(f'Duplicate Markdown source: {source}')
        markdown_sources.add(str(source))
        original = read_source(source, document['markdown_sha256'])
        text = original.decode('utf-8')
        if text.startswith('---'):
            raise ValueError(f'Markdown must not contain Jekyll front matter: {source}')
        assets = {}
        for asset in document['assets']:
            path = relative_path(asset['path'], 'figures', '.png', source.stem)
            if str(path) in assets:
                raise ValueError(f'Duplicate asset in manifest: {path}')
            assets[str(path)] = read_source(path, asset['sha256'])
        referenced = []

        def replace_image(match):
            destination = match['markdown_path'] or match['html_path']
            path = str(relative_path(destination[3:], 'figures', '.png', source.stem))
            if path not in assets:
                raise ValueError(f'Image is absent from reviewed manifest: {path}')
            referenced.append(path)
            return (match['markdown'] or match['html']) + base + path

        exported = IMAGE.sub(replace_image, text)
        if '../figures/' in exported or Counter(referenced) != Counter(assets.keys()):
            raise ValueError(f'Image references do not match the reviewed assets: {source}')
        # Reversing this single prefix substitution must restore every source
        # byte, including whitespace, alternative text, links and code blocks.
        if exported.replace(base + 'figures/', '../figures/').encode('utf-8') != original:
            raise ValueError(f'Export changed content beyond image destinations: {source}')
        outputs[source.name] = exported.encode('utf-8')
        outputs.update(assets)
        image_count += len(referenced)
    actual_sources = {p.relative_to(HERE).as_posix() for p in (HERE / 'publications').glob('*.md')}
    if actual_sources != markdown_sources:
        raise ValueError('The Markdown source folder and reviewed manifest differ')
    return outputs, len(documents), image_count


def main():
    outputs, document_count, image_count = build_exports()
    # Validate all inputs before writing, and never follow a destination symlink
    # outside this generated directory or silently retain an obsolete download.
    if DESTINATION.is_symlink() or DESTINATION.resolve() != DESTINATION:
        raise ValueError(f'Unsafe destination directory: {DESTINATION}')
    existing = {p.relative_to(DESTINATION).as_posix()
                for p in DESTINATION.rglob('*') if p.is_file() or p.is_symlink()}
    unexpected = existing - outputs.keys()
    if unexpected:
        raise ValueError(f'Unexpected existing downloads; review before removing: {sorted(unexpected)}')
    for relative in outputs:
        path = DESTINATION / relative
        if path.is_symlink() or path.resolve() != path:
            raise ValueError(f'Unsafe destination file: {relative}')
    for relative, data in outputs.items():
        path = DESTINATION / relative
        path.parent.mkdir(parents=True, exist_ok=True)
        if not path.exists() or path.read_bytes() != data:
            path.write_bytes(data)
    for relative, data in outputs.items():
        if (DESTINATION / relative).read_bytes() != data:
            raise ValueError(f'Export verification failed: {relative}')
    print(f'Exported and verified {document_count} Markdown downloads and '
          f'{image_count} referenced images in {DESTINATION}')


if __name__ == '__main__':
    main()
