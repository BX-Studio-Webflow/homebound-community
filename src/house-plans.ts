import '$styles/accordion.css';
import '$styles/exterior-scheme.css';
import '$styles/explore-tabs.css';
import '$styles/gallery.css';
import '$styles/home-map.css';
import '$styles/lot-map.css';

import { AccordionController } from '$utils/accordion';
import { type ColorSchemeBinding, ColorSchemeController } from '$utils/color-scheme';
import { ExploreTabsController } from '$utils/explore-tabs';
import { type GalleryConfig, GalleryController } from '$utils/gallery';
import { HomeMapController } from '$utils/home-map';
import { LotMapController } from '$utils/lot-map';
import { ExteriorSchemeController } from '$utils/other-swiper-slide';
import { StickyNavController } from '$utils/sticky-nav';

const galleryConfigs: GalleryConfig[] = [
  {
    triggerSelector: '[dev-target="image-gallery"]',
    imageSelector: '[dev-target="hidden-main-gallery-images"]',
    containerSelector: '[hero-swiper]',
  },
];

//confrim the elements are exist in dom before initializing the gallery controller
galleryConfigs.forEach((config) => {
  const element = document.querySelector(config.triggerSelector);
  if (!element) {
    console.error(`GalleryController: element not found — ${config.triggerSelector}`);
    return;
  }
});

window.Webflow ||= [];
window.Webflow.push(() => {
  const stickyNavController = new StickyNavController();
  stickyNavController.init();

  const galleryController = new GalleryController(galleryConfigs);
  galleryController.init();

  const exploreTabsController = new ExploreTabsController({
    isHousePlansGallery: true,
    firstTabSelector: '[dev-target="first-tab"]',
    secondTabSelector: '[dev-target="second-tab"]',
    triggerToPanel: {
      'first-tab-trigger': 'first-tab-body',
      'second-tab-trigger': 'second-tab-body',
    },
  });
  exploreTabsController.init();

  const mobileExploreTabsController = new ExploreTabsController({
    isHousePlansGallery: true,
    firstTabSelector: '[dev-target="mobile-first-tab"]',
    secondTabSelector: '[dev-target="mobile-second-tab"]',
    triggerToPanel: {
      'mobile-first-tab-trigger': 'mobile-first-tab-body',
      'mobile-second-tab-trigger': 'mobile-second-tab-body',
    },
  });
  mobileExploreTabsController.init();

  const slideEls = Array.from(
    document.querySelectorAll<HTMLElement>('[dev-target="other-swiper-slide"]')
  );
  const schemeTokens = [
    'white-scheme',
    'soft-cream-scheme',
    'ochre-scheme',
    'charcoal-scheme',
  ] as const;
  type SchemeToken = (typeof schemeTokens)[number];
  type InteriorToken =
    | 'kitchen-interior'
    | 'bedroom-interior'
    | 'living-interior'
    | 'bathroom-interior';

  const schemeTitleByToken: Record<SchemeToken, string> = {
    'white-scheme': 'Warm Transitional',
    'soft-cream-scheme': 'Light Transitional',
    'ochre-scheme': 'Bold Transitional',
    'charcoal-scheme': 'Refined Transitional',
  };

  type InteriorImageUrls = Record<InteriorToken, Record<SchemeToken, string>>;

  const housePlanImageUrlsBySlug: Record<string, InteriorImageUrls> = {
    iris: {
      'kitchen-interior': {
        'white-scheme':
          'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69e0b9b0ab4a5be30bcf9b3f_Lakeside_Plan%202_A_Kitchen.avif',
        'soft-cream-scheme':
          'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69e0b9cc0f07ad276ee8c9de_Lakeside_Plan%202_B_Kitchen.avif',
        'ochre-scheme':
          'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69e0b9ec00ea527abfe075ed_Lakeside_Plan2_C_Kitchen.avif',
        'charcoal-scheme':
          'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69e0ba27d22c956cb24df231_Lakeside%20Plan%202_D_Kitchen.avif',
      },
      'bedroom-interior': {
        'white-scheme':
          'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69e0b9af1c8c47abb0a2e9fc_Lakeside_Plan%202_A_Bedroom.avif',
        'soft-cream-scheme':
          'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69e0b9ccf135e0a6dcc36535_Lakeside_Plan%202_B_Primary_Bedroom.avif',
        'ochre-scheme':
          'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69e0b9ebc8de67c028cec4c0_Lakeside_Plan2_C_Primary_Bedroom.avif',
        'charcoal-scheme':
          'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69e0ba274efd57e0baa871bf_Lakeside%20Plan%202_D_Primary_Bed.avif',
      },
      'living-interior': {
        'white-scheme':
          'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69e0b9b02410ba14aaa226d5_Lakeside_Plan%202_A_Great.avif',
        'soft-cream-scheme':
          'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69e0b9cc37c90f8bf7028f7e_Lakeside_Plan%202_B_Great.avif',
        'ochre-scheme':
          'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69e0b9eb469a39c917f2e99b_Lakeside_Plan2_C_Great.avif',
        'charcoal-scheme':
          'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69e0ba28da5822300a5f5b79_Lakeside%20Plan%202_D_Great.avif',
      },
      'bathroom-interior': {
        'white-scheme':
          'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69e0b9abf8fc3a0c688c5407_Lakeside_Plan%202_A_Primary_Bath.avif',
        'soft-cream-scheme':
          'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69e0b9c7d96ba1672ecc593c_Lakeside_Plan%202_B_Primary_Bath.avif',
        'ochre-scheme':
          'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69e0b9e7cea72de2d80ee381_Lakeside_Plan2_C_Primary_Bath.avif',
        'charcoal-scheme':
          'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69e0ba225f0fa8776fb8292f_Lakeside%20Plan%202_D_Primary_Bath.avif',
      },
    },
    daphne: {
      'kitchen-interior': {
        'white-scheme':
          'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69ef90d666dc79d1467ab387_01_Kitchen.webp',
        'soft-cream-scheme':
          'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69ef90e61071956a56e9368c_01_Kitchen%20(1).webp',
        'ochre-scheme':
          'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69ef90fbf01e48e8adfffa76_01_Kitchen%20(2).webp',
        'charcoal-scheme':
          'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69ef910b05faf89ae1e163be_01_Kitchen%20(3).webp',
      },
      'bedroom-interior': {
        'white-scheme':
          'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69ef90d63194db681b01a946_03_Primary_Bedroom.webp',
        'soft-cream-scheme':
          'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69ef90e6924894609d6a9052_03_Primary_Bedroom%20(1).webp',
        'ochre-scheme':
          'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69ef90fbf77b5f49d85d294e_03_Primary_Bedroom%20(2).webp',
        'charcoal-scheme':
          'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69ef910c3a4ad147ce6f9fbe_03_Primary_Bedroom%20(3).webp',
      },
      'living-interior': {
        'white-scheme':
          'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69ef90d6a8a147379c9fcfb9_02_Great.webp',
        'soft-cream-scheme':
          'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69ef90e61071956a56e93691_02_Great%20(1).webp',
        'ochre-scheme':
          'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69ef90fbd04207dba0f0beb9_02_Great%20(2).webp',
        'charcoal-scheme':
          'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69ef910cac3cd82f989b4751_02_Great%20(3).webp',
      },
      'bathroom-interior': {
        'white-scheme':
          'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69ef90d71eeaf783d1560f92_04_Primary_Bath.webp',
        'soft-cream-scheme':
          'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69ef90e56a98cd0c1bfcc95c_04_Primary_Bath%20(1).webp',
        'ochre-scheme':
          'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69ef90fadc7d53b55f8e1562_04_Primary_Bath%20(2).webp',
        'charcoal-scheme':
          'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69ef910a28b8724daebd3dfd_04_Primary_Bath%20(3).webp',
      },
    },
    // TODO: replace with Sienna-specific CDN URLs once uploaded to the "Interiors - Sienna" Webflow folder
    sienna: {
      'kitchen-interior': {
        'white-scheme':
          'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69e0b9b0ab4a5be30bcf9b3f_Lakeside_Plan%202_A_Kitchen.avif',
        'soft-cream-scheme':
          'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69e0b9cc0f07ad276ee8c9de_Lakeside_Plan%202_B_Kitchen.avif',
        'ochre-scheme':
          'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69e0b9ec00ea527abfe075ed_Lakeside_Plan2_C_Kitchen.avif',
        'charcoal-scheme':
          'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69e0ba27d22c956cb24df231_Lakeside%20Plan%202_D_Kitchen.avif',
      },
      'bedroom-interior': {
        'white-scheme':
          'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69e0b9af1c8c47abb0a2e9fc_Lakeside_Plan%202_A_Bedroom.avif',
        'soft-cream-scheme':
          'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69e0b9ccf135e0a6dcc36535_Lakeside_Plan%202_B_Primary_Bedroom.avif',
        'ochre-scheme':
          'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69e0b9ebc8de67c028cec4c0_Lakeside_Plan2_C_Primary_Bedroom.avif',
        'charcoal-scheme':
          'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69e0ba274efd57e0baa871bf_Lakeside%20Plan%202_D_Primary_Bed.avif',
      },
      'living-interior': {
        'white-scheme':
          'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69e0b9b02410ba14aaa226d5_Lakeside_Plan%202_A_Great.avif',
        'soft-cream-scheme':
          'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69e0b9cc37c90f8bf7028f7e_Lakeside_Plan%202_B_Great.avif',
        'ochre-scheme':
          'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69e0b9eb469a39c917f2e99b_Lakeside_Plan2_C_Great.avif',
        'charcoal-scheme':
          'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69e0ba28da5822300a5f5b79_Lakeside%20Plan%202_D_Great.avif',
      },
      'bathroom-interior': {
        'white-scheme':
          'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69e0b9abf8fc3a0c688c5407_Lakeside_Plan%202_A_Primary_Bath.avif',
        'soft-cream-scheme':
          'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69e0b9c7d96ba1672ecc593c_Lakeside_Plan%202_B_Primary_Bath.avif',
        'ochre-scheme':
          'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69e0b9e7cea72de2d80ee381_Lakeside_Plan2_C_Primary_Bath.avif',
        'charcoal-scheme':
          'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69e0ba225f0fa8776fb8292f_Lakeside%20Plan%202_D_Primary_Bath.avif',
      },
    },
  };

  const housePlanSlug =
    window.location.pathname.toLowerCase().split('/house-plans/')[1]?.split('/')[0] ?? '';
  const interiorImageUrls: InteriorImageUrls =
    housePlanImageUrlsBySlug[housePlanSlug] ?? housePlanImageUrlsBySlug.iris;

  // Keep titles mapped by interior + scheme so each interior can have unique package names.
  const packageTitleByInteriorAndScheme: Record<InteriorToken, Record<SchemeToken, string>> = {
    'kitchen-interior': { ...schemeTitleByToken },
    'bedroom-interior': { ...schemeTitleByToken },
    'living-interior': { ...schemeTitleByToken },
    'bathroom-interior': { ...schemeTitleByToken },
  };
  const defaultInteriorToken: InteriorToken = 'kitchen-interior';
  const defaultSchemeToken: SchemeToken = 'white-scheme';
  const schemeButtonSelector = schemeTokens.map((token) => `[dev-target="${token}"]`).join(',');
  const interiorButtons = Array.from(
    document.querySelectorAll<HTMLElement>('[dev-target$="-interior"]')
  );

  const colorSchemeBindings: ColorSchemeBinding[] = slideEls.flatMap((slide) => {
    const forwardImage = slide.querySelector<HTMLImageElement>('img[dev-target="interior-image"]');
    if (!forwardImage) return [];
    const packageTitleEl = slide.querySelector<HTMLElement>('[dev-target="package-title"]');
    const schemeButtons = Array.from(slide.querySelectorAll<HTMLElement>(schemeButtonSelector));
    if (!schemeButtons.length) return [];

    // House plans uses context-based URL mappings; hidden scheme images are optional.
    const schemeImagesByToken = new Map<string, HTMLImageElement>();

    return [
      {
        forwardImage,
        schemeButtons,
        schemeImagesByToken,
        context: {
          contextButtons: interiorButtons,
          defaultContextToken: defaultInteriorToken,
          defaultSchemeToken,
          resetSchemeOnContextChange: true,
          titleElement: packageTitleEl ?? undefined,
          titleByContextAndScheme: packageTitleByInteriorAndScheme as Record<
            string,
            Record<string, string>
          >,
          imageUrlByContextAndScheme: interiorImageUrls as Record<string, Record<string, string>>,
        },
      },
    ];
  });

  const colorSchemeController = new ColorSchemeController({ bindings: colorSchemeBindings });
  colorSchemeController.init();

  const lotMapController = new LotMapController();
  lotMapController.init();

  const accordionController = new AccordionController();
  accordionController.init();

  HomeMapController.initAll();

  const exteriorSchemeController = new ExteriorSchemeController();
  exteriorSchemeController.init();
});
