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
    constructor(options = {}) {
      this.options = options;
    }
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
      this.toggleHousePlansCompanionTabs(triggerTarget);
      this.activeTrigger = triggerTarget;
    }
    toggleHousePlansCompanionTabs(triggerTarget) {
      if (!this.options.isHousePlansGallery) return;
      if (!this.options.firstTabSelector || !this.options.secondTabSelector) return;
      const firstTab = document.querySelector(this.options.firstTabSelector);
      const secondTab = document.querySelector(this.options.secondTabSelector);
      if (!firstTab || !secondTab) return;
      const isExplorePlansActive = triggerTarget === "explore-plans-trigger";
      firstTab.classList.toggle("hide", !isExplorePlansActive);
      secondTab.classList.toggle("hide", isExplorePlansActive);
    }
  };

  // src/utils/home-map.ts
  var HomeMapController = class _HomeMapController {
    static FLOORS = ["first-floor", "second-floor"];
    svgEls = [];
    activeFeature = null;
    root;
    constructor(root = document) {
      this.root = root;
    }
    /**
     * Initialises one map instance scoped to the provided root.
     * Must be called after the DOM is ready (e.g. inside `window.Webflow.push`).
     */
    init() {
      if (!this.injectSvgs()) return;
      this.bindSvgHover();
      this.bindCardHover();
    }
    /**
     * Initialises all map roots on the page.
     * Each `[dev-target="explore-tab-body"]` that contains at least one holder
     * element becomes its own {@link HomeMapController} instance.
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
     * Converts a kebab-case `feature` attribute value to the matching SVG
     * group ID. `"primary-bedroom"` → `"PRIMARY-BEDROOM"`.
     */
    static toSvgId(feature) {
      return feature.toUpperCase();
    }
    /**
     * Converts an SVG group ID back to the kebab-case `feature` value.
     * `"PRIMARY-BEDROOM"` → `"primary-bedroom"`.
     */
    static toFeature(svgId) {
      return svgId.toLowerCase();
    }
    /**
     * Iterates over each floor, reads SVG markup from its text holder,
     * sanitises it, and injects it into the corresponding target wrapper.
     *
     * @returns `true` if at least one floor was injected successfully.
     */
    injectSvgs() {
      let injected = false;
      for (const floor of _HomeMapController.FLOORS) {
        const textHolder = this.root.querySelector(
          `[dev-target="${floor}-svg-text-holder"]`
        );
        const targetWrapper = this.root.querySelector(
          `[dev-target="${floor}-svg-target-wrapper"]`
        );
        if (!textHolder || !targetWrapper) {
          console.error(
            `HomeMapController: Missing element for "${floor}". holder=${!!textHolder}, wrapper=${!!targetWrapper}`
          );
          continue;
        }
        const rawMarkup = textHolder.textContent?.trim() ?? "";
        if (!rawMarkup.includes("<svg")) {
          console.error(`HomeMapController: "${floor}" SVG text holder does not contain SVG markup.`);
          continue;
        }
        const svgMarkup = rawMarkup.replace(/=\d+"/g, '="');
        targetWrapper.innerHTML = svgMarkup;
        const svgEl = targetWrapper.querySelector("svg");
        if (!svgEl) {
          console.error(
            `HomeMapController: "${floor}" SVG injection failed \u2014 no <svg> found after injection.`
          );
          continue;
        }
        svgEl.classList.add("home-map__svg");
        svgEl.style.width = "100%";
        svgEl.style.height = "100%";
        svgEl.style.display = "block";
        this.svgEls.push(svgEl);
        injected = true;
      }
      if (!injected) {
        console.error("HomeMapController: No floor SVGs were successfully injected.");
      }
      return injected;
    }
    /**
     * Discovers which feature cards exist, then for each SVG finds the matching
     * `<g>` groups and wires `mouseenter`/`mouseleave` to {@link highlight}.
     * Only groups whose ID maps to a card's `feature` attribute become interactive.
     */
    bindSvgHover() {
      if (!this.svgEls.length) {
        console.error("HomeMapController: bindSvgHover called but no SVGs are injected.");
        return;
      }
      const features = /* @__PURE__ */ new Set();
      document.querySelectorAll('[dev-target="feature-collection-item"][feature]').forEach((card) => {
        const f = card.getAttribute("feature");
        if (f) features.add(f);
      });
      for (const svgEl of this.svgEls) {
        for (const feature of features) {
          const svgId = _HomeMapController.toSvgId(feature);
          const group = svgEl.querySelector(`#${CSS.escape(svgId)}`);
          if (!group) continue;
          group.classList.add("home-map__shape");
          group.style.cursor = "pointer";
          group.addEventListener("mouseenter", () => this.highlight(feature));
          group.addEventListener("mouseleave", () => this.clearHighlight());
        }
      }
    }
    /**
     * Attaches `mouseenter`/`mouseleave` listeners to CMS feature cards so
     * hovering a card highlights the corresponding SVG room group.
     */
    bindCardHover() {
      const cards = document.querySelectorAll(
        '[dev-target="feature-collection-item"][feature]'
      );
      if (!cards.length) {
        console.error(
          'HomeMapController: No [dev-target="feature-collection-item"][feature] cards found \u2014 add a feature attribute to each CMS card to enable bidirectional hover.'
        );
        return;
      }
      cards.forEach((card) => {
        const feature = card.getAttribute("feature");
        if (!feature) return;
        card.addEventListener("mouseenter", () => this.highlight(feature));
        card.addEventListener("mouseleave", () => this.clearHighlight());
      });
    }
    /**
     * Activates the SVG room shape and CMS card for the given feature.
     * No-ops if the feature is already active.
     *
     * @param feature - Kebab-case feature id matching both the card `feature`
     *   attribute and the SVG `<g id>` (uppercased).
     */
    highlight(feature) {
      if (this.activeFeature === feature) return;
      this.clearHighlight();
      this.activeFeature = feature;
      const svgId = _HomeMapController.toSvgId(feature);
      for (const svgEl of this.svgEls) {
        svgEl.querySelector(`#${CSS.escape(svgId)}`)?.classList.add("home-map__shape--active");
      }
      document.querySelector(`[dev-target="feature-collection-item"][feature="${feature}"]`)?.classList.add("home-map__card--active");
    }
    /**
     * Removes all active highlight classes and resets {@link activeFeature}.
     */
    clearHighlight() {
      this.activeFeature = null;
      for (const svgEl of this.svgEls) {
        svgEl.querySelector(".home-map__shape--active")?.classList.remove("home-map__shape--active");
      }
      document.querySelector(".home-map__card--active")?.classList.remove("home-map__card--active");
    }
  };

  // src/utils/lot-map.ts
  var AVAILABILITY_COLORS = {
    "For Sale": "#657839",
    "Not Available for Sale": "#d17520",
    "Under Contract": "#8b514e",
    "Not Available": "#3A759D"
  };
  var LotMapController = class {
    svgEl = null;
    activeId = null;
    isPanning = false;
    config;
    /** Native width of the SVG viewBox. */
    ORIGINAL_W = 1162.54;
    /** Native height of the SVG viewBox. */
    ORIGINAL_H = 912.76;
    /** Minimum zoom factor — prevents zooming out past the full map (1 = full map). */
    MIN_ZOOM = 1;
    /** Maximum zoom factor. */
    MAX_ZOOM = 8;
    /** Zoom factor for the zoom buttons. */
    DISABLE_ZOOM_WITH_MOUSE_SCROLL = true;
    vb = { x: 0, y: 0, w: this.ORIGINAL_W, h: this.ORIGINAL_H };
    constructor(config = {}) {
      this.config = config;
    }
    /**
     * Initialises the controller: injects the SVG, wires hover and zoom.
     * Must be called after the DOM is ready (e.g. inside `window.Webflow.push`).
     */
    init() {
      if (!this.injectSvg()) return;
      const cards = document.querySelectorAll('[dev-target="one-lot"][lot-number]');
      if (!cards.length) {
        console.error(
          'LotMapController: No [dev-target="one-lot"][lot-number] found \u2014 add lot-number to each CMS lot card to enable bidirectional hover.'
        );
      }
      this.applyLabelColors();
      this.bindSvgHover();
      this.bindCardHover(cards);
      this.bindZoom();
      this.injectZoomControls();
      this.bindFilter();
      const { isZoomMode, focusLotNumber, focusZoomFactor = 3.5 } = this.config;
      if (isZoomMode && focusLotNumber) {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            this.focusViewOnLot(focusLotNumber, focusZoomFactor);
            this.highlight(focusLotNumber, false);
          });
        });
      } else if (isZoomMode && !focusLotNumber) {
        console.error(
          'LotMapController: isZoomMode is true but focusLotNumber is missing \u2014 set focusLotNumber or a CMS `lot-number` on [dev-target="one-lot"].'
        );
      }
    }
    /**
     * Sets the viewBox to frame the lot shape group in SVG space, with padding and a
     * zoom level derived from {@link focusZoomFactor}.
     */
    focusViewOnLot(lotId, zoomFactor) {
      if (!this.svgEl) return;
      const shape = this.svgEl.querySelector(`#${CSS.escape(lotId)}`);
      if (!shape) {
        console.error(`LotMapController: No SVG lot group #${lotId} \u2014 cannot focus view.`);
        return;
      }
      let bbox;
      try {
        bbox = shape.getBBox();
      } catch {
        return;
      }
      if (bbox.width <= 0 && bbox.height <= 0) {
        console.error(`LotMapController: Empty geometry for lot #${lotId} \u2014 cannot focus view.`);
        return;
      }
      const cx = bbox.x + bbox.width / 2;
      const cy = bbox.y + bbox.height / 2;
      const minWFromMaxZoom = this.ORIGINAL_W / this.MAX_ZOOM;
      const fromMapZoom = this.ORIGINAL_W / Math.max(zoomFactor, 1);
      const fromLotPadding = Math.max(bbox.width, bbox.height) * 3;
      const targetW = Math.min(
        this.ORIGINAL_W,
        Math.max(minWFromMaxZoom, Math.max(fromMapZoom, fromLotPadding))
      );
      const targetH = targetW * this.ORIGINAL_H / this.ORIGINAL_W;
      this.vb.x = cx - targetW / 2;
      this.vb.y = cy - targetH / 2;
      this.vb.w = targetW;
      this.vb.h = targetH;
      this.clampViewBox();
    }
    bindFilter() {
      const map = {
        available: "For Sale",
        reserved: "Not Available for Sale",
        sold: "Under Contract",
        "model-home": "Not Available"
      };
      let activeKey = null;
      const applyFilter = () => {
        let visibleCount = 0;
        document.querySelectorAll('[dev-target="one-lot"]').forEach((lot) => {
          const matches = activeKey === null || lot.getAttribute("availability") === map[activeKey];
          lot.classList.toggle("hide", !matches);
          if (matches) visibleCount += 1;
        });
        const noItems = document.querySelector('[dev-target="no-items-found"]');
        noItems?.classList.toggle("hide", visibleCount > 0);
      };
      Object.keys(map).forEach((key) => {
        const pill = document.querySelector(`[dev-target="${key}"]`);
        if (!pill) {
          console.error(`LotMapController: no filter pill found for dev-target="${key}".`);
          return;
        }
        pill.addEventListener("click", () => {
          document.querySelector(`[dev-target="${activeKey}"]`)?.classList.remove("is-active");
          activeKey = activeKey === key ? null : key;
          if (activeKey) pill.classList.add("is-active");
          applyFilter();
        });
      });
    }
    /**
     * Sets each SVG label group's rect fill color based on the lot's availability
     * from the CMS cards. Uses {@link AVAILABILITY_COLORS}; unknown values default to #657839.
     */
    applyLabelColors() {
      if (!this.svgEl) {
        console.error("LotMapController: applyLabelColors called but svgEl is null.");
        return;
      }
      const lotToAvailability = /* @__PURE__ */ new Map();
      document.querySelectorAll('[dev-target="one-lot"][lot-number]').forEach((card) => {
        const lotNumber = card.getAttribute("lot-number");
        const availability = card.getAttribute("availability");
        if (lotNumber && availability) lotToAvailability.set(lotNumber, availability);
      });
      this.svgEl.querySelectorAll('g[id$="Label"]').forEach((labelGroup) => {
        const { id } = labelGroup;
        const lotNumber = id.replace(/Label$/, "");
        const availability = lotToAvailability.get(lotNumber);
        const color = availability ? AVAILABILITY_COLORS[availability] ?? "#657839" : "#657839";
        labelGroup.querySelector("rect")?.setAttribute("fill", color);
      });
    }
    /**
     * Reads SVG markup from `[dev-target="svg-text-holder"]`, sanitises it,
     * and injects it into `[dev-target="svg-target-wrapper"]`.
     *
     * @returns `true` on success, `false` if a required element is missing or
     *   the holder does not contain valid SVG markup.
     */
    injectSvg() {
      const textHolder = document.querySelector('[dev-target="svg-text-holder"]');
      const targetWrapper = document.querySelector('[dev-target="svg-target-wrapper"]');
      if (!textHolder) {
        console.error('LotMapController: No [dev-target="svg-text-holder"] element found.');
        return false;
      }
      if (!targetWrapper) {
        console.error('LotMapController: No [dev-target="svg-target-wrapper"] element found.');
        return false;
      }
      const rawMarkup = textHolder.textContent?.trim() ?? "";
      if (!rawMarkup.includes("<svg")) {
        console.error(
          'LotMapController: [dev-target="svg-text-holder"] does not contain SVG markup.'
        );
        return false;
      }
      const svgMarkup = rawMarkup.replace(/=\d+"/g, '="');
      targetWrapper.innerHTML = svgMarkup;
      this.svgEl = targetWrapper.querySelector("svg");
      if (!this.svgEl) {
        console.error("LotMapController: SVG injection failed \u2014 no <svg> found after injection.");
        return false;
      }
      this.svgEl.style.width = "100%";
      this.svgEl.style.height = "100%";
      this.svgEl.style.display = "block";
      return true;
    }
    /**
     * Writes the current {@link ViewBox} state back to the SVG `viewBox` attribute.
     */
    applyViewBox() {
      const { x, y, w, h } = this.vb;
      this.svgEl?.setAttribute("viewBox", `${x} ${y} ${w} ${h}`);
    }
    /**
     * Clamps the viewBox so the visible area stays within map bounds.
     * Prevents panning the map out of view at any zoom level.
     */
    clampViewBox() {
      this.vb.x = Math.max(0, Math.min(this.vb.x, this.ORIGINAL_W - this.vb.w));
      this.vb.y = Math.max(0, Math.min(this.vb.y, this.ORIGINAL_H - this.vb.h));
      this.applyViewBox();
    }
    /**
     * Converts a screen-space client coordinate to SVG-space coordinates,
     * accounting for the current viewBox pan and zoom.
     *
     * @param clientX - Horizontal client coordinate (e.g. from a mouse event).
     * @param clientY - Vertical client coordinate.
     * @returns The equivalent point in SVG user units.
     */
    toSvgPoint(clientX, clientY) {
      const rect = this.svgEl.getBoundingClientRect();
      return {
        x: this.vb.x + (clientX - rect.left) / rect.width * this.vb.w,
        y: this.vb.y + (clientY - rect.top) / rect.height * this.vb.h
      };
    }
    /**
     * Scales the viewBox by `scale` around a fixed SVG-space origin point,
     * clamped to {@link MIN_ZOOM} / {@link MAX_ZOOM}.
     *
     * @param scale   - Multiplier applied to the viewBox dimensions (< 1 zooms in).
     * @param originX - SVG-space X coordinate to zoom around.
     * @param originY - SVG-space Y coordinate to zoom around.
     */
    zoomAround(scale, originX, originY) {
      const newW = this.vb.w * scale;
      const zoom = this.ORIGINAL_W / newW;
      if (zoom < this.MIN_ZOOM || zoom > this.MAX_ZOOM) {
        this.clampViewBox();
        return;
      }
      this.vb.x = originX + (this.vb.x - originX) * scale;
      this.vb.y = originY + (this.vb.y - originY) * scale;
      this.vb.w = newW;
      this.vb.h = this.vb.h * scale;
      this.clampViewBox();
    }
    /**
     * Zooms by `scale` around the centre of the current viewBox.
     * Used by the +/− buttons.
     *
     * @param scale - Multiplier applied to the viewBox dimensions (< 1 zooms in).
     */
    zoomBy(scale) {
      const cx = this.vb.x + this.vb.w / 2;
      const cy = this.vb.y + this.vb.h / 2;
      this.zoomAround(scale, cx, cy);
    }
    /**
     * Resets the viewBox to the original full-map dimensions.
     */
    resetZoom() {
      this.vb = { x: 0, y: 0, w: this.ORIGINAL_W, h: this.ORIGINAL_H };
      this.applyViewBox();
    }
    /**
     * Attaches mouse-wheel zoom, left/middle-click drag pan, and touch
     * pinch-to-zoom / single-finger pan event listeners to the SVG.
     *
     * Mouse and touch move/end listeners are bound to `window` so gestures
     * continue working when the pointer leaves the SVG boundary.
     * `preventDefault()` is only called when an interaction originated on
     * the SVG, leaving all other page scroll unaffected.
     */
    bindZoom() {
      if (!this.svgEl) {
        console.error("LotMapController: bindZoom called but svgEl is null.");
        return;
      }
      const svg = this.svgEl;
      svg.addEventListener(
        "wheel",
        (e) => {
          if (this.DISABLE_ZOOM_WITH_MOUSE_SCROLL) return;
          e.preventDefault();
          const scale = e.deltaY < 0 ? 0.85 : 1 / 0.85;
          const { x, y } = this.toSvgPoint(e.clientX, e.clientY);
          this.zoomAround(scale, x, y);
        },
        { passive: false }
      );
      let startClient = { x: 0, y: 0 };
      let startVb = { ...this.vb };
      svg.addEventListener("mousedown", (e) => {
        if (e.button !== 0 && e.button !== 1) return;
        e.preventDefault();
        this.isPanning = true;
        startClient = { x: e.clientX, y: e.clientY };
        startVb = { ...this.vb };
        svg.classList.add("lot-map__svg--panning");
      });
      window.addEventListener("mousemove", (e) => {
        if (!this.isPanning) return;
        const rect = svg.getBoundingClientRect();
        this.vb.x = startVb.x - (e.clientX - startClient.x) / rect.width * startVb.w;
        this.vb.y = startVb.y - (e.clientY - startClient.y) / rect.height * startVb.h;
        this.clampViewBox();
      });
      window.addEventListener("mouseup", (e) => {
        if (!this.isPanning || e.button !== 0 && e.button !== 1) return;
        this.isPanning = false;
        svg.classList.remove("lot-map__svg--panning");
      });
      let isTouching = false;
      let lastDist = 0;
      let lastMid = { x: 0, y: 0 };
      const touchDist = (t) => Math.hypot(t[0].clientX - t[1].clientX, t[0].clientY - t[1].clientY);
      const touchMid = (t) => ({
        x: (t[0].clientX + t[1].clientX) / 2,
        y: (t[0].clientY + t[1].clientY) / 2
      });
      svg.addEventListener(
        "touchstart",
        (e) => {
          e.preventDefault();
          isTouching = true;
          if (e.touches.length === 2) {
            this.isPanning = false;
            lastDist = touchDist(e.touches);
            lastMid = touchMid(e.touches);
          } else {
            this.isPanning = true;
            startClient = { x: e.touches[0].clientX, y: e.touches[0].clientY };
            startVb = { ...this.vb };
          }
        },
        { passive: false }
      );
      window.addEventListener(
        "touchmove",
        (e) => {
          if (!isTouching) return;
          e.preventDefault();
          if (e.touches.length === 2) {
            this.isPanning = false;
            const dist = touchDist(e.touches);
            const mid = touchMid(e.touches);
            const scale = lastDist / dist;
            const origin = this.toSvgPoint(mid.x, mid.y);
            this.zoomAround(scale, origin.x, origin.y);
            const rect = svg.getBoundingClientRect();
            this.vb.x -= (mid.x - lastMid.x) / rect.width * this.vb.w;
            this.vb.y -= (mid.y - lastMid.y) / rect.height * this.vb.h;
            this.clampViewBox();
            lastDist = dist;
            lastMid = mid;
          } else if (e.touches.length === 1 && this.isPanning) {
            const rect = svg.getBoundingClientRect();
            const dx = (e.touches[0].clientX - startClient.x) / rect.width * startVb.w;
            const dy = (e.touches[0].clientY - startClient.y) / rect.height * startVb.h;
            this.vb.x = startVb.x - dx;
            this.vb.y = startVb.y - dy;
            this.clampViewBox();
          }
        },
        { passive: false }
      );
      window.addEventListener("touchend", () => {
        if (!isTouching) return;
        isTouching = false;
        this.isPanning = false;
      });
    }
    /**
     * Creates and appends +/− and reset zoom buttons as a sibling of the `<svg>`.
     * Forces the parent wrapper to `position: relative` if it is `static`.
     */
    injectZoomControls() {
      const wrapper = this.svgEl?.parentElement;
      if (!wrapper) {
        console.error("LotMapController: injectZoomControls called but SVG has no parent.");
        return;
      }
      if (getComputedStyle(wrapper).position === "static") {
        wrapper.style.position = "relative";
      }
      const controls = document.createElement("div");
      controls.className = "lot-map__zoom-controls";
      controls.setAttribute("aria-label", "Map zoom controls");
      controls.innerHTML = `
      <button class="lot-map__zoom-btn" data-zoom="in"    title="Zoom in"   aria-label="Zoom in">+</button>
      <button class="lot-map__zoom-btn" data-zoom="reset" title="Reset zoom" aria-label="Reset zoom">\u2299</button>
      <button class="lot-map__zoom-btn" data-zoom="out"   title="Zoom out"  aria-label="Zoom out">\u2212</button>
    `;
      controls.addEventListener("click", (e) => {
        const btn = e.target.closest("[data-zoom]");
        if (!btn) return;
        const { zoom } = btn.dataset;
        if (zoom === "in") this.zoomBy(0.7);
        else if (zoom === "out") this.zoomBy(1 / 0.7);
        else if (zoom === "reset") this.resetZoom();
      });
      wrapper.appendChild(controls);
    }
    /**
     * Auto-discovers all lot shape/label `<g>` pairs in the SVG and attaches
     * `mouseenter`/`mouseleave` listeners. A group is treated as a lot shape
     * when a sibling group named `${id}Label` exists.
     */
    bindSvgHover() {
      if (!this.svgEl) {
        console.error("LotMapController: bindSvgHover called but svgEl is null.");
        return;
      }
      const allGroups = Array.from(this.svgEl.querySelectorAll("g[id]"));
      allGroups.forEach((group) => {
        const { id } = group;
        if (id.endsWith("Label") || id.endsWith("Border")) return;
        const labelGroup = this.svgEl.querySelector(`#${CSS.escape(id)}Label`);
        if (!labelGroup) return;
        group.style.cursor = "pointer";
        group.addEventListener("mouseenter", () => this.highlight(id));
        group.addEventListener("mouseleave", () => this.clearHighlight());
        group.addEventListener("mousedown", (e) => e.stopPropagation());
        group.addEventListener("click", () => this.highlight(id, true));
        labelGroup.style.cursor = "pointer";
        labelGroup.addEventListener("mouseenter", () => this.highlight(id));
        labelGroup.addEventListener("mouseleave", () => this.clearHighlight());
        labelGroup.addEventListener("mousedown", (e) => e.stopPropagation());
        labelGroup.addEventListener("click", () => this.highlight(id, true));
      });
    }
    /**
     * Attaches `mouseenter`/`mouseleave` listeners to the CMS lot cards.
     * - If the lot price is 'Inquire for Pricing', it will hide the 'Starting from' text.
     *
     * @param cards - All `[dev-target="one-lot"][lot-number]` elements on the page.
     */
    bindCardHover(cards) {
      cards.forEach((card) => {
        const lotNumber = card.getAttribute("lot-number");
        const price = card.getAttribute("price");
        if (!lotNumber) return;
        card.addEventListener("mouseenter", () => this.highlight(lotNumber));
        card.addEventListener("mouseleave", () => this.clearHighlight());
        if (price === "Inquire for Pricing") {
          card.querySelector('[dev-target="starting-from-text"]')?.classList.add("hide");
        }
      });
    }
    /**
     * Activates the SVG shape, label, and CMS card for the given lot ID.
     * Optionally scrolls the card into view (only when triggered by map click, not hover).
     * No-ops if the lot is already active or if a pan is in progress.
     *
     * @param lotId - Lot identifier matching both the SVG `<g id>` and `lot-number` attribute.
     * @param scrollToCard - When true, scrolls the lot card into view in the list. Use for map clicks only.
     */
    highlight(lotId, scrollToCard = false) {
      if (this.isPanning) return;
      if (this.activeId === lotId && !scrollToCard) return;
      this.clearHighlight();
      this.activeId = lotId;
      if (this.svgEl) {
        this.svgEl.querySelector(`#${CSS.escape(lotId)}`)?.classList.add("lot-map__shape--active");
        this.svgEl.querySelector(`#${CSS.escape(lotId)}Label`)?.classList.add("lot-map__label--active");
      }
      const card = document.querySelector(
        `[dev-target="one-lot"][lot-number="${lotId}"]`
      );
      if (card) {
        if (!this.config.isZoomMode) {
          card.classList.add("lot-map__card--active");
        }
        if (scrollToCard) {
          card.classList.remove("hide");
          card.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      } else if (scrollToCard) {
        console.error(
          `LotMapController: No CMS lot card for map lot \u2014 expected [dev-target="one-lot"][lot-number="${lotId}"].`
        );
      }
    }
    /**
     * Removes all active highlight classes and resets {@link activeId}.
     */
    clearHighlight() {
      this.activeId = null;
      this.svgEl?.querySelector(".lot-map__shape--active")?.classList.remove("lot-map__shape--active");
      this.svgEl?.querySelector(".lot-map__label--active")?.classList.remove("lot-map__label--active");
      document.querySelector(".lot-map__card--active")?.classList.remove("lot-map__card--active");
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
    const lot = document.querySelector('[dev-target="one-lot"]');
    if (!lot) {
      console.error('LotMapController: No [dev-target="one-lot"] found.');
      return;
    }
    const lotNumber = lot.getAttribute("lot-number");
    if (!lotNumber) {
      console.error("LotMapController: No data-lot-number found.");
      return;
    }
    const lotMapConfig = {
      focusLotNumber: lotNumber,
      isZoomMode: true,
      focusZoomFactor: 2.5
    };
    const lotMapController = new LotMapController(lotMapConfig);
    lotMapController.init();
    const stickyNavController = new StickyNavController(stickyNavConfig);
    stickyNavController.init();
    const exploreTabsController = new ExploreTabsController();
    exploreTabsController.init();
    HomeMapController.initAll();
  });
})();
//# sourceMappingURL=homes.js.map
