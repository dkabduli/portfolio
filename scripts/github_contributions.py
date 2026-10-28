"""Snapshot the public GitHub contribution calendar into src/data/githubContributions.json.

Reads the same public calendar a visitor sees on github.com/<user>, so private
contributions only appear if "Private contributions" is enabled on the profile.
Runs before every deploy; on any failure it keeps the existing snapshot.
"""

import json
import re
import sys
import urllib.request
from datetime import datetime, timezone
from html import unescape
from pathlib import Path

USER = 'dkabduli'
ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / 'src' / 'data' / 'githubContributions.json'
URL = f'https://github.com/users/{USER}/contributions'

CELL_RE = re.compile(r'<td\b[^>]*\bdata-date="(\d{4}-\d{2}-\d{2})"[^>]*>', re.S)
ATTR_RE = re.compile(r'\b(id|data-level)="([^"]+)"')
TIP_RE = re.compile(r'<tool-tip\b[^>]*\bfor="([^"]+)"[^>]*>(.*?)</tool-tip>', re.S)
COUNT_RE = re.compile(r'(\d[\d,]*)\s+contributions?')
TOTAL_RE = re.compile(r'([\d,]+)\s+contributions?\s+in the last year')


def fetch():
    request = urllib.request.Request(URL, headers={'User-Agent': 'portfolio-snapshot'})
    with urllib.request.urlopen(request, timeout=20) as response:
        return response.read().decode('utf-8')


def parse(html):
    tips = {}
    for target, text in TIP_RE.findall(html):
        match = COUNT_RE.search(unescape(text))
        tips[target] = int(match.group(1).replace(',', '')) if match else 0

    days = []
    for match in CELL_RE.finditer(html):
        attrs = dict(ATTR_RE.findall(match.group(0)))
        cell_id = attrs.get('id', '')
        # ids look like contribution-day-component-<weekday>-<week>
        parts = cell_id.rsplit('-', 2)
        if len(parts) != 3 or not parts[1].isdigit() or not parts[2].isdigit():
            continue
        days.append({
            'date': match.group(1),
            'weekday': int(parts[1]),
            'week': int(parts[2]),
            'level': int(attrs.get('data-level', '0')),
            'count': tips.get(cell_id, 0),
        })

    if not days:
        raise ValueError('no contribution cells found')

    weeks = [[] for _ in range(max(day['week'] for day in days) + 1)]
    for day in sorted(days, key=lambda d: (d['week'], d['weekday'])):
        weeks[day['week']].append({k: day[k] for k in ('date', 'weekday', 'count', 'level')})

    flat = " ".join(re.sub(r'<[^>]+>', ' ', html).split())
    total_match = TOTAL_RE.search(flat)
    total = int(total_match.group(1).replace(',', '')) if total_match else sum(d['count'] for d in days)
    return {'user': USER, 'total': total, 'weeks': weeks}


def main():
    try:
        data = parse(fetch())
    except Exception as error:  # Keep the last good snapshot rather than failing the deploy.
        print(f'github contributions: kept existing snapshot ({error})', file=sys.stderr)
        return
    data['fetchedAt'] = datetime.now(timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ')
    OUT.write_text(json.dumps(data, separators=(',', ':')) + '\n')
    print(f"github contributions: {data['total']} in the last year, {len(data['weeks'])} weeks -> {OUT.relative_to(ROOT)}")


if __name__ == '__main__':
    main()
