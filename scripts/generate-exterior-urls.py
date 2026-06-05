import json
import re
from pathlib import Path

ASSETS_FILE = Path(
    r"C:\Users\kipla\.cursor\projects\c-Users-kipla-projects-homebound-community\agent-tools\8f298466-b8cc-484a-9c0b-3a7a493fc6fd.txt"
)
CONFIG_FILE = Path(__file__).resolve().parent / "exterior-asset-structure.config.json"

FOLDER_TO_PLAN_STYLE = {
    "6a22da450231dc3c4fc514fb": ("glenview", "Spanish Contemporary"),
    "6a22da46265bb7802238e2f6": ("glenview", "Transitional Ranch"),
    "6a22da46637097c67104dd22": ("glenview", "Coastal Colonial"),
    "6a22da471874f921350b104d": ("glenview", "English Cottage"),
    "6a22da476f6790ba108f2394": ("elm", "Spanish Contemporary"),
    "6a22da4894a607e299d9822e": ("elm", "Transitional Ranch"),
    "6a22da48a4f1d3230ac5d87a": ("elm", "Coastal Colonial"),
    "6a22da48e8450cb26529ad01": ("elm", "English Cottage"),
    "6a22da49c7334f5e9533b4f2": ("willow", "Spanish Contemporary"),
    "6a22da49a4f1d3230ac5d904": ("willow", "Transitional Ranch"),
    "6a22da4a457bb0fd2a3834e8": ("willow", "Coastal Colonial"),
    "6a22da4aa553e27ab7537a66": ("willow", "English Cottage"),
    "6a22da4a84d8f798153954ae": ("vista", "Spanish Contemporary"),
    "6a22da4b598dc996ca64393e": ("vista", "Transitional Ranch"),
    "6a22da4b047178e0d8ab1e07": ("vista", "Coastal Colonial"),
    "6a22da4c2292b2134c3f17eb": ("vista", "English Cottage"),
    "6a22da4c100bbd0118cfcebd": ("ambrose", "Spanish Contemporary"),
    "6a22da4d9b0f504ec7b838a8": ("ambrose", "Transitional Ranch"),
    "6a22da4d280604b61b8beb22": ("ambrose", "Coastal Colonial"),
    "6a22da4d1874f921350b1202": ("ambrose", "English Cottage"),
    "6a22da4e1874f921350b121e": ("alder", "Spanish Contemporary"),
    "6a22da4e1d89d731cedfbfab": ("alder", "Transitional Ranch"),
    "6a22da4f44cd163ecc3c5e62": ("alder", "Coastal Colonial"),
    "6a22da4f602fb01b69e4fa03": ("alder", "English Cottage"),
}

STYLE_KEYS = {
    "Spanish Contemporary": "spanishContemporary",
    "Transitional Ranch": "transitionalRanch",
    "Coastal Colonial": "coastalColonial",
    "English Cottage": "englishCottage",
}

config = json.loads(CONFIG_FILE.read_text())
scheme_order = {
    s["folder"]: [sch["number"] for sch in s["schemes"]] for s in config["styles"]
}
scheme_names = {
    s["folder"]: {sch["number"]: sch["name"] for sch in s["schemes"]} for s in config["styles"]
}

data = json.loads(ASSETS_FILE.read_text())
assets = data[0]["data"]["assets"]

urls: dict[str, dict[str, dict[int, str]]] = {
    p["slug"]: {STYLE_KEYS[s["folder"]]: {} for s in config["styles"]} for p in config["plans"]
}

sch_re = re.compile(r"^Sch\s*(\d+)\s*-\s*(.+)$", re.I)

for asset in assets:
    parent = asset.get("assetParentFolderInfo") or {}
    folder_id = parent.get("id")
    if folder_id not in FOLDER_TO_PLAN_STYLE:
        continue

    plan_slug, style_folder = FOLDER_TO_PLAN_STYLE[folder_id]
    style_key = STYLE_KEYS[style_folder]
    m = sch_re.match(Path(asset["name"]).stem)
    if not m:
        print(f"SKIP unparseable: {plan_slug}/{style_folder} -> {asset['name']}")
        continue

    number = int(m.group(1))
    name = m.group(2).strip()
    expected = scheme_names[style_folder].get(number)
    if expected and name.lower() != expected.lower():
        print(f"WARN name mismatch Sch{number}: got '{name}' expected '{expected}' ({plan_slug}/{style_folder})")

    urls[plan_slug][style_key][number] = asset["url"]

missing = []
for plan in config["plans"]:
    slug = plan["slug"]
    for style in config["styles"]:
        style_key = STYLE_KEYS[style["folder"]]
        for num in scheme_order[style["folder"]]:
            if num not in urls[slug][style_key]:
                missing.append(f"{slug}/{style_key}/Sch{num}")

print("\n=== MISSING ===")
if missing:
    for m in missing:
        print(m)
else:
    print("(none)")

print("\n=== GENERATED TS ===")
lines = ["const NEW_COMMUNITY_EXTERIOR_IMAGE_URLS = {"]
for plan in config["plans"]:
    slug = plan["slug"]
    lines.append(f"  {slug}: {{")
    for style in config["styles"]:
        style_key = STYLE_KEYS[style["folder"]]
        lines.append(f"    {style_key}: [")
        for num in scheme_order[style["folder"]]:
            url = urls[slug][style_key].get(num, "")
            lines.append(f"      '{url}',")
        lines.append("    ],")
    lines.append("  },")
lines.append("} as const satisfies Record<NewCommunityPlanSlug, Record<NewCommunityStyleKey, string[]>>;")
print("\n".join(lines))

out = Path(__file__).resolve().parent / "generated-exterior-urls.ts.txt"
out.write_text("\n".join(lines), encoding="utf-8")
print(f"\nWrote {out}")
