import '$styles/accordion.css';
import '$styles/explore-tabs.css';
import '$styles/gallery.css';
import '$styles/home-map.css';
import '$styles/lot-map.css';

import { ExploreTabsController } from '$utils/explore-tabs';
/*import { type GalleryConfig } from '$utils/gallery';*/
import { HomeMapController } from '$utils/home-map';
import { type LotMapConfig, LotMapController } from '$utils/lot-map';
import { type StickyNavConfig, StickyNavController } from '$utils/sticky-nav';

/*const galleryConfigs: GalleryConfig[] = [
  {
    triggerSelector: '[dev-target="image-gallery"]',
    imageSelector: 'img[dev-target="hidden-main-gallery-images"]',
    containerSelector: '.hidden-main-gallery-collection',
  },
  {
    triggerSelector: '[dev-target="community-gallery"]',
    imageSelector: 'img[dev-target="hidden-community-gallery-images"]',
    containerSelector: '.hidden-community-gallery-collection',
  },
];*/

const stickyNavConfig: StickyNavConfig = {
  linkSelector: '.tab-links[dev-target]',
  navContainerSelector: '.tab-header',
  stripSelector: '[dev-target="tab-left"]',
  mobileBreakpoint: 767,
  observerRootMargin: '-10% 0px -85% 0px',
  observerThreshold: 0,
  sectionMap: {
    overview: 'overview-section',
    'floor-plans': 'floor-plans-section',
    'explore-spaces': 'explore-spaces-section',
    location: 'location-section',
    'available-homes': 'available-homes-section',
    community: 'community-section',
  },
  sectionOrder: [
    'overview',
    'floor-plans',
    'explore-spaces',
    'location',
    'available-homes',
    'community',
  ],
};

window.Webflow ||= [];
window.Webflow.push(() => {
  const lot = document.querySelector('[dev-target="one-lot"]');
  if (!lot) {
    console.error('LotMapController: No [dev-target="one-lot"] found.');
    return;
  }
  const lotNumber = lot.getAttribute('lot-number');
  if (!lotNumber) {
    console.error('LotMapController: No data-lot-number found.');
    return;
  }
  const lotMapConfig: LotMapConfig = {
    focusLotNumber: lotNumber,
    isZoomMode: true,
    focusZoomFactor: 2.5,
  };

  const lotMapController = new LotMapController(lotMapConfig);
  lotMapController.init();
  const stickyNavController = new StickyNavController(stickyNavConfig);
  stickyNavController.init();

  //const galleryController = new GalleryController(galleryConfigs);
  //galleryController.init();

  const exploreTabsController = new ExploreTabsController();
  exploreTabsController.init();

  HomeMapController.initAll();
});
