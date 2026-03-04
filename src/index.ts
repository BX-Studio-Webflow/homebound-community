import '$styles/accordion.css';
import '$styles/gallery.css';
import '$styles/lot-map.css';

import { AccordionController } from '$utils/accordion';
import { GalleryController } from '$utils/gallery';
import { LotMapController } from '$utils/lot-map';
import { StickyNavController } from '$utils/sticky-nav';

window.Webflow ||= [];
window.Webflow.push(() => {
  const stickyNavController = new StickyNavController();
  stickyNavController.init();

  const galleryController = new GalleryController();
  galleryController.init();

  const accordionController = new AccordionController();
  accordionController.init();

  const lotMapController = new LotMapController();
  lotMapController.init();
});
