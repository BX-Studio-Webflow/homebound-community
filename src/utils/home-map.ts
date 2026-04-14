/**
 * Home floor-map hover controller.
 *
 * Reads inline SVG markup from hidden holder elements, injects each into its
 * matching target wrapper, and applies hover/active classes to room groups.
 * Both first-floor and second-floor SVGs are injected independently so each
 * floor works regardless of tab visibility order.
 *
 * **Required Webflow attributes**
 *
 * | Element | Attribute | Value |
 * |---|---|---|
 * | Tab body wrapping both floors | `dev-target` | `explore-tab-body` |
 * | Hidden HTML Embed with raw SVG text (1st floor) | `dev-target` | `first-floor-svg-text-holder` |
 * | Hidden HTML Embed with raw SVG text (2nd floor) | `dev-target` | `second-floor-svg-text-holder` |
 * | Empty wrapper where SVG is rendered (1st floor) | `dev-target` | `first-floor-svg-target-wrapper` |
 * | Empty wrapper where SVG is rendered (2nd floor) | `dev-target` | `second-floor-svg-target-wrapper` |
 *
 * **CSS classes applied (style in home-map.css)**
 * - `.home-map__svg`            — injected `<svg>` element
 * - `.home-map__shape`          — each interactive room `<g>`
 * - `.home-map__shape--active`  — hovered room `<g>`
 */
export class HomeMapController {
  private static readonly FLOORS = ['first-floor', 'second-floor'] as const;

  private svgEls: SVGSVGElement[] = [];
  private activeGroup: SVGGElement | null = null;
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
   * Auto-discovers all interactive room `<g>` groups in every injected SVG
   * and attaches `mouseenter`/`mouseleave` listeners. Non-interactive groups
   * (hatches, walls, doors, etc.) are excluded via {@link isInteractiveGroup}.
   */
  private bindSvgHover(): void {
    if (!this.svgEls.length) {
      console.error('HomeMapController: bindSvgHover called but no SVGs are injected.');
      return;
    }

    for (const svgEl of this.svgEls) {
      const interactiveGroups = Array.from(svgEl.querySelectorAll<SVGGElement>('g[id]')).filter(
        (group) => this.isInteractiveGroup(group.id)
      );

      interactiveGroups.forEach((group) => {
        group.classList.add('home-map__shape');
        group.style.cursor = 'pointer';
        group.addEventListener('mouseenter', () => this.setActive(group));
        group.addEventListener('mouseleave', () => this.clearActive(group));
      });
    }
  }

  /**
   * Returns `true` when a `<g id>` represents a hoverable room shape.
   * Structural groups (hatches, walls, doors, text layers, etc.) return `false`.
   */
  private isInteractiveGroup(id: string): boolean {
    if (!id) return false;
    if (/^HATCH(?:-\d+)?$/i.test(id)) return false;
    if (/^(STANDARD_REV|TEXT|DIMS?|NOTES|BORDER|WALLS?|DOORS?|WINDOWS?)$/i.test(id)) return false;
    return true;
  }

  /**
   * Activates the given room group and deactivates the previous one.
   */
  private setActive(group: SVGGElement): void {
    if (this.activeGroup && this.activeGroup !== group) {
      this.activeGroup.classList.remove('home-map__shape--active');
    }

    group.classList.add('home-map__shape--active');
    this.activeGroup = group;
  }

  /**
   * Removes the active highlight from the given room group.
   */
  private clearActive(group: SVGGElement): void {
    group.classList.remove('home-map__shape--active');
    if (this.activeGroup === group) {
      this.activeGroup = null;
    }
  }
}
