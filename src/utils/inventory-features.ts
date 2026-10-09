/**
 * Inventory page features section.
 *
 * Focusing a feature (list click, next arrow, or a horizontal swipe on the
 * image) marks that row active and crossfades the section image. A feature
 * with no CMS image keeps the image that was already on the display.
 *
 * **Required Webflow markup**
 *
 * | Element | Attribute / class | Value |
 * |---------|-------------------|-------|
 * | Section root | class | `inv_features-inner` |
 * | Feature row | class + `dev-target` | `feature-item` |
 * | Hidden CMS image | `dev-target` | `feature-image` |
 * | Visible image | class + `dev-target` | `inv_features-image` / `feature-image-display` |
 * | Next arrow | class | `inv_features-cta` |
 * | Swipe target | class | `inv_features-media` |
 * | CMS item wrapper | class | `w-dyn-item` |
 * | List | class | `inv_features-list` |
 *
 * Fade duration must stay in sync with `.inv_features-image` in
 * `src/styles/inventory-features.css`.
 */

const SWIPE_MIN_PX = 40;
const FADE_MS = 200;
const MOBILE_LIST_QUERY = '(max-width: 767px)';

type ImageSource = {
  src: string | null;
  srcset: string | null;
  sizes: string | null;
};

type FeatureSlide = ImageSource & {
  item: HTMLElement;
  wrapper: HTMLElement;
  label: string;
};

export class InventoryFeaturesController {
  init(): void {
    const roots = document.querySelectorAll<HTMLElement>('.inv_features-inner');
    if (!roots.length) {
      console.error('InventoryFeaturesController: No .inv_features-inner sections found.');
      return;
    }

    roots.forEach((root) => this.bindSection(root));
  }

  private bindSection(root: HTMLElement): void {
    const items = [...root.querySelectorAll<HTMLElement>('[dev-target="feature-item"]')];
    const display = root.querySelector<HTMLImageElement>('[dev-target="feature-image-display"]');
    const list = root.querySelector<HTMLElement>('.inv_features-list');
    const nextBtn = root.querySelector<HTMLElement>('.inv_features-cta');
    const media = root.querySelector<HTMLElement>('.inv_features-media');

    if (!items.length || !display) {
      console.error(
        'InventoryFeaturesController: Missing feature items or [dev-target="feature-image-display"].'
      );
      return;
    }

    const fallback: ImageSource = {
      src: display.getAttribute('src'),
      srcset: display.getAttribute('srcset'),
      sizes: display.getAttribute('sizes'),
    };

    const slides: FeatureSlide[] = items.map((item) => {
      const source = this.readFeatureImage(
        item.querySelector<HTMLImageElement>('[dev-target="feature-image"]')
      );
      return {
        item,
        wrapper: item.closest<HTMLElement>('.w-dyn-item') ?? item,
        label: item.textContent?.trim() ?? '',
        src: source?.src ?? null,
        srcset: source?.srcset ?? null,
        sizes: source?.sizes ?? null,
      };
    });

    slides.forEach((slide) => {
      if (!slide.src) return;
      const preloaded = new Image();
      if (slide.srcset) preloaded.srcset = slide.srcset;
      preloaded.src = slide.src;
    });

    let current = -1;
    let swapToken = 0;

    const showImage = (slide: FeatureSlide): void => {
      const next = slide.src ? slide : fallback;
      if (display.getAttribute('src') === next.src) {
        display.alt = slide.label;
        return;
      }

      swapToken += 1;
      const token = swapToken;
      display.classList.add('is-swapping');
      window.setTimeout(() => {
        if (token !== swapToken) return;
        this.setAttr(display, 'srcset', next.srcset);
        this.setAttr(display, 'sizes', next.srcset ? next.sizes || '100vw' : null);
        if (next.src) display.src = next.src;
        display.alt = slide.label;

        const reveal = (): void => {
          if (token === swapToken) display.classList.remove('is-swapping');
        };
        if (display.complete) reveal();
        else display.addEventListener('load', reveal, { once: true });
      }, FADE_MS);
    };

    const go = (index: number): void => {
      const nextIndex = (index + slides.length) % slides.length;
      if (nextIndex === current) return;

      slides.forEach((slide, n) => {
        const active = n === nextIndex;
        slide.item.classList.toggle('is-active', active);
        slide.wrapper.classList.toggle('is-active', active);
        if (active) slide.item.setAttribute('aria-current', 'true');
        else slide.item.removeAttribute('aria-current');
      });

      const slide = slides[nextIndex];
      if (slide) {
        showImage(slide);
        this.scrollActiveIntoView(list, slide.wrapper);
      }
      current = nextIndex;
    };

    slides.forEach((slide, n) => {
      this.bindActivate(slide.item, () => go(n));
    });

    if (nextBtn) {
      if (slides.length < 2) {
        nextBtn.style.display = 'none';
      } else {
        nextBtn.setAttribute('aria-label', 'Next feature');
        this.bindActivate(nextBtn, () => go(current + 1));
      }
    }

    if (media && slides.length > 1) {
      this.bindSwipe(media, (direction) => go(current + direction));
    }

    go(0);
  }

  /** Keeps the active row in the mobile list without scrolling the page. */
  private scrollActiveIntoView(list: HTMLElement | null, item: HTMLElement): void {
    if (!list || !window.matchMedia(MOBILE_LIST_QUERY).matches) return;

    const listRect = list.getBoundingClientRect();
    const itemRect = item.getBoundingClientRect();
    if (itemRect.top < listRect.top) {
      list.scrollTop -= listRect.top - itemRect.top;
    } else if (itemRect.bottom > listRect.bottom) {
      list.scrollTop += itemRect.bottom - listRect.bottom;
    }
  }

  private readFeatureImage(img: HTMLImageElement | null): ImageSource | null {
    if (!img || img.classList.contains('w-dyn-bind-empty')) return null;
    const src = img.getAttribute('src');
    if (!src) return null;
    return {
      src,
      srcset: img.getAttribute('srcset'),
      sizes: img.getAttribute('sizes'),
    };
  }

  private setAttr(el: HTMLElement, name: string, value: string | null): void {
    if (value) el.setAttribute(name, value);
    else el.removeAttribute(name);
  }

  private bindActivate(el: HTMLElement, onActivate: () => void): void {
    el.setAttribute('role', 'button');
    el.setAttribute('tabindex', '0');
    el.addEventListener('click', onActivate);
    el.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      onActivate();
    });
  }

  private bindSwipe(media: HTMLElement, onSwipe: (direction: 1 | -1) => void): void {
    let startX: number | null = null;
    let startY: number | null = null;

    media.addEventListener(
      'touchstart',
      (event) => {
        const touch = event.touches[0];
        if (!touch) return;
        startX = touch.clientX;
        startY = touch.clientY;
      },
      { passive: true }
    );

    media.addEventListener(
      'touchend',
      (event) => {
        if (startX === null || startY === null) return;
        const originX = startX;
        const originY = startY;
        startX = null;
        startY = null;

        const touch = event.changedTouches[0];
        if (!touch) return;
        const dx = touch.clientX - originX;
        const dy = touch.clientY - originY;
        if (Math.abs(dx) < SWIPE_MIN_PX || Math.abs(dx) < Math.abs(dy)) return;
        onSwipe(dx < 0 ? 1 : -1);
      },
      { passive: true }
    );
  }
}
