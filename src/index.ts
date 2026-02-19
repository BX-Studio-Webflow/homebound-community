import '$styles/accordion.css';
import '$styles/gallery.css';

import { AccordionController } from '$utils/accordion';
import { GalleryController } from '$utils/gallery';
import { StickyNavController } from '$utils/sticky-nav';

window.Webflow ||= [];
window.Webflow.push(() => {
  const stickyNavController = new StickyNavController();
  stickyNavController.init();

  const galleryController = new GalleryController();
  galleryController.init();

  const accordionController = new AccordionController();
  accordionController.init();
});
