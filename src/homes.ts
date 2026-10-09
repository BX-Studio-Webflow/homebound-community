import '$styles/carto.css';
import '$styles/gallery.css';
import '$styles/inventory-features.css';

import { type GalleryConfig, GalleryController } from '$utils/gallery';
import { InventoryController } from '$utils/inventory';
import { InventoryFeaturesController } from '$utils/inventory-features';

const galleryConfigs: GalleryConfig[] = [
  {
    triggerSelector: '[dev-target="image-gallery"]',
    imageSelector: '[dev-target="hero-slider"] img',
    containerSelector: '[dev-target="hero-slider"]',
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
  const galleryController = new GalleryController(galleryConfigs);
  galleryController.init();

  const inventoryController = new InventoryController();
  inventoryController.init();

  const inventoryFeaturesController = new InventoryFeaturesController();
  inventoryFeaturesController.init();
});
