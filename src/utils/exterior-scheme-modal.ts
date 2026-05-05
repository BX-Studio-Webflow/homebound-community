interface ExteriorColorScheme {
  name: string;
  imageUrl: string;
}

interface ExteriorDefinition {
  style: string;
  slug: string;
  colorSchemes: ExteriorColorScheme[];
}

type HousePlanSlug = 'echo' | 'merrick' | 'chaney' | 'loma' | 'sycamore';

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

interface ExteriorImageSet {
  craftsman: string[];
  janesCottage: string[];
  spanish: string[];
}

const EXTERIOR_IMAGE_SETS_BY_PLAN: Record<HousePlanSlug, ExteriorImageSet> = {
  echo: {
    craftsman: [
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f1f95450b85abd3d949f4e_Eaton4_Craftsman_Sch1_ClassicCream.webp',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f1f953252b3600fcbe4e80_Eaton4_Craftsman_Sch2_SoftGreen.webp',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f1f954f0cccea740cd8b9f_Eaton4_Craftsman_Sch3_CoastalNavy.webp',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f1f955180a5af38a774901_Eaton4_Craftsman_Sch4_WarmTaupe.webp',
      'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f1f953ceb831e555c6f0c2_Eaton4_Craftsman_Sch5_NaturalCharcoal.webp',
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
  names.map((name, index) => ({ name, imageUrl: urls[index] ?? '' }));

const buildExteriorsForPlan = (planSlug: HousePlanSlug): ExteriorDefinition[] => {
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
};

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

  private getExteriorsForCurrentPlan(): ExteriorDefinition[] {
    const maybeSlug = this.getHousePlanSlugFromPath();
    if (!maybeSlug) return EXTERIORS_BY_PLAN.echo;
    return EXTERIORS_BY_PLAN[maybeSlug] ?? EXTERIORS_BY_PLAN.echo;
  }

  private getHousePlanSlugFromPath(): HousePlanSlug | null {
    const maybeSlug =
      window.location.pathname.toLowerCase().split('/house-plans/')[1]?.split('/')[0] ?? '';
    const normalizedSlug = maybeSlug.replace(/^the-/, '');

    if (normalizedSlug === 'echo') return 'echo';
    if (normalizedSlug === 'merrick') return 'merrick';
    if (normalizedSlug === 'chaney') return 'chaney';
    if (normalizedSlug === 'loma') return 'loma';
    if (normalizedSlug === 'sycamore') return 'sycamore';

    return null;
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

      headerText.textContent = `Scheme ${index + 1}: ${scheme.name}`;
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
        item.innerHTML = `<div class="modal-scheme_text">Scheme ${index + 1}: ${scheme.name}</div>`;

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
