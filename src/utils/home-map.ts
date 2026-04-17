/**
 * Home floor-map hover controller.
 *
 * Reads inline SVG markup from hidden holder elements, injects each into its
 * matching target wrapper, and wires bidirectional hover between CMS feature
 * cards and SVG highlight groups. Both first-floor and second-floor SVGs are
 * injected independently so each floor works regardless of tab visibility.
 *
 * **Naming convention**
 *
 * The CMS card's `feature` value should match the SVG highlight group's `id`
 * exactly. Card `id` is supported as a fallback.
 * Example: card `feature="highlight-garage"` maps to
 * `<g id="highlight-garage" data-attribute="feature">...</g>`.
 *
 * **Required Webflow attributes**
 *
 * | Element | Attribute | Value |
 * |---|---|---|
 * | Tab body wrapping both floors | `dev-target` | `explore-tab-body` |
 * | Hidden HTML Embed with raw SVG (1st) | `dev-target` | `first-floor-svg-text-holder` |
 * | Hidden HTML Embed with raw SVG (2nd) | `dev-target` | `second-floor-svg-text-holder` |
 * | Empty wrapper for rendered SVG (1st) | `dev-target` | `first-floor-svg-target-wrapper` |
 * | Empty wrapper for rendered SVG (2nd) | `dev-target` | `second-floor-svg-target-wrapper` |
 * | Each CMS feature card | `dev-target` | `feature-collection-item` |
 * | Each CMS feature card | `feature` | highlight id matching the SVG group id |
 *
 * **CSS classes applied (style in home-map.css)**
 * - `.home-map__svg`             — injected `<svg>` element
 * - `.home-map__shape`           — each interactive room `<g>`
 * - `.home-map__shape--active`   — highlighted room `<g>`
 * - `.home-map__card--active`    — highlighted CMS feature card
 */
export class HomeMapController {
  private static readonly FLOORS = ['first-floor', 'second-floor'] as const;
  private readonly floors: ReadonlyArray<(typeof HomeMapController.FLOORS)[number]>;

  private svgEls: SVGSVGElement[] = [];
  private activeHighlightId: string | null = null;
  private readonly root: ParentNode;

  constructor(
    root: ParentNode = document,
    floors: ReadonlyArray<(typeof HomeMapController.FLOORS)[number]> = HomeMapController.FLOORS
  ) {
    this.root = root;
    this.floors = floors;
  }

  /**
   * Initialises one map instance scoped to the provided root.
   * Must be called after the DOM is ready (e.g. inside `window.Webflow.push`).
   */
  init(): void {
    if (!this.injectSvgs()) return;
    this.bindSvgHover();
    this.bindCardHover();
  }

  /**
   * Initialises all map roots on the page.
   * Each `[dev-target="explore-tab-body"]` that contains at least one holder
   * element becomes its own {@link HomeMapController} instance.
   */
  static initAll(
    rootSelector = '[dev-target="explore-tab-body"]',
    floors: ReadonlyArray<(typeof HomeMapController.FLOORS)[number]> = HomeMapController.FLOORS
  ): void {
    const holderSelector =
      '[dev-target="first-floor-svg-text-holder"], [dev-target="second-floor-svg-text-holder"]';

    const roots = Array.from(document.querySelectorAll<HTMLElement>(rootSelector)).filter((root) =>
      root.querySelector(holderSelector)
    );

    if (!roots.length) {
      new HomeMapController(document, floors).init();
      return;
    }

    roots.forEach((root) => new HomeMapController(root, floors).init());
  }

  private static escapeRegExp(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  /**
   * SVG editors commonly emit class names like `cls-1` or `st11`.
   * Namespace these to avoid style collisions between floor SVGs.
   */
  private static isSvgGeneratedClassToken(token: string): boolean {
    return /^cls-\d+$/.test(token) || /^st\d+$/.test(token);
  }

  /**
   * Resolves the highlight identifier from a CMS card.
   * Prefers `feature`, then falls back to `id` for backward compatibility.
   */
  private getCardHighlightId(card: HTMLElement): string | null {
    const featureValue = card.getAttribute('feature')?.trim();
    if (featureValue) return featureValue;
    const idValue = card.id.trim();
    return idValue || null;
  }

  /**
   * Prevent cross-SVG style collisions by namespacing auto-generated classes
   * (e.g. `.cls-1`) per floor before event wiring runs.
   */
  private namespaceSvgClasses(
    svgEl: SVGSVGElement,
    floor: (typeof HomeMapController.FLOORS)[number]
  ): void {
    const classMap = new Map<string, string>();
    const prefix = `hm-${floor}-`;

    svgEl.querySelectorAll<SVGElement>('[class]').forEach((el) => {
      const classAttr = el.getAttribute('class');
      if (!classAttr) return;

      classAttr
        .split(/\s+/)
        .map((token) => token.trim())
        .filter(Boolean)
        .forEach((token) => {
          if (!HomeMapController.isSvgGeneratedClassToken(token)) return;
          if (classMap.has(token)) return;
          classMap.set(token, `${prefix}${token}`);
        });
    });

    if (!classMap.size) return;

    svgEl.querySelectorAll<SVGElement>('[class]').forEach((el) => {
      const classAttr = el.getAttribute('class');
      if (!classAttr) return;

      const namespaced = classAttr
        .split(/\s+/)
        .map((token) => token.trim())
        .filter(Boolean)
        .map((token) => classMap.get(token) ?? token);

      el.setAttribute('class', namespaced.join(' '));
    });

    svgEl.querySelectorAll('style').forEach((styleEl) => {
      let cssText = styleEl.textContent ?? '';
      classMap.forEach((namespacedClass, originalClass) => {
        const classSelector = new RegExp(
          `\\.${HomeMapController.escapeRegExp(originalClass)}(?![\\w-])`,
          'g'
        );
        cssText = cssText.replace(classSelector, `.${namespacedClass}`);
      });
      styleEl.textContent = cssText;
    });
  }

  /**
   * Iterates over each floor, reads SVG markup from its text holder,
   * sanitises it, and injects it into the corresponding target wrapper.
   *
   * @returns `true` if at least one floor was injected successfully.
   */
  private injectSvgs(): boolean {
    let injected = false;

    for (const floor of this.floors) {
      const textHolder = this.root.querySelector<HTMLElement>(
        `[dev-target="${floor}-svg-text-holder"]`
      );
      const targetWrapper = this.root.querySelector<HTMLElement>(
        `[dev-target="${floor}-svg-target-wrapper"]`
      );

      if (!textHolder || !targetWrapper) {
        console.error(
          `HomeMapController: Missing element for "${floor}". ` +
            `holder=${!!textHolder}, wrapper=${!!targetWrapper}`
        );
        continue;
      }

      const rawMarkup = textHolder.textContent?.trim() ?? '';

      if (!rawMarkup.includes('<svg')) {
        console.error(`HomeMapController: "${floor}" SVG text holder does not contain SVG markup.`);
        continue;
      }

      // Webflow's HTML Embed editor sometimes inserts a stray digit before the
      // opening quote of an attribute value (e.g. width=0"1162.54"). Strip them.
      const svgMarkup = rawMarkup.replace(/=\d+"/g, '="');

      targetWrapper.innerHTML = svgMarkup;
      const svgEl = targetWrapper.querySelector<SVGSVGElement>('svg');

      if (!svgEl) {
        console.error(
          `HomeMapController: "${floor}" SVG injection failed — no <svg> found after injection.`
        );
        continue;
      }

      this.namespaceSvgClasses(svgEl, floor);
      svgEl.classList.add('home-map__svg');
      svgEl.style.width = '100%';
      svgEl.style.height = '100%';
      svgEl.style.display = 'block';
      this.svgEls.push(svgEl);
      injected = true;
    }

    if (!injected) {
      console.error('HomeMapController: No floor SVGs were successfully injected.');
    }

    return injected;
  }

  /**
   * Discovers SVG highlight groups and wires `mouseenter`/`mouseleave` to
   * {@link highlight}. Only `<g data-attribute="feature" id="...">` groups
   * are considered highlight targets.
   */
  private bindSvgHover(): void {
    if (!this.svgEls.length) {
      console.error('HomeMapController: bindSvgHover called but no SVGs are injected.');
      return;
    }

    for (const svgEl of this.svgEls) {
      const groups = svgEl.querySelectorAll<SVGGElement>('g[data-attribute="feature"][id]');
      groups.forEach((group) => {
        const highlightId = group.id.trim();
        if (!highlightId) return;

        group.classList.add('home-map__shape');
        group.style.cursor = 'pointer';
        group.addEventListener('mouseenter', () => this.highlight(highlightId));
        group.addEventListener('mouseleave', () => this.clearHighlight());
      });
    }
  }

  /**
   * Attaches `mouseenter`/`mouseleave` listeners to CMS feature cards so
   * hovering a card highlights the corresponding SVG group by matching
   * `feature` (with `id` as fallback).
   */
  private bindCardHover(): void {
    const cards = document.querySelectorAll<HTMLElement>('[dev-target="feature-collection-item"]');

    if (!cards.length) {
      console.error('HomeMapController: No [dev-target="feature-collection-item"] cards found.');
      return;
    }

    cards.forEach((card) => {
      const highlightId = this.getCardHighlightId(card);
      if (!highlightId) return;
      card.addEventListener('mouseenter', () => this.highlight(highlightId));
      card.addEventListener('mouseleave', () => this.clearHighlight());
    });
  }

  /**
   * Activates the SVG group and CMS card for the given highlight id.
   * No-ops if the id is already active.
   *
   * @param highlightId - Value shared by the card `feature` (or fallback `id`)
   *   and SVG `<g id data-attribute="feature">`.
   */
  private highlight(highlightId: string): void {
    if (this.activeHighlightId === highlightId) return;
    this.clearHighlight();
    this.activeHighlightId = highlightId;

    for (const svgEl of this.svgEls) {
      svgEl
        .querySelector<SVGGElement>(`g#${CSS.escape(highlightId)}[data-attribute="feature"]`)
        ?.classList.add('home-map__shape--active');
    }

    this.root
      .querySelectorAll<HTMLElement>('[dev-target="feature-collection-item"]')
      .forEach((card) => {
        if (this.getCardHighlightId(card) === highlightId) {
          card.classList.add('home-map__card--active');
        }
      });
  }

  /**
   * Removes all active highlight classes and resets {@link activeHighlightId}.
   */
  private clearHighlight(): void {
    this.activeHighlightId = null;

    for (const svgEl of this.svgEls) {
      svgEl
        .querySelectorAll('.home-map__shape--active')
        .forEach((el) => el.classList.remove('home-map__shape--active'));
    }

    this.root
      .querySelectorAll('.home-map__card--active')
      .forEach((el) => el.classList.remove('home-map__card--active'));
  }
}
