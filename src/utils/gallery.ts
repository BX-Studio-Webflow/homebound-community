import Swiper from 'swiper';
import { Keyboard, Navigation, Pagination, Thumbs } from 'swiper/modules';

/**
 * Full-screen image gallery controller.
 *
 * Clicking any image inside [dev-target="image-gallery"] opens the gallery.
 * Slides are sourced from img[dev-target="hidden-main-gallery-images"] elements
 * (the dev-target is on the <img> itself inside the Webflow CMS list).
 * A MutationObserver on .hidden-main-gallery-collection keeps the cache fresh
 * for images that render after initial page paint.
 */
export class GalleryController {
  private overlay: HTMLElement | null = null;
  private swiper: Swiper | null = null;
  private thumbsSwiper: Swiper | null = null;
  private cachedImgs: HTMLImageElement[] = [];
  private imgObserver: MutationObserver | null = null;

  init(): void {
    const galleries = document.querySelectorAll<HTMLElement>('[dev-target="image-gallery"]');

    if (!galleries.length) {
      console.error('GalleryController: No [dev-target="image-gallery"] elements found.');
      return;
    }

    this.observeGalleryImages();

    galleries.forEach((gallery) => {
      gallery.addEventListener('click', (e) => {
        if (!(e.target as HTMLElement).closest('img')) return;

        if (!this.cachedImgs.length) {
          console.error(
            'GalleryController: No images found in img[dev-target="hidden-main-gallery-images"].'
          );
          return;
        }

        this.open(this.cachedImgs, 0);
      });
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.close();
    });
  }

  /**
   * Cache all img[dev-target="hidden-main-gallery-images"] elements.
   * The dev-target is on each <img> directly (Webflow CMS list pattern).
   * Observes .hidden-main-gallery-collection so dynamically rendered
   * CMS items are picked up after the initial page paint.
   */
  private observeGalleryImages(): void {
    const refresh = () => {
      this.cachedImgs = Array.from(
        document.querySelectorAll<HTMLImageElement>('img[dev-target="hidden-main-gallery-images"]')
      );
    };

    refresh();

    const container = document.querySelector<HTMLElement>('.hidden-main-gallery-collection');
    if (!container) {
      console.error('GalleryController: .hidden-main-gallery-collection not found.');
      return;
    }

    this.imgObserver = new MutationObserver(refresh);
    this.imgObserver.observe(container, { childList: true, subtree: true });
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
      // Main slide
      const slide = document.createElement('div');
      slide.className = 'swiper-slide';
      const slideImg = document.createElement('img');
      slideImg.src = img.src;
      slideImg.alt = img.alt;
      if (img.srcset) slideImg.srcset = img.srcset;
      if (img.sizes) slideImg.sizes = img.sizes;
      slide.appendChild(slideImg);
      mainWrapper.appendChild(slide);

      // Thumb slide
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

    // Init thumbs swiper first so it can be passed to the main swiper
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
    this.imgObserver?.disconnect();
    this.imgObserver = null;
    this.close();
  }
}
