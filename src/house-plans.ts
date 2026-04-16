import '$styles/accordion.css';
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
  });
  exploreTabsController.init();

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
  const interiorImageUrls: Record<InteriorToken, Record<SchemeToken, string>> = {
    'kitchen-interior': {
      'white-scheme':
        'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69e0b9b0ab4a5be30bcf9b3f_Lakeside_Plan%202_A_Kitchen.jpg',
      'soft-cream-scheme':
        'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69e0b9cc0f07ad276ee8c9de_Lakeside_Plan%202_B_Kitchen.jpg',
      'ochre-scheme':
        'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69e0b9ec00ea527abfe075ed_Lakeside_Plan2_C_Kitchen.jpg',
      'charcoal-scheme':
        'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69e0ba27d22c956cb24df231_Lakeside%20Plan%202_D_Kitchen.jpg',
    },
    'bedroom-interior': {
      'white-scheme':
        'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69e0b9af1c8c47abb0a2e9fc_Lakeside_Plan%202_A_Bedroom.jpg',
      'soft-cream-scheme':
        'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69e0b9ccf135e0a6dcc36535_Lakeside_Plan%202_B_Primary_Bedroom.jpg',
      'ochre-scheme':
        'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69e0b9ebc8de67c028cec4c0_Lakeside_Plan2_C_Primary_Bedroom.jpg',
      'charcoal-scheme':
        'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69e0ba274efd57e0baa871bf_Lakeside%20Plan%202_D_Primary_Bed.jpg',
    },
    'living-interior': {
      'white-scheme':
        'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69e0b9b02410ba14aaa226d5_Lakeside_Plan%202_A_Great.jpg',
      'soft-cream-scheme':
        'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69e0b9cc37c90f8bf7028f7e_Lakeside_Plan%202_B_Great.jpg',
      'ochre-scheme':
        'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69e0b9eb469a39c917f2e99b_Lakeside_Plan2_C_Great.jpg',
      'charcoal-scheme':
        'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69e0ba28da5822300a5f5b79_Lakeside%20Plan%202_D_Great.jpg',
    },
    'bathroom-interior': {
      'white-scheme':
        'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69e0b9abf8fc3a0c688c5407_Lakeside_Plan%202_A_Primary_Bath.jpg',
      'soft-cream-scheme':
        'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69e0b9c7d96ba1672ecc593c_Lakeside_Plan%202_B_Primary_Bath.jpg',
      'ochre-scheme':
        'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69e0b9e7cea72de2d80ee381_Lakeside_Plan2_C_Primary_Bath.jpg',
      'charcoal-scheme':
        'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69e0ba225f0fa8776fb8292f_Lakeside%20Plan%202_D_Primary_Bath.jpg',
    },
  };
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
});
