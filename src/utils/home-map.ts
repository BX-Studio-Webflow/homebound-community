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
 * Multiple groups: `feature="highlight-a,highlight-b"` highlights both.
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
 * | Each CMS feature card | `feature` | one highlight id, or several comma-separated
 *   ids (e.g. `highlight-a,highlight-b`) matching SVG group ids — all highlight together |
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
  /** Normalised key for the current hover layer (sorted ids, comma-joined) or `null`. */
  private activeHighlightKey: string | null = null;
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
    this.bindCardClick();
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
   * Splits a `feature` attribute by commas (trimmed, empty tokens removed).
   * Example: `highlight-a, highlight-b` → `['highlight-a', 'highlight-b']`.
   */
  private static parseFeatureAttribute(value: string): string[] {
    return value
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
  }

  /**
   * Resolves highlight id(s) from a CMS card.
   * `feature` may be one id or a comma-separated list; if absent, `id` is used as a single id.
   */
  private getCardFeatureIds(card: HTMLElement): string[] {
    const featureValue = card.getAttribute('feature')?.trim();
    if (featureValue) {
      const parsed = HomeMapController.parseFeatureAttribute(featureValue);
      if (parsed.length) return parsed;
    }
    const idValue = card.id.trim();
    return idValue ? [idValue] : [];
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
  private async injectSvgs(): Promise<boolean> {
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
          `HomeMapController: Missing element for "${floor}". holder=${!!textHolder}, wrapper=${!!targetWrapper}`
        );
        continue;
      }

      const raw = (textHolder.textContent ?? '').trim();

      if (!raw) {
        console.error(`HomeMapController: "${floor}" SVG source is empty.`);
        continue;
      }

      let svgText: string;

      try {
        // ---------------------------------------------------
        // 1. Detect URL vs inline SVG
        // ---------------------------------------------------
        const isSvgMarkup = raw.includes('<svg');
        const isUrl = /^https?:\/\//i.test(raw);

        if (isSvgMarkup) {
          svgText = this.sanitizeSvg(raw);
        } else if (isUrl) {
          const res = await fetch(raw);

          if (!res.ok) {
            throw new Error(`Fetch failed with status ${res.status}`);
          }

          svgText = this.sanitizeSvg(await res.text());
        } else {
          console.error(`HomeMapController: "${floor}" invalid SVG input.`);
          continue;
        }

        // ---------------------------------------------------
        // 2. Parse SVG safely
        // ---------------------------------------------------
        const parser = new DOMParser();
        const doc = parser.parseFromString(svgText, 'image/svg+xml');
        const svgEl = doc.querySelector('svg');

        if (!svgEl) {
          console.error(`HomeMapController: "${floor}" SVG parse failed.`);
          continue;
        }

        // ---------------------------------------------------
        // 3. Inject into DOM
        // ---------------------------------------------------
        targetWrapper.innerHTML = '';
        targetWrapper.appendChild(svgEl);

        // ---------------------------------------------------
        // 4. Normalize styling
        // ---------------------------------------------------
        svgEl.classList.add('home-map__svg');
        svgEl.style.width = '100%';
        svgEl.style.height = '100%';
        svgEl.style.display = 'block';

        // ---------------------------------------------------
        // 5. Namespace / prep interactions
        // ---------------------------------------------------
        this.namespaceSvgClasses(svgEl, floor);

        this.svgEls.push(svgEl);
        injected = true;
      } catch (err) {
        console.error(`HomeMapController: "${floor}" injection error`, err);
      }
    }

    if (!injected) {
      console.error('HomeMapController: No floor SVGs were successfully injected.');
    }

    return injected;
  }
  /**
   * Sanitises SVG markup by fixing broken Webflow attributes and removing script tags.
   */
  private sanitizeSvg(svg: string): string {
    return (
      svg
        // Fix broken Webflow attributes like: width=0"1162
        .replace(/=\d+"/g, '="')
        // Remove script tags for safety
        .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
    );
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
      const highlightIds = this.getCardFeatureIds(card);
      if (!highlightIds.length) return;
      card.addEventListener('mouseenter', () => this.highlight(highlightIds));
      card.addEventListener('mouseleave', () => this.clearHighlight());
    });
  }

  /**
   * Applies a transient hover highlight to the SVG group(s) and matching CMS
   * card(s). One id (from the SVG) or several (comma-separated on a card).
   * No-ops if the same set of ids is already hover-highlighted.
   */
  private highlight(highlightIdOrIds: string | ReadonlyArray<string>): void {
    const ids = (
      Array.isArray(highlightIdOrIds) ? [...highlightIdOrIds] : [highlightIdOrIds]
    ).filter(Boolean);
    if (!ids.length) return;
    const key = ids.slice().sort().join('\u0000');
    if (this.activeHighlightKey === key) return;
    this.applyClasses(null, 'hover');
    this.activeHighlightKey = key;
    this.applyClasses(ids, 'hover');
  }

  /**
   * Removes the transient hover highlight. The persistent checkbox highlight
   * (if any) is left untouched because it lives on separate CSS classes.
   */
  private clearHighlight(): void {
    this.activeHighlightKey = null;
    this.applyClasses(null, 'hover');
  }

  /**
   * Low-level helper that removes then (optionally) re-applies one layer of
   * highlight classes — either the hover layer or the checked/persistent layer.
   *
   * @param highlightIds - Target feature id(s), or `null` / `[]` to only clear.
   * @param layer        - `'hover'` uses `--hover` classes;
   *                      `'checked'` uses `--active` classes.
   */
  private applyClasses(highlightIds: string[] | null, layer: 'hover' | 'checked'): void {
    const shapeClass = layer === 'hover' ? 'home-map__shape--hover' : 'home-map__shape--active';
    const cardClass = layer === 'hover' ? 'home-map__card--hover' : 'home-map__card--active';

    for (const svgEl of this.svgEls) {
      svgEl.querySelectorAll(`.${shapeClass}`).forEach((el) => el.classList.remove(shapeClass));
    }
    this.root.querySelectorAll(`.${cardClass}`).forEach((el) => el.classList.remove(cardClass));

    if (!highlightIds?.length) return;

    const want = new Set(highlightIds);

    for (const id of want) {
      for (const svgEl of this.svgEls) {
        svgEl
          .querySelector<SVGGElement>(`g#${CSS.escape(id)}[data-attribute="feature"]`)
          ?.classList.add(shapeClass);
      }
    }

    this.root
      .querySelectorAll<HTMLElement>('[dev-target="feature-collection-item"]')
      .forEach((card) => {
        const cardIds = this.getCardFeatureIds(card);
        if (cardIds.some((cid) => want.has(cid))) {
          card.classList.add(cardClass);
        }
      });
  }

  /**
   * Updates the set of id(s) that should be persistently highlighted for one
   * feature card, then re-syncs the checked layer from the set (one card can
   * contribute several comma-separated ids).
   */
  private updateCheckedSetForCard(card: HTMLElement, checked: boolean): void {
    const ids = this.getCardFeatureIds(card);
    if (!ids.length) return;
    for (const id of ids) {
      if (checked) this.checkedHighlightIds.add(id);
      else this.checkedHighlightIds.delete(id);
    }
    this.syncCheckedLayer();
  }

  /**
   * Reapplies `home-map__shape--active` / `home-map__card--active` from
   * {@link checkedHighlightIds} so unchecking a multi-id card does not leave
   * shapes/cards in a half-cleared state.
   */
  private syncCheckedLayer(): void {
    this.applyClasses(
      this.checkedHighlightIds.size ? Array.from(this.checkedHighlightIds) : null,
      'checked'
    );
  }

  /**
   * Makes the entire feature card row behave as a checkbox toggle.
   *
   * Clicks that already originate from the checkbox `<input>`, its Webflow
   * visual wrapper `.w-checkbox-input`, or a `<label>` element (which the
   * browser handles natively) are ignored to avoid double-toggling.
   * All other clicks on the card toggle the checkbox visuals and call
   * {@link updateCheckedSetForCard} directly — no `change` event is dispatched to
   * avoid Webflow or parent listeners firing a second toggle.
   */
  private bindCardClick(): void {
    document
      .querySelectorAll<HTMLElement>('[dev-target="feature-collection-item"]')
      .forEach((card) => {
        card.style.cursor = 'pointer';

        card.addEventListener('click', (e) => {
          const target = e.target as HTMLElement;

          // Clicks on the checkbox input, its Webflow visual wrapper, or a
          // label are handled natively — the resulting `change` event is picked
          // up by bindCheckboxClick. Don't also handle them here.
          if (target.closest('input[type="checkbox"], .w-checkbox-input, label')) return;

          const input = card.querySelector<HTMLInputElement>('input[type="checkbox"]');
          const featureIds = this.getCardFeatureIds(card);
          if (!input || !featureIds.length) return;

          // Use the visual class as the source of truth — `input.checked` can
          // drift out of sync with `w--redirected-checked` during Webflow init.
          const checkboxDiv = card.querySelector<HTMLElement>('.w-checkbox-input');
          const wasChecked =
            checkboxDiv?.classList.contains('w--redirected-checked') ?? input.checked;
          const nowChecked = !wasChecked;

          input.checked = nowChecked;
          checkboxDiv?.classList.toggle('w--redirected-checked', nowChecked);
          this.updateCheckedSetForCard(card, nowChecked);
        });
      });
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
        if (!this.getCardFeatureIds(card).length) return;

        card.querySelectorAll<HTMLInputElement>('input[type="checkbox"]').forEach((input) => {
          input.addEventListener('change', () => this.updateCheckedSetForCard(card, input.checked));
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
    this.activeHighlightKey = null;
    this.applyClasses(null, 'hover');
    this.checkedHighlightIds.clear();
    this.syncCheckedLayer();

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
