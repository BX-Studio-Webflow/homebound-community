#!/usr/bin/env python3
"""Print MCP update payloads in batches from palisade-cms-updates.json."""

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
updates = json.loads((ROOT / "scripts/palisade-cms-updates.json").read_text(encoding="utf-8"))
batch_size = 15
for i in range(0, len(updates), batch_size):
    batch = updates[i : i + batch_size]
    print(f"BATCH {i // batch_size + 1} ({len(batch)} items)")
    print(json.dumps(batch))
