import Swiper from 'swiper';
import { Keyboard, Navigation, Pagination, Thumbs } from 'swiper/modules';

interface GalleryConfig {
  /** dev-target value on the clickable trigger container */
  trigger: string;
  /** dev-target value on each <img> inside the hidden CMS list */
  imageAttr: string;
  /** CSS class of the Webflow CMS wrapper to observe for late-rendered items */
  containerClass: string;
}

const GALLERY_CONFIGS: GalleryConfig[] = [
  {
    trigger: 'image-gallery',
    imageAttr: 'hidden-main-gallery-images',
    containerClass: '.hidden-main-gallery-collection',
  },
  {
    trigger: 'community-gallery',
    imageAttr: 'hidden-community-gallery-images',
    containerClass: '.hidden-community-gallery-collection',
  },
];

/**
 * Full-screen image gallery controller.
 *
 * Supports multiple independent gallery triggers on the same page.
 * Each trigger is configured via GALLERY_CONFIGS above — add a new entry
 * to support a new gallery without touching any other code.
 */
export class GalleryController {
  private overlay: HTMLElement | null = null;
  private swiper: Swiper | null = null;
  private thumbsSwiper: Swiper | null = null;

  /** Per-config image cache, keyed by trigger dev-target value */
  private caches: Map<string, HTMLImageElement[]> = new Map();
  private observers: MutationObserver[] = [];

  init(): void {
    GALLERY_CONFIGS.forEach((config) => {
      this.caches.set(config.trigger, []);
      this.observeImages(config);
      this.bindTrigger(config);
    });

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
        config.trigger,
        Array.from(
          document.querySelectorAll<HTMLImageElement>(`img[dev-target="${config.imageAttr}"]`)
        )
      );
    };

    refresh();

    const container = document.querySelector<HTMLElement>(config.containerClass);
    if (!container) {
      console.error(`GalleryController: "${config.containerClass}" not found.`);
      return;
    }

    const observer = new MutationObserver(refresh);
    observer.observe(container, { childList: true, subtree: true });
    this.observers.push(observer);
  }

  /** Attach a click listener to all trigger elements for a config. */
  private bindTrigger(config: GalleryConfig): void {
    const triggers = document.querySelectorAll<HTMLElement>(`[dev-target="${config.trigger}"]`);

    if (!triggers.length) return;

    triggers.forEach((trigger) => {
      trigger.addEventListener('click', (e) => {
        if (!(e.target as HTMLElement).closest('img')) return;

        const imgs = this.caches.get(config.trigger) ?? [];
        if (!imgs.length) {
          console.error(`GalleryController: No images cached for "${config.trigger}".`);
          return;
        }

        this.open(imgs, 0);
      });
    });
  }

  private open(imgs: HTMLImageElement[], startIndex: number): void {
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

    imgs.forEach((img) => {
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
      initialSlide: startIndex,
      loop: imgs.length > 1,
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
