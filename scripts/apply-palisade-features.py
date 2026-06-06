#!/usr/bin/env python3
"""Add data-attribute=feature to Palisade OPT_CODE groups and prepare CMS updates."""

from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SVG_ROOT = ROOT / "src/example-assets/home-icons/Palisade SVGs"
FEATURES_CACHE = Path(
    r"C:\Users\kipla\.cursor\projects\c-Users-kipla-projects-homebound-community\agent-tools\36c9a7a8-5973-40cd-b75b-3955c7722b13.txt"
)

PLAN_FOLDERS = {
    "6a1ff0ecd3d3113ee5e4b084": "The Elm - Plan 6",
    "6a1ff02dd3d3113ee5e4193c": "The Willow - Plan 7",
    "6a1ff02dd3d3113ee5e4193e": "The Vista - Plan 8",
    "6a1ff02dd3d3113ee5e41940": "The Ambrose - Plan 10",
    "6a1ff02dd3d3113ee5e41942": "The Alder - Plan 9",
}

# CMS item id -> (house plan id, SVG OPT_CODE group id)
FEATURE_MAP: dict[str, tuple[str, str]] = {
    # The Elm
    "6a20045863e5c726b6f37ab8": ("6a1ff0ecd3d3113ee5e4b084", "OPT_CODE_EXTCVPT02"),
    "6a20045863e5c726b6f37aba": ("6a1ff0ecd3d3113ee5e4b084", "OPT_CODE_CEILBEAM01__x28_Great_Room_x29_"),
    "6a20045863e5c726b6f37abc": ("6a1ff0ecd3d3113ee5e4b084", "OPT_CODE_FIREADD001"),
    "6a20045863e5c726b6f37abe": ("6a1ff0ecd3d3113ee5e4b084", "OPT_CODE_RTREATPM01"),
    "6a20045863e5c726b6f37ac0": ("6a1ff0ecd3d3113ee5e4b084", "OPT_CODE_CEILBEAM01__x28_Primary_Bedroom_x29_"),
    "6a20045863e5c726b6f37ac2": ("6a1ff0ecd3d3113ee5e4b084", "OPT_CODE_FIREPLODR1"),
    # The Willow
    "6a20045863e5c726b6f37ac4": ("6a1ff02dd3d3113ee5e4193c", "OPT_CODE_EXTCVPT01"),
    "6a20045863e5c726b6f37ac6": ("6a1ff02dd3d3113ee5e4193c", "OPT_CODE_FIREADD001"),
    "6a20045863e5c726b6f37ac8": ("6a1ff02dd3d3113ee5e4193c", "OPT_CODE_CEILBEAM01"),
    "6a2005e90c69de11c2892fc3": ("6a1ff02dd3d3113ee5e4193c", "OPT_CODE_ADDLOFT001"),
    "6a2005e90c69de11c2892fc5": ("6a1ff02dd3d3113ee5e4193c", "OPT_CODE_DECKCVD001"),
    "6a2005e90c69de11c2892fc7": ("6a1ff02dd3d3113ee5e4193c", "OPT_CODE_BEDBATH001"),
    "6a2005e90c69de11c2892fc9": ("6a1ff02dd3d3113ee5e4193c", "OPT_CODE_CEILBEAM01"),
    # The Vista
    "6a20045863e5c726b6f37aca": ("6a1ff02dd3d3113ee5e4193e", "OPT_CODE_PREPKIT001"),
    "6a20045863e5c726b6f37acc": ("6a1ff02dd3d3113ee5e4193e", "OPT_CODE_ADDWINERM1"),
    "6a20045863e5c726b6f37ace": ("6a1ff02dd3d3113ee5e4193e", "OPT_CODE_EXTCVPT02"),
    "6a20045863e5c726b6f37ad0": ("6a1ff02dd3d3113ee5e4193e", "OPT_CODE_FIREADD001"),
    "6a2005e90c69de11c2892fcb": ("6a1ff02dd3d3113ee5e4193e", "OPT_CODE_EXTCLST001"),
    "6a2005e90c69de11c2892fcd": ("6a1ff02dd3d3113ee5e4193e", "OPT_CODE_BEDBATH001"),
    "6a2005e90c69de11c2892fcf": (
        "6a1ff02dd3d3113ee5e4193e",
        "OPT_CODE_CEILBEAM01_x28_FOR_EXT._PRIMARY_BED_AND_CLOSET_x29_",
    ),
    # The Ambrose
    "6a20045863e5c726b6f37ad2": ("6a1ff02dd3d3113ee5e41940", "OPT_CODE_PREPKIT001"),
    "6a20045863e5c726b6f37ad4": ("6a1ff02dd3d3113ee5e41940", "OPT_CODE_ELEVATOR01"),
    "6a2005e90c69de11c2892fd1": ("6a1ff02dd3d3113ee5e41940", "OPT_CODE_BEDBATH001"),
    "6a2005e90c69de11c2892fd3": ("6a1ff02dd3d3113ee5e41940", "OPT_CODE_EXTCLST001"),
    "6a2005e90c69de11c2892fd5": (
        "6a1ff02dd3d3113ee5e41940",
        "OPT_CODE_CEILBEAM01__x28_primary_bedroom_x29_",
    ),
    "6a2005e90c69de11c2892fd7": ("6a1ff02dd3d3113ee5e41940", "OPT_CODE_ELEVATOR01"),
    # The Alder
    "6a2005e90c69de11c2892fbb": ("6a1ff02dd3d3113ee5e41942", "OPT_CODE_CEILBEAM01_FOR_GREAT_ROOM"),
    "6a2005e90c69de11c2892fbd": ("6a1ff02dd3d3113ee5e41942", "OPT_CODE_FIREADD001"),
    "6a2005e90c69de11c2892fbf": ("6a1ff02dd3d3113ee5e41942", "OPT_CODE_CEILBEAM01"),
    "6a2005e90c69de11c2892fc1": ("6a1ff02dd3d3113ee5e41942", "OPT_CODE_LFT2BED001"),
}
FIRST_TAB = "b9b3ff6995dad6233446a190085a3d1a"
SECOND_TAB = "9abe51351fba65d0cbbd595e60bfc221"


def svg_matches_tab(svg: Path, tab: str | None) -> bool:
    name = svg.name.lower()
    if tab == FIRST_TAB:
        return "second" not in name
    if tab == SECOND_TAB:
        return "second" in name
    return True


OPT_OPEN_RE = re.compile(r'(<g id="(OPT_CODE[^"]+)")([^>]*)(>)', re.I)


def tag_svg(path: Path, opt_ids: set[str]) -> list[str]:
    text = path.read_text(encoding="utf-8")
    changed: list[str] = []

    def repl(match: re.Match[str]) -> str:
        prefix, oid, attrs, close = match.group(1), match.group(2), match.group(3), match.group(4)
        if oid not in opt_ids:
            return match.group(0)
        if 'data-attribute="feature"' in attrs:
            return match.group(0)
        changed.append(oid)
        return f'{prefix}{attrs} data-attribute="feature"{close}'

    new_text = OPT_OPEN_RE.sub(repl, text)
    if changed:
        path.write_text(new_text, encoding="utf-8", newline="\n")
    return changed


def main() -> None:
    with FEATURES_CACHE.open(encoding="utf-8") as f:
        items = json.load(f)["result"]["items"]
    tab_by_cms = {it["id"]: it["fieldData"].get("tab") for it in items}

    files_to_tag: dict[Path, set[str]] = {}

    for cms_id, (plan_id, oid) in FEATURE_MAP.items():
        folder = PLAN_FOLDERS[plan_id]
        plan_dir = SVG_ROOT / folder
        if not plan_dir.is_dir():
            print(f"WARNING: missing folder {plan_dir}")
            continue

        tab = tab_by_cms.get(cms_id)
        found = False
        for svg in plan_dir.glob("*.svg"):
            if not svg_matches_tab(svg, tab):
                continue
            text = svg.read_text(encoding="utf-8")
            if f'id="{oid}"' not in text:
                continue
            files_to_tag.setdefault(svg, set()).add(oid)
            found = True
        if not found:
            print(f"WARNING: {oid} not found in {folder} for tab {tab} (cms {cms_id})")

    print("=== SVG updates ===")
    for svg, oids in sorted(files_to_tag.items(), key=lambda x: str(x[0])):
        tagged = tag_svg(svg, oids)
        rel = svg.relative_to(ROOT)
        print(f"{rel}: tagged {len(tagged)} -> {', '.join(tagged)}")

    cms_updates = []
    for it in items:
        cms_id = it["id"]
        if cms_id not in FEATURE_MAP:
            continue
        fd = dict(it["fieldData"])
        _, opt_id = FEATURE_MAP[cms_id]
        fd["feature"] = opt_id
        cms_updates.append({"id": cms_id, "fieldData": fd})

    out = ROOT / "scripts" / "palisade-cms-updates.json"
    out.write_text(json.dumps(cms_updates, indent=2), encoding="utf-8")
    print(f"\nWrote {len(cms_updates)} CMS updates to {out.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
