/**
 * Sticky navigation controller
 * Handles scroll-based active link highlighting and click/tap navigation
 */

export class StickyNavController {
  private links: Element[] = [];
  private observer: IntersectionObserver | null = null;
  private visibleSections: Set<string> = new Set();

  /**
   * Maps dev-target attribute values to their corresponding section IDs.
   * Handles spelling mismatches between the nav markup and section IDs.
   */
  private readonly sectionMap: Record<string, string> = {
    overview: 'overview-section',
    'floor-plans': 'floor-plans-section',
    amentities: 'amentities-section',
    personalisation: 'personalization-section',
    'browse-homes': 'lots-section',
    process: 'process-section',
  };

  /**
   * Ordered list of dev-target values matching the top-to-bottom page section order.
   * Used to determine which section is "topmost" when multiple are visible at once.
   */
  private readonly sectionOrder: string[] = [
    'overview',
    'floor-plans',
    'amentities',
    'personalisation',
    'browse-homes',
  ];

  init(): void {
    this.links = Array.from(document.querySelectorAll('.tab-links[dev-target]'));

    if (!this.links.length) {
      console.error('StickyNavController: No tab links found.');
      return;
    }

    this.setupClickHandlers();
    this.setupScrollObserver();

    // On first load, scroll the strip to the link already marked is-active in the
    // HTML (Webflow sets this). rAF defers until layout is painted so offsetLeft
    // values are accurate.
    requestAnimationFrame(() => {
      const initialActive =
        (this.links.find((l) => l.classList.contains('is-active')) as HTMLElement | undefined) ??
        (this.links[0] as HTMLElement | undefined);

      if (initialActive) {
        initialActive.classList.add('is-active');
        this.scrollLinkIntoStrip(initialActive);
      }
    });
  }

  /**
   * Smooth-scroll to the target section on click/tap.
   * Offsets the scroll position by the sticky nav height so the section
   * heading isn't hidden behind the bar.
   */
  private setupClickHandlers(): void {
    this.links.forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();

        const target = link.getAttribute('dev-target');
        if (!target) return;

        const sectionId = this.sectionMap[target];
        if (!sectionId) return;

        const section = document.getElementById(sectionId);
        if (!section) {
          console.error(`StickyNavController: Section #${sectionId} not found.`);
          return;
        }

        const navBar = link.closest('.tab-header') as HTMLElement | null;
        const navHeight = navBar ? navBar.offsetHeight : 0;

        const sectionTop = section.getBoundingClientRect().top + window.scrollY - navHeight;

        window.scrollTo({ top: sectionTop, behavior: 'smooth' });

        // Set active immediately so the UI responds at the tap/click moment
        this.setActiveLink(target);
      });
    });
  }

  /**
   * Use IntersectionObserver to keep the active link in sync with scroll position.
   *
   * rootMargin '-10% 0px -85% 0px' shrinks the observable viewport to a band near
   * the top of the screen (roughly the top 15%, offset slightly for the sticky bar).
   * A section "intersects" when its top edge enters that band, which is the natural
   * moment a reader considers themselves to be inside that section.
   *
   * Among all currently intersecting sections, the one that appears earliest in
   * sectionOrder wins, so rapidly scrolled or short sections stay consistent.
   */
  private setupScrollObserver(): void {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const devTarget = this.getDevTargetBySectionId(entry.target.id);
          if (!devTarget) return;

          if (entry.isIntersecting) {
            this.visibleSections.add(devTarget);
          } else {
            this.visibleSections.delete(devTarget);
          }
        });

        const activeTarget = this.sectionOrder.find((t) => this.visibleSections.has(t));
        if (activeTarget) {
          this.setActiveLink(activeTarget);
        }
      },
      {
        rootMargin: '-10% 0px -85% 0px',
        threshold: 0,
      }
    );

    this.sectionOrder.forEach((target) => {
      const sectionId = this.sectionMap[target];
      if (!sectionId) return;
      const section = document.getElementById(sectionId);
      if (section) {
        this.observer!.observe(section);
      } else {
        console.error(`StickyNavController: Section #${sectionId} not found in DOM.`);
      }
    });
  }

  private setActiveLink(targetName: string): void {
    this.links.forEach((link) => {
      const isActive = link.getAttribute('dev-target') === targetName;
      link.classList.toggle('is-active', isActive);
      if (isActive) this.scrollLinkIntoStrip(link as HTMLElement);
    });
  }

  /**
   * On mobile (≤767px), scroll the strip so the active link is centred in the
   * visible area.
   *
   * The strip has `position: relative` (set in CSS), which makes it the
   * offsetParent for its children. This means `link.offsetLeft` is always
   * measured from the strip's own left edge — no ancestor-chain ambiguity.
   *
   * Clamped to [0, maxScroll] so we never show blank space at either end.
   */
  private scrollLinkIntoStrip(link: HTMLElement): void {
    if (window.innerWidth > 767) return;

    const strip = link.closest('[dev-target="tab-left"]') as HTMLElement | null;
    if (!strip) return;

    const targetScrollLeft = link.offsetLeft + link.offsetWidth / 2 - strip.offsetWidth / 2;

    const maxScroll = strip.scrollWidth - strip.offsetWidth;
    strip.scrollTo({
      left: Math.min(Math.max(0, targetScrollLeft), maxScroll),
      behavior: 'smooth',
    });
  }

  private getDevTargetBySectionId(sectionId: string): string | null {
    return this.sectionOrder.find((key) => this.sectionMap[key] === sectionId) ?? null;
  }

  destroy(): void {
    this.observer?.disconnect();
    this.observer = null;
    this.visibleSections.clear();
  }
}
