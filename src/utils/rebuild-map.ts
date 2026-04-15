type ViewBox = {
  x: number;
  y: number;
  w: number;
  h: number;
};

type MapPoint = {
  id: string;
  label: string;
  x: number;
  y: number;
};

const MAP_POINTS: MapPoint[] = [
  { id: 'tubbs-fire', label: 'Tubbs Fire - Santa Rosa, CA', x: 10.72, y: 153.05 },
  {
    id: 'glass-complex',
    label: 'Glass Complex - Napa & Sonoma Counties, CA',
    x: 21.83,
    y: 161.4,
  },
  {
    id: 'czu-complex',
    label: 'CZU Comples - Santa Cruz & San Mateo Counties, CA',
    x: 21.83,
    y: 173.78,
  },
  { id: 'woolsey-fire', label: 'Woolsey Fire - Malibu, CA', x: 28.69, y: 226.88 },
  { id: 'eaton-fire', label: 'Eaton Fire - Altadena, CA', x: 38.96, y: 236.7 },
  { id: 'palisades-fire', label: 'Palisades Fire - Pacific Palisades, CA', x: 54.67, y: 225.59 },
  { id: 'marshall-fire', label: 'Marshall Fire - Boulder County, CO', x: 197.87, y: 188.96 },
  {
    id: 'hurricane-ian',
    label: 'Hurricane Ian - Fort Myers Beach, FL',
    x: 490.3,
    y: 350.64,
  },
  {
    id: 'hurricane-dorian',
    label: 'Hurricane Dorian, The Bahamas',
    x: 555.09,
    y: 380.6,
  },
];

export class RebuildMapController {
  private svgEl: SVGSVGElement | null = null;
  private activeId: string | null = null;
  private isPanning = false;
  private markerById = new Map<string, SVGCircleElement>();
  private cardById = new Map<string, HTMLElement>();
  private tooltipEl: HTMLElement | null = null;

  private readonly MIN_ZOOM = 1;
  private readonly MAX_ZOOM = 8;
  private readonly DISABLE_ZOOM_WITH_MOUSE_SCROLL = true;

  private originalViewBox: ViewBox = { x: 0, y: 0, w: 582.03, h: 399.02 };
  private vb: ViewBox = { ...this.originalViewBox };

  init(): void {
    if (!this.injectSvg()) return;
    this.bindMarkers();
    this.bindCards();
    this.bindZoom();
    this.injectZoomControls();
  }

  private injectSvg(): boolean {
    const textHolder = document.querySelector<HTMLElement>('[dev-target="svg-text-holder"]');
    const targetWrapper = document.querySelector<HTMLElement>('[dev-target="svg-target-wrapper"]');

    if (!textHolder || !targetWrapper) return false;

    const rawMarkup = textHolder.textContent?.trim() ?? '';
    if (!rawMarkup.includes('<svg')) return false;

    const svgMarkup = rawMarkup.replace(/=\d+"/g, '="');
    targetWrapper.innerHTML = svgMarkup;
    this.svgEl = targetWrapper.querySelector<SVGSVGElement>('svg');

    if (!this.svgEl) return false;

    const svgStyle = this.svgEl.querySelector('style');
    if (svgStyle?.textContent) {
      svgStyle.textContent = svgStyle.textContent.replace(/\u00A0/g, ' ');
    }

    this.svgEl.style.width = '100%';
    this.svgEl.style.height = '100%';
    this.svgEl.style.display = 'block';
    this.svgEl.classList.add('rebuild-map__svg');
    this.ensureTooltip();

    const viewBoxTokens = this.svgEl
      .getAttribute('viewBox')
      ?.split(/[\s,]+/)
      .map((token) => Number.parseFloat(token))
      .filter((token) => Number.isFinite(token));

    if (viewBoxTokens?.length === 4) {
      const [x, y, w, h] = viewBoxTokens;
      this.originalViewBox = { x, y, w, h };
      this.vb = { ...this.originalViewBox };
      this.applyViewBox();
    }

    return true;
  }

  private ensureTooltip(): void {
    const wrapper = this.svgEl?.parentElement;
    if (!wrapper) return;

    if (getComputedStyle(wrapper).position === 'static') {
      wrapper.style.position = 'relative';
    }

    const tooltip = document.createElement('div');
    tooltip.className = 'rebuild-map__tooltip';
    tooltip.setAttribute('aria-hidden', 'true');
    wrapper.appendChild(tooltip);
    this.tooltipEl = tooltip;
  }

  private bindMarkers(): void {
    if (!this.svgEl) return;

    const circles = Array.from(this.svgEl.querySelectorAll<SVGCircleElement>('circle'));
    if (circles.length < MAP_POINTS.length) return;

    const available = [...circles];

    MAP_POINTS.forEach((point) => {
      const marker = this.pickNearestMarker(point, available);
      if (!marker) return;

      this.markerById.set(point.id, marker);
      marker.dataset.rebuildPointId = point.id;
      marker.setAttribute('aria-label', point.label);
      marker.setAttribute('title', point.label);
      marker.classList.add('rebuild-map__marker');

      marker.addEventListener('mouseenter', () => this.highlight(point.id));
      marker.addEventListener('mouseleave', () => this.clearHighlight());
      marker.addEventListener('mousedown', (event) => event.stopPropagation());
      marker.addEventListener('click', () => this.highlight(point.id, true));
    });
  }

  private pickNearestMarker(
    point: MapPoint,
    available: SVGCircleElement[]
  ): SVGCircleElement | undefined {
    if (!available.length) return undefined;

    let bestIndex = 0;
    let bestDistance = Number.POSITIVE_INFINITY;

    available.forEach((marker, index) => {
      const cx = Number.parseFloat(marker.getAttribute('cx') ?? '');
      const cy = Number.parseFloat(marker.getAttribute('cy') ?? '');
      if (!Number.isFinite(cx) || !Number.isFinite(cy)) return;

      const distance = Math.hypot(cx - point.x, cy - point.y);
      if (distance < bestDistance) {
        bestDistance = distance;
        bestIndex = index;
      }
    });

    const [marker] = available.splice(bestIndex, 1);
    return marker;
  }

  private bindCards(): void {
    const listContainer = document.querySelector<HTMLElement>(
      '[dev-target="rebuild-map-point-list"]'
    );

    let cards = document.querySelectorAll<HTMLElement>(
      '[dev-target="rebuild-map-point"][map-point-id]'
    );

    if (!cards.length && listContainer) {
      listContainer.innerHTML = MAP_POINTS.map(
        (point) =>
          `<button class="rebuild-map__card" type="button" dev-target="rebuild-map-point" map-point-id="${point.id}">${point.label}</button>`
      ).join('');
      cards = listContainer.querySelectorAll<HTMLElement>(
        '[dev-target="rebuild-map-point"][map-point-id]'
      );
    }

    cards.forEach((card) => {
      const pointId = card.getAttribute('map-point-id');
      if (!pointId) return;

      this.cardById.set(pointId, card);
      card.addEventListener('mouseenter', () => this.highlight(pointId));
      card.addEventListener('mouseleave', () => this.clearHighlight());
      card.addEventListener('focus', () => this.highlight(pointId));
      card.addEventListener('blur', () => this.clearHighlight());
      card.addEventListener('click', () => this.highlight(pointId));
    });
  }

  private highlight(pointId: string, scrollToCard = false): void {
    if (this.isPanning) return;
    if (this.activeId === pointId && !scrollToCard) return;

    this.clearHighlight();
    this.activeId = pointId;

    this.markerById.get(pointId)?.classList.add('rebuild-map__marker--active');
    this.showTooltip(pointId);

    const card = this.cardById.get(pointId);
    if (card) {
      card.classList.add('rebuild-map__card--active');
      if (scrollToCard) {
        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }

  private clearHighlight(): void {
    this.activeId = null;

    this.svgEl
      ?.querySelector<SVGCircleElement>('.rebuild-map__marker--active')
      ?.classList.remove('rebuild-map__marker--active');

    document
      .querySelector<HTMLElement>('.rebuild-map__card--active')
      ?.classList.remove('rebuild-map__card--active');

    this.hideTooltip();
  }

  private showTooltip(pointId: string): void {
    if (!this.svgEl || !this.tooltipEl) return;

    const marker = this.markerById.get(pointId);
    const point = MAP_POINTS.find((entry) => entry.id === pointId);
    if (!marker || !point) return;

    const markerRect = marker.getBoundingClientRect();
    const wrapperRect = this.svgEl.parentElement?.getBoundingClientRect();
    if (!wrapperRect) return;

    const [title, subtitle] = this.splitLabel(point.label);
    this.tooltipEl.innerHTML = `
      <div class="rebuild-map__tooltip-title">${title}</div>
      <div class="rebuild-map__tooltip-subtitle">${subtitle.toUpperCase()}</div>
    `;

    const left = markerRect.left - wrapperRect.left + markerRect.width + 8;
    const top = markerRect.top - wrapperRect.top - 8;

    this.tooltipEl.style.left = `${left}px`;
    this.tooltipEl.style.top = `${top}px`;
    this.tooltipEl.classList.add('is-visible');
  }

  private hideTooltip(): void {
    this.tooltipEl?.classList.remove('is-visible');
  }

  private splitLabel(label: string): [string, string] {
    if (label.includes(' - ')) {
      const [title, subtitle] = label.split(/\s-\s(.+)/);
      return [title.trim(), subtitle.trim()];
    }

    const commaIndex = label.indexOf(',');
    if (commaIndex >= 0) {
      const title = label.slice(0, commaIndex).trim();
      const subtitle = label.slice(commaIndex + 1).trim();
      return [title, subtitle];
    }

    return [label.trim(), ''];
  }

  private applyViewBox(): void {
    const { x, y, w, h } = this.vb;
    this.svgEl?.setAttribute('viewBox', `${x} ${y} ${w} ${h}`);
  }

  private clampViewBox(): void {
    this.vb.x = Math.max(
      this.originalViewBox.x,
      Math.min(this.vb.x, this.originalViewBox.w - this.vb.w)
    );
    this.vb.y = Math.max(
      this.originalViewBox.y,
      Math.min(this.vb.y, this.originalViewBox.h - this.vb.h)
    );
    this.applyViewBox();
  }

  private toSvgPoint(clientX: number, clientY: number): { x: number; y: number } {
    const rect = this.svgEl!.getBoundingClientRect();
    return {
      x: this.vb.x + ((clientX - rect.left) / rect.width) * this.vb.w,
      y: this.vb.y + ((clientY - rect.top) / rect.height) * this.vb.h,
    };
  }

  private zoomAround(scale: number, originX: number, originY: number): void {
    const newW = this.vb.w * scale;
    const zoom = this.originalViewBox.w / newW;
    if (zoom < this.MIN_ZOOM || zoom > this.MAX_ZOOM) return;

    this.vb.x = originX + (this.vb.x - originX) * scale;
    this.vb.y = originY + (this.vb.y - originY) * scale;
    this.vb.w = newW;
    this.vb.h *= scale;
    this.clampViewBox();
  }

  private zoomBy(scale: number): void {
    const cx = this.vb.x + this.vb.w / 2;
    const cy = this.vb.y + this.vb.h / 2;
    this.zoomAround(scale, cx, cy);
  }

  private resetZoom(): void {
    this.vb = { ...this.originalViewBox };
    this.applyViewBox();
  }

  private bindZoom(): void {
    if (!this.svgEl) return;

    const svg = this.svgEl;

    svg.addEventListener(
      'wheel',
      (event: WheelEvent) => {
        if (this.DISABLE_ZOOM_WITH_MOUSE_SCROLL) return;
        event.preventDefault();
        const scale = event.deltaY < 0 ? 0.85 : 1 / 0.85;
        const { x, y } = this.toSvgPoint(event.clientX, event.clientY);
        this.zoomAround(scale, x, y);
      },
      { passive: false }
    );

    let startClient = { x: 0, y: 0 };
    let startVb: ViewBox = { ...this.vb };

    svg.addEventListener('mousedown', (event: MouseEvent) => {
      if (event.button !== 0 && event.button !== 1) return;
      event.preventDefault();
      this.isPanning = true;
      startClient = { x: event.clientX, y: event.clientY };
      startVb = { ...this.vb };
      svg.classList.add('lot-map__svg--panning');
    });

    window.addEventListener('mousemove', (event: MouseEvent) => {
      if (!this.isPanning) return;
      const rect = svg.getBoundingClientRect();
      this.vb.x = startVb.x - ((event.clientX - startClient.x) / rect.width) * startVb.w;
      this.vb.y = startVb.y - ((event.clientY - startClient.y) / rect.height) * startVb.h;
      this.clampViewBox();
    });

    window.addEventListener('mouseup', (event: MouseEvent) => {
      if (!this.isPanning || (event.button !== 0 && event.button !== 1)) return;
      this.isPanning = false;
      svg.classList.remove('lot-map__svg--panning');
    });
  }

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
      <button class="lot-map__zoom-btn" data-zoom="in" title="Zoom in" aria-label="Zoom in">+</button>
      <button class="lot-map__zoom-btn" data-zoom="reset" title="Reset zoom" aria-label="Reset zoom">⊙</button>
      <button class="lot-map__zoom-btn" data-zoom="out" title="Zoom out" aria-label="Zoom out">−</button>
    `;

    controls.addEventListener('click', (event: MouseEvent) => {
      const button = (event.target as HTMLElement).closest<HTMLButtonElement>('[data-zoom]');
      if (!button) return;

      const action = button.dataset.zoom;
      if (action === 'in') this.zoomBy(0.7);
      else if (action === 'out') this.zoomBy(1 / 0.7);
      else if (action === 'reset') this.resetZoom();
    });

    wrapper.appendChild(controls);
  }
}
