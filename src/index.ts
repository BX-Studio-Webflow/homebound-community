import '$styles/accordion.css';
import '$styles/explore-tabs.css';
import '$styles/gallery.css';
import '$styles/lot-map.css';

import { AccordionController } from '$utils/accordion';
import { ExploreTabsController } from '$utils/explore-tabs';
import { type GalleryConfig, GalleryController } from '$utils/gallery';
import { type HeroVideoConfig, HeroVideoController } from '$utils/hero-video';
import { type ColorSchemeBinding, ColorSchemeController } from '$utils/interior-color-scheme';
import { lotMapConfigFromLocation, LotMapController } from '$utils/lot-map';
import { StickyNavController } from '$utils/sticky-nav';

const galleryConfigs: GalleryConfig[] = [
  {
    triggerSelector: '[dev-target="image-gallery"]',
    imageSelector: '[dev-target="hidden-main-gallery-images"]',
    containerSelector: '[hero-swiper]',
  },
  {
    triggerSelector: '[dev-target="community-gallery"]',
    imageSelector: 'img[dev-target="hidden-community-gallery-images"]',
    containerSelector: '.hidden-community-gallery-collection',
  },
];

const heroVideoConfigs: HeroVideoConfig[] = [
  {
    enabled: true,
    pathname: '/upcoming-communities/lakeside',
    videoUrl:
      'https://player.vimeo.com/progressive_redirect/playback/1180975407/rendition/1080p/file.mp4%20%281080p%29.mp4?loc=external&signature=2079a861de0de589c730b923f58d52e8ce30e098c37a9c2b8afde2ec25c79236',
    title: 'The Villas at Lakeside video',
    index: 0,
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
  const heroVideoController = new HeroVideoController(heroVideoConfigs);
  heroVideoController.init();

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

  const lotMapController = new LotMapController(lotMapConfigFromLocation());
  void lotMapController.init();
});
