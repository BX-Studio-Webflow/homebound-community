import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SVG_ROOT = ROOT / "src/example-assets/home-icons/Palisade SVGs"
features_path = Path(
    r"C:\Users\kipla\.cursor\projects\c-Users-kipla-projects-homebound-community\agent-tools\36c9a7a8-5973-40cd-b75b-3955c7722b13.txt"
)
plans_path = Path(
    r"C:\Users\kipla\.cursor\projects\c-Users-kipla-projects-homebound-community\agent-tools\6b1f6ea1-901b-4708-8690-09e984af5b2e.txt"
)

HIDDEN_CLASS_RE = re.compile(
    r"\.(st\d+)\s*\{[^}]*display:\s*none", re.I | re.S
)
OPT_OPEN_RE = re.compile(r'<g id="(OPT_CODE[^"]+)"([^>]*)>', re.I)

with features_path.open(encoding="utf-8") as f:
    cms_items = json.load(f)["result"]["items"]
with plans_path.open(encoding="utf-8") as f:
    plans = {p["id"]: p["fieldData"] for p in json.load(f)["result"]["items"]}

PLAN_NAMES = ["The Elm", "The Willow", "The Vista", "The Ambrose", "The Alder", "The Glenview"]
TAB = {
    "b9b3ff6995dad6233446a190085a3d1a": "1st",
    "9abe51351fba65d0cbbd595e60bfc221": "2nd",
}

print("=== SVG OPT_CODE audit ===")
for svg in sorted(SVG_ROOT.rglob("*.svg")):
    text = svg.read_text(encoding="utf-8")
    hidden_classes = set(HIDDEN_CLASS_RE.findall(text))
    opts = []
    for m in OPT_OPEN_RE.finditer(text):
        oid, attrs = m.group(1), m.group(2)
        cls = re.search(r'class="([^"]+)"', attrs)
        classes = cls.group(1).split() if cls else []
        is_hidden = any(c in hidden_classes for c in classes)
        has_attr = 'data-attribute="feature"' in attrs
        opts.append((oid, is_hidden, has_attr))
    missing_attr = [o for o, h, a in opts if not a]
    print(f"\n{svg.relative_to(ROOT)}")
    print(f"  OPT_CODE groups: {len(opts)}, missing data-attribute: {len(missing_attr)}")
    for oid, hidden, has_attr in opts:
        flag = "HIDDEN" if hidden else "visible"
        attr = "OK" if has_attr else "MISSING"
        print(f"    [{attr}] [{flag}] {oid}")

print("\n=== CMS features by Palisade plan ===")
for plan_name in PLAN_NAMES:
    pid = next(k for k, v in plans.items() if v.get("name") == plan_name)
    feats = [it for it in cms_items if pid in (it["fieldData"].get("house-plan-2") or [])]
    print(f"\n{plan_name} ({pid}) — {len(feats)} items")
    for it in sorted(
        feats, key=lambda x: (x["fieldData"].get("tab", ""), x["fieldData"].get("sort-order", 0))
    ):
        f = it["fieldData"]
        print(
            f"  {TAB.get(f.get('tab'),'?')}\t{f.get('sort-order')}\t{f.get('feature')}\t{f.get('name')}\t{it['id']}"
        )
