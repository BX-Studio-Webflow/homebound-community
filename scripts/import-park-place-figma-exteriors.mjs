import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const assetRoot = path.join(root, 'src', 'example-assets', 'Park Place', 'exteriors');
const styles = [
    { name: 'Modern Cape Dutch', key: 'capeDutch', schemes: ['Everest', 'Urbane Bronze', 'Iron Ore', 'Pure White', 'Felted Wool'] },
    { name: 'Transitional', key: 'transitional', schemes: ['Newport', 'Iron Ore', 'Caprock', 'Alabaster', 'Worldly Gray'] },
    { name: 'Modern Tudor', key: 'tudor', schemes: ['Colonnade Gray', 'Coral Gray', 'Greenblack', 'Felted Wool', 'Altitude Gray'] },
];
const plans = [
    { name: 'The Addison', sectionId: '87:6434', assets: ['c7da205e-9534-4d08-af8b-5a4012dad33d', 'd41f2d73-06ee-42ae-bd67-fdffd95a8541', '4de29819-d101-4cb8-8ab0-9f8ca5fe79da', '14652cd8-7e87-448e-a1c1-04f0dbac5654', '65f9f0e0-14a9-4a63-adb9-170e4615d0aa', 'a771dcf2-c93b-4626-9697-baf647b65554', '4050bcd1-a9ff-4bbb-bc92-5d7a994bd5cd', '054c589a-a438-4b69-97d4-390200f89338', 'f645279b-4912-4b48-b14b-41abc3fbdd93', 'ac4ee6d1-7ae4-4c40-ba7d-2cbfa7a3738a', '2c51c8ce-675c-4dc6-a08e-3e483397e3cb', 'e3fe272d-56a8-45df-b0c6-e430fb54961b', '7c28c759-5247-4af4-be96-c7ee1d4724b4', '513dc088-8ee0-4a86-bd87-9e7441e5b549', 'fce0f2b4-f6fe-4df2-a38a-ffbb23143f03'] },
    { name: 'The Bandera', sectionId: '87:7954', assets: ['eb5a23a7-bcbf-45c9-9ec6-9498f1305dec', '4616b83b-f45c-44d3-a757-4a5cae4edbd5', '61676032-4e6e-4386-ac7a-0b43ebe34ab5', 'f04c5f82-87be-46dc-b5cd-35c6185f2c63', 'dc763bca-0361-4075-8a14-29720e9cd291', 'c403a62a-2e42-4c07-b7ec-c70c1db3bfaa', '2afacbde-62ce-464f-90ac-dc9e58311ceb', 'a1fde6a0-f5d8-44f2-b151-9fb1664edbc8', '64dfe19a-76ff-432d-9372-4ecb6e12e390', '1318d8f9-8340-4275-89e4-13da378f2617', '506085c4-0027-45f2-ab26-6136b5b6f867', '6b65e792-b718-4edc-b2fc-6bfb2dc51e3c', '4d61043c-f7b6-4f10-9d26-2b1cfa3c139c', '597ff02f-e127-4ab2-aa7e-2e3a52ddf138', 'c15b4bdd-b23f-4ae6-9746-5fc606d0eb94'] },
    { name: 'The Collin', sectionId: '87:9260', assets: ['ffd85d79-6e9f-4d94-ba3e-dbc959073fe0', '03b6b730-525e-4c54-91dd-776fcc06c4a4', '726d68fe-6324-442b-ab13-1cd898e38b4b', '047c5bff-8fb6-43d1-850d-610c1c56301e', '14aefb8c-81f2-4fc2-8df6-d70c3c44bb9e', 'fb0b9c82-595a-4f32-9b0d-6495b5a429fe', 'c19ba33a-b964-4f65-8d1d-9a931681272d', '0113efa9-8e82-4169-b53a-12f53d33f23c', '8738e423-f3fa-4308-8f69-30160ba8530a', '7a6a205b-99fb-48c8-86b9-b5ff3186bfe9', '326549ee-c90c-4f71-83e6-57ce09aeca2c', '0b51842c-def5-4972-af87-ae8c56b11832', '17e85dad-5c69-4c68-9188-ecf58eb42285', 'eb4be93a-ab56-46a3-aa9e-29c75db636c3', '8cb1e244-3ca0-400c-847a-2b2fb085a290'] },
    { name: 'The Grayson', sectionId: '87:10514', assets: ['83e0c73d-719d-4b57-ac6a-d044d090607f', '5b538c8d-18b7-42cb-bc46-5064dcb20106', '5eea0805-dd30-4982-a024-66ed041149b6', '61f53d28-e4b6-4f11-bf7c-0cee15ec3e52', '7e8677f5-85ee-452d-b2ca-86aaff4308ae', '8d9760c0-aa73-4828-84ed-ea85862ce60e', '0f4d9f1b-098f-4b8e-8d25-d285adc392c7', '4203e3cb-2f17-4650-bb04-7ac530fc53b1', '8557999c-ca5b-4a3f-9686-2b270793bd0e', '9a43f078-f81d-443e-90a6-a5df98cf1548', 'f7dca5ac-a0a5-48b1-b172-8df8efec17a4', 'e5ff5ac5-d8f8-4262-be5c-0fe08447c5ce', 'c6597d73-9eb5-4d6b-bbdd-6b91006021f3', 'b398df78-b99b-4225-a184-a7d3d9078515', 'dd8804d5-d31d-42d9-bf62-8c1042f8a8e0'] },
    { name: 'The Magnolia', sectionId: '87:11807', assets: ['649f3f5c-378b-4839-8bfb-2fb8762c6a10', 'd637b597-42d1-4514-ba61-86a561302f89', 'd153a6c8-3935-45fd-979d-d1145905d4e4', 'c83196a6-232e-4917-a04e-1c3408ca1220', '9d3ef521-c241-4cb1-a43e-234976229198', '00ada26b-5809-44dc-8330-c3ee95aa1033', 'a7a73b15-ed83-4542-8803-04f4d183fd30', '7adc5eb5-0809-4ffa-81ba-bde9143b2182', '915d5eb9-2013-49e9-b6f8-7742cc0f3daf', 'e2bdb43a-e0cd-4cd7-995f-9d65042bf84c', '87a8cd97-362f-4bb2-8acd-d580046cf19d', 'e65d6208-d897-48ed-8840-f4cf2b7d31c8', '569173f4-1d36-4da7-ab49-73dd17145650', '52e6c9bf-9619-47a9-a792-58045c2b9f49', '3ad0fd15-ce5a-46a0-b913-0a39ffdce352'] },
];

const manifest = [];
for (const plan of plans) {
    for (let schemeIndex = 0; schemeIndex < 5; schemeIndex += 1) {
        for (let styleIndex = 0; styleIndex < styles.length; styleIndex += 1) {
            const style = styles[styleIndex];
            const schemeNumber = schemeIndex + 1;
            const schemeName = style.schemes[schemeIndex];
            const assetId = plan.assets[schemeIndex * styles.length + styleIndex];
            const filename = `_update_01_${style.name} Color Scheme ${schemeNumber} ${schemeName}.jpeg`;
            const destination = path.join(assetRoot, plan.name, style.name, filename);
            const url = `https://www.figma.com/api/mcp/asset/${assetId}`;
            await fs.mkdir(path.dirname(destination), { recursive: true });
            const response = await fetch(url);
            if (!response.ok) throw new Error(`${response.status} ${response.statusText}: ${url}`);
            await fs.writeFile(destination, Buffer.from(await response.arrayBuffer()));
            manifest.push({ plan: plan.name, figmaSectionId: plan.sectionId, style: style.name, styleKey: style.key, schemeNumber, schemeName, sourceAssetId: assetId, file: path.relative(root, destination).replaceAll('\\', '/'), webflowFolder: `Exterior Styles / ${plan.name} / ${style.name}` });
        }
    }
}

const manifestPath = path.join(root, 'scripts', 'park-place-figma-exterior-upload-manifest.json');
await fs.writeFile(manifestPath, `${JSON.stringify({ sourceFileKey: 'OaKtXegzG6NfBXvYNaffG8', items: manifest }, null, 2)}\n`);
console.log(`Imported ${manifest.length} Park Place exterior layers.`);