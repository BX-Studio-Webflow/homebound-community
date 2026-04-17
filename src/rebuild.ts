import '$styles/accordion.css';
import '$styles/explore-tabs.css';
import '$styles/gallery.css';
import '$styles/lot-map.css';
import '$styles/rebuild-map.css';

import { type GalleryConfig, GalleryController } from '$utils/gallery';
import { RebuildMapController } from '$utils/rebuild-map';

const galleryConfigs: GalleryConfig[] = [
  {
    triggerSelector: '[dev-target="slide-image-wrapper"]',
    imageSelector: '[dev-target="forward-image"]',
    containerSelector: '[explore-swiper]',
  },
];

window.Webflow ||= [];
window.Webflow.push(() => {
  const galleryController = new GalleryController(galleryConfigs);
  galleryController.init();

  const rebuildMapController = new RebuildMapController();
  rebuildMapController.init();
});
