import '$styles/accordion.css';
import '$styles/explore-tabs.css';
import '$styles/gallery.css';
import '$styles/lot-map.css';

import { AccordionController } from '$utils/accordion';
import { type ColorSchemeBinding, ColorSchemeController } from '$utils/color-scheme';
import { ExploreTabsController } from '$utils/explore-tabs';
import { type GalleryConfig, GalleryController } from '$utils/gallery';
import { LotMapController } from '$utils/lot-map';
import { StickyNavController } from '$utils/sticky-nav';

const galleryConfigs: GalleryConfig[] = [
  {
    triggerSelector: '[dev-target="image-gallery"]',
    imageSelector: 'img[dev-target="hidden-main-gallery-images"]',
    containerSelector: '.hidden-main-gallery-collection',
  },
  {
    triggerSelector: '[dev-target="community-gallery"]',
    imageSelector: 'img[dev-target="hidden-community-gallery-images"]',
    containerSelector: '.hidden-community-gallery-collection',
  },
];

window.Webflow ||= [];
window.Webflow.push(() => {
  const stickyNavController = new StickyNavController();
  stickyNavController.init();

  const galleryController = new GalleryController(galleryConfigs);
  galleryController.init();

  const accordionController = new AccordionController();
  accordionController.init();

  const exploreTabsController = new ExploreTabsController();
  exploreTabsController.init();

  const exploreColorRoots = Array.from(
    document.querySelectorAll<HTMLElement>('[dev-target="explore-image-colors"]')
  );
  const exploreColorBindings: ColorSchemeBinding[] = exploreColorRoots.flatMap((root) => {
    const forwardImage = root.querySelector<HTMLImageElement>(
      'img[dev-target="exploration-forward-image"]'
    );
    if (!forwardImage) return [];

    const schemeButtons = Array.from<HTMLElement>(root.querySelectorAll('[dev-target$="-scheme"]'));
    if (!schemeButtons.length) return [];

    const schemeImagesByToken = new Map<string, HTMLImageElement>();
    schemeButtons.forEach((btn) => {
      const token = btn.getAttribute('dev-target');
      if (!token) return;

      const schemeImg = root.querySelector<HTMLImageElement>(`img[dev-target="${token}-image"]`);
      if (!schemeImg) {
        console.error(
          `ColorSchemeController (explore-image-colors): no hidden scheme image for token "${token}".`
        );
        return;
      }

      schemeImagesByToken.set(token, schemeImg);
    });

    if (!schemeImagesByToken.size) return [];

    return [
      {
        forwardImage,
        schemeButtons,
        schemeImagesByToken,
        visual: {
          activeStrokeWidth: 0.5,
          inactiveStrokeWidth: 2,
          activeCircleRadius: 22.25,
          inactiveCircleRadius: 21.5,
        },
      },
    ];
  });

  if (exploreColorBindings.length) {
    const colorSchemeController = new ColorSchemeController({ bindings: exploreColorBindings });
    colorSchemeController.init();
  }

  const lotMapController = new LotMapController();
  lotMapController.init();
});
