/**
 * Lists Palisade interior room subfolders that should be deleted in Webflow
 * (flat package folders — images upload directly into Coastal Cottage, etc.)
 *
 * Run with Designer MCP connected:
 *   node scripts/list-palisade-room-folders-to-delete.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const config = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'interior-asset-structure.config.json'), 'utf8')
);

const ROOM_NAMES = new Set(['Great Room', 'Kitchen', 'Primary Bathroom', 'Primary Bedroom']);
const PACKAGE_NAMES = new Set(
  config.plans.flatMap((plan) => plan.packages)
);

/** Package folder IDs created under Interiors - Palisade */
const PACKAGE_FOLDER_IDS = new Set([
  '6a23deb32ac8266de48a8dcf',
  '6a23deb49238ab0bbd4ae97d',
  '6a23deb454dbb1a98a89bbdb',
  '6a23deb5da8906173d2b3385',
  '6a23deb580eb9363711a64fd',
  '6a23deb5da8906173d2b339f',
  '6a23deb6078636196293f46d',
  '6a23deb6ce0f59637d0c3bdb',
  '6a23deb79193bf39371d5d18',
  '6a23deb8f6d40c97f0536d03',
  '6a23deb857b8638eb24f4f97',
  '6a23deb93546e70bdf7f480a',
  '6a23deb987aa71f7de71e37d',
  '6a23deb9fb74c69c172bb54b',
  '6a23deba8ef0cd3e84825b96',
  '6a23debabeb1853c81336b81',
  '6a23debbf67452b10ce2f0f5',
  '6a23debbf6d40c97f0536d48',
]);

/** Room subfolder IDs created under those packages (delete in Webflow UI) */
export const ROOM_FOLDER_IDS_TO_DELETE = [
  '6a23dec3f6d40c97f0536e25',
  '6a23dec3587d8591d7e24d62',
  '6a23dec4fb74c69c172bb676',
  '6a23dec487aa71f7de71e477',
  '6a23dec545841096e85468e7',
  '6a23dec58ef0cd3e84825c74',
  '6a23dec55e851946a9f45e71',
  '6a23dec6d3cdf3ce98546577',
  '6a23dec640b7d2894d856bdb',
  '6a23dec7f9cbac0dbfb7417d',
  '6a23dec7226293d1ead29cea',
  '6a23dec82c253b9e5ee5d979',
  '6a23dec8d4c8e03752b33102',
  '6a23dec9078636196293f5bf',
  '6a23dec9a5fda1afab049252',
  '6a23deca9577a06c5367a4fa',
  '6a23deca9577a06c5367a517',
  '6a23decaa18d5d024d7d6cc0',
  '6a23decb8c5a4b90b434a30c',
  '6a23decb3546e70bdf7f4c00',
  '6a23deccf67452b10ce2f3c6',
  '6a23decc096ce423ace59743',
  '6a23decde0095abe093d2785',
  '6a23decd80eb9363711a6c19',
  '6a23ded987aa71f7de71e836',
  '6a23ded9368827f3fc0e7660',
  '6a23dedaa18d5d024d7d6e3a',
  '6a23deda40b7d2894d856e03',
  '6a23deda610853fe389fdec6',
  '6a23dedb9193bf39371d6099',
  '6a23dedbe0095abe093d297a',
  '6a23dedca1d5666226f17256',
  '6a23dedcfb74c69c172bb843',
  '6a23dedcd4c8e03752b33341',
  '6a23deddf67452b10ce2f563',
  '6a23dedea1d5666226f1728a',
  '6a23deddf67452b10ce2f554',
  '6a23dede8c5a4b90b434a740',
  '6a23dede68a817bc50838e62',
  '6a23dedf45841096e8546cc6',
  '6a23dedf10db1a130af1c834',
  '6a23dedfde20611e2fd4e2da',
  '6a23dee0d3cdf3ce98546842',
  '6a23dee1ce0f59637d0c40eb',
  '6a23dee245841096e8546d72',
  '6a23dee3587d8591d7e25122',
  '6a23dee4a1d5666226f17319',
  '6a23dee5a1d5666226f17333',
  '6a23dee5f9cbac0dbfb744ee',
  '6a23dee6f9cbac0dbfb74501',
  '6a23dee668a817bc50839367',
  '6a23dee73546e70bdf7f4f9a',
  '6a23dee0f68980a89731c86d',
  '6a23dee1226293d1ead29fb1',
  '6a23dee292c518a59f7064a4',
  '6a23dee39193bf39371d6274',
  '6a23dee42c253b9e5ee5dca2',
  '6a23dee4a18d5d024d7d6f47',
  '6a23dee5da8906173d2b388f',
  '6a23dee62c253b9e5ee5dcdd',
  '6a23dee6fdbf5bd9fbeb4268',
  '6a23dee77389bd93e6bad880',
  '6a23dee8f68980a89731c969',
  '6a23dee89401d162eb3a6e53',
  '6a23dee8a98c22a3006f2906',
  '6a23dee999e19a404a363f5e',
  '6a23dee9a1d5666226f173dd',
  '6a23deea2ac8266de48a958f',
  '6a23deea5fb5517249c72928',
  '6a23deeb8ef0cd3e84826021',
  '6a23deebfb74c69c172bba49',
  '6a23deeb40b7d2894d8570ab',
];

const outPath = path.join(__dirname, 'palisade-room-folders-to-delete.json');
fs.writeFileSync(
  outPath,
  `${JSON.stringify(
    {
      note: 'Delete these empty room subfolders in Webflow Assets (MCP has no delete_folder). Upload images directly into package folders.',
      count: ROOM_FOLDER_IDS_TO_DELETE.length,
      roomNames: [...ROOM_NAMES],
      packageFolderIds: [...PACKAGE_FOLDER_IDS],
      packageNames: [...PACKAGE_NAMES],
      folderIds: ROOM_FOLDER_IDS_TO_DELETE,
    },
    null,
    2
  )}\n`,
  'utf8'
);

console.log(`Wrote ${outPath} (${ROOM_FOLDER_IDS_TO_DELETE.length} folders to delete in Webflow UI)`);
