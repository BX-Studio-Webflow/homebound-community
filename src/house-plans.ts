import '$styles/accordion.css';
import '$styles/explore-tabs.css';
import '$styles/gallery.css';
import '$styles/lot-map.css';

import { AccordionController } from '$utils/accordion';
import { type ColorSchemeBinding, ColorSchemeController } from '$utils/color-scheme';
import { ExploreTabsController } from '$utils/explore-tabs';
import { type GalleryConfig, GalleryController } from '$utils/gallery';
import { HomeMapController } from '$utils/home-map';
import { LotMapController } from '$utils/lot-map';
import { StickyNavController } from '$utils/sticky-nav';

const galleryConfigs: GalleryConfig[] = [
  {
    triggerSelector: '[dev-target="image-gallery"]',
    imageSelector: '[dev-target="hidden-main-gallery-images"]',
    containerSelector: '[hero-swiper]',
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
  const stickyNavController = new StickyNavController();
  stickyNavController.init();

  const galleryController = new GalleryController(galleryConfigs);
  galleryController.init();

  const exploreTabsController = new ExploreTabsController({
    isHousePlansGallery: true,
    firstTabSelector: '[dev-target="first-tab"]',
    secondTabSelector: '[dev-target="second-tab"]',
  });
  exploreTabsController.init();

  const slideEls = Array.from(
    document.querySelectorAll<HTMLElement>('[dev-target="other-swiper-slide"]')
  );
  const colorSchemeBindings: ColorSchemeBinding[] = slideEls.flatMap((slide) => {
    const forwardImage = slide.querySelector<HTMLImageElement>('img[dev-target="forward-image"]');
    if (!forwardImage) return [];

    const schemeButtons = Array.from(
      slide.querySelectorAll<HTMLElement>('[dev-target$="-scheme"]')
    );
    if (!schemeButtons.length) return [];

    const schemeImagesByToken = new Map<string, HTMLImageElement>();
    schemeButtons.forEach((btn) => {
      const token = btn.getAttribute('dev-target');
      if (!token) return;

      const schemeImg = slide.querySelector<HTMLImageElement>(`img[dev-target="${token}-image"]`);
      if (!schemeImg) {
        console.error(
          `ColorSchemeController (house-plans): no hidden scheme image for token "${token}".`
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
      },
    ];
  });

  const colorSchemeController = new ColorSchemeController({ bindings: colorSchemeBindings });
  colorSchemeController.init();

  const lotMapController = new LotMapController();
  lotMapController.init();

  const accordionController = new AccordionController();
  accordionController.init();

  HomeMapController.initAll();
});
