import '$styles/explore-tabs.css';
import '$styles/gallery.css';

import { ExploreTabsController } from '$utils/explore-tabs';
import { GalleryController } from '$utils/gallery';

window.Webflow ||= [];
window.Webflow.push(() => {
  const exploreTabsController = new ExploreTabsController({
    triggerToPanel: {
      'explore-plans-trigger': 'explore-plans-tab',
      'explore-adu-plans-trigger': 'explore-adu-plans-tab',
    },
  });
  exploreTabsController.init();

  // Slide galleries are wired globally via bindSlideGalleries(); no CMS config needed here.
  const galleryController = new GalleryController([]);
  galleryController.init();
});
