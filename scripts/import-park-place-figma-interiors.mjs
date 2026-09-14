import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const assetRoot = path.join(root, 'src', 'example-assets', 'Park Place', 'interiors');
const rooms = [
  ['Kitchen', 'kitchen-interior'],
  ['Great Room', 'living-interior'],
  ['Primary Bedroom', 'bedroom-interior'],
  ['Primary Bathroom', 'bathroom-interior'],
];
const packages = [
  ['Transitional Natural', 'pos-1'],
  ['Modern Edge', 'pos-2'],
  ['Casual Organic', 'pos-3'],
];
const plans = [
  {
    name: 'The Addison', sectionId: '87:6347', assets: [
      ['1731aa33-6231-4be0-ab6f-7a0b8e23fbd6', 'png'], ['2ce92d34-af0f-4800-9fb1-95b0fa8f7044', 'png'], ['56596ff7-7052-4720-b815-600c0462779a', 'png'], ['b7275673-37d0-4e60-a574-f31f73c2b840', 'png'],
      ['ce09b105-83cf-45b9-aae4-32ac19afa0c6', 'jpeg'], ['5ed2976e-da11-4dae-8445-3c66aacc93c0', 'jpeg'], ['3efda6e4-2013-420c-bdb7-96c9cb59fac0', 'jpeg'], ['57724b3c-c47e-4f06-a404-223c77768b4b', 'jpeg'],
      ['56dccdb4-a12a-42ac-8437-eabbe04bc400', 'png'], ['fdf1fec6-2c27-4d67-b74d-c065efa3b136', 'png'], ['867b19b5-da16-48c2-8a75-a1a6306c41c7', 'png'], ['63386830-83bd-47c1-bd9e-8ff79f91f18c', 'png'],
    ],
  },
  {
    name: 'The Bandera', sectionId: '87:7867', assets: [
      ['0bb69afb-9368-4e6b-bd6b-b502562fc65d', 'jpeg'], ['d91392b7-ba94-4142-b855-c8053fe8871b', 'jpeg'], ['61f9f08b-a1ff-4d78-bd25-bef6b1a0c0fe', 'jpeg'], ['0483b94e-23d1-4994-a0f8-6139ac2a04a5', 'jpeg'],
      ['4d68a803-cc54-4f86-9186-d051665f64ad', 'png'], ['a37e9beb-df3f-4ace-8d82-df9eb493d4cd', 'png'], ['76e05bc6-0ecb-4c1f-89ea-ab699e66ad3f', 'png'], ['f0ed9fe8-dbc0-4d5d-9e56-16e5eebb2147', 'png'],
      ['c8201548-b4bd-4a79-bc69-834cab94108c', 'png'], ['061cdd59-d0a2-4a11-8b4b-6b2b3eeb80f7', 'png'], ['b22ab33b-7179-4b6e-a191-dbc44cda2991', 'png'], ['2d3f1038-b08e-4660-8774-ba1d3e1ab312', 'png'],
    ],
  },
  {
    name: 'The Collin', sectionId: '87:9173', assets: [
      ['d4e3f698-9776-443b-9ec0-277f553c97b0', 'png'], ['e842ab39-7ee5-4028-aad5-af73f8a71d7d', 'png'], ['8fa8c4f0-7e1f-48b2-a477-148f7fed045e', 'png'], ['802ea739-9242-41ef-ae65-f1d74016694a', 'png'],
      ['d1da216a-8687-4faa-8c2a-e2c5c1d47912', 'jpeg'], ['522f7878-13ba-4a26-972b-5eee4c4af34d', 'jpeg'], ['81b3fa96-d089-4bf6-ac46-a86660d1eb31', 'jpeg'], ['25a6f0e1-5323-4e1c-9b67-f23406f07d4d', 'jpeg'],
      ['d3d079d6-5ba2-42cb-b32b-04fbd1ed4d1b', 'png'], ['6ac87f92-3df9-402e-ab2e-69143b00908c', 'png'], ['d0b320a6-cea4-4845-8755-9c266cb6c407', 'png'], ['cdf171dc-16d4-4a51-9c6c-d96505d17b6b', 'png'],
    ],
  },
  {
    name: 'The Grayson', sectionId: '87:10427', assets: [
      ['d3c6b2de-0987-434f-8be5-4fdacde8f595', 'jpeg'], ['e8bf35c2-c180-4a26-8ee7-cf5e75372fb6', 'jpeg'], ['58c2bdc5-89b6-40ad-ae02-8b83b51792ae', 'jpeg'], ['cb4b9683-9bde-486a-b71c-68e5f8018f24', 'jpeg'],
      ['fb732764-d07a-4a18-8df9-bc0d942cec44', 'png'], ['335e3e73-40b8-4d74-bbfe-22631eaed0d8', 'png'], ['409c45cc-110e-475c-a8b9-eef3384a93bd', 'png'], ['669a3528-c5da-4fe3-94e6-f1536c5edc21', 'png'],
      ['eb9c07fa-92fb-4968-bb8e-465d42e21887', 'png'], ['3a963220-7bd8-4a02-ae5f-aa5fc304936b', 'png'], ['5e950828-3665-476a-bb78-416a327b0bcc', 'png'], ['fcde155e-3a28-4aa0-819f-9442591c3ab3', 'png'],
    ],
  },
  {
    name: 'The Magnolia', sectionId: '87:11720', assets: [
      ['5c5bc647-8fe5-476b-aeea-6d5bed47b3bd', 'png'], ['5dd7530f-57cf-4ec0-9d4a-feb2722f0999', 'png'], ['31d58953-b3c7-49d7-951d-7bc0ff3b608a', 'png'], ['76a17c76-658d-4bd1-9ad1-4bc8b158ed9e', 'png'],
      ['17d72ade-4bca-4482-a57e-8e9cbcc161cc', 'png'], ['0e2d933c-aa9c-45dc-8cb6-65127cd67446', 'png'], ['ec1ab6e4-6a84-45dd-a283-85b001f2dec0', 'jpeg'], ['cf168882-bd33-4122-8ac0-877e4d13b826', 'png'],
      ['02554b5e-a7a7-4228-93a7-03640036a6c7', 'png'], ['5294edf6-66f3-47b3-ab75-c9d4b2a6e9e3', 'png'], ['96c32c34-aad0-4d6e-bff6-4a13dd579c42', 'png'], ['3da94f29-596b-4977-ab41-802a7f62f946', 'png'],
    ],
  },
];

const manifest = [];
for (const plan of plans) {
  for (let packageIndex = 0; packageIndex < packages.length; packageIndex += 1) {
    const [packageName, schemeToken] = packages[packageIndex];
    for (let roomIndex = 0; roomIndex < rooms.length; roomIndex += 1) {
      const [roomName, roomKey] = rooms[roomIndex];
      const [assetId, format] = plan.assets[packageIndex * rooms.length + roomIndex];
      const filename = `_update_01_${roomName}.${format}`;
      const relativePath = path.join(`Interior - ${plan.name}`, packageName, filename);
      const destination = path.join(assetRoot, relativePath);
      const url = `https://www.figma.com/api/mcp/asset/${assetId}`;
      await fs.mkdir(path.dirname(destination), { recursive: true });
      const response = await fetch(url);
      if (!response.ok) throw new Error(`${response.status} ${response.statusText}: ${url}`);
      await fs.writeFile(destination, Buffer.from(await response.arrayBuffer()));
      manifest.push({ plan: plan.name, figmaSectionId: plan.sectionId, packageName, schemeToken, roomName, roomKey, sourceAssetId: assetId, file: path.relative(root, destination).replaceAll('\\', '/'), webflowFolder: `Interiors - Park Place / Interior - ${plan.name} / ${packageName}` });
    }
  }
}

const manifestPath = path.join(root, 'scripts', 'park-place-figma-interior-upload-manifest.json');
await fs.writeFile(manifestPath, `${JSON.stringify({ sourceFileKey: 'OaKtXegzG6NfBXvYNaffG8', items: manifest }, null, 2)}\n`);
console.log(`Imported ${manifest.length} Park Place interior room layers.`);