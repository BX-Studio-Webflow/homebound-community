/**
 * Interactive floor plan configurator for the house-plans template.
 *
 * Reads each floor SVG from the same hidden holders as {@link HomeMapController},
 * then mounts a copy into the desktop, mobile, and overlay wrappers. Option
 * cards and SVG shapes share one selection set. On mobile, an overlay pages
 * through those options.
 *
 * Desktop card clicks cooperate with HomeMapController: the checkbox is the
 * source of truth when that controller also toggles it.
 *
 * **Required Webflow attributes**
 *
 * | Element | Attribute | Value |
 * |---|---|---|
 * | Configurator root | `dev-target` | `ifp-root` |
 * | Hidden SVG source (1st / 2nd) | `dev-target` | `first-floor-svg-text-holder` / `second-floor-svg-text-holder` |
 * | Desktop / mobile / overlay SVG mount | `dev-target` | `ifp-desktop-svg` / `ifp-mobile-svg` / `ifp-overlay-svg` |
 * | Desktop card list | `dev-target` | `ifp-desktop` |
 * | Floor group | `dev-target` | `first-tab` / `second-tab` |
 * | Feature card | `dev-target` | `feature-collection-item` |
 * | Feature card | `feature` | SVG group id, or several comma-separated ids |
 * | Floor tab | `dev-target` | `ifp-tab` (`data-floor="first"` or `"second"`) |
 * | Overlay | `dev-target` | `ifp-overlay` |
 * | Open / close / next / clear | `dev-target` | `ifp-open-overlay` / `ifp-close` / `ifp-next` / `ifp-clear` |
 * | Slide list and template | `dev-target` | `ifp-slide-list` / `ifp-slide-template` |
 * | Slide title, description, toggle | `dev-target` | `ifp-option-title` / `ifp-option-desc` / `ifp-option-toggle` |
 * | Dots and template | `dev-target` | `ifp-dots` / `ifp-dot-template` |
 * | Counter | `dev-target` | `ifp-counter` |
 * | Personalize link | `dev-target` | `ifp-personalize` |
 */

const FLOORS = ['first', 'second'] as const;

type Floor = (typeof FLOORS)[number];

type FloorOption = {
  key: string;
  floor: Floor;
  title: string;
  desc: string;
  featureIds: string[];
  card: HTMLElement;
  slide?: HTMLElement;
  dot?: HTMLElement;
};

type PlanView = {
  wrapper: HTMLElement;
  svgs: Partial<Record<Floor, SVGSVGElement>>;
};

const target = (name: string): string => `[dev-target="${name}"]`;
const svgHolder = (floor: Floor): string => `[dev-target="${floor}-floor-svg-text-holder"]`;

export class FloorPlanConfigurator {
  private readonly root: HTMLElement | null;
  private options: FloorOption[] = [];
  private readonly selected = new Set<string>();
  private views: PlanView[] = [];
  private floor: Floor = 'first';
  private slideIndex = 0;
  private overlay: HTMLElement | null = null;
  private lastFocus: HTMLElement | null = null;
  private readonly floorSvgText: Partial<Record<Floor, string>> = {};

  constructor(root: HTMLElement | null = document.querySelector(target('ifp-root'))) {
    this.root = root;
  }

  async init(): Promise<void> {
    if (!this.root) return;

    this.collectOptions();
    await this.loadFloorSvgs();
    this.mountPlanViews();
    this.buildSlides();
    this.bindTabs();
    this.bindDesktopCards();
    this.bindOverlay();
    this.bindClear();
    this.bindPersonalize();

    const firstFloorWithOptions = FLOORS.find((floor) =>
      this.options.some((option) => option.floor === floor)
    );
    this.setFloor(firstFloorWithOptions ?? 'first');
    this.render();
  }

  private collectOptions(): void {
    const { root } = this;
    if (!root) return;

    const desktop = root.querySelector<HTMLElement>(target('ifp-desktop')) ?? root;
    const cards = [...desktop.querySelectorAll<HTMLElement>(target('feature-collection-item'))];

    desktop
      .querySelectorAll<HTMLElement>(`${target('first-tab')}, ${target('second-tab')}`)
      .forEach((group) => {
        if (group.querySelector(target('feature-collection-item'))) {
          group.style.removeProperty('display');
        }
      });

    this.options = cards
      .map((card, index) => {
        const featureIds = FloorPlanConfigurator.featureIds(card);
        if (!featureIds.length) return null;

        const floor: Floor = card.closest(target('second-tab')) ? 'second' : 'first';
        const text = (selector: string): string =>
          card.querySelector(selector)?.textContent?.trim() ?? '';

        return {
          key: `${floor}:${featureIds.join(',')}:${index}`,
          floor,
          title: text('.configure-heading:not(.is-body)'),
          desc: text('.configure-heading.is-body'),
          featureIds,
          card,
        };
      })
      .filter((option): option is FloorOption => option !== null)
      .sort((a, b) => FLOORS.indexOf(a.floor) - FLOORS.indexOf(b.floor));

    if (!this.options.length) {
      console.error('FloorPlanConfigurator: no option cards with a `feature` attribute found.');
    }
  }

  private static featureIds(card: HTMLElement): string[] {
    const raw = card.getAttribute('feature')?.trim() || card.id.trim();
    return raw
      .split(',')
      .map((part) => part.trim())
      .filter(Boolean);
  }

  private isSelected(option: FloorOption): boolean {
    return this.selected.has(option.key);
  }

  private setSelected(option: FloorOption, on: boolean): void {
    if (on) this.selected.add(option.key);
    else this.selected.delete(option.key);
    this.render();
  }

  private toggle(option: FloorOption): void {
    this.setSelected(option, !this.isSelected(option));
  }

  private async loadFloorSvgs(): Promise<void> {
    await Promise.all(
      FLOORS.map(async (floor) => {
        const holder = document.querySelector(svgHolder(floor));
        const raw = holder?.textContent?.trim() ?? '';
        if (!raw) return;

        try {
          if (raw.includes('<svg')) {
            this.floorSvgText[floor] = FloorPlanConfigurator.sanitize(raw);
          } else if (/^https?:\/\//i.test(raw)) {
            const res = await fetch(raw);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            this.floorSvgText[floor] = FloorPlanConfigurator.sanitize(await res.text());
          }
        } catch (err) {
          console.error(`FloorPlanConfigurator: could not load ${floor} floor SVG`, err);
        }
      })
    );
  }

  private static sanitize(svg: string): string {
    return svg.replace(/=\d+"/g, '="').replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '');
  }

  private mountPlanViews(): void {
    const { root } = this;
    if (!root) return;

    const wrappers = ['ifp-desktop-svg', 'ifp-mobile-svg', 'ifp-overlay-svg']
      .map((name) => root.querySelector<HTMLElement>(target(name)))
      .filter((wrapper): wrapper is HTMLElement => wrapper instanceof HTMLElement);

    this.views = wrappers.map((wrapper, wrapperIndex) => {
      wrapper.innerHTML = '';
      const view: PlanView = { wrapper, svgs: {} };

      FLOORS.forEach((floor) => {
        const text = this.floorSvgText[floor];
        if (!text) return;

        const svg = new DOMParser().parseFromString(text, 'image/svg+xml').querySelector('svg');
        if (!(svg instanceof SVGSVGElement)) return;

        FloorPlanConfigurator.namespaceClasses(svg, `ifp${wrapperIndex}-${floor}-`);
        svg.classList.add('home-map__svg');
        svg.style.width = '100%';
        svg.style.height = '100%';
        svg.style.display = 'none';
        svg.setAttribute('data-floor', floor);
        wrapper.appendChild(document.importNode(svg, true));

        const mounted = wrapper.lastElementChild;
        if (!(mounted instanceof SVGSVGElement)) return;
        view.svgs[floor] = mounted;
        this.bindSvgShapes(mounted);
      });

      return view;
    });
  }

  private static namespaceClasses(svg: SVGSVGElement, prefix: string): void {
    const isGenerated = (token: string): boolean =>
      /^cls-\d+$/.test(token) || /^st\d+$/.test(token);
    const map = new Map<string, string>();

    svg.querySelectorAll<SVGElement>('[class]').forEach((el) => {
      const next = (el.getAttribute('class') ?? '')
        .split(/\s+/)
        .filter(Boolean)
        .map((token) => {
          if (!isGenerated(token)) return token;
          const namespaced = map.get(token) ?? `${prefix}${token}`;
          map.set(token, namespaced);
          return namespaced;
        });
      el.setAttribute('class', next.join(' '));
    });

    svg.querySelectorAll('style').forEach((style) => {
      let css = style.textContent ?? '';
      map.forEach((to, from) => {
        css = css.replace(new RegExp(`\\.${from}(?![\\w-])`, 'g'), `.${to}`);
      });
      style.textContent = css;
    });
  }

  private bindSvgShapes(svg: SVGSVGElement): void {
    svg.querySelectorAll<SVGGElement>('g[data-attribute="feature"][id]').forEach((group) => {
      const id = group.id.trim();
      const option = this.options.find((item) => item.featureIds.includes(id));
      group.classList.add('home-map__shape');
      if (!option) return;

      group.style.cursor = 'pointer';
      group.addEventListener('mouseenter', () => this.hover(option));
      group.addEventListener('mouseleave', () => this.hover(null));
      group.addEventListener('click', () => this.toggle(option));
    });
  }

  private hover(option: FloorOption | null): void {
    const ids = new Set(option?.featureIds ?? []);

    this.views.forEach((view) => {
      Object.values(view.svgs).forEach((svg) => {
        svg?.querySelectorAll<SVGGElement>('g[data-attribute="feature"][id]').forEach((group) => {
          group.classList.toggle('home-map__shape--hover', ids.has(group.id.trim()));
        });
      });
    });

    this.options.forEach((item) => {
      item.card.classList.toggle('home-map__card--hover', item === option);
    });
  }

  private bindTabs(): void {
    const { root } = this;
    if (!root) return;

    root.querySelectorAll<HTMLElement>(target('ifp-tab')).forEach((tab) => {
      const { floor } = tab.dataset;
      if (floor !== 'first' && floor !== 'second') return;

      const go = (): void => {
        this.setFloor(floor);
        if (!tab.closest(target('ifp-overlay'))) return;
        const index = this.options.findIndex((option) => option.floor === floor);
        if (index > -1) this.goToSlide(index, false);
      };

      tab.addEventListener('click', go);
      tab.addEventListener('keydown', (event) => {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        event.preventDefault();
        go();
      });
    });
  }

  private setFloor(floor: Floor): void {
    const { root } = this;
    if (!root) return;

    this.floor = floor;
    root.querySelectorAll<HTMLElement>(target('ifp-tab')).forEach((tab) => {
      const on = tab.dataset.floor === floor;
      tab.classList.toggle('is-active', on);
      tab.setAttribute('aria-selected', on ? 'true' : 'false');
    });

    this.views.forEach((view) => {
      FLOORS.forEach((name) => {
        const svg = view.svgs[name];
        if (svg) svg.style.display = name === floor ? 'block' : 'none';
      });
    });
  }

  private bindDesktopCards(): void {
    this.options.forEach((option) => {
      const input = option.card.querySelector<HTMLInputElement>('input[type="checkbox"]');
      const box = option.card.querySelector<HTMLElement>('.w-checkbox-input');
      const readChecked = (): boolean =>
        box?.classList.contains('w--redirected-checked') ?? !!input?.checked;

      let before = false;
      option.card.addEventListener(
        'click',
        () => {
          before = readChecked();
        },
        true
      );
      option.card.addEventListener('click', (event) => {
        const native = !!(event.target instanceof Element
          ? event.target.closest('input[type="checkbox"], .w-checkbox-input, label')
          : null);

        window.setTimeout(() => {
          const after = readChecked();
          if (after === before && !native) this.toggle(option);
          else this.setSelected(option, after);
        }, 0);
      });

      input?.addEventListener('change', () => this.setSelected(option, input.checked));
      option.card.addEventListener('mouseenter', () => this.hover(option));
      option.card.addEventListener('mouseleave', () => this.hover(null));
    });
  }

  private buildSlides(): void {
    const { root } = this;
    if (!root) return;

    const list = root.querySelector<HTMLElement>(target('ifp-slide-list'));
    const template = root.querySelector<HTMLElement>(target('ifp-slide-template'));
    const dots = root.querySelector<HTMLElement>(target('ifp-dots'));
    const dotTemplate = root.querySelector<HTMLElement>(target('ifp-dot-template'));
    if (!list || !template) return;

    template.remove();
    dotTemplate?.remove();
    list.innerHTML = '';
    if (dots) dots.innerHTML = '';

    this.options.forEach((option, index) => {
      const slide = template.cloneNode(true);
      if (!(slide instanceof HTMLElement)) return;

      slide.removeAttribute('dev-target');
      slide.setAttribute('data-ifp-slide', String(index));
      slide.setAttribute('role', 'group');
      slide.setAttribute('aria-roledescription', 'slide');

      const title = slide.querySelector(target('ifp-option-title'));
      const desc = slide.querySelector<HTMLElement>(target('ifp-option-desc'));
      if (title) title.textContent = option.title;
      if (desc) desc.textContent = option.desc;
      if (desc && !option.desc) desc.style.display = 'none';

      const toggle = slide.querySelector<HTMLElement>(target('ifp-option-toggle'));
      if (toggle) {
        toggle.addEventListener('click', () => this.toggle(option));
        toggle.addEventListener('keydown', (event) => {
          if (event.key !== 'Enter' && event.key !== ' ') return;
          event.preventDefault();
          this.toggle(option);
        });
      }

      list.appendChild(slide);
      option.slide = slide;

      if (!dots || !dotTemplate) return;
      const dot = dotTemplate.cloneNode(true);
      if (!(dot instanceof HTMLElement)) return;

      dot.removeAttribute('dev-target');
      dot.setAttribute('role', 'button');
      dot.setAttribute('tabindex', '0');
      dot.setAttribute('aria-label', `Option ${index + 1}`);
      dot.style.cursor = 'pointer';
      dot.addEventListener('click', () => this.goToSlide(index));
      dots.appendChild(dot);
      option.dot = dot;
    });

    this.bindSwipe(list);
  }

  private goToSlide(index: number, syncFloor = true): void {
    const count = this.options.length;
    if (!count) return;

    this.slideIndex = ((index % count) + count) % count;
    const option = this.options[this.slideIndex];
    if (!option) return;
    if (syncFloor && option.floor !== this.floor) this.setFloor(option.floor);
    this.renderSlides();
    this.hover(option);
  }

  private bindSwipe(list: HTMLElement): void {
    let startX = 0;
    let startY = 0;
    let tracking = false;

    list.style.touchAction = 'pan-y';
    list.addEventListener('pointerdown', (event) => {
      tracking = true;
      startX = event.clientX;
      startY = event.clientY;
    });
    list.addEventListener('pointerup', (event) => {
      if (!tracking) return;
      tracking = false;
      const dx = event.clientX - startX;
      const dy = event.clientY - startY;
      if (Math.abs(dx) < 40 || Math.abs(dx) < Math.abs(dy)) return;
      this.goToSlide(this.slideIndex + (dx < 0 ? 1 : -1));
    });
    list.addEventListener('pointercancel', () => {
      tracking = false;
    });
  }

  private bindOverlay(): void {
    const { root } = this;
    if (!root) return;

    this.overlay = root.querySelector(target('ifp-overlay'));
    const openBtn = root.querySelector<HTMLElement>(target('ifp-open-overlay'));
    if (!this.overlay || !openBtn) return;

    if (!this.options.length) {
      openBtn.style.display = 'none';
      return;
    }

    openBtn.addEventListener('click', (event) => {
      event.preventDefault();
      this.openOverlay();
    });

    root.querySelectorAll<HTMLElement>(target('ifp-close')).forEach((button) => {
      button.addEventListener('click', () => this.closeOverlay());
      button.addEventListener('keydown', (event) => {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        event.preventDefault();
        this.closeOverlay();
      });
    });

    const next = root.querySelector<HTMLElement>(target('ifp-next'));
    next?.addEventListener('click', () => this.goToSlide(this.slideIndex + 1));
    next?.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      this.goToSlide(this.slideIndex + 1);
    });

    document.addEventListener('keydown', (event) => {
      if (!this.overlay?.classList.contains('is-open')) return;
      if (event.key === 'Escape') this.closeOverlay();
      if (event.key === 'ArrowRight') this.goToSlide(this.slideIndex + 1);
      if (event.key === 'ArrowLeft') this.goToSlide(this.slideIndex - 1);
    });

    window.matchMedia('(min-width: 992px)').addEventListener('change', (query) => {
      if (query.matches) this.closeOverlay();
    });
  }

  private openOverlay(): void {
    if (!this.overlay) return;

    this.lastFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const index = this.options.findIndex((option) => option.floor === this.floor);
    this.goToSlide(index > -1 ? index : 0);
    this.overlay.classList.add('is-open');
    document.body.classList.add('ifp-scroll-lock');
    this.overlay.querySelector<HTMLElement>(target('ifp-close'))?.focus({ preventScroll: true });
  }

  private closeOverlay(): void {
    if (!this.overlay?.classList.contains('is-open')) return;

    this.overlay.classList.remove('is-open');
    document.body.classList.remove('ifp-scroll-lock');
    this.hover(null);
    this.lastFocus?.focus({ preventScroll: true });
  }

  private bindClear(): void {
    this.root?.querySelectorAll<HTMLElement>(target('ifp-clear')).forEach((button) => {
      button.addEventListener('click', (event) => {
        event.preventDefault();
        this.selected.clear();
        this.render();
      });
    });
  }

  private bindPersonalize(): void {
    const { root } = this;
    if (!root) return;

    root.querySelectorAll<HTMLElement>(target('ifp-personalize')).forEach((button) => {
      button.addEventListener('click', (event) => {
        if (button.getAttribute('href') === '#') event.preventDefault();
        root.dispatchEvent(
          new CustomEvent('ifp:personalize', {
            bubbles: true,
            detail: {
              selected: this.options
                .filter((option) => this.isSelected(option))
                .map((option) => option.title),
            },
          })
        );
      });
    });
  }

  private render(): void {
    const activeIds = new Set(
      this.options
        .filter((option) => this.isSelected(option))
        .flatMap((option) => option.featureIds)
    );

    this.views.forEach((view) => {
      Object.values(view.svgs).forEach((svg) => {
        svg?.querySelectorAll<SVGGElement>('g[data-attribute="feature"][id]').forEach((group) => {
          group.classList.toggle('home-map__shape--active', activeIds.has(group.id.trim()));
        });
      });
    });

    this.options.forEach((option) => {
      const on = this.isSelected(option);
      option.card.classList.toggle('home-map__card--active', on);
      const input = option.card.querySelector<HTMLInputElement>('input[type="checkbox"]');
      const box = option.card.querySelector<HTMLElement>('.w-checkbox-input');
      if (input) input.checked = on;
      box?.classList.toggle('w--redirected-checked', on);
    });

    this.renderSlides();
  }

  private renderSlides(): void {
    const { root } = this;
    if (!root) return;

    const count = this.options.length;
    this.options.forEach((option, index) => {
      const current = index === this.slideIndex;
      if (option.slide) {
        option.slide.style.display = current ? '' : 'none';
        option.slide.setAttribute('aria-hidden', current ? 'false' : 'true');
        option.slide.classList.toggle('is-selected', this.isSelected(option));
        const toggle = option.slide.querySelector(target('ifp-option-toggle'));
        toggle?.setAttribute('aria-pressed', this.isSelected(option) ? 'true' : 'false');
        toggle?.setAttribute(
          'aria-label',
          `${this.isSelected(option) ? 'Remove' : 'Add'} ${option.title}`
        );
      }

      if (option.dot) {
        option.dot.classList.toggle('is-active', current);
        option.dot.setAttribute('aria-current', current ? 'true' : 'false');
      }
    });

    const counter = root.querySelector(target('ifp-counter'));
    if (counter && count) {
      counter.textContent = `${this.slideIndex + 1} of ${count} Personalization Options`;
    }
  }
}
