import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const interiorRoot = path.join(root, 'src/example-assets/Mosaic/interiors-webp-update-01');
const exteriorRoot = path.join(root, 'src/example-assets/Mosaic/exteriors-webp-update-01');
const outputPath = 'scripts/mosaic-house-plan-gallery-local-payload.json';

const plans = {
  addison: { name: 'The Addison', slug: 'the-addison---mosaic', cmsId: '6a0649dcd98c04735a2b1e82', cmsLocaleId: '653ad118e882f528b3fb31c4', marketingIdentifier: 'The Addison - Mosaic' },
  bandera: { name: 'The Bandera', slug: 'the-bandera---mosaic', cmsId: '6a064a5a6994a7137e4af69f', cmsLocaleId: '653ad118e882f528b3fb31c4', marketingIdentifier: 'The Bandera - Mosaic' },
  collin: { name: 'The Collin', slug: 'the-collin---mosaic', cmsId: '6a064a9f431685331343181c', cmsLocaleId: '653ad118e882f528b3fb31c4', marketingIdentifier: 'The Collin - Mosaic' },
  grayson: { name: 'The Grayson', slug: 'the-grayson---mosaic', cmsId: '6a064afbeb0dcbf979299768', cmsLocaleId: '653ad118e882f528b3fb31c4', marketingIdentifier: 'The Grayson - Mosaic' },
  magnolia: { name: 'The Magnolia', slug: 'the-magnolia---mosaic', cmsId: '6a064b30973a44428b4def2c', cmsLocaleId: '653ad118e882f528b3fb31c4', marketingIdentifier: 'The Magnolia - Mosaic' },
};

const packageFolders = ['Transitional Natural', 'Modern Edge', 'Casual Organic'];
const rooms = ['Kitchen', 'Great Room', 'Primary Bedroom', 'Primary Bathroom'];
const styles = ['Modern Cape Dutch', 'Transitional', 'Modern Tudor'];
const schemeNames = {
  'Modern Cape Dutch': ['Everest', 'Urbane Bronze', 'Iron Ore', 'Pure White', 'Felted Wool'],
  Transitional: ['Newport', 'Iron Ore', 'Caprock', 'Alabaster', 'Worldly Gray'],
  'Modern Tudor': ['Colonnade Gray', 'Coral Gray', 'Greenblack', 'Felted Wool', 'Altitude Gray'],
};

const relative = (file) => path.relative(root, file).replaceAll('\\', '/');
const localAsset = (file, kind, plan, category) => ({
  kind,
  plan,
  category,
  file: relative(file),
  fileName: path.basename(file),
});

function filesIn(folder) {
  return fs.readdirSync(folder, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.toLowerCase().endsWith('.webp'))
    .map((entry) => path.join(folder, entry.name));
}

const missing = [];
const payload = {};
for (const [planKey, plan] of Object.entries(plans)) {
  const exterior = [];
  for (const style of styles) {
    const folder = path.join(exteriorRoot, plan.name, style);
    const byScheme = filesIn(folder);
    for (let scheme = 1; scheme <= 5; scheme += 1) {
      const expected = `${style} Color Scheme ${scheme} ${schemeNames[style][scheme - 1]}`;
      const file = byScheme.find((candidate) => path.basename(candidate).includes(expected));
      if (file) exterior.push(localAsset(file, 'exterior', planKey, `${style} Scheme ${scheme}`));
      else missing.push(`exterior/${planKey}/${style}/scheme-${scheme}`);
    }
  }

  const interior = [];
  const interiorSelection = packageFolders.flatMap((pkg, index) =>
    rooms.slice(0, index === 0 ? 4 : 3).map((room) => [pkg, room])
  );
  for (const [pkg, room] of interiorSelection) {
    const file = path.join(interiorRoot, `Interior - ${plan.name}`, pkg, `${room}.webp`);
    if (fs.existsSync(file)) interior.push(localAsset(file, 'interior', planKey, `${pkg} / ${room}`));
    else missing.push(`interior/${planKey}/${pkg}/${room}`);
  }

  payload[planKey] = {
    cms: { id: plan.cmsId, cmsLocaleId: plan.cmsLocaleId, name: plan.name, slug: plan.slug, marketingIdentifier: plan.marketingIdentifier },
    totals: { exterior: exterior.length, interior: interior.length, total: exterior.length + interior.length },
    photoGallery: [...exterior, ...interior],
  };
}

const total = Object.values(payload).reduce((sum, plan) => sum + plan.photoGallery.length, 0);
fs.writeFileSync(outputPath, `${JSON.stringify({ generatedLocally: true, optimizedFormat: 'webp', targetPerPlan: 25, exteriorPerPlan: 15, interiorPerPlan: 10, missing, totalAssets: total, plans: payload }, null, 2)}\n`);
console.log(`Wrote ${outputPath}: ${Object.keys(payload).length} plans, ${total} assets, ${missing.length} missing.`);
if (missing.length) console.log(missing.join('\n'));
