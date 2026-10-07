/**
 * Carto basemap for the homes inventory page.
 *
 * Loads Leaflet, paints CARTO light tiles, and drops a marker for every
 * `.browse-homes-cms-item` that has `div[lat]` / `div[lng]`. Hover and click
 * stay in sync with the matching card.
 *
 * **Required Webflow attributes**
 *
 * | Element | Attribute | Value |
 * |---|---|---|
 * | Empty map holder | `dev-target` | `map-holder` |
 * | Each home card | class | `browse-homes-cms-item` |
 * | Lat / lng inside the card | `lat`, `lng` | decimal degrees on a `div` |
 * | Optional recenter control | `id` | `recenterBtn` |
 */

const LEAFLET_JS = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
const LEAFLET_CSS = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
const CARTO_TILES =
  'https://basemaps.cartocdn.com/rastertiles/light_all/{z}/{x}/{y}{r}.png?key=cb1_3hbj_1_c14e5182b0d3ef51c8132700';

const DEFAULT_CENTER: [number, number] = [39.7392, -104.9903];
const DEFAULT_ZOOM = 10;

interface LeafletLatLng {
  lat: number;
  lng: number;
}

interface LeafletMarker {
  addTo: (map: LeafletMap) => LeafletMarker;
  getLatLng: () => LeafletLatLng;
  getElement: () => HTMLElement | undefined;
  on: (event: 'mouseover' | 'mouseout' | 'click', handler: () => void) => void;
}

interface LeafletBounds {
  extend: (latlng: [number, number]) => void;
  isValid: () => boolean;
}

interface LeafletMap {
  fitBounds: (
    bounds: LeafletBounds,
    options?: { padding?: [number, number]; maxZoom?: number }
  ) => void;
  setView: (
    center: [number, number] | LeafletLatLng,
    zoom: number,
    options?: { animate?: boolean }
  ) => void;
  invalidateSize: () => void;
}

interface LeafletNamespace {
  map: (el: HTMLElement, options?: { zoomControl?: boolean }) => LeafletMap;
  tileLayer: (
    url: string,
    options?: { attribution?: string }
  ) => { addTo: (map: LeafletMap) => void };
  latLngBounds: (latlngs: never[]) => LeafletBounds;
  marker: (
    latlng: [number, number],
    options: { icon: unknown; riseOnHover?: boolean }
  ) => LeafletMarker;
  divIcon: (options: {
    html: string;
    className: string;
    iconSize: [number, number];
    iconAnchor: [number, number];
  }) => unknown;
}

declare global {
  interface Window {
    L?: LeafletNamespace;
    resetFilters?: () => void;
    _homeMarkers?: Map<string, LeafletMarker>;
  }
}

export class Carto {
  private map: LeafletMap | null = null;
  private bounds: LeafletBounds | null = null;
  private activeId: string | null = null;
  private readonly markers = new Map<string, LeafletMarker>();
  private readonly cards = new Map<string, HTMLElement>();

  /**
   * Mounts the map into `[dev-target="map-holder"]`.
   * Safe to call when the holder or Leaflet is missing; those cases are logged and skipped.
   */
  async init(): Promise<void> {
    const mapEl = document.querySelector<HTMLElement>('[dev-target="map-holder"]');
    if (!mapEl) {
      console.error('Carto: No [dev-target="map-holder"] found.');
      return;
    }

    const cards = document.querySelectorAll<HTMLElement>('.browse-homes-cms-item');
    if (!cards.length) {
      console.error('Carto: No .browse-homes-cms-item cards found.');
      return;
    }

    try {
      await ensureLeaflet();
    } catch (error) {
      console.error('Carto: Failed to load Leaflet.', error);
      return;
    }

    const leaflet = window.L;
    if (!leaflet) {
      console.error('Carto: Leaflet did not attach to window.');
      return;
    }

    if (mapEl.clientHeight === 0) mapEl.style.minHeight = '480px';

    const map = leaflet.map(mapEl, { zoomControl: false });
    this.map = map;

    leaflet
      .tileLayer(CARTO_TILES, {
        attribution: '&copy; OpenStreetMap | &copy; CARTO',
      })
      .addTo(map);

    const bounds = leaflet.latLngBounds([]);
    this.bounds = bounds;

    cards.forEach((card, idx) => {
      const lat = Number.parseFloat(card.querySelector('div[lat]')?.getAttribute('lat') ?? '');
      const lng = Number.parseFloat(card.querySelector('div[lng]')?.getAttribute('lng') ?? '');
      if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;

      if (!card.dataset.id) card.dataset.id = String(idx);
      const { id } = card.dataset;

      const marker = leaflet
        .marker([lat, lng], {
          icon: leaflet.divIcon({
            html: markerHtml(false),
            className: '',
            iconSize: [50, 50],
            iconAnchor: [25, 25],
          }),
          riseOnHover: true,
        })
        .addTo(map);

      this.markers.set(id, marker);
      this.cards.set(id, card);
      bounds.extend([lat, lng]);

      marker.on('mouseover', () => this.activate(id));
      marker.on('mouseout', () => this.deactivate(id));
      marker.on('click', () => {
        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
        this.activate(id);
      });

      card.addEventListener('mouseenter', () => this.activate(id));
      card.addEventListener('mouseleave', () => this.deactivate(id));
      card.addEventListener('click', () => {
        map.setView(marker.getLatLng(), 14, { animate: true });
        this.activate(id);
      });
    });

    this.fitToMarkers();

    document.getElementById('recenterBtn')?.addEventListener('click', () => {
      this.fitToMarkers();
    });

    window._homeMarkers = this.markers;
    this.refreshSize();
  }

  /** Shows or hides the marker that belongs to a home card. */
  setMarkerHidden(id: string | undefined, hidden: boolean): void {
    if (!id) return;
    this.markers.get(id)?.getElement()?.classList.toggle('hidden', hidden);
  }

  private fitToMarkers(): void {
    if (!this.map) return;

    if (this.bounds?.isValid()) {
      this.map.fitBounds(this.bounds, { padding: [20, 20], maxZoom: 12 });
      return;
    }

    this.map.setView(DEFAULT_CENTER, DEFAULT_ZOOM);
  }

  private refreshSize(): void {
    const refresh = () => this.map?.invalidateSize();
    requestAnimationFrame(refresh);
    if (document.readyState !== 'complete') {
      window.addEventListener('load', refresh, { once: true });
    }
  }

  private activate(id: string): void {
    if (this.activeId === id) return;
    this.deactivate(this.activeId);

    const markerEl = this.markers.get(id)?.getElement();
    const inner = markerEl?.querySelector('.mm-shadow');
    markerEl?.classList.add('is-active');
    markerEl?.style.setProperty('z-index', '999');
    inner?.classList.add('is-active');

    const card = this.cards.get(id);
    card?.classList.add('is-active');
    card?.querySelector('.city-card-wrapper')?.classList.add('active');

    this.activeId = id;
  }

  private deactivate(id: string | null): void {
    if (!id) return;

    const markerEl = this.markers.get(id)?.getElement();
    const inner = markerEl?.querySelector('.mm-shadow');
    markerEl?.classList.remove('is-active');
    markerEl?.style.removeProperty('z-index');
    inner?.classList.remove('is-active');

    const card = this.cards.get(id);
    card?.classList.remove('is-active');
    card?.querySelector('.city-card-wrapper')?.classList.remove('active');

    if (this.activeId === id) this.activeId = null;
  }
}

function markerHtml(active: boolean): string {
  return `<button class="mm-shadow${active ? ' is-active' : ''}">
       <div class="mm-white"><div class="mm-dot"></div></div>
     </button>`;
}

function ensureLeafletCss(): void {
  if (document.querySelector(`link[href="${LEAFLET_CSS}"]`)) return;

  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = LEAFLET_CSS;
  document.head.appendChild(link);
}

function ensureLeaflet(): Promise<void> {
  ensureLeafletCss();
  if (window.L) return Promise.resolve();

  return new Promise((resolve, reject) => {
    const fail = () => reject(new Error('Leaflet failed to load'));
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${LEAFLET_JS}"]`);

    if (existing) {
      existing.addEventListener('load', () => resolve(), { once: true });
      existing.addEventListener('error', fail, { once: true });
      return;
    }

    const script = document.createElement('script');
    script.src = LEAFLET_JS;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = fail;
    document.head.appendChild(script);
  });
}
