/**
 * Home floor-map hover controller.
 *
 * Reads inline SVG markup from hidden holder elements, injects each into its
 * matching target wrapper, and wires bidirectional hover between CMS feature
 * cards and SVG room groups. Both first-floor and second-floor SVGs are
 * injected independently so each floor works regardless of tab visibility.
 *
 * **Naming convention**
 *
 * The CMS card's `feature` attribute (kebab-case, e.g. `kitchen`) is converted
 * to an uppercase SVG group ID (e.g. `KITCHEN`) via {@link toSvgId}. Each SVG
 * must contain `<g id="KITCHEN">` (or whichever room) for the link to work.
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
 * | Each CMS feature card | `feature` | kebab-case room id, e.g. `kitchen` |
 *
 * **CSS classes applied (style in home-map.css)**
 * - `.home-map__svg`             — injected `<svg>` element
 * - `.home-map__shape`           — each interactive room `<g>`
 * - `.home-map__shape--active`   — highlighted room `<g>`
 * - `.home-map__card--active`    — highlighted CMS feature card
 */
export class HomeMapController {
  private static readonly FLOORS = ['first-floor', 'second-floor'] as const;

  private svgEls: SVGSVGElement[] = [];
  private activeFeature: string | null = null;
  private readonly root: ParentNode;

  constructor(root: ParentNode = document) {
    this.root = root;
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
  static initAll(rootSelector = '[dev-target="explore-tab-body"]'): void {
    const holderSelector =
      '[dev-target="first-floor-svg-text-holder"], [dev-target="second-floor-svg-text-holder"]';

    const roots = Array.from(document.querySelectorAll<HTMLElement>(rootSelector)).filter((root) =>
      root.querySelector(holderSelector)
    );

    if (!roots.length) {
      new HomeMapController(document).init();
      return;
    }

    roots.forEach((root) => new HomeMapController(root).init());
  }

  /**
   * Converts a kebab-case `feature` attribute value to the matching SVG
   * group ID. `"primary-bedroom"` → `"PRIMARY-BEDROOM"`.
   */
  private static toSvgId(feature: string): string {
    return feature.toUpperCase();
  }

  /**
   * Converts an SVG group ID back to the kebab-case `feature` value.
   * `"PRIMARY-BEDROOM"` → `"primary-bedroom"`.
   */
  private static toFeature(svgId: string): string {
    return svgId.toLowerCase();
  }

  /**
   * Iterates over each floor, reads SVG markup from its text holder,
   * sanitises it, and injects it into the corresponding target wrapper.
   *
   * @returns `true` if at least one floor was injected successfully.
   */
  private injectSvgs(): boolean {
    let injected = false;

    for (const floor of HomeMapController.FLOORS) {
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
   * Discovers which feature cards exist, then for each SVG finds the matching
   * `<g>` groups and wires `mouseenter`/`mouseleave` to {@link highlight}.
   * Only groups whose ID maps to a card's `feature` attribute become interactive.
   */
  private bindSvgHover(): void {
    if (!this.svgEls.length) {
      console.error('HomeMapController: bindSvgHover called but no SVGs are injected.');
      return;
    }

    const features = new Set<string>();
    document
      .querySelectorAll<HTMLElement>('[dev-target="feature-collection-item"][feature]')
      .forEach((card) => {
        const f = card.getAttribute('feature');
        if (f) features.add(f);
      });

    for (const svgEl of this.svgEls) {
      for (const feature of features) {
        const svgId = HomeMapController.toSvgId(feature);
        const group = svgEl.querySelector<SVGGElement>(`#${CSS.escape(svgId)}`);
        if (!group) continue;

        group.classList.add('home-map__shape');
        group.style.cursor = 'pointer';
        group.addEventListener('mouseenter', () => this.highlight(feature));
        group.addEventListener('mouseleave', () => this.clearHighlight());
      }
    }
  }

  /**
   * Attaches `mouseenter`/`mouseleave` listeners to CMS feature cards so
   * hovering a card highlights the corresponding SVG room group.
   */
  private bindCardHover(): void {
    const cards = document.querySelectorAll<HTMLElement>(
      '[dev-target="feature-collection-item"][feature]'
    );

    if (!cards.length) {
      console.error(
        'HomeMapController: No [dev-target="feature-collection-item"][feature] cards found — ' +
          'add a feature attribute to each CMS card to enable bidirectional hover.'
      );
      return;
    }

    cards.forEach((card) => {
      const feature = card.getAttribute('feature');
      if (!feature) return;
      card.addEventListener('mouseenter', () => this.highlight(feature));
      card.addEventListener('mouseleave', () => this.clearHighlight());
    });
  }

  /**
   * Activates the SVG room shape and CMS card for the given feature.
   * No-ops if the feature is already active.
   *
   * @param feature - Kebab-case feature id matching both the card `feature`
   *   attribute and the SVG `<g id>` (uppercased).
   */
  private highlight(feature: string): void {
    if (this.activeFeature === feature) return;
    this.clearHighlight();
    this.activeFeature = feature;

    const svgId = HomeMapController.toSvgId(feature);
    for (const svgEl of this.svgEls) {
      svgEl
        .querySelector<SVGGElement>(`#${CSS.escape(svgId)}`)
        ?.classList.add('home-map__shape--active');
    }

    document
      .querySelector<HTMLElement>(`[dev-target="feature-collection-item"][feature="${feature}"]`)
      ?.classList.add('home-map__card--active');
  }

  /**
   * Removes all active highlight classes and resets {@link activeFeature}.
   */
  private clearHighlight(): void {
    this.activeFeature = null;

    for (const svgEl of this.svgEls) {
      svgEl.querySelector('.home-map__shape--active')?.classList.remove('home-map__shape--active');
    }

    document.querySelector('.home-map__card--active')?.classList.remove('home-map__card--active');
  }
}
