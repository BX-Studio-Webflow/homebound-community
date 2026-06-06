"""Generate Palisade interior URL TypeScript from generated-interior-urls.json."""
import json
from pathlib import Path

ROOM_ORDER = [
    'kitchen-interior',
    'living-interior',
    'bedroom-interior',
    'bathroom-interior',
]
POS_ORDER = ['pos-1', 'pos-2', 'pos-3', 'pos-4']

TITLE_BY_SLUG = {
    'elm': {
        'pos-1': 'Transitional Organic',
        'pos-2': 'Coastal Cottage',
        'pos-3': 'Pacific Contemporary',
        'pos-4': 'Pacific Contemporary',
    },
    'glenview': {
        'pos-1': 'Transitional Organic',
        'pos-2': 'Coastal Cottage',
        'pos-3': 'Pacific Contemporary',
        'pos-4': 'Pacific Contemporary',
    },
    'vista': {
        'pos-1': 'Transitional Organic',
        'pos-2': 'Coastal Cottage',
        'pos-3': 'Pacific Contemporary',
        'pos-4': 'Pacific Contemporary',
    },
    'willow': {
        'pos-1': 'Spanish',
        'pos-2': 'Coastal Cottage',
        'pos-3': 'Pacific Contemporary',
        'pos-4': 'Pacific Contemporary',
    },
    'alder': {
        'pos-1': 'Spanish',
        'pos-2': 'Coastal Cottage',
        'pos-3': 'Pacific Contemporary',
        'pos-4': 'Pacific Contemporary',
    },
    'ambrose': {
        'pos-1': 'Modern',
        'pos-2': 'Coastal Cottage',
        'pos-3': 'Pacific Contemporary',
        'pos-4': 'Pacific Contemporary',
    },
}

PLAN_ORDER = ['elm', 'glenview', 'willow', 'ambrose', 'alder', 'vista']


def main() -> None:
    repo = Path(__file__).resolve().parent
    data = json.loads((repo / 'generated-interior-urls.json').read_text(encoding='utf-8'))
    by_slug: dict[str, dict[str, dict[str, str | None]]] = {
        slug: {room: {pos: None for pos in POS_ORDER} for room in ROOM_ORDER}
        for slug in PLAN_ORDER
    }

    for entry in data['entries']:
        slug = entry['slug']
        if slug not in by_slug:
            continue
        url = entry.get('url')
        by_slug[slug][entry['roomKey']][entry['pos']] = url or ''

    lines: list[str] = []
    for slug in PLAN_ORDER:
        lines.append(f'    {slug}: {{')
        for room in ROOM_ORDER:
            lines.append(f"      '{room}': {{")
            for pos in POS_ORDER:
                url = by_slug[slug][room].get(pos) or ''
                if url:
                    lines.append(f"        '{pos}': '{url}',")
                else:
                    lines.append(f"        '{pos}': '', // TODO: upload missing asset")
            lines.append('      },')
        lines.append('    },')

    out = repo / 'generated-interior-urls.ts.txt'
    out.write_text('\n'.join(lines) + '\n', encoding='utf-8')
    print(out)


if __name__ == '__main__':
    main()
