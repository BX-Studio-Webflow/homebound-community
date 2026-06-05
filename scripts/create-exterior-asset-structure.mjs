import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');
const config = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'exterior-asset-structure.config.json'), 'utf8')
);

const exteriorRoot = path.join(repoRoot, 'src', 'example-assets', 'exteriors', 'Exterior Styles');
const inputRoot = path.join(repoRoot, 'src', 'example-assets', 'input');

function schemeFilename(scheme) {
  const number = scheme.number ?? 1;
  return `Sch ${number} - ${scheme.name}.jpg`;
}

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function writeManifest(dirPath, lines) {
  fs.writeFileSync(path.join(dirPath, 'UPLOAD_HERE.txt'), `${lines.join('\n')}\n`, 'utf8');
}

function buildManifestLines(plan, style) {
  const lines = [
    `Webflow path: Exterior Styles / ${plan.folder} / ${style.folder}`,
    `Slide attribute: exterior-style="${plan.slug}-${style.slugSuffix}"`,
    '',
    'Drop one image per line (use scheme name as filename, .jpg or .webp):',
  ];

  style.schemes.forEach((scheme, index) => {
    lines.push(`${index + 1}. ${schemeFilename(scheme)}`);
  });

  return lines;
}

function ensurePlanStyleFolders(rootDir, plan, writeManifestFile) {
  const planDir = path.join(rootDir, plan.folder);
  ensureDir(planDir);

  for (const style of config.styles) {
    const styleDir = path.join(planDir, style.folder);
    ensureDir(styleDir);
    if (writeManifestFile) {
      writeManifest(styleDir, buildManifestLines(plan, style));
    }
  }
}

const readmeSections = [];
const webflowActions = [];

for (const plan of config.plans) {
  ensurePlanStyleFolders(exteriorRoot, plan, true);
  ensurePlanStyleFolders(inputRoot, plan, true);

  readmeSections.push(`### ${plan.folder}`);
  readmeSections.push('');
  readmeSections.push(`- URL: \`/house-plans/${plan.folder.toLowerCase().replace(/ /g, '-')}\``);
  readmeSections.push(`- Code slug: \`${plan.slug}\``);
  readmeSections.push('');

  webflowActions.push({
    label: `plan-${plan.slug}`,
    create_folder: {
      name: plan.folder,
      parent_folder_id: config.webflow.exteriorStylesFolderId,
    },
  });

  for (const style of config.styles) {
    readmeSections.push(`#### ${plan.folder} → ${style.folder}`);
    readmeSections.push('');
    readmeSections.push('| Upload order | Filename | Scheme label |');
    readmeSections.push('| --- | --- | --- |');
    style.schemes.forEach((scheme, index) => {
      readmeSections.push(
        `| ${index + 1} | \`${schemeFilename(scheme)}\` | Scheme ${scheme.number}: ${scheme.name} |`
      );
    });
    readmeSections.push('');
  }
}

const readme = `# Exterior asset upload guide (6 new house plans)

Local folders under \`src/example-assets/input/\` and \`src/example-assets/exteriors/\` mirror the Webflow Asset panel structure.
Name each file after its scheme (e.g. \`Abbey Iron.jpg\`), drop into the matching style folder, then upload to the same path in Webflow.

## Webflow folder tree

\`\`\`
Exterior Styles
├── The Glenview
│   ├── Spanish Contemporary      (5 images — Schemes 1–5)
│   ├── Transitional Ranch        (5 images — Schemes 1–5)
│   ├── Coastal Colonial          (4 images — Schemes 2–5 only)
│   └── English Cottage           (4 images — Schemes 2–5 only)
├── The Elm
├── The Willow
├── The Vista
├── The Ambrose
└── The Alder
\`\`\`

**18 images per plan · 108 images total**

## After upload

1. Copy each asset CDN URL from Webflow (in the same order as \`UPLOAD_HERE.txt\`).
2. Paste into \`src/utils/exterior-scheme-modal.ts\` inside \`buildNewCommunityExteriors('<slug>')\` for the matching style array.
3. Rebuild and deploy the script bundle.
4. QA each staging URL (scheme dropdown labels + image swap + gallery lightbox).

## Filename convention

Use the scheme number and name: \`Sch 1 - Sunlit Ivory.jpg\`, \`Sch 2 - Abbey Iron.jpg\`, etc.

## Auto-create folders in Webflow

Open the [Webflow Designer MCP link](${config.webflow.designerMcpUrl}) (Designer tab in foreground), then ask Cursor to run the \`asset_tool\` batch in \`scripts/webflow-exterior-folder-actions.json\`.

Parent folder: **Exterior Styles** (\`${config.webflow.exteriorStylesFolderId}\`).

---

${readmeSections.join('\n')}
`;

fs.writeFileSync(path.join(exteriorRoot, '..', 'README.md'), readme, 'utf8');

const inputReadme = `# Exterior input folders (6 house plans)

Prepare images here, then upload to the matching folder in Webflow (**Exterior Styles**).

\`\`\`
input/
├── The Glenview/
│   ├── Spanish Contemporary/     ← 5 files
│   ├── Transitional Ranch/         ← 5 files
│   ├── Coastal Colonial/           ← 4 files (Schemes 2–5)
│   └── English Cottage/            ← 4 files (Schemes 2–5)
├── The Elm/          (images ready)
├── The Willow/
├── The Vista/
├── The Ambrose/
└── The Alder/        (images ready)
\`\`\`

Each style folder has \`UPLOAD_HERE.txt\` listing expected filenames (scheme names only).

**Workflow:** drop files → upload to Webflow → copy CDN URLs into \`exterior-scheme-modal.ts\`.
`;

fs.writeFileSync(path.join(inputRoot, 'README.md'), inputReadme, 'utf8');

const webflowManifest = {
  siteId: config.webflow.siteId,
  note: 'Run via Webflow Designer MCP asset_tool. Create plan folders first, then re-fetch folder IDs and create style subfolders.',
  phase1_planFolders: webflowActions,
  phase2_styleFoldersTemplate: config.plans.flatMap((plan) =>
    config.styles.map((style) => ({
      label: `${plan.slug}-${style.slugSuffix}`,
      create_folder: {
        name: style.folder,
        parent_folder_id: `<PARENT_ID_FOR_${plan.folder}>`,
      },
    }))
  ),
};

fs.writeFileSync(
  path.join(__dirname, 'webflow-exterior-folder-actions.json'),
  JSON.stringify(webflowManifest, null, 2),
  'utf8'
);

console.log(`Created/updated folders under:\n  ${exteriorRoot}\n  ${inputRoot}`);
console.log(`Wrote README: ${path.join(exteriorRoot, '..', 'README.md')}`);
console.log(`Wrote README: ${path.join(inputRoot, 'README.md')}`);
console.log(`Wrote Webflow MCP manifest: ${path.join(__dirname, 'webflow-exterior-folder-actions.json')}`);
