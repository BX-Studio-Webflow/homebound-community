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
 * - `.home-map__shape--hover`    — room `<g>` highlighted by hover
 * - `.home-map__shape--active`   — room `<g>` highlighted by checked checkbox
 * - `.home-map__card--hover`     — CMS card highlighted by hover
 * - `.home-map__card--active`    — CMS card highlighted by checked checkbox
 */
export class HomeMapController {
  private static readonly FLOORS = ['first-floor', 'second-floor'] as const;
  private readonly floors: ReadonlyArray<(typeof HomeMapController.FLOORS)[number]>;

  private svgEls: SVGSVGElement[] = [];
  private activeHighlightId: string | null = null;
  /** All feature ids whose checkboxes are currently checked. */
  private readonly checkedHighlightIds = new Set<string>();
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
    this.bindCheckboxClick();
    this.clearInitialState();
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
   * Applies a transient hover highlight to the SVG group and CMS card.
   * No-ops if the same id is already hover-highlighted.
   */
  private highlight(highlightId: string): void {
    if (this.activeHighlightId === highlightId) return;
    this.applyClasses(null, 'hover');
    this.activeHighlightId = highlightId;
    this.applyClasses(highlightId, 'hover');
  }

  /**
   * Removes the transient hover highlight. The persistent checkbox highlight
   * (if any) is left untouched because it lives on separate CSS classes.
   */
  private clearHighlight(): void {
    this.activeHighlightId = null;
    this.applyClasses(null, 'hover');
  }

  /**
   * Low-level helper that removes then (optionally) re-applies one layer of
   * highlight classes — either the hover layer or the checked/persistent layer.
   *
   * @param highlightId - Target feature id, or `null` to only clear.
   * @param layer       - `'hover'` uses `--hover` classes;
   *                      `'checked'` uses `--active` classes.
   */
  private applyClasses(highlightId: string | null, layer: 'hover' | 'checked'): void {
    const shapeClass = layer === 'hover' ? 'home-map__shape--hover' : 'home-map__shape--active';
    const cardClass = layer === 'hover' ? 'home-map__card--hover' : 'home-map__card--active';

    for (const svgEl of this.svgEls) {
      svgEl.querySelectorAll(`.${shapeClass}`).forEach((el) => el.classList.remove(shapeClass));
    }
    this.root.querySelectorAll(`.${cardClass}`).forEach((el) => el.classList.remove(cardClass));

    if (!highlightId) return;

    for (const svgEl of this.svgEls) {
      svgEl
        .querySelector<SVGGElement>(`g#${CSS.escape(highlightId)}[data-attribute="feature"]`)
        ?.classList.add(shapeClass);
    }

    this.root
      .querySelectorAll<HTMLElement>('[dev-target="feature-collection-item"]')
      .forEach((card) => {
        if (this.getCardHighlightId(card) === highlightId) {
          card.classList.add(cardClass);
        }
      });
  }

  /**
   * Adds or removes the persistent `--active` highlight for a single feature
   * without touching any other checked items.
   */
  private setCheckedHighlight(highlightId: string, checked: boolean): void {
    const shapeClass = 'home-map__shape--active';
    const cardClass = 'home-map__card--active';

    if (checked) {
      this.checkedHighlightIds.add(highlightId);

      for (const svgEl of this.svgEls) {
        svgEl
          .querySelector<SVGGElement>(`g#${CSS.escape(highlightId)}[data-attribute="feature"]`)
          ?.classList.add(shapeClass);
      }
      this.root
        .querySelectorAll<HTMLElement>('[dev-target="feature-collection-item"]')
        .forEach((card) => {
          if (this.getCardHighlightId(card) === highlightId) card.classList.add(cardClass);
        });
    } else {
      this.checkedHighlightIds.delete(highlightId);

      for (const svgEl of this.svgEls) {
        svgEl
          .querySelector<SVGGElement>(`g#${CSS.escape(highlightId)}[data-attribute="feature"]`)
          ?.classList.remove(shapeClass);
      }
      this.root
        .querySelectorAll<HTMLElement>('[dev-target="feature-collection-item"]')
        .forEach((card) => {
          if (this.getCardHighlightId(card) === highlightId) card.classList.remove(cardClass);
        });
    }
  }

  /**
   * Wires `change` events on checkbox inputs inside feature cards so that
   * checking a box persistently highlights the matched SVG group and unchecking
   * removes the persistent highlight (hover behaviour is unaffected).
   *
   * Webflow fires a native `change` event on the hidden `<input>` whenever the
   * custom checkbox wrapper is clicked, so this is the reliable integration point.
   */
  private bindCheckboxClick(): void {
    document
      .querySelectorAll<HTMLElement>('[dev-target="feature-collection-item"]')
      .forEach((card) => {
        const highlightId = this.getCardHighlightId(card);
        if (!highlightId) return;

        card.querySelectorAll<HTMLInputElement>('input[type="checkbox"]').forEach((input) => {
          input.addEventListener('change', () =>
            this.setCheckedHighlight(highlightId, input.checked)
          );
        });
      });
  }

  /**
   * Strips any pre-existing active highlight and checked states from the DOM
   * so that the page loads with nothing selected.
   *
   * Handles:
   * - `home-map__shape--active` on injected SVG groups
   * - `home-map__card--active` on CMS feature cards
   * - `w--redirected-checked` on Webflow custom-checkbox wrappers
   * - `checked` property on the underlying `<input type="checkbox">` elements
   */
  private clearInitialState(): void {
    this.applyClasses(null, 'hover');
    this.applyClasses(null, 'checked');
    this.checkedHighlightIds.clear();

    document
      .querySelectorAll<HTMLElement>('[dev-target="feature-collection-item"]')
      .forEach((card) => {
        card.querySelectorAll<HTMLElement>('.w-checkbox-input').forEach((checkboxDiv) => {
          checkboxDiv.classList.remove('w--redirected-checked');
        });
        card.querySelectorAll<HTMLInputElement>('input[type="checkbox"]').forEach((input) => {
          input.checked = false;
        });
      });
  }
}
