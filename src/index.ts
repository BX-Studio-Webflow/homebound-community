import '$styles/gallery.css';

import { GalleryController } from '$utils/gallery';
import { StickyNavController } from '$utils/sticky-nav';

window.Webflow ||= [];
window.Webflow.push(() => {
  const stickyNavController = new StickyNavController();
  stickyNavController.init();

  const galleryController = new GalleryController();
  galleryController.init();
});
