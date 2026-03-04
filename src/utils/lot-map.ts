/**
 * Lot Map hover controller.
 *
 * Handles two responsibilities:
 *   1. SVG INJECTION — reads the SVG markup stored as escaped text inside
 *      [dev-target="svg-text-holder"], decodes it, and writes the live SVG
 *      into [dev-target="svg-target-wrapper"] so it becomes part of the DOM.
 *
 *   2. BIDIRECTIONAL HOVER — wires mouseenter/mouseleave between SVG lot
 *      groups and the right-panel CMS lot cards so hovering either side
 *      highlights the corresponding element and scrolls it into view.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * WEBFLOW SETUP
 * ─────────────────────────────────────────────────────────────────────────
 *
 * 1. SVG text source (hidden)
 *    Attribute: dev-target="svg-text-holder"
 *    Class:     hide  (visibility:hidden or display:none)
 *    Content:   paste the raw SVG markup directly as text content inside
 *               an HTML Embed component. Webflow stores it as HTML-entity-
 *               encoded text; the controller decodes it automatically.
 *
 * 2. SVG render target (empty wrapper)
 *    Attribute: dev-target="svg-target-wrapper"
 *    The controller injects the live <svg> element here at runtime.
 *
 * 3. Right-panel lot cards (CMS Collection List items)
 *    Attribute: dev-target="one-lot"
 *    Attribute: data-lot-id="B1"   ← must match the SVG <g id="B1">
 *
 * 4. SVG lot groups (no edits needed)
 *    Each lot already has two <g> elements in the SVG:
 *      <g id="B1">        ← the polygon/path shape (hit area)
 *      <g id="B1Label">   ← the pill badge + text
 *    The controller auto-discovers these pairs at runtime.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * HOVER BEHAVIOR
 * ─────────────────────────────────────────────────────────────────────────
 *
 * • Hovering the SVG shape or label badge → highlights the shape,
 *   scales up the badge, and scrolls the matching right-panel card into view.
 *
 * • Hovering a right-panel card → highlights the matching SVG shape
 *   and label badge.
 *
 * Classes applied (styled in lot-map.css):
 *   .lot-map__shape--active   → on the lot shape <g>
 *   .lot-map__label--active   → on the lot label <g>
 *   .lot-map__card--active    → on the CMS lot card element
 */

export class LotMapController {
  private svgEl: SVGSVGElement | null = null;
  private activeId: string | null = null;

  init(): void {
    // ── Step 1: inject SVG from text holder ──────────────────────────────
    if (!this.injectSvg()) return;

    // ── Step 2: wire hover interactions ──────────────────────────────────
    const cards = document.querySelectorAll<HTMLElement>('[dev-target="one-lot"][data-lot-id]');

    if (!cards.length) {
      console.error(
        'LotMapController: No [dev-target="one-lot"][data-lot-id] found — ' +
          'add data-lot-id to each CMS lot card to enable bidirectional hover.'
      );
    }

    // SVG hover works independently; card hover is a no-op if no cards are found yet.
    this.bindSvgHover();
    this.bindCardHover(cards);
  }

  // ─── SVG injection ───────────────────────────────────────────────────────

  /**
   * Reads the SVG markup from the hidden text holder, decodes any HTML
   * entities, injects it into the target wrapper, and stores a reference
   * to the live <svg> element.
   *
   * Returns true on success, false if required elements are missing.
   */
  private injectSvg(): boolean {
    const textHolder = document.querySelector<HTMLElement>('[dev-target="svg-text-holder"]');
    const targetWrapper = document.querySelector<HTMLElement>('[dev-target="svg-target-wrapper"]');

    if (!textHolder) {
      console.error('LotMapController: No [dev-target="svg-text-holder"] element found.');
      return false;
    }

    if (!targetWrapper) {
      console.error('LotMapController: No [dev-target="svg-target-wrapper"] element found.');
      return false;
    }

    // textContent decodes HTML entities (&lt; → <, &gt; → >, &amp;apos; → ')
    // giving us the raw SVG markup string ready for injection.
    const rawMarkup = textHolder.textContent?.trim() ?? '';

    if (!rawMarkup.includes('<svg')) {
      console.error(
        'LotMapController: [dev-target="svg-text-holder"] does not contain SVG markup.'
      );
      return false;
    }

    // Sanitize malformed attribute values like width=0"1162.54" → width="1162.54".
    // This handles accidental stray digits inserted before the opening quote in
    // Webflow's HTML Embed editor (e.g. the pattern attribute=DIGITS"value").
    const svgMarkup = rawMarkup.replace(/=\d+"/g, '="');

    targetWrapper.innerHTML = svgMarkup;

    this.svgEl = targetWrapper.querySelector<SVGSVGElement>('svg');

    if (!this.svgEl) {
      console.error('LotMapController: SVG injection failed — no <svg> found after injection.');
      return false;
    }

    return true;
  }

  // ─── SVG side ────────────────────────────────────────────────────────────

  private bindSvgHover(): void {
    if (!this.svgEl) return;

    // Iterate every <g id="..."> in the SVG.
    // A group is treated as a lot SHAPE if a sibling group named `${id}Label`
    // also exists — this auto-discovers all lots without pattern matching.
    const allGroups = Array.from(this.svgEl.querySelectorAll<SVGGElement>('g[id]'));

    allGroups.forEach((group) => {
      const { id } = group;

      // Skip label, border, and structural groups
      if (id.endsWith('Label') || id.endsWith('Border')) return;

      const labelGroup = this.svgEl!.querySelector<SVGGElement>(`#${CSS.escape(id)}Label`);

      // If no label sibling, it's a structural group (park, biz, labels, etc.)
      if (!labelGroup) return;

      // Shape group — pointer cursor + hover events
      group.style.cursor = 'pointer';
      group.addEventListener('mouseenter', () => this.highlight(id));
      group.addEventListener('mouseleave', () => this.clearHighlight());

      // Label group — same events so hovering the pill also triggers
      labelGroup.style.cursor = 'pointer';
      labelGroup.addEventListener('mouseenter', () => this.highlight(id));
      labelGroup.addEventListener('mouseleave', () => this.clearHighlight());
    });
  }

  // ─── Right panel side ────────────────────────────────────────────────────

  private bindCardHover(cards: NodeListOf<HTMLElement>): void {
    cards.forEach((card) => {
      const { lotId } = card.dataset;
      if (!lotId) return;

      card.addEventListener('mouseenter', () => this.highlight(lotId));
      card.addEventListener('mouseleave', () => this.clearHighlight());
    });
  }

  // ─── Highlight / clear ───────────────────────────────────────────────────

  private highlight(lotId: string): void {
    // Avoid redundant work when re-entering the same lot
    if (this.activeId === lotId) return;
    this.clearHighlight();
    this.activeId = lotId;

    if (this.svgEl) {
      this.svgEl
        .querySelector<SVGGElement>(`#${CSS.escape(lotId)}`)
        ?.classList.add('lot-map__shape--active');

      this.svgEl
        .querySelector<SVGGElement>(`#${CSS.escape(lotId)}Label`)
        ?.classList.add('lot-map__label--active');
    }

    const card = document.querySelector<HTMLElement>(
      `[dev-target="one-lot"][data-lot-id="${lotId}"]`
    );

    if (card) {
      card.classList.add('lot-map__card--active');
      // Scroll into view only if not already visible
      card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  private clearHighlight(): void {
    this.activeId = null;

    this.svgEl
      ?.querySelector('.lot-map__shape--active')
      ?.classList.remove('lot-map__shape--active');

    this.svgEl
      ?.querySelector('.lot-map__label--active')
      ?.classList.remove('lot-map__label--active');

    document.querySelector('.lot-map__card--active')?.classList.remove('lot-map__card--active');
  }
}
