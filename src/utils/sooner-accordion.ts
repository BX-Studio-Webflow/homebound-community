/**
 * FAQ accordion controller
 *
 * attribute contract:
 *   [dev-target="one-sooner-accordion"] — wrapper for each step item
 *   [dev-target="sooner-header"]       — hover/clickable step header
 *   [dev-target="sooner-step-text"]   — step label
 *   [dev-target="sooner-header-text"] — step title
 *   [dev-target="circle"]            — active indicator circle
 *   [dev-target="sooner-body"]        — collapsible body
 *
 * Desktop (fine pointer + hover): first item opens on load, then the open step
 * advances every {@link AUTO_CYCLE_MS}. Hovering any accordion item pauses cycling;
 * leaving all items resumes after a short delay.
 */

const AUTO_CYCLE_MS = 5000;

export class SoonerAccordionController {
  private soonerItems: HTMLElement[] = [];
  private activeIndex = 0;
  private cycleIntervalId: ReturnType<typeof setInterval> | null = null;
  private resumeAfterLeaveId: ReturnType<typeof setTimeout> | null = null;

  init(): void {
    this.initSoonerAccordionItems();
  }

  // ─── New 'sooner' process block behavior (mouse hover + mobile click) ───────

  private initSoonerAccordionItems(): void {
    const items = document.querySelectorAll<HTMLElement>('[dev-target="one-sooner-accordion"]');

    if (!items.length) return;

    items.forEach((item) => {
      this.soonerItems.push(item);

      const header = item.querySelector<HTMLElement>('[dev-target="sooner-header"]');
      const circle = item.querySelector<HTMLElement>('[dev-target="circle"]');

      if (!header) return;

      // Pause auto-cycle while pointer is over this item (moving between items stays paused)
      item.addEventListener('mouseenter', () => {
        if (!this.isHoverable()) return;
        if (this.resumeAfterLeaveId !== null) {
          clearTimeout(this.resumeAfterLeaveId);
          this.resumeAfterLeaveId = null;
        }
        this.stopAutoCycle();
      });

      item.addEventListener('mouseleave', () => {
        if (!this.isHoverable()) return;
        if (this.resumeAfterLeaveId !== null) {
          clearTimeout(this.resumeAfterLeaveId);
        }
        this.resumeAfterLeaveId = window.setTimeout(() => {
          this.resumeAfterLeaveId = null;
          this.startAutoCycle();
        }, 150);
      });

      // Desktop: hover opens step
      header.addEventListener('mouseenter', () => {
        if (this.isHoverable() && !this.isTouchDevice()) {
          this.openSoonerItem(item);
        }
      });

      // Mobile: click toggles step
      header.addEventListener('click', (event) => {
        if (this.isTouchDevice()) {
          event.preventDefault();
          this.toggleSoonerItem(item);
        }
      });

      // Mobile circle click also toggles step and adds `.is-active`
      if (circle) {
        circle.addEventListener('click', (event) => {
          if (this.isTouchDevice()) {
            event.preventDefault();
            event.stopPropagation();
            this.toggleSoonerItem(item);
          }
        });
      }
    });

    // Make first item active by default, then auto-advance on hover-capable devices
    if (items.length > 0) {
      this.openSoonerItem(items[0]);
      this.startAutoCycle();
    }
  }

  private startAutoCycle(): void {
    if (!this.isHoverable() || this.soonerItems.length <= 1) return;
    this.stopAutoCycle();
    this.cycleIntervalId = window.setInterval(() => {
      this.activeIndex = (this.activeIndex + 1) % this.soonerItems.length;
      this.openSoonerItem(this.soonerItems[this.activeIndex]);
    }, AUTO_CYCLE_MS);
  }

  private stopAutoCycle(): void {
    if (this.cycleIntervalId !== null) {
      clearInterval(this.cycleIntervalId);
      this.cycleIntervalId = null;
    }
  }

  private toggleSoonerItem(item: HTMLElement): void {
    if (item.classList.contains('is-open')) {
      this.closeSoonerItem(item);
    } else {
      this.openSoonerItem(item);
    }
  }

  private openSoonerItem(item: HTMLElement): void {
    const idx = this.soonerItems.indexOf(item);
    if (idx >= 0) this.activeIndex = idx;

    this.soonerItems.forEach((sibling) => {
      sibling.classList.remove('is-open');
      const siblingCircle = sibling.querySelector<HTMLElement>('[dev-target="circle"]');
      siblingCircle?.classList.remove('is-active');
    });

    item.classList.add('is-open');
    const circle = item.querySelector<HTMLElement>('[dev-target="circle"]');
    circle?.classList.add('is-active');
  }

  private closeSoonerItem(item: HTMLElement): void {
    item.classList.remove('is-open');
    const circle = item.querySelector<HTMLElement>('[dev-target="circle"]');
    circle?.classList.remove('is-active');
  }

  private isTouchDevice(): boolean {
    return (
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      window.matchMedia('(pointer: coarse)').matches
    );
  }

  private isHoverable(): boolean {
    return window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  }

  destroy(): void {
    this.stopAutoCycle();
    if (this.resumeAfterLeaveId !== null) {
      clearTimeout(this.resumeAfterLeaveId);
      this.resumeAfterLeaveId = null;
    }
    this.soonerItems = [];
  }
}
