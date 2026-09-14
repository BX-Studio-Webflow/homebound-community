import fs from 'node:fs';

const localPayload = JSON.parse(fs.readFileSync('scripts/mosaic-house-plan-gallery-local-payload.json', 'utf8'));
const webflowAssets = JSON.parse(fs.readFileSync('scripts/webflow-community-image-urls.json', 'utf8').replace(/^\uFEFF/, ''));
const uploaded = webflowAssets.filter((asset) => asset.size > 0 && asset.hostedUrl);
const mosaicInteriorFolders = new Set([
    '6aa7bbb371017e4594ba6566', '6aa7bbb4b249a16d949a66c1', '6aa7bbb42f359475e0538734',
    '6aa7bbb49dfd010afc5c8ed3', '6aa7bbb5476bba996c24fdc6', '6aa7bbb5de3954e67fe22db1',
    '6aa7bbb59dfd010afc5c8f4c', '6aa7bbb5b249a16d949a6771', '6aa7bbb59dfd010afc5c8f8d',
    '6aa7bbb6d4089533ae5a33f5', '6aa7bbb6bf87107ec7bfae27', '6aa7bbb6d3c3e4d661fa5616',
    '6aa7bbb631b9bc9655495db8', '6aa7bbb766d633681bc3cfa0', '6aa7bbb866d633681bc3d007',
]);
const mosaicInteriorFolderByPlanPackage = {
    'addison|Transitional Natural': '6aa7bbb371017e4594ba6566',
    'addison|Modern Edge': '6aa7bbb4b249a16d949a66c1',
    'addison|Casual Organic': '6aa7bbb42f359475e0538734',
    'bandera|Transitional Natural': '6aa7bbb49dfd010afc5c8ed3',
    'bandera|Modern Edge': '6aa7bbb5476bba996c24fdc6',
    'bandera|Casual Organic': '6aa7bbb5de3954e67fe22db1',
    'collin|Transitional Natural': '6aa7bbb59dfd010afc5c8f4c',
    'collin|Modern Edge': '6aa7bbb5b249a16d949a6771',
    'collin|Casual Organic': '6aa7bbb59dfd010afc5c8f8d',
    'grayson|Transitional Natural': '6aa7bbb6d4089533ae5a33f5',
    'grayson|Modern Edge': '6aa7bbb6bf87107ec7bfae27',
    'grayson|Casual Organic': '6aa7bbb6d3c3e4d661fa5616',
    'magnolia|Transitional Natural': '6aa7bbb631b9bc9655495db8',
    'magnolia|Modern Edge': '6aa7bbb766d633681bc3cfa0',
    'magnolia|Casual Organic': '6aa7bbb866d633681bc3d007',
};
const mosaicExteriorFolders = new Set([
    '6aa7bbb831b9bc9655495e57', '6aa7bbb846f5137a8963167b', '6aa7bbb99dfd010afc5c9139',
    '6aa7bbb99dfd010afc5c917c', '6aa7bbb9bf87107ec7bfb2c3', '6aa7bbbcde3954e67fe235d6',
    '6aa7bbbce6511bf076dee733', '6aa7bbbcbf87107ec7bfb4ef', '6aa7bbbc84cc8049ba407fb5',
    '6aa7bbbd9c28a51441b9f61b', '6aa7bbc35b11a64241eb32f7', '6aa7bbbe31b9bc9655495ffa',
    '6aa7bbbe878cdde0c54d4ccf', '6aa7bbbea6b50fcc35b81976', '6aa7bbbe878cdde0c54d4d03',
]);
const mosaicExteriorFolderByPlanStyle = {
    'addison|Modern Cape Dutch': '6aa7bbb831b9bc9655495e57',
    'addison|Transitional': '6aa7bbb846f5137a8963167b',
    'addison|Modern Tudor': '6aa7bbb99dfd010afc5c9139',
    'bandera|Modern Cape Dutch': '6aa7bbb99dfd010afc5c917c',
    'bandera|Transitional': '6aa7bbb9bf87107ec7bfb2c3',
    'bandera|Modern Tudor': '6aa7bbbcde3954e67fe235d6',
    'collin|Modern Cape Dutch': '6aa7bbbce6511bf076dee733',
    'collin|Transitional': '6aa7bbbcbf87107ec7bfb4ef',
    'collin|Modern Tudor': '6aa7bbbc84cc8049ba407fb5',
    'grayson|Modern Cape Dutch': '6aa7bbbd9c28a51441b9f61b',
    'grayson|Transitional': '6aa7bbc35b11a64241eb32f7',
    'grayson|Modern Tudor': '6aa7bbbe31b9bc9655495ffa',
    'magnolia|Modern Cape Dutch': '6aa7bbbe878cdde0c54d4ccf',
    'magnolia|Transitional': '6aa7bbbea6b50fcc35b81976',
    'magnolia|Modern Tudor': '6aa7bbbe878cdde0c54d4d03',
};
const plans = {};
const missing = [];

for (const [planKey, plan] of Object.entries(localPayload.plans)) {
    const photoGallery = [];
    for (const item of plan.photoGallery) {
        const expectedName = item.fileName.replace(/^_update_01_/, '');
        const categoryPackage = item.kind === 'interior' ? item.category.split(' / ')[0] : null;
        const categoryStyle = item.kind === 'exterior' ? item.category.replace(/ Scheme \d+$/, '') : null;
        const targetFolder = item.kind === 'interior'
            ? mosaicInteriorFolderByPlanPackage[`${planKey}|${categoryPackage}`]
            : mosaicExteriorFolderByPlanStyle[`${planKey}|${categoryStyle}`];
        const asset = uploaded.find((candidate) =>
            candidate.folderId === targetFolder &&
            candidate.displayName === expectedName && candidate.hostedUrl
        );
        if (!asset) {
            missing.push(`${planKey}/${item.kind}/${item.category}/${item.fileName}`);
            continue;
        }
        photoGallery.push({ fileId: asset.id, url: asset.hostedUrl, alt: null });
    }
    plans[planKey] = {
        cms: plan.cms,
        fieldData: { 'photo-gallery': photoGallery },
        totals: { selected: plan.photoGallery.length, uploaded: photoGallery.length },
    };
}

const output = { generatedFromLocalCuration: true, missing, plans };
fs.writeFileSync('scripts/mosaic-house-plan-gallery-cms-payload.json', `${JSON.stringify(output, null, 2)}\n`);
console.log(`Wrote CMS payload: ${Object.keys(plans).length} plans, ${missing.length} missing assets.`);
if (missing.length) console.log(missing.join('\n'));
