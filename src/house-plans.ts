import '$styles/accordion.css';
import '$styles/exterior-scheme.css';
import '$styles/explore-tabs.css';
import '$styles/gallery.css';
import '$styles/home-map.css';
import '$styles/lot-map.css';

import { AccordionController } from '$utils/accordion';
import { ExploreTabsController } from '$utils/explore-tabs';
import { ExteriorSchemeController } from '$utils/exterior-scheme-modal';
import { type GalleryConfig, GalleryController } from '$utils/gallery';
import { HomeMapController } from '$utils/home-map';
import { type ColorSchemeBinding, ColorSchemeController } from '$utils/interior-color-scheme';
import { LotMapController } from '$utils/lot-map';
import { StickyNavController } from '$utils/sticky-nav';

const galleryConfigs: GalleryConfig[] = [
  {
    triggerSelector: '[dev-target="image-gallery"]',
    imageSelector: '[dev-target="hidden-main-gallery-images"]',
    containerSelector: '[hero-swiper]',
  },
];

//confirm the elements are exist in dom before initializing the gallery controller
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
  const schemeTokens = ['pos-1', 'pos-2', 'pos-3', 'pos-4'] as const;
  type SchemeToken = (typeof schemeTokens)[number];
  type InteriorToken =
    | 'kitchen-interior'
    | 'bedroom-interior'
    | 'living-interior'
    | 'bathroom-interior';

  const schemeTitleByToken: Record<SchemeToken, string> = {
    'pos-1': 'Warm Transitional',
    'pos-2': 'Light Transitional',
    'pos-3': 'Bold Transitional',
    'pos-4': 'Refined Transitional',
  };
  const styleTitleByToken: Record<SchemeToken, string> = {
    'pos-1': 'Spanish',
    'pos-2': "Jane's Cottage",
    'pos-3': 'Craftsman',
    'pos-4': 'Transitional Organic',
  };

  type InteriorImageUrls = Record<InteriorToken, Record<SchemeToken, string>>;
  type HousePlanSlugForInteriors =
    | 'echo'
    | 'merrick'
    | 'chaney'
    | 'loma'
    | 'sycamore'
    | 'iris'
    | 'daphne'
    | 'sienna';

  const housePlanImageUrlsBySlug: Partial<Record<HousePlanSlugForInteriors, InteriorImageUrls>> = {
    iris: {
      'kitchen-interior': {
        'pos-1':
          'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69e0b9b0ab4a5be30bcf9b3f_Lakeside_Plan%202_A_Kitchen.avif',
        'pos-2':
          'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69e0b9cc0f07ad276ee8c9de_Lakeside_Plan%202_B_Kitchen.avif',
        'pos-3':
          'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69e0b9ec00ea527abfe075ed_Lakeside_Plan2_C_Kitchen.avif',
        'pos-4':
          'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69e0ba27d22c956cb24df231_Lakeside%20Plan%202_D_Kitchen.avif',
      },
      'bedroom-interior': {
        'pos-1':
          'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69e0b9af1c8c47abb0a2e9fc_Lakeside_Plan%202_A_Bedroom.avif',
        'pos-2':
          'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69e0b9ccf135e0a6dcc36535_Lakeside_Plan%202_B_Primary_Bedroom.avif',
        'pos-3':
          'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69e0b9ebc8de67c028cec4c0_Lakeside_Plan2_C_Primary_Bedroom.avif',
        'pos-4':
          'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69e0ba274efd57e0baa871bf_Lakeside%20Plan%202_D_Primary_Bed.avif',
      },
      'living-interior': {
        'pos-1':
          'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69e0b9b02410ba14aaa226d5_Lakeside_Plan%202_A_Great.avif',
        'pos-2':
          'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69e0b9cc37c90f8bf7028f7e_Lakeside_Plan%202_B_Great.avif',
        'pos-3':
          'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69e0b9eb469a39c917f2e99b_Lakeside_Plan2_C_Great.avif',
        'pos-4':
          'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69e0ba28da5822300a5f5b79_Lakeside%20Plan%202_D_Great.avif',
      },
      'bathroom-interior': {
        'pos-1':
          'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69e0b9abf8fc3a0c688c5407_Lakeside_Plan%202_A_Primary_Bath.avif',
        'pos-2':
          'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69e0b9c7d96ba1672ecc593c_Lakeside_Plan%202_B_Primary_Bath.avif',
        'pos-3':
          'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69e0b9e7cea72de2d80ee381_Lakeside_Plan2_C_Primary_Bath.avif',
        'pos-4':
          'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69e0ba225f0fa8776fb8292f_Lakeside%20Plan%202_D_Primary_Bath.avif',
      },
    },
    daphne: {
      'kitchen-interior': {
        'pos-1':
          'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69ef90d666dc79d1467ab387_01_Kitchen.webp',
        'pos-2':
          'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69ef90e61071956a56e9368c_01_Kitchen%20(1).webp',
        'pos-3':
          'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69ef90fbf01e48e8adfffa76_01_Kitchen%20(2).webp',
        'pos-4':
          'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69ef910b05faf89ae1e163be_01_Kitchen%20(3).webp',
      },
      'bedroom-interior': {
        'pos-1':
          'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69ef90d63194db681b01a946_03_Primary_Bedroom.webp',
        'pos-2':
          'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69ef90e6924894609d6a9052_03_Primary_Bedroom%20(1).webp',
        'pos-3':
          'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69ef90fbf77b5f49d85d294e_03_Primary_Bedroom%20(2).webp',
        'pos-4':
          'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69ef910c3a4ad147ce6f9fbe_03_Primary_Bedroom%20(3).webp',
      },
      'living-interior': {
        'pos-1':
          'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69ef90d6a8a147379c9fcfb9_02_Great.webp',
        'pos-2':
          'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69ef90e61071956a56e93691_02_Great%20(1).webp',
        'pos-3':
          'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69ef90fbd04207dba0f0beb9_02_Great%20(2).webp',
        'pos-4':
          'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69ef910cac3cd82f989b4751_02_Great%20(3).webp',
      },
      'bathroom-interior': {
        'pos-1':
          'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69ef90d71eeaf783d1560f92_04_Primary_Bath.webp',
        'pos-2':
          'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69ef90e56a98cd0c1bfcc95c_04_Primary_Bath%20(1).webp',
        'pos-3':
          'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69ef90fadc7d53b55f8e1562_04_Primary_Bath%20(2).webp',
        'pos-4':
          'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69ef910a28b8724daebd3dfd_04_Primary_Bath%20(3).webp',
      },
    },
    // TODO: Fill Altadena-specific interior URLs per plan.
    echo: {
      'kitchen-interior': {
        'pos-1':
          'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f30e84a2556c2e8340e83a_Echo-spanish-deluxe-kitchen.webp',
        'pos-2':
          'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f30e49998825eb14cc1be9_Echo-JC-deluxe-kitchen.webp',
        'pos-3':
          'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f30df2e0808ef8214d15f3_Echo-craftsman-deluxe-kitchen.webp',
        'pos-4':
          'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f30f1f7a074e4f0d7ffe7e_Plan%205_Echo_TOD_Kitchen.webp',
      },
      'bedroom-interior': {
        'pos-1':
          'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f30e9c998825eb14cc2cf8_Echo-spanish-deluxe-bed.webp',
        'pos-2':
          'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f30e09bc658ee1f11fd7b8_Echo-craftsman-deluxe-bed.webp',
        'pos-3':
          'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f30e09bc658ee1f11fd7b8_Echo-craftsman-deluxe-bed.webp',
        'pos-4':
          'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f30f38b40ce75bfd32b682_Echo-transorg-deluxe-bed.webp',
      },
      'living-interior': {
        'pos-1':
          'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f30e7538b996d4464e7616_Echo-spanish-deluxe-living.webp',
        'pos-2':
          'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f30e400f0c6d1c38cb809e_Echo-JC-deluxe-living.webp',
        'pos-3':
          'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f30de4da9ee4c3eee17082_Echo-craftsman-deluxe-living.webp',
        'pos-4':
          'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f30f1257b2288087ee18ed_Echo-transorg-deluxe-living.webp',
      },
      'bathroom-interior': {
        'pos-1':
          'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f30e8f10299da9f17bbe55_Echo-spanish-deluxe-bath.webp',
        'pos-2':
          'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f30e585afbd045c3cb1570_Echo-JC-deluxe-bath.webp',
        'pos-3':
          'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f30dfed0195d9cec1a8a5c_Echo-craftsman-deluxe-bath.webp',
        'pos-4':
          'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f30f2a7d7edc7a31964cfa_Echo-transorg-deluxe-bath.webp',
      },
    },
    merrick: {
      'kitchen-interior': {
        'pos-1':
          'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f310d905aa3960d6d0ca3f_Merrick-spanish-deluxe-kitchen.webp',
        'pos-2':
          'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f310a3f035633b98077a18_Plan%204_Merrick_JCD_Kitchen.webp',
        'pos-3':
          'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f31062151ad0baa0dfb2e5_Merrick-craftsman-deluxe-kitchen.webp',
        'pos-4':
          'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f31106998825eb14cc95ca_Merrick-transorganic-deluxe-kitchen.webp',
      },
      'bedroom-interior': {
        'pos-1':
          'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f310ee8b86f8fc649bb9fc_Merrick-spanish-deluxe-bed.webp',
        'pos-2':
          'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f31079886983ec7158dd5f_Merrick-craftsman-deluxe-bed.webp',
        'pos-3':
          'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f31079886983ec7158dd5f_Merrick-craftsman-deluxe-bed.webp',
        'pos-4':
          'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f3111d8cbff89591af2c7b_Merrick-transorganic-deluxe-bed.webp',
      },
      'living-interior': {
        'pos-1':
          'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f310cca89e7aaf62159fd5_Merrick-spanish-deluxe-living.webp',
        'pos-2':
          'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f310596be703688df2727c_Merrick-craftsman-deluxe-living.webp',
        'pos-3':
          'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f310596be703688df2727c_Merrick-craftsman-deluxe-living.webp',
        'pos-4':
          'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f310fda87e3a09965a147f_Merrick-transorganic-deluxe-living.webp',
      },
      'bathroom-interior': {
        'pos-1':
          'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f310e2cc7b547654bc6b15_Merrick-spanish-deluxe-bath.webp',
        'pos-2':
          'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f310ae6ca87b3f22fd835f_Merrick-JC-deluxe-bath.webp',
        'pos-3':
          'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f3106ec59c1eb8425e403c_Merrick-craftsman-deluxe-bath.webp',
        'pos-4':
          'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f3111010c3674e408b4e75_Merrick-transorganic-deluxe-bath.webp',
      },
    },
    chaney: {
      'kitchen-interior': {
        'pos-1':
          'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f30d7ac3ffd2dd7a809b7e_Chaney-Spanish-deluxe-kitchen.webp',
        'pos-2':
          'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f30d472e07869f13155e8c_Chaney-JC-deluxe-kitchen.webp',
        'pos-3':
          'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f30cf9aa385c3498b7202d_Plan%203_Chaney_CD_Kitchen.webp',
        'pos-4':
          'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f30dba7bb976aa6e08d116_Chaney-Transorganic-deluxe-kitchen.webp',
      },
      'bedroom-interior': {
        'pos-1':
          'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f30d958da8eb64e6149d6b_Chaney-Spanish-deluxe-bed.webp',
        'pos-2':
          'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f30d04daa2e6bb9762b6a3_Chaney-craftsman-deluxe-bed.webp',
        'pos-3':
          'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f30d04daa2e6bb9762b6a3_Chaney-craftsman-deluxe-bed.webp',
        'pos-4':
          'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f30dd2698a6b8a638a0f62_Chaney-Transorganic-deluxe-bed.webp',
      },
      'living-interior': {
        'pos-1':
          'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f30d6cfa87a5dbb6cff509_Chaney-Spanish-deluxe-living.webp',
        'pos-2':
          'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f30cee6ece58ffdb95b02d_Chaney-craftsman-deluxe-living.webp',
        'pos-3':
          'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f30cee6ece58ffdb95b02d_Chaney-craftsman-deluxe-living.webp',
        'pos-4':
          'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f30daaa1ae19b9752835e3_Chaney-Transorganic-deluxe-living.webp',
      },
      'bathroom-interior': {
        'pos-1':
          'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f30d891dbc54fa32acf196_Chaney-Spanish-deluxe-bath.webp',
        'pos-2':
          'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f30d51649b8aeb377db921_Chaney-JC-deluxe-bath.webp',
        'pos-3':
          'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f30d1dca75262916c645a0_Chaney-craftsman-deluxe-bath.webp',
        'pos-4':
          'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f30dc4f1e4399677df6fe1_Chaney-Transorganic-deluxe-bath.webp',
      },
    },
    loma: {
      'kitchen-interior': {
        'pos-1':
          'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f30fd72aec7e9882ed1c10_Loma-spanish-deluxe-kitchen.webp',
        'pos-2':
          'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f30fa18b9923219cec734f_Loma-JC-deluxe-kitchen.webp',
        'pos-3':
          'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f30f632f2578b06c58f665_Loma-craftsman-deluxe-kitchen.webp',
        'pos-4':
          'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f3101f8713349d8ba951e9_Plan%202_Loma_TOD_Kitchen.webp',
      },
      'bedroom-interior': {
        'pos-1':
          'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f30fefb514c4d417447cdc_Loma-spanish-deluxe-bed.webp',
        'pos-2':
          'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f30f7d598de7abd1372edf_Loma-craftsman-deluxe-bed.webp',
        'pos-3':
          'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f30f7d598de7abd1372edf_Loma-craftsman-deluxe-bed.webp',
        'pos-4':
          'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f310456ece58ffdb966367_Loma-Transorganic-deluxe-bed.webp',
      },
      'living-interior': {
        'pos-1':
          'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f30fcfdd1abe0b625922cc_Loma-spanish-deluxe-living.webp',
        'pos-2':
          'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f30f5b7c61731258699e67_Loma-craftsman-deluxe-living.webp',
        'pos-3':
          'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f30f5b7c61731258699e67_Loma-craftsman-deluxe-living.webp',
        'pos-4':
          'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f31011d7c474086a08e3b1_Loma-Transorganic-deluxe-living.webp',
      },
      'bathroom-interior': {
        'pos-1':
          'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f30fe66a0ee1bab842c55e_Loma-spanish-deluxe-bath.webp',
        'pos-2':
          'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f30faf05aa3960d6d0965c_Loma-JC-deluxe-bath-1%20(1).webp',
        'pos-3':
          'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f30f72e488cb2f345f5f13_Loma-craftsman-deluxe-bath.webp',
        'pos-4':
          'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f3102e43b3a9cdcd2370b8_Loma-Transorganic-deluxe-bath.webp',
      },
    },
    sycamore: {
      'kitchen-interior': {
        'pos-1':
          'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f311ed9ffd7a429966558e_Sycamore-Spanish-Deluxe-Kitchen.webp',
        'pos-2':
          'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f31195212ceb8c83e45295_Plan%201_Sycamore_JCD_Kitchen.webp',
        'pos-3':
          'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f3115800e8e5598e38a606_Sycamore-Craftsman-Deluxe-Kitchen.webp',
        'pos-4':
          'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f3122b2136aba67418c49f_Sycamore-Transorganic-deluxe-Kitchen.webp',
      },
      'bedroom-interior': {
        'pos-1':
          'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f31209918fc34fd456726b_Sycamore-Spanish-Deluxe-bed.webp',
        'pos-2':
          'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f31174cdaec482d2866b8b_Sycamore-Craftsman-Deluxe-Bed.webp',
        'pos-3':
          'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f31174cdaec482d2866b8b_Sycamore-Craftsman-Deluxe-Bed.webp',
        'pos-4':
          'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f31242dd469ff182a5cf06_Sycamore-Transorganic-deluxe-bed.webp',
      },
      'living-interior': {
        'pos-1':
          'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f311c76bd8067956b0d5f5_Sycamore-Spanish-Deluxe-living.webp',
        'pos-2':
          'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f31150a89e7aaf6215b7d2_Sycamore-Craftsman-Deluxe-Living.webp',
        'pos-3':
          'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f31150a89e7aaf6215b7d2_Sycamore-Craftsman-Deluxe-Living.webp',
        'pos-4':
          'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f312216c007a8c914b7e86_Sycamore-Transorganic-deluxe-living.webp',
      },
      'bathroom-interior': {
        'pos-1':
          'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f311fc4be8099772b5644b_Sycamore-Spanish-Deluxe-bath.webp',
        'pos-2':
          'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f3119d8da45a8f3bc1bf9c_Sycamore-JC-Deluxe-bath.webp',
        'pos-3':
          'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f31169bfb441bd24348d5e_Sycamore-Craftsman-Deluxe-Bath.webp',
        'pos-4':
          'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f31238563e68bba79de473_Sycamore-Transorganic-deluxe-bath.webp',
      },
    },
    // TODO: replace with Sienna-specific CDN URLs once uploaded to the "Interiors - Sienna" Webflow folder
    sienna: {
      'kitchen-interior': {
        'pos-1':
          'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69e0b9b0ab4a5be30bcf9b3f_Lakeside_Plan%202_A_Kitchen.avif',
        'pos-2':
          'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69e0b9cc0f07ad276ee8c9de_Lakeside_Plan%202_B_Kitchen.avif',
        'pos-3':
          'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69e0b9ec00ea527abfe075ed_Lakeside_Plan2_C_Kitchen.avif',
        'pos-4':
          'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69e0ba27d22c956cb24df231_Lakeside%20Plan%202_D_Kitchen.avif',
      },
      'bedroom-interior': {
        'pos-1':
          'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69e0b9af1c8c47abb0a2e9fc_Lakeside_Plan%202_A_Bedroom.avif',
        'pos-2':
          'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69e0b9ccf135e0a6dcc36535_Lakeside_Plan%202_B_Primary_Bedroom.avif',
        'pos-3':
          'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69e0b9ebc8de67c028cec4c0_Lakeside_Plan2_C_Primary_Bedroom.avif',
        'pos-4':
          'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69e0ba274efd57e0baa871bf_Lakeside%20Plan%202_D_Primary_Bed.avif',
      },
      'living-interior': {
        'pos-1':
          'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69e0b9b02410ba14aaa226d5_Lakeside_Plan%202_A_Great.avif',
        'pos-2':
          'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69e0b9cc37c90f8bf7028f7e_Lakeside_Plan%202_B_Great.avif',
        'pos-3':
          'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69e0b9eb469a39c917f2e99b_Lakeside_Plan2_C_Great.avif',
        'pos-4':
          'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69e0ba28da5822300a5f5b79_Lakeside%20Plan%202_D_Great.avif',
      },
      'bathroom-interior': {
        'pos-1':
          'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69e0b9abf8fc3a0c688c5407_Lakeside_Plan%202_A_Primary_Bath.avif',
        'pos-2':
          'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69e0b9c7d96ba1672ecc593c_Lakeside_Plan%202_B_Primary_Bath.avif',
        'pos-3':
          'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69e0b9e7cea72de2d80ee381_Lakeside_Plan2_C_Primary_Bath.avif',
        'pos-4':
          'https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69e0ba225f0fa8776fb8292f_Lakeside%20Plan%202_D_Primary_Bath.avif',
      },
    },
  };

  const schemeTitleByTokenByHousePlan: Partial<
    Record<HousePlanSlugForInteriors, Record<SchemeToken, string>>
  > = {
    echo: styleTitleByToken,
    merrick: styleTitleByToken,
    chaney: styleTitleByToken,
    loma: styleTitleByToken,
    sycamore: styleTitleByToken,
  };

  const housePlanSlug =
    window.location.pathname.toLowerCase().split('/house-plans/')[1]?.split('/')[0] ?? '';
  const normalizedHousePlanSlug = housePlanSlug.replace(/^the-/, '');
  const maybeInteriorSlug = normalizedHousePlanSlug as HousePlanSlugForInteriors;
  const interiorImageUrls: InteriorImageUrls =
    housePlanImageUrlsBySlug[maybeInteriorSlug] ??
    housePlanImageUrlsBySlug.iris ??
    housePlanImageUrlsBySlug.daphne!;
  const activeSchemeTitleByToken =
    schemeTitleByTokenByHousePlan[maybeInteriorSlug] ?? schemeTitleByToken;

  // Keep titles mapped by interior + scheme so each interior can have unique package names.
  const packageTitleByInteriorAndScheme: Record<InteriorToken, Record<SchemeToken, string>> = {
    'kitchen-interior': { ...activeSchemeTitleByToken },
    'bedroom-interior': { ...activeSchemeTitleByToken },
    'living-interior': { ...activeSchemeTitleByToken },
    'bathroom-interior': { ...activeSchemeTitleByToken },
  };
  const defaultInteriorToken: InteriorToken = 'kitchen-interior';
  const defaultSchemeToken: SchemeToken = 'pos-1';
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
