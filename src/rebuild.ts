import '$styles/accordion.css';
import '$styles/explore-tabs.css';
import '$styles/gallery.css';
import '$styles/lot-map.css';
import '$styles/rebuild-map.css';

import { type GalleryConfig } from '$utils/gallery';
import { RebuildMapController } from '$utils/rebuild-map';

const galleryConfigs: GalleryConfig[] = [
  {
    triggerSelector: '[dev-target="slide-image-wrapper"]',
    imageSelector: '[dev-target="forward-image"]',
    containerSelector: '[explore-swiper]',
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
  //const galleryController = new GalleryController(galleryConfigs);
  //galleryController.init();

  const rebuildMapController = new RebuildMapController();
  rebuildMapController.init();
});
