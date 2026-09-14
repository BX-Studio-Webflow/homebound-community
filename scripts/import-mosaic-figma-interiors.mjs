import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const assetRoot = path.join(root, 'src', 'example-assets', 'Mosaic', 'interiors');
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
        name: 'The Addison',
        sectionId: '83:2399',
        assets: [
            ['d71da732-52a8-4bd9-b2e0-023ef33ebcc8', 'png'], ['c98fb778-a4e1-4264-b77d-4ee9d2669569', 'png'], ['1f1a9118-be13-4a9d-91c2-0926801e7cf5', 'png'], ['2f63aed5-fc79-43a3-ab0e-447fa96e814f', 'png'],
            ['2fd21795-084f-4146-8396-726f5f18c905', 'jpeg'], ['ac047f37-3d75-4f2f-a7eb-599c5c276a3a', 'jpeg'], ['225f484c-dbde-4372-bb97-852c9b12eb81', 'jpeg'], ['c2738ba1-d087-4d25-950e-0f1e27c576a7', 'jpeg'],
            ['aa7fdd79-d167-4577-a708-683615b902cc', 'png'], ['288dc330-cef7-475b-82a4-816638f226ed', 'png'], ['a69271e5-dcd4-4e32-916d-fb3314ad3093', 'png'], ['51f0ee14-c281-43c2-820a-2ef057c19150', 'png'],
        ],
    },
    {
        name: 'The Bandera',
        sectionId: '83:3445',
        assets: [
            ['6ecb5ce7-0e42-444a-b9b6-cf9ca5c1ecb9', 'jpeg'], ['df63b85f-99f8-48f1-aea9-24db1c32d8de', 'jpeg'], ['6129535d-63b0-47b7-a5f5-43beddcc1a42', 'jpeg'], ['d16f0312-d39c-4d76-9e99-14e4462633f2', 'jpeg'],
            ['4feeffbc-c132-4fc8-8a6b-12216b3f598d', 'png'], ['8d385035-8d9c-41e5-acf6-7fb5db9858a7', 'png'], ['0b2dd511-59b8-43f4-8bd3-247daaa4141b', 'png'], ['baf00e39-0b37-475d-8b71-d4d407395cb9', 'png'],
            ['bfc579a5-1704-4243-bf57-fb350e8e37c4', 'png'], ['f9bd1d65-3659-43c0-9c83-56a1cc331e17', 'png'], ['f10b1304-ea85-4ec4-82fc-180f90466d90', 'png'], ['f0ef8a88-81a0-4369-8e98-d6382f4c6060', 'png'],
        ],
    },
    {
        name: 'The Collin',
        sectionId: '83:4751',
        assets: [
            ['f1464ad1-8131-4c48-8613-491f515e9340', 'png'], ['8127d16a-9ce6-4618-a250-5293bb892a01', 'png'], ['68058a7b-4041-4dff-a9a5-93482e1fb8b3', 'png'], ['a2499fea-c30e-46b0-8760-2c9197cf22f0', 'png'],
            ['2f075bd9-dbf0-429f-b0d2-25d719db8c8f', 'jpeg'], ['0f58fdca-7446-4dbe-b4e5-360d326ba4c8', 'jpeg'], ['c0e8fb9b-0609-4dc3-8550-6250f3cd41c5', 'jpeg'], ['25e0b168-fb93-4b2e-a9ee-55d7c0b49d18', 'jpeg'],
            ['1e3370ae-2bd5-4c19-b1d7-5fc777a57efc', 'png'], ['3e6a0999-69f7-4554-a070-262c11a7e885', 'png'], ['3c06f7e0-e2fb-4548-bb43-7e792c30fa8b', 'png'], ['fabdba8b-7e27-4c9c-b1ce-23d806678d80', 'png'],
        ],
    },
    {
        name: 'The Grayson',
        sectionId: '83:6005',
        assets: [
            ['fc2262f2-e838-4b11-a1ec-7406e451cd80', 'jpeg'], ['efe9aaf4-f3de-447e-91d5-70d6c112ec1b', 'jpeg'], ['c93c72ea-471a-460b-925c-a00764b9d85f', 'jpeg'], ['0cd59a44-b99c-4d74-a5ce-6d24e360876f', 'jpeg'],
            ['c094dc22-6384-4d35-b742-db8c093b399b', 'png'], ['655a3567-e3b1-4ee1-84a8-1e3935579a98', 'png'], ['5359d21a-ec0d-4e19-991f-7442ba648d5d', 'png'], ['7f03bce2-09d0-4928-9941-8b7371fdafc1', 'png'],
            ['f89506ca-4d8a-48b3-bb0e-70862169b654', 'png'], ['d4221f8d-f397-42e1-a0dc-cb00b440da33', 'png'], ['996d5df2-e66b-41e9-8c84-7de290519e76', 'png'], ['56c62c25-01af-4187-8ac0-2756c449372f', 'png'],
        ],
    },
    {
        name: 'The Magnolia',
        sectionId: '83:7298',
        assets: [
            ['112b3242-01ba-49ad-ad4b-a6cdbb64787b', 'png'], ['159dd703-37d0-4b14-be4b-3eca467d01e7', 'png'], ['8550aedf-c8ec-4b43-bc37-19439027c05c', 'png'], ['66348297-7255-4e9d-b58d-8b06fad2f768', 'png'],
            ['7f023336-74a8-4ba6-a648-9b0d7519f692', 'png'], ['9248e6de-b343-4923-b8d9-a9b286af4863', 'png'], ['5c11443d-5e77-4742-8c5d-365f08195cfd', 'jpeg'], ['8b65fa31-3991-41e4-a19a-ba44f9bc32e3', 'png'],
            ['6e83fa44-5da9-4819-b891-918c7f0531c7', 'png'], ['3b05f53a-155e-4151-8210-343b9f0d0357', 'png'], ['d000e402-18ce-4724-b996-d0134e804c45', 'png'], ['84332679-c4df-4fa3-9eac-d1cd81b72d48', 'png'],
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
            const filename = `${roomName}.${format}`;
            const relativePath = path.join(`Interior - ${plan.name}`, packageName, filename);
            const destination = path.join(assetRoot, relativePath);
            const url = `https://www.figma.com/api/mcp/asset/${assetId}`;

            await fs.mkdir(path.dirname(destination), { recursive: true });
            const response = await fetch(url);
            if (!response.ok) throw new Error(`${response.status} ${response.statusText}: ${url}`);
            await fs.writeFile(destination, Buffer.from(await response.arrayBuffer()));

            manifest.push({
                plan: plan.name,
                figmaSectionId: plan.sectionId,
                packageName,
                schemeToken,
                roomName,
                roomKey,
                sourceAssetId: assetId,
                file: path.relative(root, destination).replaceAll('\\', '/'),
                webflowFolder: `Interiors - Mosaic / Interior - ${plan.name} / ${packageName}`,
            });
        }
    }
}

const manifestPath = path.join(root, 'scripts', 'mosaic-figma-interior-upload-manifest.json');
await fs.writeFile(manifestPath, `${JSON.stringify({ sourceFileKey: 'OaKtXegzG6NfBXvYNaffG8', items: manifest }, null, 2)}\n`);
console.log(`Imported ${manifest.length} Mosaic interior room layers.`);