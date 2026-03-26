import '$styles/accordion.css';
import '$styles/explore-tabs.css';
import '$styles/gallery.css';
import '$styles/lot-map.css';

import { type GalleryConfig, GalleryController } from '$utils/gallery';

const galleryConfigs: GalleryConfig[] = [
  {
    triggerSelector: '[dev-target="image-gallery"]',
    imageSelector: '[dev-target="slide-gallery-collection-image"]',
    containerSelector: '[dev-target="slide-gallery-collection-list-wrapper"]',
  },
];

window.Webflow ||= [];
window.Webflow.push(() => {
  const galleryController = new GalleryController(galleryConfigs);
  galleryController.init();
});
