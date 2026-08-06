import '$styles/explore-tabs.css';
import '$styles/gallery.css';

import { ExploreTabsController } from '$utils/explore-tabs';
import { type GalleryConfig, GalleryController } from '$utils/gallery';

const galleryConfigs: GalleryConfig[] = [
  {
    triggerSelector: '[dev-target="slide-image-wrapper"]',
    imageSelector: '[dev-target="forward-image"]',
    containerSelector: '[explore-swiper]',
  },
];

galleryConfigs.forEach((config) => {
  const element = document.querySelector(config.triggerSelector);
  if (!element) {
    console.error(`GalleryController: element not found — ${config.triggerSelector}`);
  }
});

window.Webflow ||= [];
window.Webflow.push(() => {
  const exploreTabsController = new ExploreTabsController({
    triggerToPanel: {
      'explore-plans-trigger': 'explore-plans-tab',
      'explore-adu-plans-trigger': 'explore-adu-plans-tab',
    },
  });
  exploreTabsController.init();

  const galleryController = new GalleryController(galleryConfigs);
  galleryController.init();
});
