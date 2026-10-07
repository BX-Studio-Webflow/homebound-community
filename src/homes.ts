import '$styles/carto.css';

import { Carto } from '$utils/carto';

type NumberRange = { min: number; max: number };

type FilterState = {
  location: string | null;
  price: NumberRange | null;
  beds: number | null;
  baths: number | null;
  sqft: NumberRange | null;
  readiness: string | null;
};

const FILTER_KEY: Record<string, keyof FilterState> = {
  'sq-feet': 'sqft',
  'home-readiness': 'readiness',
};

window.Webflow ||= [];
window.Webflow.push(() => {
  initScrollLock();
  initHeaderScroll();
  stampDropdownDefaults();
  populateLocationDropdown();
  initPriceFix();
  initCardPopup();
  initCardForm();

  const carto = new Carto();
  const applyFilters = initFilters(carto);
  void carto.init().then(() => applyFilters());
});

function initScrollLock(): void {
  document.addEventListener('click', (event) => {
    const target = event.target instanceof Element ? event.target.closest('[scroll]') : null;
    if (!(target instanceof HTMLElement)) return;

    const scrollAction = target.getAttribute('scroll');
    if (scrollAction === 'disable') {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
      return;
    }

    if (scrollAction === 'enable') {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    }
  });
}

function initHeaderScroll(): void {
  const header = document.querySelector('.new-header-nav');
  if (!header) return;

  const sync = () => {
    header.classList.toggle('switch-style', window.scrollY >= 1);
  };

  window.addEventListener('scroll', sync, { passive: true });
  sync();
}

function stampDropdownDefaults(): void {
  document.querySelectorAll<HTMLElement>('.cities-dropdown').forEach((drop) => {
    const text = drop.querySelector('.dropdown-toggle-text')?.textContent?.trim();
    if (!text) return;
    drop.dataset.defaultLabel = text;
  });
}

function populateLocationDropdown(): void {
  const locationDrop = document.querySelector<HTMLElement>(
    '.cities-dropdown[data-default-label="Location"]'
  );
  const listEl = locationDrop?.querySelector('.cities-dropdown-list');
  if (!locationDrop || !listEl) return;

  const neighbourhoods = new Set<string>();
  document.querySelectorAll('.browse-homes-cms-item [neighbourhood]').forEach((el) => {
    const value = el.getAttribute('neighbourhood')?.trim();
    if (value) neighbourhoods.add(value);
  });

  listEl.innerHTML = '';
  [...neighbourhoods]
    .sort((a, b) => a.localeCompare(b))
    .forEach((value) => {
      const item = document.createElement('div');
      item.className = 'cities-dropdown-list-item';
      item.textContent = value;
      listEl.appendChild(item);
    });
}

function initPriceFix(): void {
  document.querySelectorAll('.city-card-wrapper [price]').forEach((priceEl) => {
    const value = (priceEl.getAttribute('price') || priceEl.textContent || '').trim().toLowerCase();
    if (value !== 'inquire for pricing') return;

    priceEl
      .closest('.city-card-wrapper')
      ?.querySelectorAll('[price-text]')
      .forEach((el) => {
        el.remove();
      });
  });
}

function initFilters(carto: Carto): () => void {
  const filterState: FilterState = {
    location: null,
    price: null,
    beds: null,
    baths: null,
    sqft: null,
    readiness: null,
  };

  const filterCards = () => {
    const noActive = Object.values(filterState).every((value) => value == null);

    document.querySelectorAll<HTMLElement>('.browse-homes-cms-item').forEach((card) => {
      const wrap = card.querySelector<HTMLElement>('.city-card-wrapper');
      const { id } = card.dataset;

      if (noActive) {
        card.style.removeProperty('display');
        carto.setMarkerHidden(id, false);
        return;
      }

      if (!wrap) {
        card.style.display = 'none';
        carto.setMarkerHidden(id, true);
        return;
      }

      const show = cardMatchesFilters(wrap, filterState);
      if (show) {
        card.style.removeProperty('display');
        carto.setMarkerHidden(id, false);
        return;
      }

      card.style.display = 'none';
      carto.setMarkerHidden(id, true);
    });
  };

  document.querySelectorAll<HTMLElement>('.cities-dropdown').forEach((drop) => {
    const txtEl = drop.querySelector('.dropdown-toggle-text');
    if (!txtEl) return;

    drop.addEventListener('click', (event) => {
      const item =
        event.target instanceof Element ? event.target.closest('.cities-dropdown-list-item') : null;
      if (!(item instanceof HTMLElement)) return;

      const label = item.textContent?.trim() ?? '';
      const rawFilter = drop.dataset.filter || drop.getAttribute('filter') || 'location';
      const filt = FILTER_KEY[rawFilter] ?? rawFilter;
      const same = label === txtEl.textContent?.trim();

      if (same) {
        clearFilter(filterState, filt);
        txtEl.textContent = drop.dataset.defaultLabel ?? '';
        txtEl.classList.remove('selected');
        item.classList.remove('selected');
        filterCards();
        return;
      }

      drop.querySelectorAll('.cities-dropdown-list-item').forEach((el) => {
        el.classList.toggle('selected', el === item);
      });

      txtEl.textContent = label;
      txtEl.classList.add('selected');
      applyFilterChoice(filterState, filt, label);
      filterCards();
    });
  });

  window.resetFilters = () => {
    (Object.keys(filterState) as (keyof FilterState)[]).forEach((key) => {
      filterState[key] = null;
    });

    document.querySelectorAll<HTMLElement>('.cities-dropdown').forEach((drop) => {
      const text = drop.querySelector('.dropdown-toggle-text');
      if (text) text.textContent = drop.dataset.defaultLabel ?? '';
      drop.querySelectorAll('.selected').forEach((el) => el.classList.remove('selected'));
    });

    filterCards();
  };

  filterCards();
  return filterCards;
}

function clearFilter(filterState: FilterState, filt: string): void {
  switch (filt) {
    case 'price':
      filterState.price = null;
      break;
    case 'beds':
      filterState.beds = null;
      break;
    case 'baths':
      filterState.baths = null;
      break;
    case 'sqft':
      filterState.sqft = null;
      break;
    case 'readiness':
    case 'home-readiness':
      filterState.readiness = null;
      break;
    default:
      filterState.location = null;
  }
}

function applyFilterChoice(filterState: FilterState, filt: string, label: string): void {
  switch (filt) {
    case 'price':
      filterState.price = parseRange(label, true);
      break;
    case 'beds':
      filterState.beds = Number.parseInt(label, 10);
      break;
    case 'baths':
      filterState.baths = Number.parseInt(label, 10);
      break;
    case 'sqft':
      filterState.sqft = parseRange(label);
      break;
    case 'readiness':
    case 'home-readiness':
      filterState.readiness = label;
      break;
    default:
      filterState.location = label;
  }
}

function cardMatchesFilters(wrap: HTMLElement, filterState: FilterState): boolean {
  const priceRaw = wrap.querySelector('[price]')?.getAttribute('price') ?? '';
  const price = Number(priceRaw.replace(/[^\d]/g, '')) || 0;
  const beds = Number(wrap.querySelector('[beds]')?.getAttribute('beds')) || 0;
  const baths = Number(wrap.querySelector('[baths]')?.getAttribute('baths')) || 0;
  const sqft = Number(wrap.querySelector('[sq-feet]')?.getAttribute('sq-feet')) || 0;
  const ready =
    wrap.querySelector('[home-readiness]')?.getAttribute('home-readiness')?.trim() ?? '';
  const addr = wrap.textContent ?? '';

  if (filterState.location && !addr.includes(filterState.location)) return false;
  if (filterState.price && (price < filterState.price.min || price > filterState.price.max)) {
    return false;
  }
  if (filterState.beds && beds < filterState.beds) return false;
  if (filterState.baths && baths < filterState.baths) return false;
  if (filterState.sqft && (sqft < filterState.sqft.min || sqft > filterState.sqft.max)) {
    return false;
  }
  if (filterState.readiness && ready !== filterState.readiness) return false;

  return true;
}

function moneyFactor(value: string): number {
  const suffix = value.slice(-1).toUpperCase();
  if (suffix === 'K') return 1e3;
  if (suffix === 'M') return 1e6;
  if (suffix === 'B') return 1e9;
  return 1;
}

function moneyToNum(value: string): number {
  return Number.parseFloat(value) * moneyFactor(value);
}

function parseRange(label: string, isMoney = false): NumberRange {
  const clean = label.replace(/[\s$]/g, '');
  const toNum = (token: string) => (isMoney ? moneyToNum(token) : Number.parseInt(token, 10));

  if (clean.includes('+')) {
    return { min: toNum(clean.replace('+', '')), max: Number.POSITIVE_INFINITY };
  }

  const [rawMin, rawMax] = clean.split('-');
  return { min: toNum(rawMin ?? ''), max: toNum(rawMax ?? '') };
}

function initCardPopup(): void {
  const cards = document.querySelectorAll<HTMLElement>('.browse-homes-cms-item');
  const popupImage = document.querySelector('[form-image]');
  const popupName = document.querySelector('[form-name]');
  const popupSqft = document.querySelector('[form-sq-ft]');
  const popupBeds = document.querySelector('[form-beds]');
  const popupBaths = document.querySelector('[form-baths]');
  const popupSfId = document.querySelector('#home_listing_id');

  cards.forEach((card) => {
    const button = card.querySelector('a[card-button]');
    if (!button) return;

    button.addEventListener('click', (event) => {
      event.preventDefault();

      const image = card.querySelector('[house-main-image]');
      const name = card.querySelector('[data-filter-name]');
      const sqft = card.querySelector('[sq-feet]');
      const beds = card.querySelector('[beds]');
      const baths = card.querySelector('[baths]');
      const sfid = card.querySelector('[sf-id]');
      const src = image?.getAttribute('src');

      if (src && popupImage instanceof HTMLImageElement) {
        popupImage.src = src;
        popupImage.srcset = src;
      }
      if (name && popupName) popupName.textContent = name.textContent?.trim() ?? '';
      if (sqft && popupSqft) popupSqft.textContent = sqft.textContent?.trim() ?? '';
      if (beds && popupBeds) popupBeds.textContent = beds.textContent?.trim() ?? '';
      if (baths && popupBaths) popupBaths.textContent = baths.textContent?.trim() ?? '';
      if (sfid && popupSfId instanceof HTMLInputElement) {
        popupSfId.value = sfid.getAttribute('sf-id') ?? '';
      }
    });
  });
}

function initCardForm(): void {
  const form = document.getElementById('hb-pardot-form');
  const first = document.getElementById('hb_first');
  const last = document.getElementById('hb_last');
  const email = document.getElementById('hb_email');
  const phone = document.getElementById('hb_phone');
  const button = form?.querySelector('.house-form-submit-button');

  if (
    !(form instanceof HTMLFormElement) ||
    !(first instanceof HTMLInputElement) ||
    !(last instanceof HTMLInputElement) ||
    !(email instanceof HTMLInputElement) ||
    !(phone instanceof HTMLInputElement) ||
    !(button instanceof HTMLButtonElement || button instanceof HTMLInputElement)
  ) {
    return;
  }

  const setHidden = (id: string, value: string) => {
    const input = document.getElementById(id);
    if (input instanceof HTMLInputElement) input.value = value;
  };

  setHidden('utm_source', getParam('utm_source'));
  setHidden('utm_medium', getParam('utm_medium'));
  setHidden('utm_campaign', getParam('utm_campaign'));
  setHidden('utm_term', getParam('utm_term'));

  const listingId = getParam('house_id');
  if (listingId) setHidden('home_listing_id', listingId);

  let submitted = false;

  const validateAndToggle = () => {
    const allOk = Boolean(
      first.value.trim() &&
        last.value.trim() &&
        email.checkValidity() &&
        digits(phone.value).length === 10
    );
    button.classList.toggle('disabled', !allOk);
    button.disabled = !allOk;
    button.setAttribute('aria-disabled', String(!allOk));
  };

  phone.addEventListener('input', () => {
    phone.value = formatUSPhone(phone.value);
    phone.setSelectionRange(phone.value.length, phone.value.length);
    validateAndToggle();
  });

  [first, last, email].forEach((input) => {
    input.addEventListener('input', validateAndToggle);
    input.addEventListener('blur', validateAndToggle);
  });

  const iframe = document.getElementsByName('hidden_iframe')[0];
  if (iframe instanceof HTMLIFrameElement) {
    iframe.addEventListener('load', () => {
      if (!submitted) return;
      form.style.display = 'none';
      const thanks = document.getElementById('thankyou-message');
      if (thanks) thanks.style.display = 'block';
    });
  }

  form.addEventListener('submit', (event) => {
    if (button.disabled) {
      event.preventDefault();
      return;
    }
    submitted = true;
    phone.value = digits(phone.value);
  });

  validateAndToggle();
}

function getParam(name: string): string {
  return new URL(location.href).searchParams.get(name) ?? '';
}

function digits(value: string): string {
  return value.replace(/\D/g, '');
}

function formatUSPhone(value: string): string {
  const d = digits(value).slice(0, 10);
  if (!d) return '';
  if (d.length < 4) return `(${d}`;
  if (d.length < 7) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
}
