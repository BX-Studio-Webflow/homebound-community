import json
import re
from collections import Counter
from pathlib import Path

input_root = Path(__file__).resolve().parent.parent / "src/example-assets/input"
config = json.loads(
    (Path(__file__).resolve().parent / "exterior-asset-structure.config.json").read_text()
)

expected = {s["folder"]: [sch["number"] for sch in s["schemes"]] for s in config["styles"]}
expected_names = {
    s["folder"]: {sch["number"]: sch["name"] for sch in s["schemes"]} for s in config["styles"]
}

issues = []
summary = []
sch_re = re.compile(r"^Sch (\d+) - (.+)\.(jpg|jpeg|png|webp)$", re.I)

for plan in [p["folder"] for p in config["plans"]]:
    plan_dir = input_root / plan
    if not plan_dir.exists():
        issues.append(f"MISSING PLAN FOLDER: {plan}")
        continue

    for style in config["styles"]:
        style_dir = plan_dir / style["folder"]
        if not style_dir.exists():
            issues.append(f"MISSING STYLE FOLDER: {plan} / {style['folder']}")
            continue

        files = [f for f in style_dir.iterdir() if f.is_file() and f.name != "UPLOAD_HERE.txt"]
        parsed = []
        for f in files:
            m = sch_re.match(f.name)
            if not m:
                issues.append(f"BAD FILENAME: {f.relative_to(input_root)}")
                continue
            num, name, ext = int(m.group(1)), m.group(2), m.group(3).lower()
            parsed.append((num, name, ext, f.name))

        exp_set = set(expected[style["folder"]])
        found_set = set(n for n, _, _, _ in parsed)
        missing = sorted(exp_set - found_set)
        extra = sorted(found_set - exp_set)

        for num, name, _, fname in parsed:
            canon = expected_names[style["folder"]].get(num)
            if canon and name != canon:
                issues.append(
                    f'NAME MISMATCH Sch{num}: {plan}/{style["folder"]} has "{name}" expected "{canon}" ({fname})'
                )

        for num, count in Counter(n for n, _, _, _ in parsed).items():
            if count > 1:
                dups = [x[3] for x in parsed if x[0] == num]
                issues.append(f"DUPLICATE Sch{num}: {plan}/{style['folder']} -> {dups}")

        summary.append(
            {
                "plan": plan,
                "style": style["folder"],
                "count": len(files),
                "expected_count": len(expected[style["folder"]]),
                "missing": missing,
                "extra": extra,
                "exts": sorted(set(ext for _, _, ext, _ in parsed)),
            }
        )

print("=== COVERAGE BY PLAN/STYLE ===")
for s in summary:
    flag = " ***" if s["missing"] or s["extra"] or s["count"] != s["expected_count"] else ""
    print(
        f"{s['plan']:14} | {s['style']:22} | files={s['count']:2} expected={s['expected_count']:2} "
        f"missing={s['missing']} extra={s['extra']}{flag}"
    )

print("\n=== ALL ISSUES ===")
if not issues:
    print("(none from filename/coverage checks)")
else:
    for i in issues:
        print(i)
    print(f"\nTotal issues: {len(issues)}")

print("\n=== SCH 1 EXTRAS (not in live dropdown) ===")
for s in summary:
    if 1 in s["extra"]:
        print(f"  {s['plan']} / {s['style']} — Sch 1 present; dropdown starts at Sch 2")

print("\n=== FILE FORMAT OUTLIERS ===")
for s in summary:
    if s["exts"] != ["jpg"]:
        print(f"  {s['plan']} / {s['style']}: {s['exts']}")
