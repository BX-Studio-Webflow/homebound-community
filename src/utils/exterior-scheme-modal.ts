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
  | 'alder';

type AltadenaHousePlanSlug = 'echo' | 'merrick' | 'chaney' | 'loma' | 'sycamore';
type NewCommunityPlanSlug = 'glenview' | 'elm' | 'willow' | 'vista' | 'ambrose' | 'alder';

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
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22edac6e6422b45442464d_Sch%202%20-%20Stone%20Harbor.webp',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22edac9d58911e051d3fba_Sch%203%20-%20Seabreeze.webp',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22edac8f40d304dd481aec_Sch%204%20-%20Ivory%20%26%20Onyx.webp',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22edace365374d2b4c2c3f_Sch%205%20-%20Coastal%20Stone.webp',
    ],
    englishCottage: [
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
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22ec7e9d58911e051c5dc8_Sch%202%20-%20Stone%20Harbor.webp',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22ec7f2472a39b3cbd5614_Sch%203%20-%20Seabreeze.webp',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22ec7e61f18799715386b8_Sch%204%20-%20Ivory%20%26%20Onyx.webp',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22ec7fb75aee6fe61ebf09_Sch%205%20-%20Coastal%20Stone.webp',
    ],
    englishCottage: [
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
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22f084544db6edddd13c4b_Sch%202%20-%20Stone%20Harbor.webp',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22f08420e6f459b8cc8171_Sch%203%20-%20Seabreeze.webp',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22f084ae64905f6a6340f6_Sch%204%20-%20Ivory%20%26%20Onyx.webp',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22f084f11078832302fea2_Sch%205%20-%20Coastal%20Stone.webp',
    ],
    englishCottage: [
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
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22f1b73b306ae798b3454e_Sch%202%20-%20Stone%20Harbor.webp',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22f1b7fccec2bd9f7f3bf0_Sch%203%20-%20Seabreeze.webp',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22f1b7f3437fec84c94c74_Sch%204%20-%20Ivory%20%26%20Onyx.webp',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22f1b75d778b0e1d343aec_Sch%205%20-%20Coastal%20Stone.webp',
    ],
    englishCottage: [
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
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22ecef2ba437a787a0b71d_Sch%202%20-%20Stone%20Harbor.webp',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22ecefc74ccc360e2beea9_Sch%203%20-%20Seabreeze.webp',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22ecf0475a005a81e66998_Sch%204%20-%20Ivory%20%26%20Onyx.webp',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22ecef9619a764f4d3abc5_Sch%205%20-%20Coastal%20Stone.webp',
    ],
    englishCottage: [
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
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22ef67cd6d5d498ce2266f_Sch%202%20-%20Stone%20Harbor.webp',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22ef6a438168dc11d43cdb_Sch%203%20-%20Seabreeze.webp',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22ef682ba437a787a1fdc9_Sch%204%20-%20Ivory%20%26%20Onyx.webp',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22ef6874297c1a3022840a_Sch%205%20-%20Coastal%20Stone.webp',
    ],
    englishCottage: [
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22ef7cdb1b9afafad4b525_Sch%202%20-%20Abbey%20Iron.webp',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22ef7c94fec08c5d9f1fb1_Sch%203%20-%20Bronze%20Meadow.webp',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22ef7c679eea90bc20be8b_Sch%204%20-%20Manor%20Brick.webp',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22ef7c8157506f00af4584_Sch%205%20-%20Chateau%20Stone.webp',
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
  { number: 2, name: 'Stone Harbor' },
  { number: 3, name: 'Seabreeze' },
  { number: 4, name: 'Ivory & Onyx' },
  { number: 5, name: 'Coastal Stone' },
] as const;

const ENGLISH_COTTAGE_SCHEMES = [
  { number: 2, name: 'Abbey Iron' },
  { number: 3, name: 'Bronze Meadow' },
  { number: 4, name: 'Manor Brick' },
  { number: 5, name: 'Chateau Stone' },
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
