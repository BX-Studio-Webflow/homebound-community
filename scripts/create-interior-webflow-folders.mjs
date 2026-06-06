import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const config = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'interior-asset-structure.config.json'), 'utf8')
);

const webflowPlanFolder = (planFolder) => `Interior - ${planFolder}`;

function buildTreeLines() {
  const lines = [`${config.webflow.rootFolderName}/`];

  for (const plan of config.plans) {
    lines.push(`├── ${webflowPlanFolder(plan.folder)}/`);
    const pkgNames = plan.packages;
    pkgNames.forEach((pkg, pkgIndex) => {
      const prefix = pkgIndex === pkgNames.length - 1 ? '└──' : '├──';
      lines.push(`│   ${prefix} ${pkg}/  (4 images here, no room subfolders)`);
    });
  }

  return lines;
}

function buildPhaseActions(parentKey, folders, labelPrefix) {
  return folders.map((name) => ({
    label: `${labelPrefix}-${name.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}`,
    create_folder: {
      name,
      parent_folder_id: `<${parentKey}>`,
    },
  }));
}

const output = {
  siteId: config.webflow.siteId,
  designerMcpUrl: config.webflow.designerMcpUrl,
  note:
    'Palisade interiors use flat package folders. Upload kitchen.png, great room.png, primary bedroom.png, and primary bathroom.png directly inside each package folder. Delete any Great Room / Kitchen / Primary Bathroom / Primary Bedroom subfolders if they were created earlier.',
  localFilenames: config.localFilenames,
  totals: {
    rootFolders: 1,
    planFolders: config.plans.length,
    packageFolders: config.plans.reduce((sum, plan) => sum + plan.packages.length, 0),
  },
  tree: buildTreeLines(),
  phase1_rootFolder: [
    {
      label: 'root-interiors-palisade',
      create_folder: {
        name: config.webflow.rootFolderName,
      },
    },
  ],
  phase2_planFolders: buildPhaseActions(
    'INTERIORS_PALISADE_ROOT_ID',
    config.plans.map((plan) => webflowPlanFolder(plan.folder)),
    'plan'
  ),
  phase3_packageFoldersTemplate: config.plans.flatMap((plan) =>
    buildPhaseActions(
      `${plan.slug.toUpperCase()}_PLAN_FOLDER_ID`,
      plan.packages,
      `${plan.slug}-pkg`
    )
  ),
};

const outPath = path.join(__dirname, 'webflow-interior-folder-actions.json');
fs.writeFileSync(outPath, `${JSON.stringify(output, null, 2)}\n`, 'utf8');

console.log(`Wrote ${outPath}`);
console.log('');
console.log(`Open Designer MCP: ${config.webflow.designerMcpUrl}`);
console.log('');
console.log('Folder tree (Webflow asset panel):');
for (const line of output.tree) {
  console.log(line);
}
console.log('');
console.log(
  `Totals: 1 root + ${output.totals.planFolders} plans + ${output.totals.packageFolders} packages = ${
    1 + output.totals.planFolders + output.totals.packageFolders
  } folders`
);
