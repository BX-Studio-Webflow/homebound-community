"use strict";
(() => {
  // bin/live-reload.js
  new EventSource(`${"http://localhost:3000"}/esbuild`).addEventListener("change", () => location.reload());

  // src/utils/sooner-accordion.ts
  var AUTO_CYCLE_MS = 5e3;
  var SoonerAccordionController = class {
    soonerItems = [];
    activeIndex = 0;
    cycleIntervalId = null;
    resumeAfterLeaveId = null;
    init() {
      this.initSoonerAccordionItems();
    }
    // ─── New 'sooner' process block behavior (mouse hover + mobile click) ───────
    initSoonerAccordionItems() {
      const items = document.querySelectorAll('[dev-target="one-sooner-accordion"]');
      if (!items.length) return;
      items.forEach((item) => {
        this.soonerItems.push(item);
        const header = item.querySelector('[dev-target="sooner-header"]');
        const circle = item.querySelector('[dev-target="circle"]');
        if (!header) return;
        item.addEventListener("mouseenter", () => {
          if (!this.isHoverable()) return;
          if (this.resumeAfterLeaveId !== null) {
            clearTimeout(this.resumeAfterLeaveId);
            this.resumeAfterLeaveId = null;
          }
          this.stopAutoCycle();
        });
        item.addEventListener("mouseleave", () => {
          if (!this.isHoverable()) return;
          if (this.resumeAfterLeaveId !== null) {
            clearTimeout(this.resumeAfterLeaveId);
          }
          this.resumeAfterLeaveId = window.setTimeout(() => {
            this.resumeAfterLeaveId = null;
            this.startAutoCycle();
          }, 150);
        });
        header.addEventListener("mouseenter", () => {
          if (this.isHoverable() && !this.isTouchDevice()) {
            this.openSoonerItem(item);
          }
        });
        header.addEventListener("click", (event) => {
          if (this.isTouchDevice()) {
            event.preventDefault();
            this.toggleSoonerItem(item);
          }
        });
        if (circle) {
          circle.addEventListener("click", (event) => {
            if (this.isTouchDevice()) {
              event.preventDefault();
              event.stopPropagation();
              this.toggleSoonerItem(item);
            }
          });
        }
      });
      if (items.length > 0) {
        this.openSoonerItem(items[0]);
        this.startAutoCycle();
      }
    }
    startAutoCycle() {
      if (!this.isHoverable() || this.soonerItems.length <= 1) return;
      this.stopAutoCycle();
      this.cycleIntervalId = window.setInterval(() => {
        this.activeIndex = (this.activeIndex + 1) % this.soonerItems.length;
        this.openSoonerItem(this.soonerItems[this.activeIndex]);
      }, AUTO_CYCLE_MS);
    }
    stopAutoCycle() {
      if (this.cycleIntervalId !== null) {
        clearInterval(this.cycleIntervalId);
        this.cycleIntervalId = null;
      }
    }
    toggleSoonerItem(item) {
      if (item.classList.contains("is-open")) {
        this.closeSoonerItem(item);
      } else {
        this.openSoonerItem(item);
      }
    }
    openSoonerItem(item) {
      const idx = this.soonerItems.indexOf(item);
      if (idx >= 0) this.activeIndex = idx;
      this.soonerItems.forEach((sibling) => {
        sibling.classList.remove("is-open");
        const siblingCircle = sibling.querySelector('[dev-target="circle"]');
        siblingCircle?.classList.remove("is-active");
      });
      item.classList.add("is-open");
      const circle = item.querySelector('[dev-target="circle"]');
      circle?.classList.add("is-active");
    }
    closeSoonerItem(item) {
      item.classList.remove("is-open");
      const circle = item.querySelector('[dev-target="circle"]');
      circle?.classList.remove("is-active");
    }
    isTouchDevice() {
      return "ontouchstart" in window || navigator.maxTouchPoints > 0 || window.matchMedia("(pointer: coarse)").matches;
    }
    isHoverable() {
      return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    }
    destroy() {
      this.stopAutoCycle();
      if (this.resumeAfterLeaveId !== null) {
        clearTimeout(this.resumeAfterLeaveId);
        this.resumeAfterLeaveId = null;
      }
      this.soonerItems = [];
    }
  };

  // src/sooner-accordion.ts
  window.Webflow ||= [];
  window.Webflow.push(() => {
    const faqAccordionController = new SoonerAccordionController();
    faqAccordionController.init();
  });
})();
//# sourceMappingURL=sooner-accordion.js.map
