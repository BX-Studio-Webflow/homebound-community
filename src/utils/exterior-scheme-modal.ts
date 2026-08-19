interface ExteriorColorScheme {
  schemeNumber: number;
  name: string;
  imageUrl: string;
}

interface ExteriorDefinition {
  style: string;
  slug: string;
  colorSchemes: ExteriorColorScheme[];
}

export type HousePlanSlug =
  | 'echo'
  | 'merrick'
  | 'chaney'
  | 'loma'
  | 'sycamore'
  | 'glenview'
  | 'elm'
  | 'willow'
  | 'vista'
  | 'ambrose'
  | 'alder'
  | 'studio-adu'
  | 'carriage-house-adu'
  | 'two-story-adu'
  | 'addison'
  | 'bandera'
  | 'collin'
  | 'grayson'
  | 'magnolia';

type AltadenaHousePlanSlug = 'echo' | 'merrick' | 'chaney' | 'loma' | 'sycamore';
type NewCommunityPlanSlug =
  | 'glenview'
  | 'elm'
  | 'willow'
  | 'vista'
  | 'ambrose'
  | 'alder'
  | 'carriage-house-adu'
  | 'two-story-adu';
type StudioAduPlanSlug = 'studio-adu';

type NewCommunityStyleKey =
  | 'spanishContemporary'
  | 'transitionalRanch'
  | 'coastalColonial'
  | 'englishCottage';

const NEW_COMMUNITY_EXTERIOR_IMAGE_URLS: Record<
  NewCommunityPlanSlug,
  Record<NewCommunityStyleKey, readonly string[]>
> = {
  glenview: {
    spanishContemporary: [
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22eddb81b67658917d147c_Sch%201%20-%20Sunlit%20Ivory.webp',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22edd689113f6185fb81bc_Sch%202%20-%20Sandstone%20Villa.webp',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22edd72ba437a787a12c6e_Sch%203%20-%20Stone%20Garden.webp',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22edd765053904adda70f1_Sch%204%20-%20Sienna%20Stone.webp',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22edd754f23ca1aa66fd5c_Sch%205%20-%20Coastal%20Villa.webp',
    ],
    transitionalRanch: [
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22edeba8e815ef475c3e2c_Sch%201%20-%20White%20Oak%20Ranch.webp',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22edeb74297c1a3021d0b4_Sch%202%20-%20Midnight%20Ridge.webp',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22edebb734c9412a1851a1_Sch%203%20-%20Oakstone.webp',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22edea46c4dce897c622c0_Sch%204%20-%20White%20Mason.webp',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22edeaf11078832301af0d_Sch%205%20-%20Black%20Timber.webp',
    ],
    coastalColonial: [
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22edad32d82c66475aa7b2_Sch%201%20-%20Saltwood.webp',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22edac6e6422b45442464d_Sch%202%20-%20Stone%20Harbor.webp',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22edac9d58911e051d3fba_Sch%203%20-%20Seabreeze.webp',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22edac8f40d304dd481aec_Sch%204%20-%20Ivory%20%26%20Onyx.webp',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22edace365374d2b4c2c3f_Sch%205%20-%20Coastal%20Stone.webp',
    ],
    englishCottage: [
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22edbd63fae91f151fd9d0_Sch%201%20-%20Ivory%20Meadow.webp',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22edbe0c3370fb3e35ffaf_Sch%202%20-%20Abbey%20Iron.webp',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22edbea3771290396ed4df_Sch%203%20-%20Bronze%20Meadow.webp',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22edbef4494d74c17404a9_Sch%204%20-%20Manor%20Brick.webp',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22edbe2c42ef25e857568f_Sch%205%20-%20Chateau%20Stone.webp',
    ],
  },
  elm: {
    spanishContemporary: [
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22ecc8f3437fec84c633be_Sch%201%20-%20Sunlit%20Ivory.webp',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22ecc8f4494d74c17399e4_Sch%202%20-%20Sandstone%20Villa.webp',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22ecca2472a39b3cbd7498_Sch%203%20-%20Stone%20Garden.webp',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22eccaae1ca7e49161fbc8_Sch%204%20-%20Sienna%20Stone.webp',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22ecca872355c22f8eaadf_Sch%205%20-%20Coastal%20Villa.webp',
    ],
    transitionalRanch: [
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22ecac0c3370fb3e356423_Sch%201%20-%20White%20Oak%20Ranch.webp',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22ecac269d95cd19e0e026_Sch%202%20-%20Midnight%20Ridge.webp',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22ecacf110788323011ee1_Sch%203%20-%20Oakstone.webp',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22ecab55c9aaa9438a7a06_Sch%204%20-%20White%20Mason.webp',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22ecac08f434791bad029e_Sch%205%20-%20Black%20Timber.webp',
    ],
    coastalColonial: [
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22ec7f49422c2f9de17695_Sch%201%20-%20Saltwood.webp',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22ec7e9d58911e051c5dc8_Sch%202%20-%20Stone%20Harbor.webp',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22ec7f2472a39b3cbd5614_Sch%203%20-%20Seabreeze.webp',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22ec7e61f18799715386b8_Sch%204%20-%20Ivory%20%26%20Onyx.webp',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22ec7fb75aee6fe61ebf09_Sch%205%20-%20Coastal%20Stone.webp',
    ],
    englishCottage: [
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22ec8ff461c0c6633f96a1_Sch%201%20-%20Ivory%20Meadow.webp',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22ec90872355c22f8e89a8_Sch%202%20-%20Abbey%20Iron.webp',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22ec9061f1879971538dfd_Sch%203%20-%20Bronze%20Meadow.webp',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22ec9095a46fd82b1cb0b3_Sch%204%20-%20Manor%20Brick.webp',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22ec908f40d304dd4776a6_Sch%205%20-%20Chateau%20Stone.webp',
    ],
  },
  willow: {
    spanishContemporary: [
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22f0c220e6f459b8cc97fc_Sch%201%20-%20Sunlit%20Ivory.webp',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22f0c3679eea90bc21737e_Sch%202%20-%20Sandstone%20Villa.webp',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22f0c227f295bf102c73d9_Sch%203%20-%20Stone%20Garden.webp',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22f0c23b306ae798b2d5b7_Sch%204%20-%20Sienna%20Stone.webp',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22f0c207d8f3773f4fde0e_Sch%205%20-%20Coastal%20Villa.webp',
    ],
    transitionalRanch: [
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22f0e02f638a601d29fc82_Sch%201%20-%20White%20Oak%20Ranch.webp',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22f0e02d888efac45336f8_Sch%202%20-%20Midnight%20Ridge.webp',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22f0e0b734c9412a19d579_Sch%203%20-%20Oakstone.webp',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22f0e0cd6d5d498ce2e8ac_Sch%204%20-%20White%20Mason.webp',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22f0df57edcdcc3c089676_Sch%205%20-%20Black%20Timber.webp',
    ],
    coastalColonial: [
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22f085438168dc11d4e604_Sch%201%20-%20Saltwood.webp',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22f084544db6edddd13c4b_Sch%202%20-%20Stone%20Harbor.webp',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22f08420e6f459b8cc8171_Sch%203%20-%20Seabreeze.webp',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22f084ae64905f6a6340f6_Sch%204%20-%20Ivory%20%26%20Onyx.webp',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22f084f11078832302fea2_Sch%205%20-%20Coastal%20Stone.webp',
    ],
    englishCottage: [
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22f0a195a46fd82b1ec05a_Sch%201%20-%20Ivory%20Meadow.webp',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22f0a218fa7f2207b9e007_Sch%202%20-%20Abbey%20Iron.webp',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22f0a1a3771290397042a1_Sch%203%20-%20Bronze%20Meadow.webp',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22f0a1ae1ca7e491642775_Sch%204%20-%20Manor%20Brick.webp',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22f0a12d888efac453195c_Sch%205%20-%20Chateau%20Stone.webp',
    ],
  },
  vista: {
    spanishContemporary: [
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22f167939798a0c8459ed2_Sch%201%20-%20Sunlit%20Ivory.webp',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22f1666982be65b05567c0_Sch%202%20-%20Sandstone%20Villa.webp',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22f167f461c0c66341fa0d_Sch%203%20-%20Stone%20Garden.webp',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22f1672c42ef25e859297c_Sch%204%20-%20Sienna%20Stone.webp',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22f1664ff4597241d8f033_Sch%205%20-%20Coastal%20Villa.webp',
    ],
    transitionalRanch: [
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22f14f550f4fd0cf5a4561_Sch%201%20-%20White%20Oak%20Ranch.webp',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22f14e20e6f459b8ccc7ed_Sch%202%20-%20Midnight%20Ridge.webp',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22f14f52e0fbbd6afa96b4_Sch%203%20-%20Oakstone.webp',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22f14e32d82c66475c84c6_Sch%204%20-%20White%20Mason.webp',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22f14f4ff4597241d8e0f7_Sch%205%20-%20Black%20Timber.webp',
    ],
    coastalColonial: [
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22f1b72c42ef25e8594040_Sch%201%20-%20Saltwood.webp',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22f1b73b306ae798b3454e_Sch%202%20-%20Stone%20Harbor.webp',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22f1b7fccec2bd9f7f3bf0_Sch%203%20-%20Seabreeze.webp',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22f1b7f3437fec84c94c74_Sch%204%20-%20Ivory%20%26%20Onyx.webp',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22f1b75d778b0e1d343aec_Sch%205%20-%20Coastal%20Stone.webp',
    ],
    englishCottage: [
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22f19257edcdcc3c08ed63_Sch%201%20-%20Ivory%20Meadow.webp',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22f193475a005a81e89db1_Sch%202%20-%20Abbey%20Iron.webp',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22f1939619a764f4d5f48a_Sch%203%20-%20Bronze%20Meadow.webp',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22f1939ab120a2472fcc9b_Sch%204%20-%20Manor%20Brick.webp',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22f193f1107883230392a1_Sch%205%20-%20Chateau%20Stone.webp',
    ],
  },
  ambrose: {
    spanishContemporary: [
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22ed1e9d58911e051cc527_Sch%201%20-%20Sunlit%20Ivory.webp',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22ed1e50c5363e89576c23_Sch%202%20-%20Sandstone%20Villa.webp',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22ed1e57edcdcc3c06dc7f_Sch%203%20-%20Stone%20Garden.webp',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22ed1e55c9aaa9438ac2b6_Sch%204%20-%20Sienna%20Stone.webp',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22ed1e0c3370fb3e359ffd_Sch%205%20-%20Coastal%20Villa.webp',
    ],
    transitionalRanch: [
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22ed3920e6f459b8caf257_Sch%201%20-%20White%20Oak%20Ranch.webp',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22ed3af8c13be94948c3b2_Sch%202%20-%20Midnight%20Ridge.webp',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22ed3a61f1879971541248_Sch%203%20-%20Oakstone.webp',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22ed3a220472fb3ac3475b_Sch%204%20-%20White%20Mason.webp',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22ed3a939798a0c843907b_Sch%205%20-%20Black%20Timber.webp',
    ],
    coastalColonial: [
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22ecf02d888efac450f505_Sch%201%20-%20Saltwood.webp',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22ecef2ba437a787a0b71d_Sch%202%20-%20Stone%20Harbor.webp',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22ecefc74ccc360e2beea9_Sch%203%20-%20Seabreeze.webp',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22ecf0475a005a81e66998_Sch%204%20-%20Ivory%20%26%20Onyx.webp',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22ecef9619a764f4d3abc5_Sch%205%20-%20Coastal%20Stone.webp',
    ],
    englishCottage: [
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22ed0346c4dce897c5ad7b_Sch%201%20-%20Ivory%20Meadow.webp',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22ed04269d95cd19e1032b_Sch%202%20-%20Abbey%20Iron.webp',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22ed048157506f00ae1c15_Sch%203%20-%20Bronze%20Meadow.webp',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22ed04a8e815ef475bc111_Sch%204%20-%20Manor%20Brick.webp',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22ed0445c164b3134e1b2d_Sch%205%20-%20Chateau%20Stone.webp',
    ],
  },
  alder: {
    spanishContemporary: [
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22ef9295a46fd82b1e4964_Sch%201%20-%20Sunlit%20Ivory.webp',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22ed1e50c5363e89576c23_Sch%202%20-%20Sandstone%20Villa.webp',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22ed1e57edcdcc3c06dc7f_Sch%203%20-%20Stone%20Garden.webp',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22ed1e55c9aaa9438ac2b6_Sch%204%20-%20Sienna%20Stone.webp',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22ed1e0c3370fb3e359ffd_Sch%205%20-%20Coastal%20Villa.webp',
    ],
    transitionalRanch: [
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22efe29d58911e051e60b9_Sch%201%20-%20White%20Oak%20Ranch.webp',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22efe4f8ae2a21e657e6c5_Sch%202%20-%20Midnight%20Ridge.webp',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22efe445c164b3134f6b84_Sch%203%20-%20Oakstone.webp',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22efe32d10f7997d7b25c6_Sch%204%20-%20White%20Mason.webp',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22efe227f295bf102bdd5f_Sch%205%20-%20Black%20Timber.webp',
    ],
    coastalColonial: [
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22ef682f638a601d296658_Sch%201%20-%20Saltwood.webp',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22ef67cd6d5d498ce2266f_Sch%202%20-%20Stone%20Harbor.webp',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22ef6a438168dc11d43cdb_Sch%203%20-%20Seabreeze.webp',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22ef682ba437a787a1fdc9_Sch%204%20-%20Ivory%20%26%20Onyx.webp',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22ef6874297c1a3022840a_Sch%205%20-%20Coastal%20Stone.webp',
    ],
    englishCottage: [
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22ef7b20e6f459b8cc0838_Sch%201%20-%20Ivory%20Meadow.webp',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22ef7cdb1b9afafad4b525_Sch%202%20-%20Abbey%20Iron.webp',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22ef7c94fec08c5d9f1fb1_Sch%203%20-%20Bronze%20Meadow.webp',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22ef7c679eea90bc20be8b_Sch%204%20-%20Manor%20Brick.webp',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22ef7c8157506f00af4584_Sch%205%20-%20Chateau%20Stone.webp',
    ],
  },
  'carriage-house-adu': {
    spanishContemporary: [
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a74481b584b9c46e5511c91_Spanish%20Color%20Scheme%201%20Sunlit%20Ivory.png',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a74481beb481309db1a7307_Spanish%20Color%20Scheme%202%20Sandstone%20Villa.png',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a74481bbef87edeabad2e73_Spanish%20Color%20Scheme%203%20Stone%20Garden.png',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a74481b6edcdf3e9d8d46c2_Spanish%20Color%20Scheme%204%20Sienna%20Stone.png',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a74481c6a82a8eed0e08ebd_Spanish%20Color%20Scheme%205%20Coastal%20Villa.png',
    ],
    transitionalRanch: [
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a74482bc6a80142bb76cf90_Transitional%20Ranch%20Scheme%201%20White%20Oak%20Ranch.png',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a74482a11799919800d8f1b_Transitional%20Ranch%20Scheme%202%20Midnight%20Ridge.png',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a74482b6edcdf3e9d8d5cb6_Transitional%20Ranch%20Scheme%203%20Oakstone.png',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a74482ad39678ec281b4461_Transitional%20Ranch%20Scheme%204%20White%20Mason.png',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a74482b93d8443261da1b0a_Transitional%20Ranch%20Scheme%205%20%20Black%20Timber.png',
    ],
    coastalColonial: [
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a7447fc6a82a8eed0e07b4e_Coastal%20Colonial%20Color%20Scheme%201%20Saltwood.png',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a7447fcc75a7f8c2ef9e0c3_Coastal%20Colonial%20Color%20Scheme%202%20Stone%20Harbor.png',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a7447fc23e233e2dda5bf19_Coastal%20Colonial%20Color%20Scheme%203%20Seabreeze.png',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a7447fcb6815eb1f05189ed_Coastal%20Colonial%20Color%20Scheme%204%20Ivory%20%26%20Onyx.png',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a7447ffa66dd7f5c7f6a7b1_Coastal%20Colonial%20Color%20Scheme%205%20Coastal%20Stone.png',
    ],
    englishCottage: [
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a74480bd16c9c5509bf96dc_English%20Cottage%20Scheme%201%20Ivory%20Meadow.png',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a74480b72ce27915163d94a_English%20Cottage%20Scheme%202%20Abbey%20Iron.png',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a74480bc15cbea785d01665_English%20Cottage%20Scheme%203%20Bronze%20Meadow.png',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a74480ce7b264502743ccca_English%20Cottage%20Scheme%204%20Manor%20Brick.png',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a74480b6b926a8c17016811_English%20Cottage%20Scheme%205%20Chateau%20Stone.png',
    ],
  },
  'two-story-adu': {
    spanishContemporary: [
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a7448939b8f033bd6ed4a63_Spanish%20Color%20Scheme%201%20Sunlit%20Ivory.png',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a744893c75a7f8c2efa6206_Spanish%20Color%20Scheme%202%20Sandstone%20Villa.png',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a74489410ccae5bf6232d00_Spanish%20Color%20Scheme%203%20Stone%20Garden.png',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a7448939eac13f82c3f13e0_Spanish%20Color%20Scheme%204%20Sienna%20Stone.png',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a744893c75a7f8c2efa620b_Spanish%20Color%20Scheme%205%20Coastal%20Villa.png',
    ],
    transitionalRanch: [
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a7448a172ce2791516456e6_Transitional%20Ranch%20Scheme%201%20White%20Oak%20Ranch.png',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a7448a13cfff99009c92551_Transitional%20Ranch%20Scheme%202%20Midnight%20Ridge.png',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a7448a1a39fcd4ef158ec4a_Transitional%20Ranch%20Scheme%203%20Oakstone.png',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a7448a27795e2c6a31f4b43_Transitional%20Ranch%20Scheme%204%20%20White%20Mason.png',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a744aa9d1f5b783e659ddf5_missing%20Transitional%20Ranch%20Scheme%205%20Black%20Timber.png',
    ],
    coastalColonial: [
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a74487bc75a7f8c2efa4a05_Coastal%20Colonial%20Color%20Scheme%201%20Saltwood.png',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a74487bc83039285bdf2a72_Coastal%20Colonial%20Color%20Scheme%202%20Stone%20Harbor.png',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a74487b204beb02432f65c7_Coastal%20Colonial%20Color%20Scheme%203%20Seabreeze.png',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a74487b44a60aa2dd1838f8_Coastal%20Colonial%20Color%20Scheme%204%20Ivory%20%26%20Onyx.png',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a74487b6a82a8eed0e0d222_Coastal%20Colonial%20Color%20Scheme%205%20Coastal%20Stone.png',
    ],
    englishCottage: [
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a744886bef87edeabada8d7_English%20Cottage%20Scheme%201%20Ivory%20Meadow.png',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a744886f0f1ba26b2dd2326_English%20Cottage%20Scheme%202%20Abbey%20Iron.png',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a744886b8fb342e82bed943_English%20Cottage%20Scheme%203%20Bronze%20Meadow.png',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a7448869b8f033bd6ed2e48_English%20Cottage%20Scheme%204%20Manor%20Brick.png',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a74488611799919800dea42_English%20Cottage%20Scheme%205%20Chateau%20Stone.png',
    ],
  },
};

/** Studio ADU — Altadena-style elevations; Schemes 1–3 only (4–5 not provided). */
const STUDIO_ADU_EXTERIOR_IMAGE_URLS: Record<StudioAduPlanSlug, ExteriorImageSet> = {
  'studio-adu': {
    craftsman: [
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a744849c84ff4e8a34d921c_Craftsman%20Color%20Scheme%201%20Classic%20Cream.png',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a74484910ccae5bf622dc3a_Craftsman%20Color%20Scheme%202%20Soft%20Green.png',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a744849638fdaa6197e9142_Craftsman%20Color%20Scheme%203%20Coastal%20Navy.png',
    ],
    janesCottage: [
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a7448522534f8c0b4c15a8b_Janes%20Cottage%20Color%20Scheme%201%20Warm%20White.png',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a74485372ce279151640663_Janes%20Cottage%20Color%20Scheme%202%20Dusk%20Gray.png',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a744852565ef7b6637304e1_Janes%20Cottage%20Color%20Scheme%203%20Neutral%20Stone.png',
    ],
    spanish: [
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a7448628761de8cb0131cec_Spanish%20Scheme%201%20Coastal%20White.png',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a744862b6815eb1f051dc99_Spanish%20Scheme%202%20Natural%20Gray.png',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a7448621674b95bdff4ffb4_Spanish%20Scheme%203%20Garden%20Olive.png',
    ],
  },
};

const CRAFTSMAN_NAMES = [
  'Classic Cream',
  'Soft Green',
  'Coastal Navy',
  'Warm Taupe',
  'Natural Charcoal',
] as const;

const JANES_COTTAGE_NAMES = [
  'Warm White',
  'Dusk Gray',
  'Neutral Stone',
  'Soft White',
  'Historic Gray',
] as const;

const SPANISH_NAMES = [
  'Coastal White',
  'Natural Gray',
  'Garden Olive',
  'Rich Bronze',
  'Warm Earth Clay',
] as const;

const SPANISH_CONTEMPORARY_SCHEMES = [
  { number: 1, name: 'Sunlit Ivory' },
  { number: 2, name: 'Sandstone Villa' },
  { number: 3, name: 'Stone Garden' },
  { number: 4, name: 'Sienna Stone' },
  { number: 5, name: 'Coastal Villa' },
] as const;

const TRANSITIONAL_RANCH_SCHEMES = [
  { number: 1, name: 'White Oak Ranch' },
  { number: 2, name: 'Midnight Ridge' },
  { number: 3, name: 'Oakstone' },
  { number: 4, name: 'White Mason' },
  { number: 5, name: 'Black Timber' },
] as const;

const COASTAL_COLONIAL_SCHEMES = [
  { number: 1, name: 'Saltwood' },
  { number: 2, name: 'Stone Harbor' },
  { number: 3, name: 'Seabreeze' },
  { number: 4, name: 'Ivory & Onyx' },
  { number: 5, name: 'Coastal Stone' },
] as const;

const ENGLISH_COTTAGE_SCHEMES = [
  { number: 1, name: 'Ivory Meadow' },
  { number: 2, name: 'Abbey Iron' },
  { number: 3, name: 'Bronze Meadow' },
  { number: 4, name: 'Manor Brick' },
  { number: 5, name: 'Chateau Stone' },
] as const;

const PARK_PLACE_CAPE_DUTCH_SCHEMES = [
  { number: 1, name: 'Everest' },
  { number: 2, name: 'Urbane Bronze' },
  { number: 3, name: 'Iron Ore' },
  { number: 4, name: 'Pure White' },
  { number: 5, name: 'Felted Wool' },
] as const;

const PARK_PLACE_TRANSITIONAL_SCHEMES = [
  { number: 1, name: 'Newport' },
  { number: 2, name: 'Iron Ore' },
  { number: 3, name: 'Caprock' },
  { number: 4, name: 'Alabaster' },
  { number: 5, name: 'Worldly Gray' },
] as const;

const PARK_PLACE_TUDOR_SCHEMES = [
  { number: 1, name: 'Colonnade Gray' },
  { number: 2, name: 'Coral Gray' },
  { number: 3, name: 'Greenblack' },
  { number: 4, name: 'Felted Wool' },
  { number: 5, name: 'Altitude Gray' },
] as const;

interface ExteriorImageSet {
  craftsman: string[];
  janesCottage: string[];
  spanish: string[];
}

export const EXTERIOR_IMAGE_SETS_BY_PLAN: Record<AltadenaHousePlanSlug, ExteriorImageSet> = {
  echo: {
    craftsman: [
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69fa1179b6b2a0ae1e8ce5be_Eaton5_Craftsman_Sch1_ClassicCream.webp',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69fa11798c7f61ed170d02c1_Eaton5_Craftsman_Sch2_SoftGreen.webp',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69fa1178d4e789851d726afd_Eaton5_Craftsman_Sch3_CoastalNavy.webp',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69fa1179e37e4c9da35dd349_Eaton5_Craftsman_Sch4_WarmTaupe.webp',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69fa117934eb986df4409a80_Eaton5_Craftsman_Sch5_NaturalCharcoal.webp',
    ],
    janesCottage: [
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f1f967ed46f583c45fb319_Eaton5_Janes_Cottage_Sch1_WarmWhite.webp',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f1f9673f19c0a2d78cbb9e_Eaton5_Janes_Cottage_Sch2_DuskGray.webp',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f1f967165e83dd2af826bb_Eaton5_Janes_Cottage_Sch3_NeutralStone.webp',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f1f967a7a2df84652e1078_Eaton5_Janes_Cottage_Sch4_SoftWhite.webp',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f1f9676e59091671c162ac_Eaton5_Janes_Cottage_Sch5_HistoricGray.webp',
    ],
    spanish: [
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f1f981d8030b85e86c5eee_Eaton5_Spanish_Sch1)CoastalWhite.webp',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f1f9818dfc10b3ad322043_Eaton5_Spanish_Sch2_NaturalGray.webp',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f1f981b3fba19edac10345_Eaton5_Spanish_Sch3_GardenOlive.webp',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f1f9818582aeea3838bcd3_Eaton5_Spanish_Sch4_RichBronze.webp',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f1f981af3855fd07a02254_Eaton5_Spanish_Sch5_WarmEarthClay.webp',
    ],
  },
  merrick: {
    craftsman: [
      'https://cdn.prod.website-files.com/601ca16f9dfe00cc7bb4027c/69f3003b93c53e9b6387d557_69f1f95450b85abd3d949f4e_Eaton4_Craftsman_Sch1_ClassicCream.webp',
      'https://cdn.prod.website-files.com/601ca16f9dfe00cc7bb4027c/69f3003b93c53e9b6387d562_69f1f953252b3600fcbe4e80_Eaton4_Craftsman_Sch2_SoftGreen.webp',
      'https://cdn.prod.website-files.com/601ca16f9dfe00cc7bb4027c/69f3003a93c53e9b6387d547_69f1f954f0cccea740cd8b9f_Eaton4_Craftsman_Sch3_CoastalNavy.webp',
      'https://cdn.prod.website-files.com/601ca16f9dfe00cc7bb4027c/69f3003b93c53e9b6387d56d_69f1f955180a5af38a774901_Eaton4_Craftsman_Sch4_WarmTaupe.webp',
      'https://cdn.prod.website-files.com/601ca16f9dfe00cc7bb4027c/69f3003c93c53e9b6387d581_69f1f953ceb831e555c6f0c2_Eaton4_Craftsman_Sch5_NaturalCharcoal.webp',
    ],
    janesCottage: [
      'https://cdn.prod.website-files.com/601ca16f9dfe00cc7bb4027c/69f3003b93c53e9b6387d565_69f1fa3cc74e38671839449b_Eaton4_Janes_Cottage_Sch1_WarmWhite.webp',
      'https://cdn.prod.website-files.com/601ca16f9dfe00cc7bb4027c/69f3003c93c53e9b6387d57e_69f1fa3cff957cd5197530f5_Eaton4_Janes_Cottage_Sch2_DuskGray.webp',
      'https://cdn.prod.website-files.com/601ca16f9dfe00cc7bb4027c/69f3003b93c53e9b6387d55d_69f1fa3c848b541b0e090d97_Eaton4_Janes_Cottage_Sch3_NeutralStone.webp',
      'https://cdn.prod.website-files.com/601ca16f9dfe00cc7bb4027c/69f3003c93c53e9b6387d578_69f1fa3cf9c32ba7ba62c7e7_Eaton4_Janes_Cottage_Sch4_SoftWhite.webp',
      'https://cdn.prod.website-files.com/601ca16f9dfe00cc7bb4027c/69f3003a93c53e9b6387d54b_69f1fa3c26c535b3fa92955a_Eaton4_Janes_Cottage_Sch5_HistoricGray.webp',
    ],
    spanish: [
      'https://cdn.prod.website-files.com/601ca16f9dfe00cc7bb4027c/69f3003c93c53e9b6387d575_69f1fa27d27c3c9e6b23ce8d_Eaton4_Spanish_Sch1_CoastalWhite.webp',
      'https://cdn.prod.website-files.com/601ca16f9dfe00cc7bb4027c/69f3003a93c53e9b6387d54f_69f1fa27b19d1d6237faa1b6_Eaton4_Spanish_Sch2_NaturalGray.webp',
      'https://cdn.prod.website-files.com/601ca16f9dfe00cc7bb4027c/69f3003c93c53e9b6387d589_69f1fa27adcc4b13bfb7229e_Eaton4_Spanish_Sch3_GardenOlive.webp',
      'https://cdn.prod.website-files.com/601ca16f9dfe00cc7bb4027c/69f3003c93c53e9b6387d586_69f1fa2704074b196573ba2a_Eaton4_Spanish_Sch4_RichBronze.webp',
      'https://cdn.prod.website-files.com/601ca16f9dfe00cc7bb4027c/69f3003b93c53e9b6387d55a_69f1fa27d874fa8f14184b4c_Eaton4_Spanish_Sch5_WarmEarthClay.webp',
    ],
  },
  chaney: {
    craftsman: [
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f1f8a6a7a2df84652df1c2_Eaton3_Craftsman_Sch1_ClassicCream.webp',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f1f8a571c267c5a6d19d59_Eaton3_Craftsman_Sch2_SoftGreen.webp',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f1f8a46e59091671c1452c_Eaton3_Craftsman_Sch3_CoastalNavy.webp',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f1f8a5151e31161533467a_Eaton3_Craftsman_Sch4_WarmTaupe.webp',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f1f8a5535e1ec75c9ed78b_Eaton3_Craftsman_Sch5_NaturalCharcoal.webp',
    ],
    janesCottage: [
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f1f8b8a76017d864898f1c_Eaton3_Janes_Sch1_WarmWhite.webp',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f1f8b826f327fe8b8314c3_Eaton3_Janes_Sch2_DuskGray.webp',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f1f8b86e1c34584269d0b4_Eaton3_Janes_Sch3_NeutralStone.webp',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f1f8b80f8abd2778a65c61_Eaton3_Janes_Sch4_SoftWhite.webp',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f1f8b839d6f0b57222e683_Eaton3_Janes_Sch5_HistoricGray.webp',
    ],
    spanish: [
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f1f8d119e08a63bb87a563_Eaton3_Spanish_Sch1_CoastalWhite.webp',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f1f8d1c002eece10343349_Eaton3_Spanish_Sch2_NaturalGray.webp',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f1f8d20cb4d186330f5414_Eaton3_Spanish_Sch3_GardenOlive.webp',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f1f8d2d0bc4c3d311c6867_Eaton3_Spanish_Sch4_RichBronze.webp',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f1f8d1f3573cd92cb08111_Eaton3_Spanish_Sch5_WArmEarthClay.webp',
    ],
  },
  loma: {
    craftsman: [
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f1f998b885bb7225449c8e_Eaton2_Craftsman_Sch1_ClassicCream.webp',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f1f998ff957cd519750e2b_Eaton2_Craftsman_Sch2_SoftGreen.webp',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f1f99867d6924479cbd2bb_Eaton2_Craftsman_Sch3_CoastalNavy.webp',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f1f99816ad2a104acb7728_Eaton2_Craftsman_Sch4_WarmTaupe.webp',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f1f9987417fe7fb74e6bbd_Eaton2_Craftsman_Sch5_NaturalCharcoal.webp',
    ],
    janesCottage: [
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f1f9c94e811fb2f2915ccd_Eaton2_Janes_Sch1_WarmWhite.webp',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f1f9c9444f0e9cf3870f8e_Eaton2_Janes_Sch2_DuskGray.webp',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f1f9c9e11203e2617c9946_Eaton2_Janes_Sch3_NeutralStone.webp',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f1f9c9255e1fbe5ac33217_Eaton2_Janes_Sch4_SoftWhite.webp',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f1f9c9d3067f0a7efe5fd6_Eaton2_Janes_Sch5_HistoricGray.webp',
    ],
    spanish: [
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f1fa0096a959af0bd4ed45_Eaton2_Spanish_Sch1_CoastalWhite.webp',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f1fa00112be277eea18bd4_Eaton2_Spanish_Sch2_NaturalGray.webp',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f1f9ff24369ae8059a02bd_Eaton2_Spanish_Sch3_GardenOlive.webp',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f1fa0052b6244c225fa903_Eaton2_Spanish_Sch4_RichBronze.webp',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f1fa079e2ec043052c58e5_Eaton2_Spanish_Sch5_WarmEarthClay.webp',
    ],
  },
  sycamore: {
    craftsman: [
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f1fa921c26d9ee20d7557e_Eaton1_Craftsman_Sch1_ClassicCream.webp',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f1fa9346432d98c0974cee_Eaton1_Craftsman_Sch2_SoftGreen.webp',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f1fa93d99dbd042136a8c5_Eaton1_Craftsman_Sch3_CoastalNavy.webp',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f1fa9275c170937d547cda_Eaton1_Craftsman_Sch4_WarmTaupe.webp',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f1fa93db5a646b559687d6_Eaton1_Craftsman_Sch5_NaturalCharcoal.webp',
    ],
    janesCottage: [
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f1faac9a388e1b666a2e9f_Eaton1_Janes_Cottage_Sch1_WarmWhite.webp',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f1faac4cfe0437b90b4fee_Eaton1_Janes_Cottage_Sch2_DuskGray.webp',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f1faac6ce7a3c2af1aee22_Eaton1_Janes_Cottage_Sch3_NeutralStone.webp',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f1faac00a3f24d2deca82a_Eaton1_Janes_Cottage_Sch4_SoftWhite.webp',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f1faace73112fa77de5962_Eaton1_Janes_Cottage_Sch5_HistoricGray.webp',
    ],
    spanish: [
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f1facacf7104f7e2bb4532_Eaton1_Spanish_Sch1_CoastalWhite.webp',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f1faca832e56e8d1302425_Eaton1_Spanish_Sch2_NaturalGray.webp',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f1faca7fcd4a25484de868_Eaton1_Spanish_Sch3_GardenOlive.webp',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f1facabdcd44c1fee09803_Eaton1_Spanish_Sch4_RichBronze.webp',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f1faca151e31161533c3d7_Eaton1_Spanish_Sch5_WarmEarthClay.webp',
    ],
  },
};

const toSchemes = (names: readonly string[], urls: string[]): ExteriorColorScheme[] =>
  names.map((name, index) => ({
    schemeNumber: index + 1,
    name,
    imageUrl: urls[index] ?? '',
  }));

const toNumberedSchemes = (
  schemes: readonly { number: number; name: string }[],
  urls: string[]
): ExteriorColorScheme[] =>
  schemes.map((scheme, index) => ({
    schemeNumber: scheme.number,
    name: scheme.name,
    imageUrl: urls[index] ?? '',
  }));

const buildNewCommunityExteriors = (planSlug: NewCommunityPlanSlug): ExteriorDefinition[] => {
  const imageUrls = NEW_COMMUNITY_EXTERIOR_IMAGE_URLS[planSlug];

  return [
    {
      style: 'Spanish Contemporary',
      slug: `${planSlug}-spanish-contemporary`,
      colorSchemes: toNumberedSchemes(SPANISH_CONTEMPORARY_SCHEMES, [
        ...imageUrls.spanishContemporary,
      ]),
    },
    {
      style: 'Transitional Ranch',
      slug: `${planSlug}-transitional-ranch`,
      colorSchemes: toNumberedSchemes(TRANSITIONAL_RANCH_SCHEMES, [...imageUrls.transitionalRanch]),
    },
    {
      style: 'Coastal Colonial',
      slug: `${planSlug}-coastal-colonial`,
      colorSchemes: toNumberedSchemes(COASTAL_COLONIAL_SCHEMES, [...imageUrls.coastalColonial]),
    },
    {
      style: 'English Cottage',
      slug: `${planSlug}-english-cottage`,
      colorSchemes: toNumberedSchemes(ENGLISH_COTTAGE_SCHEMES, [...imageUrls.englishCottage]),
    },
  ];
};

const buildExteriorsForPlan = (planSlug: AltadenaHousePlanSlug): ExteriorDefinition[] => {
  const imageSet = EXTERIOR_IMAGE_SETS_BY_PLAN[planSlug];

  return [
    {
      style: 'Craftsman',
      slug: 'craftsman-style',
      colorSchemes: toSchemes(CRAFTSMAN_NAMES, imageSet.craftsman),
    },
    {
      style: 'Janes Cottage',
      slug: 'janes-cottage',
      colorSchemes: toSchemes(JANES_COTTAGE_NAMES, imageSet.janesCottage),
    },
    {
      style: 'Spanish Transitional',
      slug: 'spanish-transitional',
      colorSchemes: toSchemes(SPANISH_NAMES, imageSet.spanish),
    },
  ];
};

/** Studio ADU reuses Altadena exterior-style slide attrs; only Schemes 1–3 are wired. */
const buildStudioAduExteriors = (planSlug: StudioAduPlanSlug): ExteriorDefinition[] => {
  const imageSet = STUDIO_ADU_EXTERIOR_IMAGE_URLS[planSlug];

  return [
    {
      style: 'Craftsman',
      slug: 'craftsman-style',
      colorSchemes: toSchemes(CRAFTSMAN_NAMES.slice(0, 3), imageSet.craftsman),
    },
    {
      style: 'Janes Cottage',
      slug: 'janes-cottage',
      colorSchemes: toSchemes(JANES_COTTAGE_NAMES.slice(0, 3), imageSet.janesCottage),
    },
    {
      style: 'Spanish Transitional',
      slug: 'spanish-transitional',
      colorSchemes: toSchemes(SPANISH_NAMES.slice(0, 3), imageSet.spanish),
    },
  ];
};

type ParkPlacePlanSlug = 'addison' | 'bandera' | 'collin' | 'grayson' | 'magnolia';
type ParkPlaceStyleKey = 'capeDutch' | 'transitional' | 'tudor';

const PARK_PLACE_CDN =
  'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0';

const PARK_PLACE_EXTERIOR_IMAGE_URLS: Record<
  ParkPlacePlanSlug,
  Record<ParkPlaceStyleKey, readonly string[]>
> = {
  addison: {
    capeDutch: [
      `${PARK_PLACE_CDN}/6a84b1a5b0cd93c94cbe7346_Modern%20Cape%20Dutch%20Color%20Scheme%201%20Everest.webp`,
      `${PARK_PLACE_CDN}/6a84b1a583d75ceaa6461dcd_Modern%20Cape%20Dutch%20Color%20Scheme%202%20Urbane%20Bronze.webp`,
      `${PARK_PLACE_CDN}/6a84b1a5830be1b62868857d_Modern%20Cape%20Dutch%20Color%20Scheme%203%20Iron%20Ore.webp`,
      `${PARK_PLACE_CDN}/6a84b1a56a17c6919f5e0e0e_Modern%20Cape%20Dutch%20Color%20Scheme%204%20Pure%20White.webp`,
      `${PARK_PLACE_CDN}/6a84b1a5e570e96c28ac12c4_Modern%20Cape%20Dutch%20Color%20Scheme%205%20Felted%20Wool.webp`,
    ],
    transitional: [
      `${PARK_PLACE_CDN}/6a84b1a7b79122ab8a0f40bd_Transitional%20Color%20Scheme%201%20Newport.webp`,
      `${PARK_PLACE_CDN}/6a84b1a7b8efd49498294990_Transitional%20Color%20Scheme%202%20Iron%20Ore.webp`,
      `${PARK_PLACE_CDN}/6a84b1a77b6b694595669cd2_Transitional%20Color%20Scheme%203%20Caprock.webp`,
      `${PARK_PLACE_CDN}/6a84b1a7f5c02efbf7c77d98_Transitional%20Color%20Scheme%204%20Alabaster.webp`,
      `${PARK_PLACE_CDN}/6a84b1a7fcc834951e54f4bf_Transitional%20Color%20Scheme%205%20Worldly%20Gray.webp`,
    ],
    tudor: [
      `${PARK_PLACE_CDN}/6a84b1a6af7a129003ace1ec_Modern%20Tudor%20Color%20Scheme%201%20Colonnade%20Gray.webp`,
      `${PARK_PLACE_CDN}/6a84b1a6fcc834951e54f421_Modern%20Tudor%20Color%20Scheme%202%20Coral%20Gray.webp`,
      `${PARK_PLACE_CDN}/6a84b1a617cf0f48c34c5058_Modern%20Tudor%20Color%20Scheme%203%20Greenblack.webp`,
      `${PARK_PLACE_CDN}/6a84b1a683d75ceaa6461f26_Modern%20Tudor%20Color%20Scheme%204%20Felted%20Wool.webp`,
      `${PARK_PLACE_CDN}/6a84b1a67b6b694595669ca2_Modern%20Tudor%20Color%20Scheme%205%20Altitude%20Gray.webp`,
    ],
  },
  bandera: {
    capeDutch: [
      `${PARK_PLACE_CDN}/6a84b2bc1f53dd3717d85d60_Modern%20Cape%20Dutch%20Color%20Scheme%201%20Everest.webp`,
      `${PARK_PLACE_CDN}/6a84b2bc297085014b204e1c_Modern%20Cape%20Dutch%20Color%20Scheme%202%20Urbane%20Bronze.webp`,
      `${PARK_PLACE_CDN}/6a84b2bcb0cd93c94cbeff9d_Modern%20Cape%20Dutch%20Color%20Scheme%203%20Iron%20Ore.webp`,
      `${PARK_PLACE_CDN}/6a84b2bdb79122ab8a0fb25f_Modern%20Cape%20Dutch%20Color%20Scheme%204%20Pure%20White.webp`,
      `${PARK_PLACE_CDN}/6a84b2bd9a92f58d97c26784_Modern%20Cape%20Dutch%20Color%20Scheme%205%20Felted%20Wool.webp`,
    ],
    transitional: [
      `${PARK_PLACE_CDN}/6a84b2c097c77db82ebab4a2_Transitional%20Color%20Scheme%201%20Newport.webp`,
      `${PARK_PLACE_CDN}/6a84b2c004702f83e9ba2ddd_Transitional%20Color%20Scheme%202%20Iron%20Ore.webp`,
      `${PARK_PLACE_CDN}/6a84b2c004702f83e9ba2e1b_Transitional%20Color%20Scheme%203%20Caprock.webp`,
      `${PARK_PLACE_CDN}/6a84b2c017cf0f48c34cdcbf_Transitional%20Color%20Scheme%204%20Alabaster.webp`,
      `${PARK_PLACE_CDN}/6a84b2c1d62095daa8114600_Transitional%20Color%20Scheme%205%20Worldly%20Gray.webp`,
    ],
    tudor: [
      `${PARK_PLACE_CDN}/6a84b2be9a287322be54c601_Modern%20Tudor%20Color%20Scheme%201%20Colonnade%20Gray.webp`,
      `${PARK_PLACE_CDN}/6a84b2bfe570e96c28ac8d97_Modern%20Tudor%20Color%20Scheme%202%20Coral%20Gray.webp`,
      `${PARK_PLACE_CDN}/6a84b2bf573a47599c830a8d_Modern%20Tudor%20Color%20Scheme%203%20Greenblack.webp`,
      `${PARK_PLACE_CDN}/6a84b2bf165fa1b5bf5bbab9_Modern%20Tudor%20Color%20Scheme%204%20Felted%20Wool.webp`,
      `${PARK_PLACE_CDN}/6a84b2c008dc2fe1c6cfdb16_Modern%20Tudor%20Color%20Scheme%205%20Altitude%20Gray.webp`,
    ],
  },
  collin: {
    capeDutch: [
      `${PARK_PLACE_CDN}/6a84b3c647e218625ded7348_Modern%20Cape%20Dutch%20Color%20Scheme%201%20Everest.webp`,
      `${PARK_PLACE_CDN}/6a84b3c73888a4db5685d9d6_Modern%20Cape%20Dutch%20Color%20Scheme%202%20Urbane%20Bronze.webp`,
      `${PARK_PLACE_CDN}/6a84b3c797c77db82ebaf1bc_Modern%20Cape%20Dutch%20Color%20Scheme%203%20Iron%20Ore.webp`,
      `${PARK_PLACE_CDN}/6a84b3c7668753f061942f10_Modern%20Cape%20Dutch%20Color%20Scheme%204%20Pure%20White.webp`,
      `${PARK_PLACE_CDN}/6a84b3c7b79122ab8a107532_Modern%20Cape%20Dutch%20Color%20Scheme%205%20Felted%20Wool.webp`,
    ],
    transitional: [
      `${PARK_PLACE_CDN}/6a84b3c93888a4db5685dad3_Transitional%20Color%20Scheme%201%20Newport.webp`,
      `${PARK_PLACE_CDN}/6a84b3ca165fa1b5bf5c40e5_Transitional%20Color%20Scheme%202%20Iron%20Ore.webp`,
      `${PARK_PLACE_CDN}/6a84b3cae570e96c28ad428e_Transitional%20Color%20Scheme%203%20Caprock.webp`,
      `${PARK_PLACE_CDN}/6a84b3ca6ca32e7649b97267_Transitional%20Color%20Scheme%204%20Alabaster.webp`,
      `${PARK_PLACE_CDN}/6a84b3ca165fa1b5bf5c4159_Transitional%20Color%20Scheme%205%20Worldly%20Gray.webp`,
    ],
    tudor: [
      `${PARK_PLACE_CDN}/6a84b3c7b1357c809573778c_Modern%20Tudor%20Color%20Scheme%201%20Colonnade%20Gray.webp`,
      `${PARK_PLACE_CDN}/6a84b3c855df81cb20fbe5e3_Modern%20Tudor%20Color%20Scheme%202%20Coral%20Gray.webp`,
      `${PARK_PLACE_CDN}/6a84b3c8668753f061942fca_Modern%20Tudor%20Color%20Scheme%203%20Greenblack.webp`,
      `${PARK_PLACE_CDN}/6a84b3c86ca32e7649b9709d_Modern%20Tudor%20Color%20Scheme%204%20Felted%20Wool.webp`,
      `${PARK_PLACE_CDN}/6a84b3c9d62095daa8120c5f_Modern%20Tudor%20Color%20Scheme%205%20Altitude%20Gray.webp`,
    ],
  },
  grayson: {
    capeDutch: [
      `${PARK_PLACE_CDN}/6a84b4a456716fa5cdfdc6df_Modern%20Cape%20Dutch%20Color%20Scheme%201%20Everest.webp`,
      `${PARK_PLACE_CDN}/6a84b4a4d7c17df8a732426f_Modern%20Cape%20Dutch%20Color%20Scheme%202%20Urbane%20Bronze.webp`,
      `${PARK_PLACE_CDN}/6a84b4a459e59db0530cb29b_Modern%20Cape%20Dutch%20Color%20Scheme%203%20Iron%20Ore.webp`,
      `${PARK_PLACE_CDN}/6a84b4a4573a47599c833035_Modern%20Cape%20Dutch%20Color%20Scheme%204%20Pure%20White.webp`,
      `${PARK_PLACE_CDN}/6a84b4a5d7c17df8a73242a1_Modern%20Cape%20Dutch%20Color%20Scheme%205%20Felted%20Wool.webp`,
    ],
    transitional: [
      `${PARK_PLACE_CDN}/6a84b4a6165fa1b5bf5ca597_Transitional%20Color%20Scheme%201%20Newport.webp`,
      `${PARK_PLACE_CDN}/6a84b4a6165fa1b5bf5ca5ca_Transitional%20Color%20Scheme%202%20Iron%20Ore.webp`,
      `${PARK_PLACE_CDN}/6a84b4a697c77db82ebb267f_Transitional%20Color%20Scheme%203%20Caprock.webp`,
      `${PARK_PLACE_CDN}/6a84b4a7b79122ab8a10ff2f_Transitional%20Color%20Scheme%204%20Alabaster.webp`,
      `${PARK_PLACE_CDN}/6a84b4a76a17c6919f5e4c29_Transitional%20Color%20Scheme%205%20Worldly%20Gray.webp`,
    ],
    tudor: [
      `${PARK_PLACE_CDN}/6a84b4a5573a47599c833061_Modern%20Tudor%20Color%20Scheme%201%20Colonnade%20Gray.webp`,
      `${PARK_PLACE_CDN}/6a84b4a598d45b2c7121e549_Modern%20Tudor%20Color%20Scheme%202%20Coral%20Gray.webp`,
      `${PARK_PLACE_CDN}/6a84b4a56ca32e7649b9eae7_Modern%20Tudor%20Color%20Scheme%203%20Greenblack.webp`,
      `${PARK_PLACE_CDN}/6a84b4a66a17c6919f5e4ba9_Modern%20Tudor%20Color%20Scheme%204%20Felted%20Wool.webp`,
      `${PARK_PLACE_CDN}/6a84b4a6d62095daa8129a86_Modern%20Tudor%20Color%20Scheme%205%20Altitude%20Gray.webp`,
    ],
  },
  magnolia: {
    capeDutch: [
      `${PARK_PLACE_CDN}/6a84b4e5666418f9d40514fd_Modern%20Cape%20Dutch%20Color%20Scheme%201%20Everest.webp`,
      `${PARK_PLACE_CDN}/6a84b4e6666418f9d405153c_Modern%20Cape%20Dutch%20Color%20Scheme%202%20Urbane%20Bronze.webp`,
      `${PARK_PLACE_CDN}/6a84b4e6b0cd93c94cc02ab5_Modern%20Cape%20Dutch%20Color%20Scheme%203%20Iron%20Ore.webp`,
      `${PARK_PLACE_CDN}/6a84b4e647323a2b628f5a3b_Modern%20Cape%20Dutch%20Color%20Scheme%204%20Pure%20White.webp`,
      `${PARK_PLACE_CDN}/6a84b4e6668753f06194cead_Modern%20Cape%20Dutch%20Color%20Scheme%205%20Felted%20Wool.webp`,
    ],
    transitional: [
      `${PARK_PLACE_CDN}/6a84b4e8b0cd93c94cc02c4b_Transitional%20Color%20Scheme%201%20Newport.webp`,
      `${PARK_PLACE_CDN}/6a84b4e808dc2fe1c6d05bb6_Transitional%20Color%20Scheme%202%20Iron%20Ore.webp`,
      `${PARK_PLACE_CDN}/6a84b4e87b6b694595678e17_Transitional%20Color%20Scheme%203%20Caprock.webp`,
      `${PARK_PLACE_CDN}/6a84b4e96ca32e7649ba0767_Transitional%20Color%20Scheme%204%20Alabaster.webp`,
      `${PARK_PLACE_CDN}/6a84b4e917cf0f48c34d6370_Transitional%20Color%20Scheme%205%20Worldly%20Gray.webp`,
    ],
    tudor: [
      `${PARK_PLACE_CDN}/6a84b4e717cf0f48c34d62b8_Modern%20Tudor%20Color%20Scheme%201%20Colonnade%20Gray.webp`,
      `${PARK_PLACE_CDN}/6a84b4e7b0cd93c94cc02b79_Modern%20Tudor%20Color%20Scheme%202%20Coral%20Gray.webp`,
      `${PARK_PLACE_CDN}/6a84b4e716910f7fe0fd6e86_Modern%20Tudor%20Color%20Scheme%203%20Greenblack.webp`,
      `${PARK_PLACE_CDN}/6a84b4e7165fa1b5bf5cc6b0_Modern%20Tudor%20Color%20Scheme%204%20Felted%20Wool.webp`,
      `${PARK_PLACE_CDN}/6a84b4e747e218625dedae9b_Modern%20Tudor%20Color%20Scheme%205%20Altitude%20Gray.webp`,
    ],
  },
};

/** CMS Exterior Style slugs used on house-plan slides via `exterior-style`. */
const PARK_PLACE_STYLE_SLUGS: Record<
  ParkPlacePlanSlug,
  Record<ParkPlaceStyleKey, string>
> = {
  addison: {
    capeDutch: 'addison-modern-cape-dutch',
    transitional: 'addison-transitional',
    tudor: 'addison-modern-tudor',
  },
  bandera: {
    capeDutch: 'bandera-modern-cape-dutch',
    transitional: 'bandera-transitional',
    tudor: 'bandera-modern-tudor',
  },
  collin: {
    capeDutch: 'collin-modern-cape-dutch',
    transitional: 'collin-transitional',
    tudor: 'collin-modern-tudor',
  },
  grayson: {
    capeDutch: 'grayson-modern-cape-dutch',
    transitional: 'the-grayson-transitional',
    tudor: 'the-grayson-modern-tudor',
  },
  magnolia: {
    capeDutch: 'magnolia-modern-cape-dutch',
    transitional: 'magnolia-transitional',
    tudor: 'magnolia-modern-tudor',
  },
};

const buildParkPlaceExteriors = (planSlug: ParkPlacePlanSlug): ExteriorDefinition[] => {
  const imageUrls = PARK_PLACE_EXTERIOR_IMAGE_URLS[planSlug];
  const slugs = PARK_PLACE_STYLE_SLUGS[planSlug];

  return [
    {
      style: 'Modern Cape Dutch',
      slug: slugs.capeDutch,
      colorSchemes: toNumberedSchemes(PARK_PLACE_CAPE_DUTCH_SCHEMES, [...imageUrls.capeDutch]),
    },
    {
      style: 'Transitional',
      slug: slugs.transitional,
      colorSchemes: toNumberedSchemes(PARK_PLACE_TRANSITIONAL_SCHEMES, [...imageUrls.transitional]),
    },
    {
      style: 'Modern Tudor',
      slug: slugs.tudor,
      colorSchemes: toNumberedSchemes(PARK_PLACE_TUDOR_SCHEMES, [...imageUrls.tudor]),
    },
  ];
};

const EXTERIORS_BY_PLAN: Record<HousePlanSlug, ExteriorDefinition[]> = {
  echo: buildExteriorsForPlan('echo'),
  merrick: buildExteriorsForPlan('merrick'),
  chaney: buildExteriorsForPlan('chaney'),
  loma: buildExteriorsForPlan('loma'),
  sycamore: buildExteriorsForPlan('sycamore'),
  glenview: buildNewCommunityExteriors('glenview'),
  elm: buildNewCommunityExteriors('elm'),
  willow: buildNewCommunityExteriors('willow'),
  vista: buildNewCommunityExteriors('vista'),
  ambrose: buildNewCommunityExteriors('ambrose'),
  alder: buildNewCommunityExteriors('alder'),
  'studio-adu': buildStudioAduExteriors('studio-adu'),
  'carriage-house-adu': buildNewCommunityExteriors('carriage-house-adu'),
  'two-story-adu': buildNewCommunityExteriors('two-story-adu'),
  addison: buildParkPlaceExteriors('addison'),
  bandera: buildParkPlaceExteriors('bandera'),
  collin: buildParkPlaceExteriors('collin'),
  grayson: buildParkPlaceExteriors('grayson'),
  magnolia: buildParkPlaceExteriors('magnolia'),
};

export function getHousePlanSlugFromPath(): HousePlanSlug | null {
  const maybeSlug =
    window.location.pathname.toLowerCase().split('/house-plans/')[1]?.split('/')[0] ?? '';
  const normalizedSlug = maybeSlug.replace(/^the-/, '');

  if (normalizedSlug in EXTERIORS_BY_PLAN) {
    return normalizedSlug as HousePlanSlug;
  }

  return null;
}

export function getExteriorImageUrlsForStyle(
  planSlug: HousePlanSlug,
  exteriorStyleSlug: string
): string[] {
  const exterior = EXTERIORS_BY_PLAN[planSlug]?.find((item) => item.slug === exteriorStyleSlug);
  if (!exterior) return [];

  return exterior.colorSchemes.map((scheme) => scheme.imageUrl).filter(Boolean);
}

/**
 * Populates and controls exterior color scheme dropdowns in house-plan slides.
 */
export class ExteriorSchemeController {
  private readonly slideSelector = '[exterior-style]';
  private readonly schemeBodySelector = '[dev-target="scheme-body"]';
  private readonly schemeHeaderSelector = '[dev-target="scheme-header"]';
  private readonly schemeArrowSelector = '[dev-target="scheme-arrow"]';
  private readonly schemeItemSelector = '[dev-target="scheme-item"]';
  private readonly headerTextSelector = '.modal-scheme_text';
  private readonly mainImageSelector = '.homes-image';

  init(): void {
    const exteriors = this.getExteriorsForCurrentPlan();
    const slides = Array.from(document.querySelectorAll<HTMLElement>(this.slideSelector));

    if (!exteriors) {
      slides.forEach((slide) => this.hideSchemeUi(slide));
      return;
    }

    slides.forEach((slide) => {
      const slug = slide.getAttribute('exterior-style');
      const exterior = exteriors.find((item) => item.slug === slug);
      if (!exterior) return;

      const schemeBody = slide.querySelector<HTMLElement>(this.schemeBodySelector);
      const schemeHeader = slide.querySelector<HTMLElement>(this.schemeHeaderSelector);
      const schemeArrow = slide.querySelector<HTMLElement>(this.schemeArrowSelector);
      const mainImage = slide.querySelector<HTMLImageElement>(this.mainImageSelector);
      const headerText = schemeHeader?.querySelector<HTMLElement>(this.headerTextSelector) ?? null;

      if (!schemeBody || !schemeHeader || !schemeArrow || !mainImage || !headerText) return;

      this.renderSchemeItems({
        exterior,
        schemeBody,
        schemeHeader,
        schemeArrow,
        headerText,
        mainImage,
      });

      this.setHeaderOpenState(schemeHeader, false);
      this.setModalOpenState(schemeBody, false);
      schemeBody.classList.add('hide');
      schemeArrow.classList.remove('open');

      schemeArrow.addEventListener('click', (event) => {
        event.stopPropagation();
      });

      schemeBody.addEventListener('click', (event) => {
        event.stopPropagation();
      });

      schemeHeader.addEventListener('click', (event) => {
        event.stopPropagation();
        const isHidden = schemeBody.classList.contains('hide');
        schemeBody.classList.toggle('hide', !isHidden);
        schemeArrow.classList.toggle('open', isHidden);
        this.setHeaderOpenState(schemeHeader, isHidden);
        this.setModalOpenState(schemeBody, isHidden);
      });
    });
  }

  private getExteriorsForCurrentPlan(): ExteriorDefinition[] | null {
    const maybeSlug = this.getHousePlanSlugFromPath();
    if (!maybeSlug) return null;
    return EXTERIORS_BY_PLAN[maybeSlug] ?? null;
  }

  /** Hides exterior scheme heading and dropdown when this plan has no exterior image config. */
  private hideSchemeUi(slide: HTMLElement): void {
    const schemeBody = slide.querySelector<HTMLElement>(this.schemeBodySelector);
    const schemeHeader = slide.querySelector<HTMLElement>(this.schemeHeaderSelector);
    const schemeArrow = slide.querySelector<HTMLElement>(this.schemeArrowSelector);
    schemeBody?.classList.add('hide');
    schemeHeader?.classList.add('hide');
    schemeArrow?.classList.add('hide');
  }

  private getHousePlanSlugFromPath(): HousePlanSlug | null {
    return getHousePlanSlugFromPath();
  }

  private renderSchemeItems(params: {
    exterior: ExteriorDefinition;
    schemeBody: HTMLElement;
    schemeHeader: HTMLElement;
    schemeArrow: HTMLElement;
    headerText: HTMLElement;
    mainImage: HTMLImageElement;
  }): void {
    const { exterior, schemeBody, schemeHeader, schemeArrow, headerText, mainImage } = params;

    let selectedIndex = 0;

    const applySelection = (index: number): void => {
      const scheme = exterior.colorSchemes[index];
      if (!scheme) return;

      headerText.textContent = `Scheme ${scheme.schemeNumber}: ${scheme.name}`;
      if (scheme.imageUrl) {
        // Webflow responsive `srcset` wins over `src`; drop it so scheme swaps actually paint.
        mainImage.removeAttribute('srcset');
        mainImage.removeAttribute('sizes');
        mainImage.src = scheme.imageUrl;
      }
    };

    const renderBody = (): void => {
      schemeBody.innerHTML = '';

      exterior.colorSchemes.forEach((scheme, index) => {
        if (index === selectedIndex) return;

        const item = document.createElement('div');
        item.setAttribute('dev-target', 'scheme-item');
        item.className = 'modal-wrapper';
        item.innerHTML = `<div class="modal-scheme_text">Scheme ${scheme.schemeNumber}: ${scheme.name}</div>`;

        item.addEventListener('click', (event) => {
          event.stopPropagation();
          selectedIndex = index;
          applySelection(selectedIndex);
          renderBody();

          schemeBody.classList.add('hide');
          schemeArrow.classList.remove('open');
          this.setHeaderOpenState(schemeHeader, false);
          this.setModalOpenState(schemeBody, false);
        });

        schemeBody.appendChild(item);
      });
    };

    applySelection(selectedIndex);
    renderBody();
  }

  private setHeaderOpenState(schemeHeader: HTMLElement, isOpen: boolean): void {
    schemeHeader.classList.toggle('is-open', isOpen);
    schemeHeader.classList.toggle('is-closed', !isOpen);
  }

  private setModalOpenState(schemeBody: HTMLElement, isOpen: boolean): void {
    schemeBody.classList.toggle('is-modal-open', isOpen);
    schemeBody.classList.toggle('is-modal-closed', !isOpen);
  }
}
