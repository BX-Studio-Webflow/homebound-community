import Swiper from 'swiper';
import { Keyboard, Navigation, Pagination, Thumbs } from 'swiper/modules';

import {
  getExteriorImageUrlsForStyle,
  getHousePlanSlugFromPath,
} from '$utils/exterior-scheme-modal';

export interface GalleryConfig {
  /** Full selector for the clickable trigger region (e.g. `[dev-target="image-gallery"]`). */
  triggerSelector: string;
  /** Full selector for each gallery image in the hidden CMS list (e.g. `img[dev-target="…"]`). */
  imageSelector: string;
  /** Full selector for the CMS list wrapper to observe for late-rendered items (class or attribute). */
  containerSelector: string;
}

/**
 * Full-screen image gallery controller.
 *
 * Supports multiple independent gallery triggers on the same page.
 * Pass a {@link GalleryConfig} array from the entry script (e.g. `index.ts`) for each
 * trigger + hidden CMS list pair. Slide / mobile lightbox behaviour is always wired.
 */
export class GalleryController {
  private static readonly MAX_GALLERY_IMAGES = 25;

  private overlay: HTMLElement | null = null;
  private swiper: Swiper | null = null;
  private thumbsSwiper: Swiper | null = null;

  /** Per-config image cache, keyed by {@link GalleryConfig.triggerSelector} */
  private caches: Map<string, HTMLImageElement[]> = new Map();
  private observers: MutationObserver[] = [];
  constructor(private readonly configs: GalleryConfig[]) {
    this.configs = configs;
  }

  init(): void {
    this.configs.forEach((config) => {
      this.caches.set(config.triggerSelector, []);
      this.observeImages(config);
      this.bindTrigger(config);
    });

    this.bindSlideGalleries();
    this.bindMobileGallery();

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.close();
    });
  }

  /**
   * Seed and maintain the image cache for a single gallery config.
   * Observes the Webflow CMS wrapper so images added after page paint are captured.
   */
  private observeImages(config: GalleryConfig): void {
    const refresh = () => {
      this.caches.set(
        config.triggerSelector,
        Array.from(document.querySelectorAll<HTMLImageElement>(config.imageSelector))
      );
    };

    refresh();

    const container = document.querySelector<HTMLElement>(config.containerSelector);
    if (!container) {
      console.error(`GalleryController: container not found — ${config.containerSelector}`);
      return;
    }

    const observer = new MutationObserver(refresh);
    observer.observe(container, { childList: true, subtree: true });
    this.observers.push(observer);
  }

  /** Attach a click listener to all trigger elements for a config. */
  private bindTrigger(config: GalleryConfig): void {
    const triggers = document.querySelectorAll<HTMLElement>(config.triggerSelector);

    if (!triggers.length) return;

    triggers.forEach((trigger) => {
      trigger.addEventListener('click', () => {
        const imgs = this.caches.get(config.triggerSelector) ?? [];
        if (!imgs.length) {
          console.error(
            `GalleryController: No images cached for trigger ${config.triggerSelector}.`
          );
          return;
        }

        this.open(imgs, 0);
      });
    });
  }

  /**
   * Per-slide gallery: clicking [dev-target="slide-image-wrapper"] opens a gallery
   * populated from that slide's own [dev-target="slide-gallery-collection-image"] images.
   * Images are queried at click time so no cache or MutationObserver is needed.
   */
  private bindSlideGalleries(): void {
    document.addEventListener('click', (e) => {
      const clickTarget = e.target as HTMLElement;
      if (
        clickTarget.closest('[dev-target="scheme-header"]') ||
        clickTarget.closest('[dev-target="scheme-body"]') ||
        clickTarget.closest('[dev-target="scheme-arrow"]') ||
        clickTarget.closest('[dev-target="scheme-item"]')
      ) {
        return;
      }

      const wrapper = (e.target as HTMLElement).closest('[dev-target="slide-image-wrapper"]');
      if (!wrapper) return;

      const slide = wrapper.closest('.swiper-slide');
      if (!slide) return;

      const imgs = this.resolveSlideGalleryImages(slide as HTMLElement);

      if (!imgs.length) return;

      this.open(imgs, 0);
    });
  }

  private resolveSlideGalleryImages(slide: HTMLElement): HTMLImageElement[] {
    const chooseFrom = slide.getAttribute('choose-from')?.toLowerCase();
    const shouldUseExteriorSet =
      chooseFrom === 'exterior-schema' || chooseFrom === 'exterior-scheme';

    if (shouldUseExteriorSet) {
      const exteriorImages = this.getExteriorImagesForSlide(slide);
      if (exteriorImages.length) return exteriorImages;
    }

    // Backward compatibility: keep existing per-slide CMS image source.
    return Array.from(
      slide.querySelectorAll<HTMLImageElement>('img[dev-target="slide-gallery-collection-image"]')
    );
  }

  private getExteriorImagesForSlide(slide: HTMLElement): HTMLImageElement[] {
    const planSlug = getHousePlanSlugFromPath();
    if (!planSlug) return [];

    const exteriorStyle = slide.getAttribute('exterior-style')?.toLowerCase() ?? '';
    const urls = getExteriorImageUrlsForStyle(planSlug, exteriorStyle);
    return urls.map((url) => this.createImageElement(url));
  }

  private createImageElement(url: string): HTMLImageElement {
    const img = document.createElement('img');
    img.src = url;
    img.alt = '';
    return img;
  }

  /**
   * Mobile gallery: clicking `[dev-target="mobile-slide-image-wrapper"]` opens a lightbox
   * with all `[dev-target="mobile-slide-image"]` images from the parent
   * `[dev-target="mobile-swiper"]`, starting at the clicked slide's index.
   */
  private bindMobileGallery(): void {
    document.addEventListener('click', (e) => {
      const wrapper = (e.target as HTMLElement).closest(
        '[dev-target="mobile-slide-image-wrapper"]'
      );
      if (!wrapper) return;

      const swiper = wrapper.closest('[dev-target="mobile-swiper"]');
      if (!swiper) return;

      const allSlides = Array.from(
        swiper.querySelectorAll<HTMLElement>('[dev-target="mobile-slide"]')
      );
      const clickedSlide = wrapper.closest('[dev-target="mobile-slide"]');
      const startIndex = clickedSlide ? allSlides.indexOf(clickedSlide as HTMLElement) : 0;

      const imgs = allSlides
        .map((slide) => slide.querySelector<HTMLImageElement>('[dev-target="mobile-slide-image"]'))
        .filter((img): img is HTMLImageElement => img !== null);

      if (!imgs.length) return;

      this.open(imgs, Math.max(0, startIndex));
    });
  }

  private open(imgs: HTMLImageElement[], startIndex: number): void {
    const limitedImgs = imgs.slice(0, GalleryController.MAX_GALLERY_IMAGES);
    if (!limitedImgs.length) return;

    const boundedStartIndex = Math.min(Math.max(0, startIndex), limitedImgs.length - 1);

    this.close();

    this.overlay = document.createElement('div');
    this.overlay.className = 'hb-gallery-overlay';
    this.overlay.innerHTML = `
      <button class="hb-gallery-close" aria-label="Close gallery">&#x2715;</button>
      <div class="hb-gallery-main-wrap">
        <div class="swiper hb-gallery-swiper">
          <div class="swiper-wrapper"></div>
          <div class="swiper-button-prev"></div>
          <div class="swiper-button-next"></div>
          <div class="swiper-pagination"></div>
        </div>
        <div class="swiper hb-gallery-thumbs">
          <div class="swiper-wrapper"></div>
        </div>
      </div>
    `;

    const mainWrapper = this.overlay.querySelector<HTMLElement>(
      '.hb-gallery-swiper .swiper-wrapper'
    )!;
    const thumbWrapper = this.overlay.querySelector<HTMLElement>(
      '.hb-gallery-thumbs .swiper-wrapper'
    )!;

    limitedImgs.forEach((img) => {
      const slide = document.createElement('div');
      slide.className = 'swiper-slide';
      const slideImg = document.createElement('img');
      slideImg.src = img.src;
      slideImg.alt = img.alt;
      if (img.srcset) slideImg.srcset = img.srcset;
      if (img.sizes) slideImg.sizes = img.sizes;
      slide.appendChild(slideImg);
      mainWrapper.appendChild(slide);

      const thumbSlide = document.createElement('div');
      thumbSlide.className = 'swiper-slide';
      const thumbImg = document.createElement('img');
      thumbImg.src = img.src;
      thumbImg.alt = img.alt;
      thumbSlide.appendChild(thumbImg);
      thumbWrapper.appendChild(thumbSlide);
    });

    document.body.appendChild(this.overlay);
    document.body.style.overflow = 'hidden';

    this.overlay.querySelector('.hb-gallery-close')!.addEventListener('click', () => this.close());
    this.overlay.addEventListener('click', (e) => {
      if (e.target === this.overlay) this.close();
    });

    this.thumbsSwiper = new Swiper('.hb-gallery-thumbs', {
      slidesPerView: 'auto',
      spaceBetween: 8,
      watchSlidesProgress: true,
      freeMode: true,
    });

    this.swiper = new Swiper('.hb-gallery-swiper', {
      modules: [Navigation, Pagination, Keyboard, Thumbs],
      initialSlide: boundedStartIndex,
      loop: limitedImgs.length > 1,
      keyboard: { enabled: true },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      pagination: {
        el: '.swiper-pagination',
        type: 'fraction',
      },
      thumbs: {
        swiper: this.thumbsSwiper,
      },
    });

    requestAnimationFrame(() => {
      this.overlay?.classList.add('is-open');
    });
  }

  private close(): void {
    if (!this.overlay) return;

    this.overlay.classList.remove('is-open');
    document.body.style.overflow = '';

    const onTransitionEnd = () => {
      this.thumbsSwiper?.destroy(true, true);
      this.thumbsSwiper = null;
      this.swiper?.destroy(true, true);
      this.swiper = null;
      this.overlay?.remove();
      this.overlay = null;
    };

    this.overlay.addEventListener('transitionend', onTransitionEnd, { once: true });
  }

  destroy(): void {
    this.observers.forEach((o) => o.disconnect());
    this.observers = [];
    this.close();
  }
}
