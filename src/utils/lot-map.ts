/**
 * Interactive lot map controller for Webflow CMS pages.
 *
 * Responsibilities:
 * - Parses SVG markup from a hidden holder element and injects it into the DOM.
 * - Enables mouse-wheel zoom, click/middle-click drag pan, and touch pinch-to-zoom.
 * - Injects +/− zoom control buttons at runtime.
 * - Wires bidirectional hover between SVG lot groups and right-panel CMS cards.
 *
 * @example
 * ```ts
 * const lotMap = new LotMapController();
 * lotMap.init();
 * ```
 *
 * **Required Webflow attributes**
 *
 * | Element | Attribute | Value |
 * |---|---|---|
 * | Hidden HTML Embed with raw SVG text | `dev-target` | `svg-text-holder` |
 * | Empty wrapper where SVG is rendered | `dev-target` | `svg-target-wrapper` |
 * | Each CMS lot card | `dev-target` | `one-lot` |
 * | Each CMS lot card | `lot-number` | e.g. `B1` — must match SVG `<g id="B1">` |
 *
 * **CSS classes applied (style in lot-map.css)**
 * - `.lot-map__shape--active` — active lot shape `<g>`
 * - `.lot-map__label--active` — active lot label `<g>`
 * - `.lot-map__card--active`  — active CMS lot card
 * - `.lot-map__zoom-controls` — injected zoom button wrapper
 * - `.lot-map__zoom-btn`      — each zoom button (`data-zoom="in|out|reset"`)
 */

/** SVG viewBox state. */
interface ViewBox {
  x: number;
  y: number;
  w: number;
  h: number;
}

export class LotMapController {
  private svgEl: SVGSVGElement | null = null;
  private activeId: string | null = null;
  private isPanning = false;

  /** Native width of the SVG viewBox. */
  private readonly ORIGINAL_W = 1162.54;
  /** Native height of the SVG viewBox. */
  private readonly ORIGINAL_H = 912.76;
  /** Minimum zoom factor — prevents zooming out past the full map. */
  private readonly MIN_ZOOM = 0.4;
  /** Maximum zoom factor. */
  private readonly MAX_ZOOM = 8;

  private vb: ViewBox = { x: 0, y: 0, w: this.ORIGINAL_W, h: this.ORIGINAL_H };

  /**
   * Initialises the controller: injects the SVG, wires hover and zoom.
   * Must be called after the DOM is ready (e.g. inside `window.Webflow.push`).
   */
  init(): void {
    if (!this.injectSvg()) return;

    const cards = document.querySelectorAll<HTMLElement>('[dev-target="one-lot"][lot-number]');

    if (!cards.length) {
      console.error(
        'LotMapController: No [dev-target="one-lot"][lot-number] found — ' +
          'add lot-number to each CMS lot card to enable bidirectional hover.'
      );
    }

    this.bindSvgHover();
    this.bindCardHover(cards);
    this.bindZoom();
    this.injectZoomControls();
    this.bindFilter();
  }

  private bindFilter(): void {
    const map: Record<string, string> = {
      available: 'For Sale',
      reserved: 'Not Available for Sale',
      sold: 'Under Contract',
      'model-home': 'Not Available',
    };

    let activeKey: string | null = null;

    const applyFilter = () => {
      document.querySelectorAll<HTMLElement>('[dev-target="one-lot"]').forEach((lot) => {
        const matches = activeKey === null || lot.getAttribute('availability') === map[activeKey];
        lot.classList.toggle('hide', !matches);
      });
    };

    Object.keys(map).forEach((key) => {
      const pill = document.querySelector<HTMLElement>(`[dev-target="${key}"]`);
      if (!pill) return;

      pill.addEventListener('click', () => {
        document
          .querySelector<HTMLElement>(`[dev-target="${activeKey}"]`)
          ?.classList.remove('is-active');

        activeKey = activeKey === key ? null : key;

        if (activeKey) pill.classList.add('is-active');

        applyFilter();
      });
    });
  }

  /**
   * Reads SVG markup from `[dev-target="svg-text-holder"]`, sanitises it,
   * and injects it into `[dev-target="svg-target-wrapper"]`.
   *
   * @returns `true` on success, `false` if a required element is missing or
   *   the holder does not contain valid SVG markup.
   */
  private injectSvg(): boolean {
    const textHolder = document.querySelector<HTMLElement>('[dev-target="svg-text-holder"]');
    const targetWrapper = document.querySelector<HTMLElement>('[dev-target="svg-target-wrapper"]');

    if (!textHolder) {
      console.error('LotMapController: No [dev-target="svg-text-holder"] element found.');
      return false;
    }

    if (!targetWrapper) {
      console.error('LotMapController: No [dev-target="svg-target-wrapper"] element found.');
      return false;
    }

    const rawMarkup = textHolder.textContent?.trim() ?? '';

    if (!rawMarkup.includes('<svg')) {
      console.error(
        'LotMapController: [dev-target="svg-text-holder"] does not contain SVG markup.'
      );
      return false;
    }

    // Webflow's HTML Embed editor sometimes inserts a stray digit before the
    // opening quote of an attribute value (e.g. width=0"1162.54"). Strip them.
    const svgMarkup = rawMarkup.replace(/=\d+"/g, '="');

    targetWrapper.innerHTML = svgMarkup;
    this.svgEl = targetWrapper.querySelector<SVGSVGElement>('svg');

    if (!this.svgEl) {
      console.error('LotMapController: SVG injection failed — no <svg> found after injection.');
      return false;
    }

    this.svgEl.style.width = '100%';
    this.svgEl.style.height = '100%';
    this.svgEl.style.display = 'block';

    return true;
  }

  /**
   * Writes the current {@link ViewBox} state back to the SVG `viewBox` attribute.
   */
  private applyViewBox(): void {
    const { x, y, w, h } = this.vb;
    this.svgEl?.setAttribute('viewBox', `${x} ${y} ${w} ${h}`);
  }

  /**
   * Converts a screen-space client coordinate to SVG-space coordinates,
   * accounting for the current viewBox pan and zoom.
   *
   * @param clientX - Horizontal client coordinate (e.g. from a mouse event).
   * @param clientY - Vertical client coordinate.
   * @returns The equivalent point in SVG user units.
   */
  private toSvgPoint(clientX: number, clientY: number): { x: number; y: number } {
    const rect = this.svgEl!.getBoundingClientRect();
    return {
      x: this.vb.x + ((clientX - rect.left) / rect.width) * this.vb.w,
      y: this.vb.y + ((clientY - rect.top) / rect.height) * this.vb.h,
    };
  }

  /**
   * Scales the viewBox by `scale` around a fixed SVG-space origin point,
   * clamped to {@link MIN_ZOOM} / {@link MAX_ZOOM}.
   *
   * @param scale   - Multiplier applied to the viewBox dimensions (< 1 zooms in).
   * @param originX - SVG-space X coordinate to zoom around.
   * @param originY - SVG-space Y coordinate to zoom around.
   */
  private zoomAround(scale: number, originX: number, originY: number): void {
    const newW = this.vb.w * scale;
    const zoom = this.ORIGINAL_W / newW;
    if (zoom < this.MIN_ZOOM || zoom > this.MAX_ZOOM) return;

    this.vb.x = originX + (this.vb.x - originX) * scale;
    this.vb.y = originY + (this.vb.y - originY) * scale;
    this.vb.w = newW;
    this.vb.h = this.vb.h * scale;
    this.applyViewBox();
  }

  /**
   * Zooms by `scale` around the centre of the current viewBox.
   * Used by the +/− buttons.
   *
   * @param scale - Multiplier applied to the viewBox dimensions (< 1 zooms in).
   */
  private zoomBy(scale: number): void {
    const cx = this.vb.x + this.vb.w / 2;
    const cy = this.vb.y + this.vb.h / 2;
    this.zoomAround(scale, cx, cy);
  }

  /**
   * Resets the viewBox to the original full-map dimensions.
   */
  private resetZoom(): void {
    this.vb = { x: 0, y: 0, w: this.ORIGINAL_W, h: this.ORIGINAL_H };
    this.applyViewBox();
  }

  /**
   * Attaches mouse-wheel zoom, left/middle-click drag pan, and touch
   * pinch-to-zoom / single-finger pan event listeners to the SVG.
   *
   * Mouse and touch move/end listeners are bound to `window` so gestures
   * continue working when the pointer leaves the SVG boundary.
   * `preventDefault()` is only called when an interaction originated on
   * the SVG, leaving all other page scroll unaffected.
   */
  private bindZoom(): void {
    if (!this.svgEl) return;

    const svg = this.svgEl;

    svg.addEventListener(
      'wheel',
      (e: WheelEvent) => {
        e.preventDefault();
        const scale = e.deltaY < 0 ? 0.85 : 1 / 0.85;
        const { x, y } = this.toSvgPoint(e.clientX, e.clientY);
        this.zoomAround(scale, x, y);
      },
      { passive: false }
    );

    let startClient = { x: 0, y: 0 };
    let startVb: ViewBox = { ...this.vb };

    svg.addEventListener('mousedown', (e: MouseEvent) => {
      // Left click (0) and middle click (1) both pan.
      // preventDefault on mousedown suppresses the browser's native
      // autoscroll cursor that fires immediately on middle-click.
      if (e.button !== 0 && e.button !== 1) return;
      e.preventDefault();
      this.isPanning = true;
      startClient = { x: e.clientX, y: e.clientY };
      startVb = { ...this.vb };
      svg.classList.add('lot-map__svg--panning');
    });

    window.addEventListener('mousemove', (e: MouseEvent) => {
      if (!this.isPanning) return;
      const rect = svg.getBoundingClientRect();
      this.vb.x = startVb.x - ((e.clientX - startClient.x) / rect.width) * startVb.w;
      this.vb.y = startVb.y - ((e.clientY - startClient.y) / rect.height) * startVb.h;
      this.applyViewBox();
    });

    window.addEventListener('mouseup', (e: MouseEvent) => {
      if (!this.isPanning || (e.button !== 0 && e.button !== 1)) return;
      this.isPanning = false;
      svg.classList.remove('lot-map__svg--panning');
    });

    let isTouching = false;
    let lastDist = 0;
    let lastMid = { x: 0, y: 0 };

    const touchDist = (t: TouchList) =>
      Math.hypot(t[0].clientX - t[1].clientX, t[0].clientY - t[1].clientY);

    const touchMid = (t: TouchList) => ({
      x: (t[0].clientX + t[1].clientX) / 2,
      y: (t[0].clientY + t[1].clientY) / 2,
    });

    svg.addEventListener(
      'touchstart',
      (e: TouchEvent) => {
        e.preventDefault();
        isTouching = true;

        if (e.touches.length === 2) {
          this.isPanning = false;
          lastDist = touchDist(e.touches);
          lastMid = touchMid(e.touches);
        } else {
          this.isPanning = true;
          startClient = { x: e.touches[0].clientX, y: e.touches[0].clientY };
          startVb = { ...this.vb };
        }
      },
      { passive: false }
    );

    window.addEventListener(
      'touchmove',
      (e: TouchEvent) => {
        if (!isTouching) return;
        e.preventDefault();

        if (e.touches.length === 2) {
          this.isPanning = false;
          const dist = touchDist(e.touches);
          const mid = touchMid(e.touches);

          const scale = lastDist / dist;
          const origin = this.toSvgPoint(mid.x, mid.y);
          this.zoomAround(scale, origin.x, origin.y);

          const rect = svg.getBoundingClientRect();
          this.vb.x -= ((mid.x - lastMid.x) / rect.width) * this.vb.w;
          this.vb.y -= ((mid.y - lastMid.y) / rect.height) * this.vb.h;
          this.applyViewBox();

          lastDist = dist;
          lastMid = mid;
        } else if (e.touches.length === 1 && this.isPanning) {
          const rect = svg.getBoundingClientRect();
          const dx = ((e.touches[0].clientX - startClient.x) / rect.width) * startVb.w;
          const dy = ((e.touches[0].clientY - startClient.y) / rect.height) * startVb.h;
          this.vb.x = startVb.x - dx;
          this.vb.y = startVb.y - dy;
          this.applyViewBox();
        }
      },
      { passive: false }
    );

    window.addEventListener('touchend', () => {
      if (!isTouching) return;
      isTouching = false;
      this.isPanning = false;
    });
  }

  /**
   * Creates and appends +/− and reset zoom buttons as a sibling of the `<svg>`.
   * Forces the parent wrapper to `position: relative` if it is `static`.
   */
  private injectZoomControls(): void {
    const wrapper = this.svgEl?.parentElement;
    if (!wrapper) return;

    if (getComputedStyle(wrapper).position === 'static') {
      wrapper.style.position = 'relative';
    }

    const controls = document.createElement('div');
    controls.className = 'lot-map__zoom-controls';
    controls.setAttribute('aria-label', 'Map zoom controls');
    controls.innerHTML = `
      <button class="lot-map__zoom-btn" data-zoom="in"    title="Zoom in"   aria-label="Zoom in">+</button>
      <button class="lot-map__zoom-btn" data-zoom="reset" title="Reset zoom" aria-label="Reset zoom">⊙</button>
      <button class="lot-map__zoom-btn" data-zoom="out"   title="Zoom out"  aria-label="Zoom out">−</button>
    `;

    controls.addEventListener('click', (e: MouseEvent) => {
      const btn = (e.target as HTMLElement).closest<HTMLButtonElement>('[data-zoom]');
      if (!btn) return;
      const { zoom } = btn.dataset;
      if (zoom === 'in') this.zoomBy(0.7);
      else if (zoom === 'out') this.zoomBy(1 / 0.7);
      else if (zoom === 'reset') this.resetZoom();
    });

    wrapper.appendChild(controls);
  }

  /**
   * Auto-discovers all lot shape/label `<g>` pairs in the SVG and attaches
   * `mouseenter`/`mouseleave` listeners. A group is treated as a lot shape
   * when a sibling group named `${id}Label` exists.
   */
  private bindSvgHover(): void {
    if (!this.svgEl) return;

    const allGroups = Array.from(this.svgEl.querySelectorAll<SVGGElement>('g[id]'));

    allGroups.forEach((group) => {
      const { id } = group;

      if (id.endsWith('Label') || id.endsWith('Border')) return;

      const labelGroup = this.svgEl!.querySelector<SVGGElement>(`#${CSS.escape(id)}Label`);
      if (!labelGroup) return;

      group.style.cursor = 'pointer';
      group.addEventListener('mouseenter', () => this.highlight(id));
      group.addEventListener('mouseleave', () => this.clearHighlight());

      labelGroup.style.cursor = 'pointer';
      labelGroup.addEventListener('mouseenter', () => this.highlight(id));
      labelGroup.addEventListener('mouseleave', () => this.clearHighlight());
    });
  }

  /**
   * Attaches `mouseenter`/`mouseleave` listeners to the CMS lot cards.
   *
   * @param cards - All `[dev-target="one-lot"][lot-number]` elements on the page.
   */
  private bindCardHover(cards: NodeListOf<HTMLElement>): void {
    cards.forEach((card) => {
      const lotNumber = card.getAttribute('lot-number');
      if (!lotNumber) return;

      card.addEventListener('mouseenter', () => this.highlight(lotNumber));
      card.addEventListener('mouseleave', () => this.clearHighlight());
    });
  }

  /**
   * Activates the SVG shape, label, and CMS card for the given lot ID.
   * Scrolls the card into view if it is outside the visible area.
   * No-ops if the lot is already active or if a pan is in progress.
   *
   * @param lotId - Lot identifier matching both the SVG `<g id>` and `lot-number` attribute.
   */
  private highlight(lotId: string): void {
    if (this.isPanning) return;
    if (this.activeId === lotId) return;

    this.clearHighlight();
    this.activeId = lotId;

    if (this.svgEl) {
      this.svgEl
        .querySelector<SVGGElement>(`#${CSS.escape(lotId)}`)
        ?.classList.add('lot-map__shape--active');

      this.svgEl
        .querySelector<SVGGElement>(`#${CSS.escape(lotId)}Label`)
        ?.classList.add('lot-map__label--active');
    }

    const card = document.querySelector<HTMLElement>(
      `[dev-target="one-lot"][lot-number="${lotId}"]`
    );

    if (card) {
      card.classList.add('lot-map__card--active');
      card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  /**
   * Removes all active highlight classes and resets {@link activeId}.
   */
  private clearHighlight(): void {
    this.activeId = null;

    this.svgEl
      ?.querySelector('.lot-map__shape--active')
      ?.classList.remove('lot-map__shape--active');

    this.svgEl
      ?.querySelector('.lot-map__label--active')
      ?.classList.remove('lot-map__label--active');

    document.querySelector('.lot-map__card--active')?.classList.remove('lot-map__card--active');
  }
}
