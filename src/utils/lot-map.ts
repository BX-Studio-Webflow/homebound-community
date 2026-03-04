/**
 * Lot Map controller.
 *
 * Handles three responsibilities:
 *   1. SVG INJECTION — reads the SVG markup stored as escaped text inside
 *      [dev-target="svg-text-holder"], decodes it, and writes the live SVG
 *      into [dev-target="svg-target-wrapper"].
 *
 *   2. ZOOM / PAN — mouse wheel zooms around cursor, click-drag pans,
 *      pinch-to-zoom on touch. +/− reset buttons are injected automatically.
 *
 *   3. BIDIRECTIONAL HOVER — wires mouseenter/mouseleave between SVG lot
 *      groups and the right-panel CMS lot cards.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * WEBFLOW SETUP
 * ─────────────────────────────────────────────────────────────────────────
 *
 * 1. SVG text source (hidden)
 *    Attribute: dev-target="svg-text-holder"
 *    Class:     hide  (visibility:hidden or display:none)
 *    Content:   paste the raw SVG markup inside an HTML Embed component.
 *
 * 2. SVG render target (empty wrapper)
 *    Attribute: dev-target="svg-target-wrapper"
 *    The controller injects the live <svg> element here at runtime.
 *
 * 3. Right-panel lot cards (CMS Collection List items)
 *    Attribute: dev-target="one-lot"
 *    Attribute: data-lot-id="B1"  ← must match the SVG <g id="B1">
 *
 * ─────────────────────────────────────────────────────────────────────────
 * ZOOM CONTROLS
 * ─────────────────────────────────────────────────────────────────────────
 *
 * Injected automatically as a sibling of the <svg>. Style via lot-map.css:
 *   .lot-map__zoom-controls   wrapper
 *   .lot-map__zoom-btn        each button  (data-zoom="in|out|reset")
 *
 * ─────────────────────────────────────────────────────────────────────────
 * HOVER CLASSES  (styled in lot-map.css)
 * ─────────────────────────────────────────────────────────────────────────
 *
 *   .lot-map__shape--active   → lot shape <g>
 *   .lot-map__label--active   → lot label <g>
 *   .lot-map__card--active    → CMS lot card element
 */

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

  // Original SVG dimensions from the viewBox attribute
  private readonly ORIGINAL_W = 1162.54;
  private readonly ORIGINAL_H = 912.76;
  private readonly MIN_ZOOM = 0.4; // most zoomed-out factor (viewBox wider than original)
  private readonly MAX_ZOOM = 8; // most zoomed-in factor

  private vb: ViewBox = { x: 0, y: 0, w: this.ORIGINAL_W, h: this.ORIGINAL_H };

  // ─── Entry point ─────────────────────────────────────────────────────────

  init(): void {
    if (!this.injectSvg()) return;

    const cards = document.querySelectorAll<HTMLElement>('[dev-target="one-lot"][data-lot-id]');

    if (!cards.length) {
      console.error(
        'LotMapController: No [dev-target="one-lot"][data-lot-id] found — ' +
          'add data-lot-id to each CMS lot card to enable bidirectional hover.'
      );
    }

    this.bindSvgHover();
    this.bindCardHover(cards);
    this.bindZoom();
    this.injectZoomControls();
  }

  // ─── SVG injection ───────────────────────────────────────────────────────

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

    // textContent decodes HTML entities (&lt; → <) giving us raw SVG markup.
    const rawMarkup = textHolder.textContent?.trim() ?? '';

    if (!rawMarkup.includes('<svg')) {
      console.error(
        'LotMapController: [dev-target="svg-text-holder"] does not contain SVG markup.'
      );
      return false;
    }

    // Fix malformed attribute values like width=0"1162.54" → width="1162.54"
    const svgMarkup = rawMarkup.replace(/=\d+"/g, '="');

    targetWrapper.innerHTML = svgMarkup;

    this.svgEl = targetWrapper.querySelector<SVGSVGElement>('svg');

    if (!this.svgEl) {
      console.error('LotMapController: SVG injection failed — no <svg> found after injection.');
      return false;
    }

    // Make SVG fill its container and allow overflow to be clipped
    this.svgEl.style.width = '100%';
    this.svgEl.style.height = '100%';
    this.svgEl.style.display = 'block';

    return true;
  }

  // ─── Zoom / pan ──────────────────────────────────────────────────────────

  private applyViewBox(): void {
    const { x, y, w, h } = this.vb;
    this.svgEl?.setAttribute('viewBox', `${x} ${y} ${w} ${h}`);
  }

  /** Convert a screen-space client point to SVG-space coordinates. */
  private toSvgPoint(clientX: number, clientY: number): { x: number; y: number } {
    const rect = this.svgEl!.getBoundingClientRect();
    return {
      x: this.vb.x + ((clientX - rect.left) / rect.width) * this.vb.w,
      y: this.vb.y + ((clientY - rect.top) / rect.height) * this.vb.h,
    };
  }

  /** Zoom by a scale factor around a given SVG-space origin point. */
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

  /** Zoom by a scale factor around the current viewBox centre (used by buttons). */
  private zoomBy(scale: number): void {
    const cx = this.vb.x + this.vb.w / 2;
    const cy = this.vb.y + this.vb.h / 2;
    this.zoomAround(scale, cx, cy);
  }

  private resetZoom(): void {
    this.vb = { x: 0, y: 0, w: this.ORIGINAL_W, h: this.ORIGINAL_H };
    this.applyViewBox();
  }

  private bindZoom(): void {
    if (!this.svgEl) return;

    const svg = this.svgEl;

    // ── Mouse wheel zoom ─────────────────────────────────────────────────
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

    // ── Mouse pan ────────────────────────────────────────────────────────
    let startClient = { x: 0, y: 0 };
    let startVb: ViewBox = { ...this.vb };

    svg.addEventListener('mousedown', (e: MouseEvent) => {
      // Accept left click (0) or middle click (1).
      // Middle click MUST call preventDefault() here — before the browser
      // activates its native autoscroll mode, which fires on mousedown.
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
      // Clear on any button release that could have started a pan
      if (!this.isPanning || (e.button !== 0 && e.button !== 1)) return;
      this.isPanning = false;
      svg.classList.remove('lot-map__svg--panning');
    });

    // ── Touch pinch-to-zoom + single-finger pan ──────────────────────────
    //
    // touchmove / touchend are bound to WINDOW (not svg) so that if a finger
    // slides outside the SVG boundary the events keep firing and the browser
    // cannot fall back to page-scroll mid-gesture.
    // preventDefault() is only called when a touch STARTED on the SVG map
    // (guarded by isTouching) so other page scroll is never affected.

    let isTouching = false;
    let lastDist = 0;
    let lastMid = { x: 0, y: 0 };

    const touchDist = (t: TouchList) =>
      Math.hypot(t[0].clientX - t[1].clientX, t[0].clientY - t[1].clientY);

    const touchMid = (t: TouchList) => ({
      x: (t[0].clientX + t[1].clientX) / 2,
      y: (t[0].clientY + t[1].clientY) / 2,
    });

    // touchstart fires on the SVG — mark interaction as ours
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

    // touchmove on WINDOW — preventDefault stops page scroll even when the
    // finger wanders outside the SVG element
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

    // touchend on WINDOW — clear flags regardless of where finger lifted
    window.addEventListener('touchend', () => {
      if (!isTouching) return;
      isTouching = false;
      this.isPanning = false;
    });
  }

  /** Injects +/− and reset buttons as a sibling of the <svg> element. */
  private injectZoomControls(): void {
    const wrapper = this.svgEl?.parentElement;
    if (!wrapper) return;

    // Ensure the wrapper can contain absolutely-positioned controls
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

  // ─── SVG lot hover ───────────────────────────────────────────────────────

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

  // ─── Right-panel card hover ──────────────────────────────────────────────

  private bindCardHover(cards: NodeListOf<HTMLElement>): void {
    cards.forEach((card) => {
      const { lotId } = card.dataset;
      if (!lotId) return;

      card.addEventListener('mouseenter', () => this.highlight(lotId));
      card.addEventListener('mouseleave', () => this.clearHighlight());
    });
  }

  // ─── Highlight / clear ───────────────────────────────────────────────────

  private highlight(lotId: string): void {
    // Suppress highlights while the user is dragging/panning
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
      `[dev-target="one-lot"][data-lot-id="${lotId}"]`
    );

    if (card) {
      card.classList.add('lot-map__card--active');
      card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

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
