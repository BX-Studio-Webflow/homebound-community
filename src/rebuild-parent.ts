import '$styles/accordion.css';
import '$styles/explore-tabs.css';
import '$styles/gallery.css';
import '$styles/lot-map.css';

import { AccordionController } from '$utils/accordion';
import { type GalleryConfig, GalleryController } from '$utils/gallery';

const galleryConfigs: GalleryConfig[] = [
  {
    triggerSelector: '[dev-target="slide-image-wrapper"]',
    imageSelector: '[dev-target="forward-image"]',
    containerSelector: '[explore-swiper]',
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
  const galleryController = new GalleryController(galleryConfigs);
  galleryController.init();

  const accordionController = new AccordionController();
  accordionController.init();
});
