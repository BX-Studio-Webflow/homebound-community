import '$styles/accordion.css';
import '$styles/explore-tabs.css';
import '$styles/gallery.css';
import '$styles/lot-map.css';

import { AccordionController } from '$utils/accordion';
import { GalleryController } from '$utils/gallery';

window.Webflow ||= [];
window.Webflow.push(() => {
  const galleryController = new GalleryController([]);
  galleryController.init();

  const accordionController = new AccordionController();
  accordionController.init();
});
