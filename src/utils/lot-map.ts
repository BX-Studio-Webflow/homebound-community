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
 * **Single-lot / home detail (zoom + highlight on load)**
 *
 * Pass {@link LotMapConfig} to focus the map on one lot’s SVG region and apply the
 * same highlight classes as hover/click. Use on CMS templates where one home’s lot
 * should be obvious when the section loads.
 *
 * ```ts
 * new LotMapController({
 *   isZoomMode: true,
 *   focusLotNumber: 'B1',
 *   focusZoomFactor: 4,
 * }).init();
 * ```
 *
 * **Required Webflow attributes**
 *
 * | Element | Attribute | Value |
 * |---|---|---|
 * | Hidden HTML Embed with raw SVG or an absolute SVG URL | `dev-target` | `svg-text-holder` |
 * | Empty wrapper where SVG is rendered | `dev-target` | `svg-target-wrapper` |
 * | Each CMS lot card | `dev-target` | `one-lot` |
 * | Each CMS lot card | `lot-number` | e.g. `B1` or `F12` — matches SVG `<g id>` or `data-lot-location` |
 * | Status pill (inside each card) | `dev-target` | `pill-component` — receives a class slug from parent `availability` |
 *
 * Map size is taken from the injected SVG `viewBox`, or from {@link LotMapConfig.mapWidth}
 * / {@link LotMapConfig.mapHeight}. Use {@link lotMapConfigFromLocation} on community
 * template pages so Park Place / Mosaic / Lakeside get the right defaults.
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

interface LotHit {
  shape: SVGGElement;
  label: SVGGElement | null;
  border: SVGGElement | null;
}

const SKIP_LOT_IDS = new Set(['Layer_1', 'C_Amenity_Center']);

/** Alternate keys so CMS `lot-number` can be F12, 12F, or `_12F`. */
function lotKeysForGroup(id: string, dataLotLocation: string | null): string[] {
  const keys = new Set<string>([id]);
  if (dataLotLocation) keys.add(dataLotLocation);

  const underscored = id.match(/^_(\d+)([A-Za-z])$/);
  if (underscored) {
    keys.add(`${underscored[1]}${underscored[2]}`);
    keys.add(`${underscored[2]}${underscored[1]}`);
  }

  const letterFirst = id.match(/^([A-Za-z])(\d+)$/);
  if (letterFirst) keys.add(`${letterFirst[2]}${letterFirst[1]}`);

  const numberFirst = id.match(/^(\d+)([A-Za-z])$/);
  if (numberFirst) keys.add(`${numberFirst[2]}${numberFirst[1]}`);

  return [...keys];
}

const SVG_NS = 'http://www.w3.org/2000/svg';

const AVAILABILITY_COLORS: Record<string, string> = {
  'For Sale': '#657839',
  'Not Available for Sale': '#d17520',
  'Under Contract': '#8b514e',
  'Not Available': '#3A759D',
};

/** Maps CMS `availability` text to a kebab-case class on `[dev-target="pill-component"]` (e.g. Under Contract → under-contract). */
function availabilityToPillClass(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

/** Options for {@link LotMapController}. */
export type LotMapConfig = {
  /**
   * When true and {@link focusLotNumber} is set, pans/zooms the initial view to that
   * lot’s bounds and highlights it (same classes as map hover).
   */
  isZoomMode?: boolean;
  /** Lot id matching SVG `<g id="…">` and CMS `lot-number` (e.g. `B1`). */
  focusLotNumber?: string;
  /**
   * How far to zoom in toward the lot: visible width ≈ full map width / this factor,
   * expanded if the lot bbox is large. Clamped so zoom never exceeds the maximum zoom level.
   * @defaultValue 3.5
   */
  focusZoomFactor?: number;
  /**
   * Native map width in SVG units. When omitted, read from the injected SVG `viewBox`.
   */
  mapWidth?: number;
  /**
   * Native map height in SVG units. When omitted, read from the injected SVG `viewBox`.
   */
  mapHeight?: number;
  /**
   * How to paint the active lot. `'fill'` is Lakeside (green wash). `'stroke'`
   * is Park Place (orange outline, gray fill unchanged).
   * @defaultValue `'fill'`
   */
  highlightStyle?: 'fill' | 'stroke';
};

/** Lakeside `lot-example.svg` viewBox. */
const LAKESIDE_MAP = { mapWidth: 1162.54, mapHeight: 912.76 } as const;

/** Park Place / Mosaic `parkPlaceLotMap_8-26.svg` viewBox. */
const PARK_PLACE_MAP = { mapWidth: 1247.80285, mapHeight: 670.33693 } as const;

/**
 * Lot map defaults keyed by Upcoming Communities slug
 * (`/upcoming-communities/<slug>`). Mosaic shares the Park Place map.
 */
export const LOT_MAP_CONFIG_BY_SLUG: Record<string, LotMapConfig> = {
  'park-place': { ...PARK_PLACE_MAP, highlightStyle: 'fill' },
  mosaic: { ...PARK_PLACE_MAP, highlightStyle: 'stroke' },
  mosic: { ...PARK_PLACE_MAP, highlightStyle: 'stroke' },
  'lake-side': { ...LAKESIDE_MAP, highlightStyle: 'fill' },
  lakeside: { ...LAKESIDE_MAP, highlightStyle: 'fill' },
};

/**
 * Resolves {@link LotMapConfig} from an Upcoming Communities URL.
 * Unknown paths return `{}` so the controller can still read `viewBox` from the SVG.
 */
export function lotMapConfigFromLocation(pathname = window.location.pathname): LotMapConfig {
  const slug = pathname.toLowerCase().split('/upcoming-communities/')[1]?.split('/')[0] ?? '';
  return LOT_MAP_CONFIG_BY_SLUG[slug] ?? {};
}

export class LotMapController {
  private svgEl: SVGSVGElement | null = null;
  private activeId: string | null = null;
  private isPanning = false;
  private readonly lotsByKey = new Map<string, LotHit>();

  private readonly config: LotMapConfig;

  /** Native width of the SVG viewBox. */
  private originalW: number = LAKESIDE_MAP.mapWidth;
  /** Native height of the SVG viewBox. */
  private originalH: number = LAKESIDE_MAP.mapHeight;
  /** Minimum zoom factor — prevents zooming out past the full map (1 = full map). */
  private readonly MIN_ZOOM = 1;
  /** Maximum zoom factor. */
  private readonly MAX_ZOOM = 8;
  /** Zoom factor for the zoom buttons. */
  private readonly DISABLE_ZOOM_WITH_MOUSE_SCROLL = true;

  private vb: ViewBox = { x: 0, y: 0, w: this.originalW, h: this.originalH };

  constructor(config: LotMapConfig = {}) {
    this.config = config;
  }

  /**
   * Initialises the controller: injects the SVG (inline markup or URL), then
   * wires hover and zoom. Must be called after the DOM is ready
   * (e.g. inside `window.Webflow.push`).
   */
  async init(): Promise<void> {
    if (!(await this.injectSvg())) return;

    const cards = document.querySelectorAll<HTMLElement>('[dev-target="one-lot"][lot-number]');

    if (!cards.length) {
      console.error(
        'LotMapController: No [dev-target="one-lot"][lot-number] found — ' +
          'add lot-number to each CMS lot card to enable bidirectional hover.'
      );
    }

    this.applyLabelColors();
    this.applyCardPillAvailabilityClasses();
    this.bindSvgHover();
    this.bindCardHover(cards);
    this.bindZoom();
    this.injectZoomControls();
    this.bindFilter();

    const { isZoomMode, focusLotNumber, focusZoomFactor = 3.5 } = this.config;
    if (isZoomMode && focusLotNumber) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          this.focusViewOnLot(focusLotNumber, focusZoomFactor);
          this.highlight(focusLotNumber, false);
        });
      });
    } else if (isZoomMode && !focusLotNumber) {
      console.error(
        'LotMapController: isZoomMode is true but focusLotNumber is missing — ' +
          'set focusLotNumber or a CMS `lot-number` on [dev-target="one-lot"].'
      );
    }
  }

  /**
   * Sets the viewBox to frame the lot shape group in SVG space, with padding and a
   * zoom level derived from {@link focusZoomFactor}.
   */
  private focusViewOnLot(lotId: string, zoomFactor: number): void {
    if (!this.svgEl) return;

    const shape = this.findLot(lotId)?.shape;
    if (!shape) {
      console.error(`LotMapController: No SVG lot group #${lotId} — cannot focus view.`);
      return;
    }

    let bbox: DOMRect;
    try {
      bbox = shape.getBBox();
    } catch {
      return;
    }

    if (bbox.width <= 0 && bbox.height <= 0) {
      console.error(`LotMapController: Empty geometry for lot #${lotId} — cannot focus view.`);
      return;
    }

    const cx = bbox.x + bbox.width / 2;
    const cy = bbox.y + bbox.height / 2;

    const minWFromMaxZoom = this.originalW / this.MAX_ZOOM;
    const fromMapZoom = this.originalW / Math.max(zoomFactor, 1);
    const fromLotPadding = Math.max(bbox.width, bbox.height) * 3;
    const targetW = Math.min(
      this.originalW,
      Math.max(minWFromMaxZoom, Math.max(fromMapZoom, fromLotPadding))
    );
    const targetH = (targetW * this.originalH) / this.originalW;

    this.vb.x = cx - targetW / 2;
    this.vb.y = cy - targetH / 2;
    this.vb.w = targetW;
    this.vb.h = targetH;
    this.clampViewBox();
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
      let visibleCount = 0;
      document.querySelectorAll<HTMLElement>('[dev-target="one-lot"]').forEach((lot) => {
        const matches = activeKey === null || lot.getAttribute('availability') === map[activeKey];
        lot.classList.toggle('hide', !matches);
        if (matches) visibleCount += 1;
      });

      const noItems = document.querySelector<HTMLElement>('[dev-target="no-items-found"]');
      noItems?.classList.toggle('hide', visibleCount > 0);
    };

    Object.keys(map).forEach((key) => {
      const pill = document.querySelector<HTMLElement>(`[dev-target="${key}"]`);
      if (!pill) {
        console.error(`LotMapController: no filter pill found for dev-target="${key}".`);
        return;
      }

      pill.addEventListener('click', () => {
        document
          .querySelector<HTMLElement>(`[dev-target="${activeKey}"]`)
          ?.classList.remove('is-active');

        activeKey = activeKey === key ? null : key;

        if (activeKey) pill.classList.add('is-active');

        applyFilter();
      });
    });

    //applyFilter();
  }

  /**
   * Sets each SVG label group's rect fill color based on the lot's availability
   * from the CMS cards. Uses {@link AVAILABILITY_COLORS}; unknown values default to #657839.
   */
  private applyLabelColors(): void {
    if (!this.svgEl) {
      console.error('LotMapController: applyLabelColors called but svgEl is null.');
      return;
    }

    const lotToAvailability = new Map<string, string>();
    document.querySelectorAll<HTMLElement>('[dev-target="one-lot"][lot-number]').forEach((card) => {
      const lotNumber = card.getAttribute('lot-number');
      const availability = card.getAttribute('availability');
      if (lotNumber && availability) lotToAvailability.set(lotNumber, availability);
    });

    this.svgEl.querySelectorAll<SVGGElement>('g[id$="Label"]').forEach((labelGroup) => {
      const { id } = labelGroup;
      const lotNumber = id.replace(/Label$/, '');
      const availability =
        lotKeysForGroup(lotNumber, null)
          .map((key) => lotToAvailability.get(key))
          .find(Boolean) ?? lotToAvailability.get(lotNumber);
      const color = availability ? (AVAILABILITY_COLORS[availability] ?? '#657839') : '#657839';

      labelGroup.querySelector('rect')?.style.setProperty('fill', color);
    });
  }

  /**
   * Adds a kebab-case class derived from each card's `availability` attribute to the
   * nested `[dev-target="pill-component"]` for CMS styling (e.g. `under-contract`).
   */
  private applyCardPillAvailabilityClasses(): void {
    document.querySelectorAll<HTMLElement>('[dev-target="one-lot"]').forEach((card) => {
      const raw = card.getAttribute('availability');
      const pill = card.querySelector<HTMLElement>('[dev-target="pill-component"]');
      if (!raw || !pill) return;

      const slug = availabilityToPillClass(raw);
      if (slug) pill.classList.add(slug);
    });
  }

  /**
   * Reads SVG markup or an absolute SVG URL from `[dev-target="svg-text-holder"]`,
   * sanitises it, and injects it into `[dev-target="svg-target-wrapper"]`.
   * Matches house-plan floor maps: inline `<svg>` or `https://…`.
   *
   * @returns `true` on success, `false` if a required element is missing or
   *   the holder does not contain valid SVG markup or a fetchable URL.
   */
  private async injectSvg(): Promise<boolean> {
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

    const raw = (textHolder.textContent ?? '').trim();
    if (!raw) {
      console.error('LotMapController: [dev-target="svg-text-holder"] is empty.');
      return false;
    }

    const isSvgMarkup = raw.includes('<svg');
    const isUrl = /^https?:\/\//i.test(raw);

    let svgText: string;
    try {
      if (isSvgMarkup) {
        svgText = this.sanitizeSvg(raw);
      } else if (isUrl) {
        const res = await fetch(raw);
        if (!res.ok) {
          throw new Error(`Fetch failed with status ${res.status}`);
        }
        svgText = this.sanitizeSvg(await res.text());
      } else {
        console.error(
          'LotMapController: [dev-target="svg-text-holder"] must contain inline SVG or an https URL.'
        );
        return false;
      }
    } catch (error) {
      console.error('LotMapController: Failed to load SVG.', error);
      return false;
    }

    const parser = new DOMParser();
    const doc = parser.parseFromString(svgText, 'image/svg+xml');
    const svgEl = doc.querySelector('svg');

    if (!svgEl) {
      console.error('LotMapController: SVG parse failed — no <svg> found.');
      return false;
    }

    targetWrapper.replaceChildren(svgEl);
    this.svgEl = svgEl;

    this.svgEl.style.width = '100%';
    this.svgEl.style.height = '100%';
    this.svgEl.style.display = 'block';

    this.applyMapSize();
    this.indexLots();
    this.ensureLotLabels();

    return true;
  }

  /**
   * Sanitises SVG markup by fixing broken Webflow attributes and removing script tags.
   */
  private sanitizeSvg(svg: string): string {
    return svg.replace(/=\d+"/g, '="').replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '');
  }

  /**
   * Sets native map size from config, then the SVG `viewBox`, then Lakeside fallbacks.
   */
  private applyMapSize(): void {
    const tokens = this.svgEl
      ?.getAttribute('viewBox')
      ?.trim()
      .split(/[\s,]+/)
      .map(Number);
    const fromView =
      tokens?.length === 4 && tokens[2] > 0 && tokens[3] > 0
        ? { w: tokens[2], h: tokens[3] }
        : null;

    this.originalW = this.config.mapWidth ?? fromView?.w ?? this.originalW;
    this.originalH = this.config.mapHeight ?? fromView?.h ?? this.originalH;
    this.vb = { x: 0, y: 0, w: this.originalW, h: this.originalH };

    if (this.config.highlightStyle === 'stroke') {
      this.svgEl?.classList.add('lot-map__svg--stroke-highlight');
    }
  }

  /**
   * Adds Lakeside-style lot pills when the SVG has none (Park Place). Existing
   * `*Label` groups are left unchanged. Display text is number-then-letter (`1B`).
   * Park Place has no baked-in pills, so they are created here for lots that
   * appear in the right-side CMS list (`lot-number` on `[dev-target="one-lot"]`).
   */
  private ensureLotLabels(): void {
    if (!this.svgEl) return;

    const cmsLotNumbers = new Set<string>();
    document.querySelectorAll<HTMLElement>('[dev-target="one-lot"][lot-number]').forEach((card) => {
      const lotNumber = card.getAttribute('lot-number');
      if (lotNumber) cmsLotNumbers.add(lotNumber);
    });

    const seen = new Set<SVGGElement>();

    this.lotsByKey.forEach((hit) => {
      if (seen.has(hit.shape) || hit.label) return;
      seen.add(hit.shape);

      const { id } = hit.shape;
      if (!id) return;

      const cmsLotNumber = lotKeysForGroup(id, hit.shape.getAttribute('data-lot-location')).find(
        (key) => cmsLotNumbers.has(key)
      );
      if (!cmsLotNumber) return;

      let bbox: DOMRect;
      try {
        bbox = hit.shape.getBBox();
      } catch {
        return;
      }
      if (bbox.width <= 0 && bbox.height <= 0) return;

      const text = cmsLotNumber;
      const w = text.length > 2 ? 28.5 : 23.79;
      const h = 11.25;
      const x = bbox.x + bbox.width / 2 - w / 2;
      const y = bbox.y + bbox.height / 2 - h / 2;

      const label = document.createElementNS(SVG_NS, 'g');
      label.setAttribute('id', `${id}Label`);

      const rect = document.createElementNS(SVG_NS, 'rect');
      rect.setAttribute('x', String(x));
      rect.setAttribute('y', String(y));
      rect.setAttribute('width', String(w));
      rect.setAttribute('height', String(h));
      rect.setAttribute('rx', '5.62');
      rect.setAttribute('ry', '5.62');
      rect.setAttribute('fill', '#657839');

      const textEl = document.createElementNS(SVG_NS, 'text');
      textEl.setAttribute('transform', `translate(${x + w / 2} ${y + h * 0.78})`);
      textEl.setAttribute('text-anchor', 'middle');
      textEl.setAttribute('fill', '#fff');
      textEl.setAttribute(
        'font-family',
        '"Good Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
      );
      textEl.setAttribute('font-size', '9');
      textEl.setAttribute('font-weight', '600');
      textEl.textContent = text;

      label.append(rect, textEl);
      this.svgEl!.appendChild(label);
    });

    this.indexLots();
  }

  /**
   * Indexes lot shapes (and optional label/border siblings) under every CMS-friendly key.
   */
  private indexLots(): void {
    this.lotsByKey.clear();
    if (!this.svgEl) return;

    const groups = Array.from(this.svgEl.querySelectorAll<SVGGElement>('g[id]'));

    groups.forEach((group) => {
      const { id } = group;
      if (!id || SKIP_LOT_IDS.has(id) || id.endsWith('Label') || id.endsWith('Border')) return;

      const hit: LotHit = {
        shape: group,
        label: this.svgEl!.querySelector<SVGGElement>(`#${CSS.escape(id)}Label`),
        border: this.svgEl!.querySelector<SVGGElement>(`#${CSS.escape(id)}Border`),
      };

      lotKeysForGroup(id, group.getAttribute('data-lot-location')).forEach((key) => {
        this.lotsByKey.set(key, hit);
      });
    });
  }

  private findLot(lotId: string): LotHit | undefined {
    return this.lotsByKey.get(lotId);
  }

  /**
   * Writes the current {@link ViewBox} state back to the SVG `viewBox` attribute.
   */
  private applyViewBox(): void {
    const { x, y, w, h } = this.vb;
    this.svgEl?.setAttribute('viewBox', `${x} ${y} ${w} ${h}`);
  }

  /**
   * Clamps the viewBox so the visible area stays within map bounds.
   * Prevents panning the map out of view at any zoom level.
   */
  private clampViewBox(): void {
    this.vb.x = Math.max(0, Math.min(this.vb.x, this.originalW - this.vb.w));
    this.vb.y = Math.max(0, Math.min(this.vb.y, this.originalH - this.vb.h));
    this.applyViewBox();
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
    const zoom = this.originalW / newW;
    if (zoom < this.MIN_ZOOM || zoom > this.MAX_ZOOM) {
      this.clampViewBox();
      return;
    }

    this.vb.x = originX + (this.vb.x - originX) * scale;
    this.vb.y = originY + (this.vb.y - originY) * scale;
    this.vb.w = newW;
    this.vb.h = this.vb.h * scale;
    this.clampViewBox();
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
    this.vb = { x: 0, y: 0, w: this.originalW, h: this.originalH };
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
    if (!this.svgEl) {
      console.error('LotMapController: bindZoom called but svgEl is null.');
      return;
    }

    const svg = this.svgEl;

    svg.addEventListener(
      'wheel',
      (e: WheelEvent) => {
        if (this.DISABLE_ZOOM_WITH_MOUSE_SCROLL) return;
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
      this.clampViewBox();
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
          this.clampViewBox();

          lastDist = dist;
          lastMid = mid;
        } else if (e.touches.length === 1 && this.isPanning) {
          const rect = svg.getBoundingClientRect();
          const dx = ((e.touches[0].clientX - startClient.x) / rect.width) * startVb.w;
          const dy = ((e.touches[0].clientY - startClient.y) / rect.height) * startVb.h;
          this.vb.x = startVb.x - dx;
          this.vb.y = startVb.y - dy;
          this.clampViewBox();
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
    if (!wrapper) {
      console.error('LotMapController: injectZoomControls called but SVG has no parent.');
      return;
    }

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
   * Auto-discovers lot shape groups. Labels are optional; Park Place lots have
   * outlines instead of Lakeside-style badges.
   */
  private bindSvgHover(): void {
    if (!this.svgEl) {
      console.error('LotMapController: bindSvgHover called but svgEl is null.');
      return;
    }

    const seen = new Set<SVGGElement>();

    this.lotsByKey.forEach((hit, key) => {
      if (seen.has(hit.shape)) return;
      seen.add(hit.shape);

      const lotId = hit.shape.id || key;

      hit.shape.style.cursor = 'pointer';
      hit.shape.addEventListener('mouseenter', () => this.highlight(lotId));
      hit.shape.addEventListener('mouseleave', () => this.clearHighlight());
      hit.shape.addEventListener('mousedown', (e) => e.stopPropagation());
      hit.shape.addEventListener('click', () => this.highlight(lotId, true));

      if (hit.label) {
        hit.label.style.cursor = 'pointer';
        hit.label.addEventListener('mouseenter', () => this.highlight(lotId));
        hit.label.addEventListener('mouseleave', () => this.clearHighlight());
        hit.label.addEventListener('mousedown', (e) => e.stopPropagation());
        hit.label.addEventListener('click', () => this.highlight(lotId, true));
      }
    });
  }

  /**
   * Attaches `mouseenter`/`mouseleave` listeners to the CMS lot cards.
   * - If the lot price is 'Inquire for Pricing', it will hide the 'Starting from' text.
   *
   * @param cards - All `[dev-target="one-lot"][lot-number]` elements on the page.
   */
  private bindCardHover(cards: NodeListOf<HTMLElement>): void {
    cards.forEach((card) => {
      const lotNumber = card.getAttribute('lot-number');
      const price = card.getAttribute('price');
      if (!lotNumber) return;

      card.addEventListener('mouseenter', () => this.highlight(lotNumber));
      card.addEventListener('mouseleave', () => this.clearHighlight());

      if (price === 'Inquire for Pricing') {
        card.querySelector<HTMLElement>('[dev-target="starting-from-text"]')?.classList.add('hide');
      }
    });
  }

  /**
   * Activates the SVG shape, label, and CMS card for the given lot ID.
   * Optionally scrolls the card into view (only when triggered by map click, not hover).
   * No-ops if the lot is already active or if a pan is in progress.
   *
   * @param lotId - Lot identifier matching both the SVG `<g id>` and `lot-number` attribute.
   * @param scrollToCard - When true, scrolls the lot card into view in the list. Use for map clicks only.
   */
  private highlight(lotId: string, scrollToCard = false): void {
    if (this.isPanning) return;
    if (this.activeId === lotId && !scrollToCard) return;

    this.clearHighlight();
    this.activeId = lotId;

    const lot = this.findLot(lotId);
    if (this.svgEl && lot) {
      lot.shape.classList.add('lot-map__shape--active');
      lot.label?.classList.add('lot-map__label--active');
    }

    const cardSelectors = lotKeysForGroup(lotId, null).map(
      (key) => `[dev-target="one-lot"][lot-number="${key}"]`
    );
    const card = document.querySelector<HTMLElement>(cardSelectors.join(','));

    if (card) {
      if (!this.config.isZoomMode) {
        card.classList.add('lot-map__card--active');
      }
      if (scrollToCard) {
        card.classList.remove('hide');
        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    } else if (scrollToCard) {
      console.error(
        'LotMapController: No CMS lot card for map lot — expected ' +
          `[dev-target="one-lot"][lot-number="${lotId}"].`
      );
    }
  }

  /**
   * Removes all active highlight classes and resets {@link activeId}.
   */
  private clearHighlight(): void {
    this.activeId = null;

    this.svgEl
      ?.querySelectorAll('.lot-map__shape--active')
      .forEach((el) => el.classList.remove('lot-map__shape--active'));

    this.svgEl
      ?.querySelectorAll('.lot-map__label--active')
      .forEach((el) => el.classList.remove('lot-map__label--active'));

    document.querySelector('.lot-map__card--active')?.classList.remove('lot-map__card--active');
  }
}
