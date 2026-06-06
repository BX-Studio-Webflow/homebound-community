import json
import pathlib
import re
from collections import defaultdict

EXPECTED = ['kitchen', 'great room', 'primary bedroom', 'primary bathroom']

PACKAGE_IDS = {
    '6a23e04ade20611e2fd5184e': ('The Elm', 'Transitional Organic'),
    '6a23e04bf9cbac0dbfb77ff1': ('The Elm', 'Coastal Cottage'),
    '6a23e04c5b71fca076058603': ('The Elm', 'Pacific Contemporary'),
    '6a23e04d078636196294248b': ('The Glenview', 'Transitional Organic'),
    '6a23e04e92c518a59f70a86a': ('The Glenview', 'Coastal Cottage'),
    '6a23e04fbeb1853c8133a39a': ('The Glenview', 'Pacific Contemporary'),
    '6a23e05057b8638eb24f8802': ('The Willow', 'Spanish'),
    '6a23e051ebe65cb959427839': ('The Willow', 'Coastal Cottage'),
    '6a23e052f9cbac0dbfb780fb': ('The Willow', 'Pacific Contemporary'),
    '6a23e053d4c8e03752b35819': ('The Ambrose', 'Modern'),
    '6a23e054ebe65cb959427860': ('The Ambrose', 'Coastal Cottage'),
    '6a23e055949fc39a35eac9d3': ('The Ambrose', 'Pacific Contemporary'),
    '6a23e05645841096e854a80c': ('The Alder', 'Spanish'),
    '6a23e05754dbb1a98a89edd9': ('The Alder', 'Coastal Cottage'),
    '6a23e05993d4f2c8ef527b12': ('The Alder', 'Pacific Contemporary'),
    '6a23e0592ac8266de48ac6c6': ('The Vista', 'Transitional Organic'),
    '6a23e05a45841096e854a8aa': ('The Vista', 'Coastal Cottage'),
    '6a23e05b93d4f2c8ef527b81': ('The Vista', 'Pacific Contemporary'),
}

ROOM_KEY = {
    'kitchen': 'kitchen-interior',
    'great room': 'living-interior',
    'primary bedroom': 'bedroom-interior',
    'primary bathroom': 'bathroom-interior',
}

POS_BY_PACKAGE = {
    'Transitional Organic': 'pos-1',
    'Spanish': 'pos-1',
    'Modern': 'pos-1',
    'Coastal Cottage': 'pos-2',
    'Pacific Contemporary': 'pos-3',
}


def norm(name: str) -> str:
    base = pathlib.Path(name).stem.lower().strip()
    return re.sub(r'\s+', ' ', base)


def main() -> None:
    repo = pathlib.Path(__file__).resolve().parent
    export = sorted((repo.parent / '.cursor').glob('**/096e5786*.txt'), key=lambda p: p.stat().st_mtime)
    if not export:
        export = sorted(pathlib.Path.home().glob('.cursor/**/096e5786*.txt'))
    # fallback: agent-tools in cursor projects
    candidates = list(pathlib.Path(r'C:\Users\kipla\.cursor\projects\c-Users-kipla-projects-homebound-community\agent-tools').glob('096e5786*.txt'))
    path = candidates[0] if candidates else None
    if not path:
        raise SystemExit('Webflow export file not found')

    assets = json.loads(path.read_text(encoding='utf-8'))[0]['data']['assets']
    by_pkg = defaultdict(list)
    for asset in assets:
        info = asset.get('assetParentFolderInfo') or {}
        pid = info.get('id')
        if pid in PACKAGE_IDS:
            by_pkg[pid].append(
                {
                    'name': asset['name'],
                    'norm': norm(asset['name']),
                    'url': asset['url'],
                    'id': asset['id'],
                }
            )

    missing_report = []
    url_entries = []
    complete = 0

    for pid, (plan, pkg) in sorted(PACKAGE_IDS.items(), key=lambda x: (x[1][0], x[1][1])):
        files = by_pkg.get(pid, [])
        by_norm = {}
        extras = []
        for file in files:
            key = file['norm']
            if key in EXPECTED and key not in by_norm:
                by_norm[key] = file
            else:
                extras.append(file['name'])

        missing = [name for name in EXPECTED if name not in by_norm]
        if not missing and not extras:
            complete += 1

        webflow_path = f'Interiors - Palisade / Interior - {plan} / {pkg}'
        if missing or extras:
            missing_report.append(
                {
                    'path': webflow_path,
                    'folderId': pid,
                    'missing': [f'{name}.png' for name in missing],
                    'extra': extras,
                    'found': sorted(by_norm.keys()),
                }
            )

        for exp in EXPECTED:
            hit = by_norm.get(exp)
            url_entries.append(
                {
                    'plan': plan,
                    'slug': plan.replace('The ', '').lower(),
                    'package': pkg,
                    'pos': POS_BY_PACKAGE[pkg],
                    'roomFile': f'{exp}.png',
                    'roomKey': ROOM_KEY[exp],
                    'webflowPath': webflow_path,
                    'url': hit['url'] if hit else None,
                    'assetName': hit['name'] if hit else None,
                    'assetId': hit['id'] if hit else None,
                }
            )

    total_found = sum(len(by_pkg.get(pid, [])) for pid in PACKAGE_IDS)

    print('=== COVERAGE ===')
    print(f'Package folders complete (4/4, no extras): {complete}/18')
    print(f'Package folders with gaps or extras: {18 - complete}')
    print(f'Total assets in package folders: {total_found} (expected 72)')
    print()

    if missing_report:
        print('=== ISSUES ===')
        for row in missing_report:
            print(f"- {row['path']}")
            if row['missing']:
                print(f"  missing: {', '.join(row['missing'])}")
            if row['extra']:
                print(f"  unexpected: {', '.join(row['extra'])}")
        print()
    else:
        print('All 18 package folders have exactly the 4 expected images.')
        print()

    out_json = repo / 'generated-interior-urls.json'
    out_json.write_text(
        json.dumps({'entries': url_entries, 'issues': missing_report}, indent=2) + '\n',
        encoding='utf-8',
    )
    print(f'Wrote {out_json}')

    # compact markdown summary for missing only
    out_md = repo / 'generated-interior-urls-summary.md'
    lines = [
        '# Palisade interior upload audit',
        '',
        f'- Complete folders: **{complete}/18**',
        f'- Assets found: **{total_found}/72**',
        '',
    ]
    if missing_report:
        lines.append('## Missing or unexpected files')
        lines.append('')
        for row in missing_report:
            lines.append(f'### `{row["path"]}`')
            if row['missing']:
                lines.append(f'- Missing: {", ".join(f"`{m}`" for m in row["missing"])}')
            if row['extra']:
                lines.append(f'- Unexpected: {", ".join(f"`{e}`" for e in row["extra"])}')
            lines.append('')
    else:
        lines.append('All folders complete.')
    out_md.write_text('\n'.join(lines) + '\n', encoding='utf-8')
    print(f'Wrote {out_md}')


if __name__ == '__main__':
    main()
