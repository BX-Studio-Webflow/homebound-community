/**
 * Home floor-map hover controller.
 *
 * Reads inline SVG markup from a holder node, injects it into a target wrapper,
 * and applies hover/active classes to room groups.
 */
export class HomeMapController {
  private svgEl: SVGSVGElement | null = null;
  private activeGroup: SVGGElement | null = null;
  private readonly root: ParentNode;

  constructor(root: ParentNode = document) {
    this.root = root;
  }

  /**
   * Initializes one map instance scoped to the provided root.
   */
  init(): void {
    if (!this.injectSvg()) return;
    this.bindSvgHover();
  }

  /**
   * Initializes all map roots in a page (works for first/second floor tabs).
   */
  static initAll(rootSelector = '[dev-target="explore-tab-body"]'): void {
    const roots = Array.from(document.querySelectorAll<HTMLElement>(rootSelector)).filter((root) =>
      root.querySelector('[dev-target="svg-text-holder"], [dev-target="home-svg-text-holder"]')
    );

    if (!roots.length) {
      new HomeMapController(document).init();
      return;
    }

    roots.forEach((root) => new HomeMapController(root).init());
  }

  private injectSvg(): boolean {
    const textHolder =
      this.root.querySelector<HTMLElement>('[dev-target="home-svg-text-holder"]') ??
      this.root.querySelector<HTMLElement>('[dev-target="svg-text-holder"]');
    const targetWrapper =
      this.root.querySelector<HTMLElement>('[dev-target="home-svg-target-wrapper"]') ??
      this.root.querySelector<HTMLElement>('[dev-target="svg-target-wrapper"]');

    if (!textHolder || !targetWrapper) return false;

    const rawMarkup = textHolder.textContent?.trim() ?? '';
    if (!rawMarkup.includes('<svg')) return false;

    const svgMarkup = rawMarkup.replace(/=\d+"/g, '="');
    targetWrapper.innerHTML = svgMarkup;

    this.svgEl = targetWrapper.querySelector<SVGSVGElement>('svg');
    if (!this.svgEl) return false;

    this.svgEl.classList.add('home-map__svg');
    this.svgEl.style.width = '100%';
    this.svgEl.style.height = '100%';
    this.svgEl.style.display = 'block';
    return true;
  }

  private bindSvgHover(): void {
    if (!this.svgEl) return;

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

  private isInteractiveGroup(id: string): boolean {
    if (!id) return false;
    if (/^HATCH(?:-\d+)?$/i.test(id)) return false;
    if (/^(STANDARD_REV|TEXT|DIMS?|NOTES|BORDER|WALLS?|DOORS?|WINDOWS?)$/i.test(id)) return false;
    return true;
  }

  private setActive(group: SVGGElement): void {
    if (this.activeGroup && this.activeGroup !== group) {
      this.activeGroup.classList.remove('home-map__shape--active');
    }

    group.classList.add('home-map__shape--active');
    this.activeGroup = group;
  }

  private clearActive(group: SVGGElement): void {
    group.classList.remove('home-map__shape--active');
    if (this.activeGroup === group) {
      this.activeGroup = null;
    }
  }
}
