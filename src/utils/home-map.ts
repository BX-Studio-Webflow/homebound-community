/**
 * Home floor-map hover controller.
 *
 * Reads inline SVG markup from a hidden holder element, injects it into a
 * target wrapper, and applies hover/active classes to room groups.
 *
 * **Required Webflow attributes**
 *
 * | Element | Attribute | Value |
 * |---|---|---|
 * | Tab body wrapping one floor | `dev-target` | `explore-tab-body` |
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
  private svgEl: SVGSVGElement | null = null;
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
    if (!this.injectSvg()) return;
    this.bindSvgHover();
  }

  /**
   * Initialises all map roots on the page (first-floor and second-floor tabs).
   * Each `[dev-target="explore-tab-body"]` that contains a holder element
   * becomes its own {@link HomeMapController} instance.
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
   * Reads SVG markup from the floor's text holder, sanitises it,
   * and injects it into the corresponding target wrapper.
   *
   * @returns `true` on success, `false` if a required element is missing or
   *   the holder does not contain valid SVG markup.
   */
  private injectSvg(): boolean {
    const textHolder = this.root.querySelector<HTMLElement>(
      '[dev-target="first-floor-svg-text-holder"], [dev-target="second-floor-svg-text-holder"]'
    );
    const targetWrapper = this.root.querySelector<HTMLElement>(
      '[dev-target="first-floor-svg-target-wrapper"], [dev-target="second-floor-svg-target-wrapper"]'
    );

    if (!textHolder) {
      console.error(
        'HomeMapController: No [dev-target="first-floor-svg-text-holder"] or ' +
          '[dev-target="second-floor-svg-text-holder"] element found.'
      );
      return false;
    }

    if (!targetWrapper) {
      console.error(
        'HomeMapController: No [dev-target="first-floor-svg-target-wrapper"] or ' +
          '[dev-target="second-floor-svg-target-wrapper"] element found.'
      );
      return false;
    }

    const rawMarkup = textHolder.textContent?.trim() ?? '';

    if (!rawMarkup.includes('<svg')) {
      console.error('HomeMapController: SVG text holder does not contain SVG markup.');
      return false;
    }

    // Webflow's HTML Embed editor sometimes inserts a stray digit before the
    // opening quote of an attribute value (e.g. width=0"1162.54"). Strip them.
    const svgMarkup = rawMarkup.replace(/=\d+"/g, '="');

    targetWrapper.innerHTML = svgMarkup;
    this.svgEl = targetWrapper.querySelector<SVGSVGElement>('svg');

    if (!this.svgEl) {
      console.error('HomeMapController: SVG injection failed — no <svg> found after injection.');
      return false;
    }

    this.svgEl.classList.add('home-map__svg');
    this.svgEl.style.width = '100%';
    this.svgEl.style.height = '100%';
    this.svgEl.style.display = 'block';
    return true;
  }

  /**
   * Auto-discovers all interactive room `<g>` groups in the SVG and attaches
   * `mouseenter`/`mouseleave` listeners. Non-interactive groups (hatches,
   * walls, doors, etc.) are excluded via {@link isInteractiveGroup}.
   */
  private bindSvgHover(): void {
    if (!this.svgEl) {
      console.error('HomeMapController: bindSvgHover called but svgEl is null.');
      return;
    }

    const interactiveGroups = Array.from(this.svgEl.querySelectorAll<SVGGElement>('g[id]')).filter(
      (group) => this.isInteractiveGroup(group.id)
    );

    interactiveGroups.forEach((group) => {
      group.classList.add('home-map__shape');
      group.style.cursor = 'pointer';
      group.addEventListener('mouseenter', () => this.setActive(group));
      group.addEventListener('mouseleave', () => this.clearActive(group));
    });
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
