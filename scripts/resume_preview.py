"""Render public/resume/Resume.pdf into page images plus link hotspots for the in-site resume page.

Run after replacing the PDF:  npm run resume:preview
Needs poppler (pdftoppm, pdftohtml) on PATH.
"""

import json
import re
import subprocess
import tempfile
from html import unescape
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PDF = ROOT / 'public' / 'resume' / 'Resume.pdf'
OUT_DIR = ROOT / 'public' / 'resume'
DATA = ROOT / 'src' / 'data' / 'resumePreview.json'
DPI = 220

PAGE_RE = re.compile(r'<page number="(\d+)"[^>]*height="(\d+)" width="(\d+)"')
TEXT_RE = re.compile(r'<text top="(\d+)" left="(\d+)" width="(\d+)" height="(\d+)"[^>]*><a href="([^"]+)">(.*?)</a></text>')


def extract_links():
    xml = subprocess.run(['pdftohtml', '-xml', '-i', '-stdout', str(PDF)], check=True, capture_output=True, text=True).stdout
    pages = []
    for chunk in xml.split('<page ')[1:]:
        head = PAGE_RE.match('<page ' + chunk)
        number, height, width = (int(v) for v in head.groups())
        links = []
        for top, left, w, h, href, label in TEXT_RE.findall(chunk):
            text = unescape(re.sub(r'<[^>]+>', '', label)).strip()
            # pdftohtml attaches separator runs (" | +1 (343) ...") to the preceding link; they are not link text.
            if not text or text.startswith('|') or text == '|':
                continue
            links.append({
                'href': unescape(href),
                'label': text,
                'left': round(int(left) / width * 100, 3),
                'top': round(int(top) / height * 100, 3),
                'width': round(int(w) / width * 100, 3),
                'height': round(int(h) / height * 100, 3),
            })
        pages.append({'number': number, 'aspect': round(width / height, 5), 'links': links})
    return pages


def render_pages(count):
    files = []
    with tempfile.TemporaryDirectory() as tmp:
        prefix = Path(tmp) / 'page'
        subprocess.run(['pdftoppm', '-png', '-r', str(DPI), str(PDF), str(prefix)], check=True)
        rendered = sorted(Path(tmp).glob('page*.png'))
        if len(rendered) != count:
            raise SystemExit(f'expected {count} rendered pages, got {len(rendered)}')
        for old in OUT_DIR.glob('resume-page-*.png'):
            old.unlink()
        for index, source in enumerate(rendered, start=1):
            target = OUT_DIR / f'resume-page-{index}.png'
            target.write_bytes(source.read_bytes())
            files.append(target.name)
    return files


def main():
    pages = extract_links()
    files = render_pages(len(pages))
    for page, name in zip(pages, files):
        page['image'] = name
    DATA.write_text(json.dumps({'pages': pages}, indent=2) + '\n')
    links = sum(len(page['links']) for page in pages)
    print(f'{len(pages)} page(s), {links} link(s) -> {DATA.relative_to(ROOT)}')


if __name__ == '__main__':
    main()
