"use strict";
(() => {
  // bin/live-reload.js
  new EventSource(`${"http://localhost:3000"}/esbuild`).addEventListener("change", () => location.reload());

  // src/utils/explore-tabs.ts
  var TRIGGER_TO_PANEL = {
    "explore-plans-trigger": "explore-plans-tab",
    "explore-homes-trigger": "explore-homes-tab"
  };
  var ExploreTabsController = class {
    activeTrigger = null;
    /**
     * Initialises the controller: wires tab triggers to panels.
     * Must be called after the DOM is ready (e.g. inside `window.Webflow.push`).
     */
    init() {
      const header = document.querySelector('[dev-target="explore-tab-header"]');
      const body = document.querySelector('[dev-target="explore-tab-body"]');
      if (!header) {
        console.error('ExploreTabsController: No [dev-target="explore-tab-header"] found.');
        return;
      }
      if (!body) {
        console.error('ExploreTabsController: No [dev-target="explore-tab-body"] found.');
        return;
      }
      Object.entries(TRIGGER_TO_PANEL).forEach(([triggerTarget, panelTarget]) => {
        const trigger = document.querySelector(`[dev-target="${triggerTarget}"]`);
        const panel = document.querySelector(`[dev-target="${panelTarget}"]`);
        if (!trigger) {
          console.error(`ExploreTabsController: No [dev-target="${triggerTarget}"] found.`);
          return;
        }
        if (!panel) {
          console.error(`ExploreTabsController: No [dev-target="${panelTarget}"] found.`);
          return;
        }
        trigger.addEventListener("click", () => this.activate(triggerTarget));
      });
      const initialTrigger = document.querySelector('[dev-target="explore-plans-trigger"].is-active') ?? document.querySelector('[dev-target="explore-homes-trigger"].is-active');
      if (initialTrigger) {
        const target = initialTrigger.getAttribute("dev-target");
        if (target) this.activate(target);
      } else {
        this.activate("explore-plans-trigger");
      }
    }
    /**
     * Activates the given trigger and shows its corresponding panel.
     */
    activate(triggerTarget) {
      if (this.activeTrigger === triggerTarget) return;
      const panelTarget = TRIGGER_TO_PANEL[triggerTarget];
      if (!panelTarget) return;
      Object.keys(TRIGGER_TO_PANEL).forEach((key) => {
        const trigger = document.querySelector(`[dev-target="${key}"]`);
        trigger?.classList.toggle("is-active", key === triggerTarget);
      });
      Object.values(TRIGGER_TO_PANEL).forEach((target) => {
        const panel = document.querySelector(`[dev-target="${target}"]`);
        panel?.classList.toggle("hide", target !== panelTarget);
      });
      this.activeTrigger = triggerTarget;
    }
  };

  // src/utils/home-map.ts
  var HomeMapController = class _HomeMapController {
    svgEl = null;
    activeGroup = null;
    root;
    constructor(root = document) {
      this.root = root;
    }
    /**
     * Initialises one map instance scoped to the provided root.
     * Must be called after the DOM is ready (e.g. inside `window.Webflow.push`).
     */
    init() {
      if (!this.injectSvg()) return;
      this.bindSvgHover();
    }
    /**
     * Initialises all map roots on the page (first-floor and second-floor tabs).
     * Each `[dev-target="explore-tab-body"]` that contains a holder element
     * becomes its own {@link HomeMapController} instance.
     */
    static initAll(rootSelector = '[dev-target="explore-tab-body"]') {
      const holderSelector = '[dev-target="first-floor-svg-text-holder"], [dev-target="second-floor-svg-text-holder"]';
      const roots = Array.from(document.querySelectorAll(rootSelector)).filter(
        (root) => root.querySelector(holderSelector)
      );
      if (!roots.length) {
        new _HomeMapController(document).init();
        return;
      }
      roots.forEach((root) => new _HomeMapController(root).init());
    }
    /**
     * Reads SVG markup from the floor's text holder, sanitises it,
     * and injects it into the corresponding target wrapper.
     *
     * @returns `true` on success, `false` if a required element is missing or
     *   the holder does not contain valid SVG markup.
     */
    injectSvg() {
      const textHolder = this.root.querySelector(
        '[dev-target="first-floor-svg-text-holder"], [dev-target="second-floor-svg-text-holder"]'
      );
      const targetWrapper = this.root.querySelector(
        '[dev-target="first-floor-svg-target-wrapper"], [dev-target="second-floor-svg-target-wrapper"]'
      );
      if (!textHolder) {
        console.error(
          'HomeMapController: No [dev-target="first-floor-svg-text-holder"] or [dev-target="second-floor-svg-text-holder"] element found.'
        );
        return false;
      }
      if (!targetWrapper) {
        console.error(
          'HomeMapController: No [dev-target="first-floor-svg-target-wrapper"] or [dev-target="second-floor-svg-target-wrapper"] element found.'
        );
        return false;
      }
      const rawMarkup = textHolder.textContent?.trim() ?? "";
      if (!rawMarkup.includes("<svg")) {
        console.error("HomeMapController: SVG text holder does not contain SVG markup.");
        return false;
      }
      const svgMarkup = rawMarkup.replace(/=\d+"/g, '="');
      targetWrapper.innerHTML = svgMarkup;
      this.svgEl = targetWrapper.querySelector("svg");
      if (!this.svgEl) {
        console.error("HomeMapController: SVG injection failed \u2014 no <svg> found after injection.");
        return false;
      }
      this.svgEl.classList.add("home-map__svg");
      this.svgEl.style.width = "100%";
      this.svgEl.style.height = "100%";
      this.svgEl.style.display = "block";
      return true;
    }
    /**
     * Auto-discovers all interactive room `<g>` groups in the SVG and attaches
     * `mouseenter`/`mouseleave` listeners. Non-interactive groups (hatches,
     * walls, doors, etc.) are excluded via {@link isInteractiveGroup}.
     */
    bindSvgHover() {
      if (!this.svgEl) {
        console.error("HomeMapController: bindSvgHover called but svgEl is null.");
        return;
      }
      const interactiveGroups = Array.from(this.svgEl.querySelectorAll("g[id]")).filter(
        (group) => this.isInteractiveGroup(group.id)
      );
      interactiveGroups.forEach((group) => {
        group.classList.add("home-map__shape");
        group.style.cursor = "pointer";
        group.addEventListener("mouseenter", () => this.setActive(group));
        group.addEventListener("mouseleave", () => this.clearActive(group));
      });
    }
    /**
     * Returns `true` when a `<g id>` represents a hoverable room shape.
     * Structural groups (hatches, walls, doors, text layers, etc.) return `false`.
     */
    isInteractiveGroup(id) {
      if (!id) return false;
      if (/^HATCH(?:-\d+)?$/i.test(id)) return false;
      if (/^(STANDARD_REV|TEXT|DIMS?|NOTES|BORDER|WALLS?|DOORS?|WINDOWS?)$/i.test(id)) return false;
      return true;
    }
    /**
     * Activates the given room group and deactivates the previous one.
     */
    setActive(group) {
      if (this.activeGroup && this.activeGroup !== group) {
        this.activeGroup.classList.remove("home-map__shape--active");
      }
      group.classList.add("home-map__shape--active");
      this.activeGroup = group;
    }
    /**
     * Removes the active highlight from the given room group.
     */
    clearActive(group) {
      group.classList.remove("home-map__shape--active");
      if (this.activeGroup === group) {
        this.activeGroup = null;
      }
    }
  };

  // src/utils/sticky-nav.ts
  var defaultStickyNavConfig = {
    linkSelector: ".tab-links[dev-target]",
    navContainerSelector: ".tab-header",
    stripSelector: '[dev-target="tab-left"]',
    mobileBreakpoint: 767,
    observerRootMargin: "-10% 0px -85% 0px",
    observerThreshold: 0,
    sectionMap: {
      overview: "overview-section",
      "floor-plans": "floor-plans-section",
      amentities: "amentities-section",
      personalisation: "personalization-section",
      "browse-homes": "lots-section",
      process: "process-section"
    },
    sectionOrder: ["overview", "floor-plans", "amentities", "personalisation", "browse-homes"]
  };
  var StickyNavController = class {
    links = [];
    observer = null;
    visibleSections = /* @__PURE__ */ new Set();
    /**
     * Maps dev-target attribute values to their corresponding section IDs.
     * Handles spelling mismatches between the nav markup and section IDs.
     */
    sectionMap;
    /**
     * Ordered list of dev-target values matching the top-to-bottom page section order.
     * Used to determine which section is "topmost" when multiple are visible at once.
     */
    sectionOrder;
    linkSelector;
    navContainerSelector;
    stripSelector;
    mobileBreakpoint;
    observerRootMargin;
    observerThreshold;
    constructor(config) {
      const resolvedConfig = {
        ...defaultStickyNavConfig,
        ...config,
        sectionMap: {
          ...defaultStickyNavConfig.sectionMap,
          ...config?.sectionMap
        },
        sectionOrder: config?.sectionOrder ?? defaultStickyNavConfig.sectionOrder
      };
      this.linkSelector = resolvedConfig.linkSelector;
      this.navContainerSelector = resolvedConfig.navContainerSelector;
      this.stripSelector = resolvedConfig.stripSelector;
      this.mobileBreakpoint = resolvedConfig.mobileBreakpoint;
      this.observerRootMargin = resolvedConfig.observerRootMargin;
      this.observerThreshold = resolvedConfig.observerThreshold;
      this.sectionMap = resolvedConfig.sectionMap;
      this.sectionOrder = resolvedConfig.sectionOrder;
    }
    init() {
      this.links = Array.from(document.querySelectorAll(this.linkSelector));
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
          const navBar = link.closest(this.navContainerSelector);
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
          rootMargin: this.observerRootMargin,
          threshold: this.observerThreshold
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
     * On mobile (≤767px), scroll the strip so the active link is centred in the
     * visible area.
     *
     * The strip has `position: relative` (set in CSS), which makes it the
     * offsetParent for its children. This means `link.offsetLeft` is always
     * measured from the strip's own left edge — no ancestor-chain ambiguity.
     *
     * Clamped to [0, maxScroll] so we never show blank space at either end.
     */
    scrollLinkIntoStrip(link) {
      if (window.innerWidth > this.mobileBreakpoint) return;
      const strip = link.closest(this.stripSelector);
      if (!strip) return;
      const targetScrollLeft = link.offsetLeft + link.offsetWidth / 2 - strip.offsetWidth / 2;
      const maxScroll = strip.scrollWidth - strip.offsetWidth;
      strip.scrollTo({
        left: Math.min(Math.max(0, targetScrollLeft), maxScroll),
        behavior: "smooth"
      });
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

  // src/homes.ts
  var stickyNavConfig = {
    linkSelector: ".tab-links[dev-target]",
    navContainerSelector: ".tab-header",
    stripSelector: '[dev-target="tab-left"]',
    mobileBreakpoint: 767,
    observerRootMargin: "-10% 0px -85% 0px",
    observerThreshold: 0,
    sectionMap: {
      overview: "overview-section",
      "floor-plans": "floor-plans-section",
      "explore-spaces": "explore-spaces-section",
      location: "location-section",
      "available-homes": "available-homes-section",
      community: "community-section"
    },
    sectionOrder: [
      "overview",
      "floor-plans",
      "explore-spaces",
      "location",
      "available-homes",
      "community"
    ]
  };
  window.Webflow ||= [];
  window.Webflow.push(() => {
    const stickyNavController = new StickyNavController(stickyNavConfig);
    stickyNavController.init();
    const exploreTabsController = new ExploreTabsController();
    exploreTabsController.init();
    HomeMapController.initAll();
  });
})();
//# sourceMappingURL=homes.js.map
