import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const assetRoot = path.join(root, 'src', 'example-assets', 'Mosaic', 'exteriors');
const styles = [
    { name: 'Modern Cape Dutch', key: 'capeDutch', schemes: ['Everest', 'Urbane Bronze', 'Iron Ore', 'Pure White', 'Felted Wool'] },
    { name: 'Transitional', key: 'transitional', schemes: ['Newport', 'Iron Ore', 'Caprock', 'Alabaster', 'Worldly Gray'] },
    { name: 'Modern Tudor', key: 'tudor', schemes: ['Colonnade Gray', 'Coral Gray', 'Greenblack', 'Felted Wool', 'Altitude Gray'] },
];

const plans = [
    { name: 'The Addison', sectionId: '83:2486', assets: ['7c2b30cc-1cce-4529-ba40-431600638c38', '28a7d681-5fc5-472e-a0f2-8f85f357921b', '1520d48f-badb-44cb-8ac6-eef0e682ff2f', '55c5c6cd-5e14-4f1b-8ac8-bc7f70e0cfd7', '03d6015a-2181-4524-ada4-43f69f2724d2', '8f014b0a-7fda-40cf-a7c4-29a6eca09764', '3d291eb1-c13d-4885-9820-846ac28a7a5f', '34810dc9-8cb4-4e44-907e-86723a7e8737', '49d34364-b4ea-4c0e-9808-093ce7fc5f2a', 'f93331f1-1fb0-4260-a36f-2d28051f3e20', '7282dfa6-bd36-438d-bc64-fee76afadd26', 'fce1e576-62ac-4183-bff3-8c6ab188c65a', 'e2b6b2e7-a032-4296-9b33-1b3854a67829', '3739a002-81fc-4fe7-b629-f08397c9bc6a', '67fca4e0-96de-4c70-a8a7-0b9efa2b8f53'] },
    { name: 'The Bandera', sectionId: '83:3532', assets: ['045bc9b2-cd9c-4e25-9e83-4d3b6d480276', 'e80eb0cf-68e3-49e1-aea7-8ba70e8ae7a1', 'bea550cb-ddb1-48f0-9bf5-0e76baa8e0ba', '1986e62f-af01-4d5a-875f-1fc49bdaaa7a', 'e09b260b-4150-453c-b054-16635d69cdf4', 'da25c689-388d-44fc-8c8b-2b62606c790c', '03f07f04-5d7b-4fec-be85-76958992ac7e', '5180ed11-203e-48d7-b4cf-dfacde31f4bd', 'bb2df6e1-d840-4edd-9082-a6150dcb5960', '4896cd1f-49ef-407b-a9bd-558b18d9ab7e', '62316dc3-a59d-499e-8da7-56a7dfa65e91', 'fd9c48bc-7d5b-4d1d-aa0a-8dcc1a5d5d49', 'caf454f7-cdbd-4323-91d6-71733fe07fd1', '7951f938-4581-4cdd-8770-c98dd7b30ffc', 'd67fde91-a737-4e58-826e-d5b18cfc4c06'] },
    { name: 'The Collin', sectionId: '83:4838', assets: ['2cd79e34-1b02-4070-a1bb-6abd31755633', '9fafbd93-163e-4741-8478-dbd776ca9333', '8410c2ac-3f24-4261-8c5c-264878f222ad', '0e3f7e62-a03a-4951-9464-22c16501ef01', 'f5e2898b-6da3-4ae8-acd1-fbea5ae9fd71', 'db4c49c6-39be-4251-b43d-aa473c58a751', '0a127e16-7318-46af-a9f9-f3d3bed94bed', '6e62e701-7dbc-405e-bafd-8bbe74c9a36d', '8c204df6-999b-4ced-801a-e6d6183b6375', '8af05815-1c47-4268-a4d2-136b2ad55e41', 'a64c3d4e-5ce5-49c8-9b2e-ee1509456191', '99deaa94-7825-4829-8980-508302c5d56e', 'd2ae9885-b9f7-4cc6-860c-1c4a57435f6b', '15c0ad9a-897a-4e4d-b891-4483e91b8de5', '4d33eb71-0538-4bba-8491-cb8540435747'] },
    { name: 'The Grayson', sectionId: '83:6092', assets: ['98cff98d-34a6-43c0-aaaa-3ff4af6fcb64', 'a35eaf2e-5d20-47e1-b3ab-271403fc9baa', '11fa7b41-54e5-4cfc-b879-71257c032210', '7043cbc7-d5d6-4334-ac0c-c768bdbe6bc4', '86e9385b-bf81-40bc-978b-e07e927a285a', '7b0a4548-7482-4b83-a65d-3dd2a0c77dd7', 'a1c0f196-7006-468f-9ac1-594134c5f4e2', 'e5068164-7344-4b6a-b493-f4731acd4d91', '8a958dae-7896-4fdb-a294-7025a23481b6', '3c0f3b88-3939-4016-80a7-2dda28035724', 'fc6796eb-af64-4bd5-9c2c-c11b5d208b3a', 'fb597193-f47d-49d8-9077-300856c052c4', '99ecb272-399c-470c-8a44-8573bbebb58c', 'c60616df-6dc5-4058-93a8-3ef44546c735', 'b860dff7-f187-4d88-b870-44b7049994aa'] },
    { name: 'The Magnolia', sectionId: '83:7385', assets: ['d05b5d96-ade1-4ace-a383-405392570a2b', 'e909b787-e858-4c9b-9109-b4e4b08c2db9', '4e25d3f2-47cb-4de2-a9bb-76cade43a8d5', '1d4152f5-9cd9-40cb-8882-db02c4d0bf57', 'f53f250d-9326-4cb1-94c5-e1e4cbf9c69d', '840cd4f3-dcbd-4876-aee1-ec8c5464dde0', '13807e2c-6160-47f4-8948-9ce57ce7db10', '54ba0e47-9333-452a-af39-1e206d59dc6d', '428e01f5-bc82-4dd3-a33a-b16c1e2eed33', '5f37d826-b9aa-4635-9c6f-92609b79f95d', 'f4c8befc-c6ed-4e1a-9941-25b33363ff29', '9222500e-495a-4b45-91f5-350d9063bb9a', '22b20ab3-dea3-44b9-841b-3d0002507f32', '0f190730-e5ec-4e22-9630-4fb469c92c3f', 'd50738dd-f5f7-4ba0-908d-0e3381b390bf'] },
];

const manifest = [];
for (const plan of plans) {
    for (let schemeIndex = 0; schemeIndex < 5; schemeIndex += 1) {
        for (let styleIndex = 0; styleIndex < styles.length; styleIndex += 1) {
            const style = styles[styleIndex];
            const schemeNumber = schemeIndex + 1;
            const schemeName = style.schemes[schemeIndex];
            const assetId = plan.assets[schemeIndex * styles.length + styleIndex];
            const filename = `${style.name} Color Scheme ${schemeNumber} ${schemeName}.png`;
            const destination = path.join(assetRoot, plan.name, style.name, filename);
            const response = await fetch(`https://www.figma.com/api/mcp/asset/${assetId}.png`);
            if (!response.ok) throw new Error(`${response.status} ${response.statusText}: ${assetId}`);
            await fs.mkdir(path.dirname(destination), { recursive: true });
            await fs.writeFile(destination, Buffer.from(await response.arrayBuffer()));
            manifest.push({
                plan: plan.name,
                figmaSectionId: plan.sectionId,
                style: style.name,
                styleKey: style.key,
                schemeNumber,
                schemeName,
                sourceAssetId: assetId,
                file: path.relative(root, destination).replaceAll('\\', '/'),
                webflowFolder: `Exterior Styles - Mosaic / ${plan.name} / ${style.name}`,
            });
        }
    }
}

const manifestPath = path.join(root, 'scripts', 'mosaic-figma-exterior-upload-manifest.json');
await fs.writeFile(manifestPath, `${JSON.stringify({ sourceFileKey: 'OaKtXegzG6NfBXvYNaffG8', items: manifest }, null, 2)}\n`);
console.log(`Imported ${manifest.length} Mosaic exterior layers.`);