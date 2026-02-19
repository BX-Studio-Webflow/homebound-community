"use strict";
(() => {
  // bin/live-reload.js
  new EventSource(`${"http://localhost:3000"}/esbuild`).addEventListener("change", () => location.reload());

  // src/utils/sticky-nav.ts
  var StickyNavController = class {
    links = [];
    observer = null;
    visibleSections = /* @__PURE__ */ new Set();
    /**
     * Maps dev-target attribute values to their corresponding section IDs.
     * Handles spelling mismatches between the nav markup and section IDs.
     */
    sectionMap = {
      overview: "overview-section",
      "floor-plans": "floor-plans-section",
      amentities: "amentities-section",
      personalisation: "personalization-section",
      "browse-homes": "lots-section",
      process: "process-section"
    };
    /**
     * Ordered list of dev-target values matching the top-to-bottom page section order.
     * Used to determine which section is "topmost" when multiple are visible at once.
     */
    sectionOrder = [
      "overview",
      "floor-plans",
      "amentities",
      "personalisation",
      "browse-homes"
    ];
    init() {
      this.links = Array.from(document.querySelectorAll(".tab-links[dev-target]"));
      if (!this.links.length) {
        console.error("StickyNavController: No tab links found.");
        return;
      }
      this.setupClickHandlers();
      this.setupScrollObserver();
      requestAnimationFrame(() => {
        const initialActive = this.links.find((l) => l.classList.contains("is-active")) ?? this.links[0];
        if (initialActive) {
          initialActive.classList.add("is-active");
          this.scrollLinkIntoStrip(initialActive);
        }
      });
    }
    /**
     * Smooth-scroll to the target section on click/tap.
     * Offsets the scroll position by the sticky nav height so the section
     * heading isn't hidden behind the bar.
     */
    setupClickHandlers() {
      this.links.forEach((link) => {
        link.addEventListener("click", (e) => {
          e.preventDefault();
          const target = link.getAttribute("dev-target");
          if (!target) return;
          const sectionId = this.sectionMap[target];
          if (!sectionId) return;
          const section = document.getElementById(sectionId);
          if (!section) {
            console.error(`StickyNavController: Section #${sectionId} not found.`);
            return;
          }
          const navBar = link.closest(".tab-header");
          const navHeight = navBar ? navBar.offsetHeight : 0;
          const sectionTop = section.getBoundingClientRect().top + window.scrollY - navHeight;
          window.scrollTo({ top: sectionTop, behavior: "smooth" });
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
    setupScrollObserver() {
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
          rootMargin: "-10% 0px -85% 0px",
          threshold: 0
        }
      );
      this.sectionOrder.forEach((target) => {
        const sectionId = this.sectionMap[target];
        if (!sectionId) return;
        const section = document.getElementById(sectionId);
        if (section) {
          this.observer.observe(section);
        } else {
          console.error(`StickyNavController: Section #${sectionId} not found in DOM.`);
        }
      });
    }
    setActiveLink(targetName) {
      this.links.forEach((link) => {
        const isActive = link.getAttribute("dev-target") === targetName;
        link.classList.toggle("is-active", isActive);
        if (isActive) this.scrollLinkIntoStrip(link);
      });
    }
    /**
     * On mobile (≤767px), scroll the active link to the centre of the tab-left
     * strip so it is always fully visible without the user needing to swipe.
     */
    scrollLinkIntoStrip(link) {
      if (window.innerWidth > 767) return;
      const strip = link.closest('[dev-target="tab-left"]');
      if (!strip) return;
      const targetScrollLeft = link.offsetLeft - strip.offsetWidth / 2 + link.offsetWidth / 2;
      strip.scrollTo({ left: targetScrollLeft, behavior: "smooth" });
    }
    getDevTargetBySectionId(sectionId) {
      return this.sectionOrder.find((key) => this.sectionMap[key] === sectionId) ?? null;
    }
    destroy() {
      this.observer?.disconnect();
      this.observer = null;
      this.visibleSections.clear();
    }
  };

  // src/index.ts
  window.Webflow ||= [];
  window.Webflow.push(() => {
    const stickyNavController = new StickyNavController();
    stickyNavController.init();
  });
})();
//# sourceMappingURL=index.js.map
