"use strict";
(() => {
  // bin/live-reload.js
  new EventSource(`${"http://localhost:3000"}/esbuild`).addEventListener("change", () => location.reload());

  // node_modules/.pnpm/swiper@12.1.2/node_modules/swiper/shared/ssr-window.esm.mjs
  function isObject(obj) {
    return obj !== null && typeof obj === "object" && "constructor" in obj && obj.constructor === Object;
  }
  function extend(target = {}, src = {}) {
    const noExtend = ["__proto__", "constructor", "prototype"];
    Object.keys(src).filter((key) => noExtend.indexOf(key) < 0).forEach((key) => {
      if (typeof target[key] === "undefined") target[key] = src[key];
      else if (isObject(src[key]) && isObject(target[key]) && Object.keys(src[key]).length > 0) {
        extend(target[key], src[key]);
      }
    });
  }
  var ssrDocument = {
    body: {},
    addEventListener() {
    },
    removeEventListener() {
    },
    activeElement: {
      blur() {
      },
      nodeName: ""
    },
    querySelector() {
      return null;
    },
    querySelectorAll() {
      return [];
    },
    getElementById() {
      return null;
    },
    createEvent() {
      return {
        initEvent() {
        }
      };
    },
    createElement() {
      return {
        children: [],
        childNodes: [],
        style: {},
        setAttribute() {
        },
        getElementsByTagName() {
          return [];
        }
      };
    },
    createElementNS() {
      return {};
    },
    importNode() {
      return null;
    },
    location: {
      hash: "",
      host: "",
      hostname: "",
      href: "",
      origin: "",
      pathname: "",
      protocol: "",
      search: ""
    }
  };
  function getDocument() {
    const doc = typeof document !== "undefined" ? document : {};
    extend(doc, ssrDocument);
    return doc;
  }
  var ssrWindow = {
    document: ssrDocument,
    navigator: {
      userAgent: ""
    },
    location: {
      hash: "",
      host: "",
      hostname: "",
      href: "",
      origin: "",
      pathname: "",
      protocol: "",
      search: ""
    },
    history: {
      replaceState() {
      },
      pushState() {
      },
      go() {
      },
      back() {
      }
    },
    CustomEvent: function CustomEvent() {
      return this;
    },
    addEventListener() {
    },
    removeEventListener() {
    },
    getComputedStyle() {
      return {
        getPropertyValue() {
          return "";
        }
      };
    },
    Image() {
    },
    Date() {
    },
    screen: {},
    setTimeout() {
    },
    clearTimeout() {
    },
    matchMedia() {
      return {};
    },
    requestAnimationFrame(callback) {
      if (typeof setTimeout === "undefined") {
        callback();
        return null;
      }
      return setTimeout(callback, 0);
    },
    cancelAnimationFrame(id) {
      if (typeof setTimeout === "undefined") {
        return;
      }
      clearTimeout(id);
    }
  };
  function getWindow() {
    const win = typeof window !== "undefined" ? window : {};
    extend(win, ssrWindow);
    return win;
  }

  // node_modules/.pnpm/swiper@12.1.2/node_modules/swiper/shared/utils.mjs
  function classesToTokens(classes2 = "") {
    return classes2.trim().split(" ").filter((c) => !!c.trim());
  }
  function deleteProps(obj) {
    const object = obj;
    Object.keys(object).forEach((key) => {
      try {
        object[key] = null;
      } catch (e) {
      }
      try {
        delete object[key];
      } catch (e) {
      }
    });
  }
  function nextTick(callback, delay = 0) {
    return setTimeout(callback, delay);
  }
  function now() {
    return Date.now();
  }
  function getComputedStyle2(el) {
    const window2 = getWindow();
    let style;
    if (window2.getComputedStyle) {
      style = window2.getComputedStyle(el, null);
    }
    if (!style && el.currentStyle) {
      style = el.currentStyle;
    }
    if (!style) {
      style = el.style;
    }
    return style;
  }
  function getTranslate(el, axis = "x") {
    const window2 = getWindow();
    let matrix;
    let curTransform;
    let transformMatrix;
    const curStyle = getComputedStyle2(el);
    if (window2.WebKitCSSMatrix) {
      curTransform = curStyle.transform || curStyle.webkitTransform;
      if (curTransform.split(",").length > 6) {
        curTransform = curTransform.split(", ").map((a) => a.replace(",", ".")).join(", ");
      }
      transformMatrix = new window2.WebKitCSSMatrix(curTransform === "none" ? "" : curTransform);
    } else {
      transformMatrix = curStyle.MozTransform || curStyle.OTransform || curStyle.MsTransform || curStyle.msTransform || curStyle.transform || curStyle.getPropertyValue("transform").replace("translate(", "matrix(1, 0, 0, 1,");
      matrix = transformMatrix.toString().split(",");
    }
    if (axis === "x") {
      if (window2.WebKitCSSMatrix) curTransform = transformMatrix.m41;
      else if (matrix.length === 16) curTransform = parseFloat(matrix[12]);
      else curTransform = parseFloat(matrix[4]);
    }
    if (axis === "y") {
      if (window2.WebKitCSSMatrix) curTransform = transformMatrix.m42;
      else if (matrix.length === 16) curTransform = parseFloat(matrix[13]);
      else curTransform = parseFloat(matrix[5]);
    }
    return curTransform || 0;
  }
  function isObject2(o) {
    return typeof o === "object" && o !== null && o.constructor && Object.prototype.toString.call(o).slice(8, -1) === "Object";
  }
  function isNode(node) {
    if (typeof window !== "undefined" && typeof window.HTMLElement !== "undefined") {
      return node instanceof HTMLElement;
    }
    return node && (node.nodeType === 1 || node.nodeType === 11);
  }
  function extend2(...args) {
    const to = Object(args[0]);
    for (let i = 1; i < args.length; i += 1) {
      const nextSource = args[i];
      if (nextSource !== void 0 && nextSource !== null && !isNode(nextSource)) {
        const keysArray = Object.keys(Object(nextSource)).filter((key) => key !== "__proto__" && key !== "constructor" && key !== "prototype");
        for (let nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex += 1) {
          const nextKey = keysArray[nextIndex];
          const desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
          if (desc !== void 0 && desc.enumerable) {
            if (isObject2(to[nextKey]) && isObject2(nextSource[nextKey])) {
              if (nextSource[nextKey].__swiper__) {
                to[nextKey] = nextSource[nextKey];
              } else {
                extend2(to[nextKey], nextSource[nextKey]);
              }
            } else if (!isObject2(to[nextKey]) && isObject2(nextSource[nextKey])) {
              to[nextKey] = {};
              if (nextSource[nextKey].__swiper__) {
                to[nextKey] = nextSource[nextKey];
              } else {
                extend2(to[nextKey], nextSource[nextKey]);
              }
            } else {
              to[nextKey] = nextSource[nextKey];
            }
          }
        }
      }
    }
    return to;
  }
  function setCSSProperty(el, varName, varValue) {
    el.style.setProperty(varName, varValue);
  }
  function animateCSSModeScroll({
    swiper,
    targetPosition,
    side
  }) {
    const window2 = getWindow();
    const startPosition = -swiper.translate;
    let startTime = null;
    let time;
    const duration = swiper.params.speed;
    swiper.wrapperEl.style.scrollSnapType = "none";
    window2.cancelAnimationFrame(swiper.cssModeFrameID);
    const dir = targetPosition > startPosition ? "next" : "prev";
    const isOutOfBound = (current, target) => {
      return dir === "next" && current >= target || dir === "prev" && current <= target;
    };
    const animate = () => {
      time = (/* @__PURE__ */ new Date()).getTime();
      if (startTime === null) {
        startTime = time;
      }
      const progress = Math.max(Math.min((time - startTime) / duration, 1), 0);
      const easeProgress = 0.5 - Math.cos(progress * Math.PI) / 2;
      let currentPosition = startPosition + easeProgress * (targetPosition - startPosition);
      if (isOutOfBound(currentPosition, targetPosition)) {
        currentPosition = targetPosition;
      }
      swiper.wrapperEl.scrollTo({
        [side]: currentPosition
      });
      if (isOutOfBound(currentPosition, targetPosition)) {
        swiper.wrapperEl.style.overflow = "hidden";
        swiper.wrapperEl.style.scrollSnapType = "";
        setTimeout(() => {
          swiper.wrapperEl.style.overflow = "";
          swiper.wrapperEl.scrollTo({
            [side]: currentPosition
          });
        });
        window2.cancelAnimationFrame(swiper.cssModeFrameID);
        return;
      }
      swiper.cssModeFrameID = window2.requestAnimationFrame(animate);
    };
    animate();
  }
  function elementChildren(element, selector = "") {
    const window2 = getWindow();
    const children = [...element.children];
    if (window2.HTMLSlotElement && element instanceof HTMLSlotElement) {
      children.push(...element.assignedElements());
    }
    if (!selector) {
      return children;
    }
    return children.filter((el) => el.matches(selector));
  }
  function elementIsChildOfSlot(el, slot) {
    const elementsQueue = [slot];
    while (elementsQueue.length > 0) {
      const elementToCheck = elementsQueue.shift();
      if (el === elementToCheck) {
        return true;
      }
      elementsQueue.push(...elementToCheck.children, ...elementToCheck.shadowRoot ? elementToCheck.shadowRoot.children : [], ...elementToCheck.assignedElements ? elementToCheck.assignedElements() : []);
    }
  }
  function elementIsChildOf(el, parent) {
    const window2 = getWindow();
    let isChild = parent.contains(el);
    if (!isChild && window2.HTMLSlotElement && parent instanceof HTMLSlotElement) {
      const children = [...parent.assignedElements()];
      isChild = children.includes(el);
      if (!isChild) {
        isChild = elementIsChildOfSlot(el, parent);
      }
    }
    return isChild;
  }
  function showWarning(text) {
    try {
      console.warn(text);
      return;
    } catch (err) {
    }
  }
  function createElement(tag, classes2 = []) {
    const el = document.createElement(tag);
    el.classList.add(...Array.isArray(classes2) ? classes2 : classesToTokens(classes2));
    return el;
  }
  function elementPrevAll(el, selector) {
    const prevEls = [];
    while (el.previousElementSibling) {
      const prev = el.previousElementSibling;
      if (selector) {
        if (prev.matches(selector)) prevEls.push(prev);
      } else prevEls.push(prev);
      el = prev;
    }
    return prevEls;
  }
  function elementNextAll(el, selector) {
    const nextEls = [];
    while (el.nextElementSibling) {
      const next = el.nextElementSibling;
      if (selector) {
        if (next.matches(selector)) nextEls.push(next);
      } else nextEls.push(next);
      el = next;
    }
    return nextEls;
  }
  function elementStyle(el, prop) {
    const window2 = getWindow();
    return window2.getComputedStyle(el, null).getPropertyValue(prop);
  }
  function elementIndex(el) {
    let child = el;
    let i;
    if (child) {
      i = 0;
      while ((child = child.previousSibling) !== null) {
        if (child.nodeType === 1) i += 1;
      }
      return i;
    }
    return void 0;
  }
  function elementParents(el, selector) {
    const parents = [];
    let parent = el.parentElement;
    while (parent) {
      if (selector) {
        if (parent.matches(selector)) parents.push(parent);
      } else {
        parents.push(parent);
      }
      parent = parent.parentElement;
    }
    return parents;
  }
  function elementOuterSize(el, size, includeMargins) {
    const window2 = getWindow();
    if (includeMargins) {
      return el[size === "width" ? "offsetWidth" : "offsetHeight"] + parseFloat(window2.getComputedStyle(el, null).getPropertyValue(size === "width" ? "margin-right" : "margin-top")) + parseFloat(window2.getComputedStyle(el, null).getPropertyValue(size === "width" ? "margin-left" : "margin-bottom"));
    }
    return el.offsetWidth;
  }

  // node_modules/.pnpm/swiper@12.1.2/node_modules/swiper/shared/swiper-core.mjs
  var support;
  function calcSupport() {
    const window2 = getWindow();
    const document2 = getDocument();
    return {
      smoothScroll: document2.documentElement && document2.documentElement.style && "scrollBehavior" in document2.documentElement.style,
      touch: !!("ontouchstart" in window2 || window2.DocumentTouch && document2 instanceof window2.DocumentTouch)
    };
  }
  function getSupport() {
    if (!support) {
      support = calcSupport();
    }
    return support;
  }
  var deviceCached;
  function calcDevice({
    userAgent
  } = {}) {
    const support2 = getSupport();
    const window2 = getWindow();
    const platform = window2.navigator.platform;
    const ua = userAgent || window2.navigator.userAgent;
    const device = {
      ios: false,
      android: false
    };
    const screenWidth = window2.screen.width;
    const screenHeight = window2.screen.height;
    const android = ua.match(/(Android);?[\s\/]+([\d.]+)?/);
    let ipad = ua.match(/(iPad)(?!\1).*OS\s([\d_]+)/);
    const ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/);
    const iphone = !ipad && ua.match(/(iPhone\sOS|iOS)\s([\d_]+)/);
    const windows = platform === "Win32";
    let macos = platform === "MacIntel";
    const iPadScreens = ["1024x1366", "1366x1024", "834x1194", "1194x834", "834x1112", "1112x834", "768x1024", "1024x768", "820x1180", "1180x820", "810x1080", "1080x810"];
    if (!ipad && macos && support2.touch && iPadScreens.indexOf(`${screenWidth}x${screenHeight}`) >= 0) {
      ipad = ua.match(/(Version)\/([\d.]+)/);
      if (!ipad) ipad = [0, 1, "13_0_0"];
      macos = false;
    }
    if (android && !windows) {
      device.os = "android";
      device.android = true;
    }
    if (ipad || iphone || ipod) {
      device.os = "ios";
      device.ios = true;
    }
    return device;
  }
  function getDevice(overrides = {}) {
    if (!deviceCached) {
      deviceCached = calcDevice(overrides);
    }
    return deviceCached;
  }
  var browser;
  function calcBrowser() {
    const window2 = getWindow();
    const device = getDevice();
    let needPerspectiveFix = false;
    function isSafari() {
      const ua = window2.navigator.userAgent.toLowerCase();
      return ua.indexOf("safari") >= 0 && ua.indexOf("chrome") < 0 && ua.indexOf("android") < 0;
    }
    if (isSafari()) {
      const ua = String(window2.navigator.userAgent);
      if (ua.includes("Version/")) {
        const [major, minor] = ua.split("Version/")[1].split(" ")[0].split(".").map((num) => Number(num));
        needPerspectiveFix = major < 16 || major === 16 && minor < 2;
      }
    }
    const isWebView = /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(window2.navigator.userAgent);
    const isSafariBrowser = isSafari();
    const need3dFix = isSafariBrowser || isWebView && device.ios;
    return {
      isSafari: needPerspectiveFix || isSafariBrowser,
      needPerspectiveFix,
      need3dFix,
      isWebView
    };
  }
  function getBrowser() {
    if (!browser) {
      browser = calcBrowser();
    }
    return browser;
  }
  function Resize({
    swiper,
    on,
    emit
  }) {
    const window2 = getWindow();
    let observer = null;
    let animationFrame = null;
    const resizeHandler = () => {
      if (!swiper || swiper.destroyed || !swiper.initialized) return;
      emit("beforeResize");
      emit("resize");
    };
    const createObserver = () => {
      if (!swiper || swiper.destroyed || !swiper.initialized) return;
      observer = new ResizeObserver((entries) => {
        animationFrame = window2.requestAnimationFrame(() => {
          const {
            width,
            height
          } = swiper;
          let newWidth = width;
          let newHeight = height;
          entries.forEach(({
            contentBoxSize,
            contentRect,
            target
          }) => {
            if (target && target !== swiper.el) return;
            newWidth = contentRect ? contentRect.width : (contentBoxSize[0] || contentBoxSize).inlineSize;
            newHeight = contentRect ? contentRect.height : (contentBoxSize[0] || contentBoxSize).blockSize;
          });
          if (newWidth !== width || newHeight !== height) {
            resizeHandler();
          }
        });
      });
      observer.observe(swiper.el);
    };
    const removeObserver = () => {
      if (animationFrame) {
        window2.cancelAnimationFrame(animationFrame);
      }
      if (observer && observer.unobserve && swiper.el) {
        observer.unobserve(swiper.el);
        observer = null;
      }
    };
    const orientationChangeHandler = () => {
      if (!swiper || swiper.destroyed || !swiper.initialized) return;
      emit("orientationchange");
    };
    on("init", () => {
      if (swiper.params.resizeObserver && typeof window2.ResizeObserver !== "undefined") {
        createObserver();
        return;
      }
      window2.addEventListener("resize", resizeHandler);
      window2.addEventListener("orientationchange", orientationChangeHandler);
    });
    on("destroy", () => {
      removeObserver();
      window2.removeEventListener("resize", resizeHandler);
      window2.removeEventListener("orientationchange", orientationChangeHandler);
    });
  }
  function Observer({
    swiper,
    extendParams,
    on,
    emit
  }) {
    const observers = [];
    const window2 = getWindow();
    const attach = (target, options = {}) => {
      const ObserverFunc = window2.MutationObserver || window2.WebkitMutationObserver;
      const observer = new ObserverFunc((mutations) => {
        if (swiper.__preventObserver__) return;
        if (mutations.length === 1) {
          emit("observerUpdate", mutations[0]);
          return;
        }
        const observerUpdate = function observerUpdate2() {
          emit("observerUpdate", mutations[0]);
        };
        if (window2.requestAnimationFrame) {
          window2.requestAnimationFrame(observerUpdate);
        } else {
          window2.setTimeout(observerUpdate, 0);
        }
      });
      observer.observe(target, {
        attributes: typeof options.attributes === "undefined" ? true : options.attributes,
        childList: swiper.isElement || (typeof options.childList === "undefined" ? true : options).childList,
        characterData: typeof options.characterData === "undefined" ? true : options.characterData
      });
      observers.push(observer);
    };
    const init = () => {
      if (!swiper.params.observer) return;
      if (swiper.params.observeParents) {
        const containerParents = elementParents(swiper.hostEl);
        for (let i = 0; i < containerParents.length; i += 1) {
          attach(containerParents[i]);
        }
      }
      attach(swiper.hostEl, {
        childList: swiper.params.observeSlideChildren
      });
      attach(swiper.wrapperEl, {
        attributes: false
      });
    };
    const destroy = () => {
      observers.forEach((observer) => {
        observer.disconnect();
      });
      observers.splice(0, observers.length);
    };
    extendParams({
      observer: false,
      observeParents: false,
      observeSlideChildren: false
    });
    on("init", init);
    on("destroy", destroy);
  }
  var eventsEmitter = {
    on(events2, handler, priority) {
      const self = this;
      if (!self.eventsListeners || self.destroyed) return self;
      if (typeof handler !== "function") return self;
      const method = priority ? "unshift" : "push";
      events2.split(" ").forEach((event2) => {
        if (!self.eventsListeners[event2]) self.eventsListeners[event2] = [];
        self.eventsListeners[event2][method](handler);
      });
      return self;
    },
    once(events2, handler, priority) {
      const self = this;
      if (!self.eventsListeners || self.destroyed) return self;
      if (typeof handler !== "function") return self;
      function onceHandler(...args) {
        self.off(events2, onceHandler);
        if (onceHandler.__emitterProxy) {
          delete onceHandler.__emitterProxy;
        }
        handler.apply(self, args);
      }
      onceHandler.__emitterProxy = handler;
      return self.on(events2, onceHandler, priority);
    },
    onAny(handler, priority) {
      const self = this;
      if (!self.eventsListeners || self.destroyed) return self;
      if (typeof handler !== "function") return self;
      const method = priority ? "unshift" : "push";
      if (self.eventsAnyListeners.indexOf(handler) < 0) {
        self.eventsAnyListeners[method](handler);
      }
      return self;
    },
    offAny(handler) {
      const self = this;
      if (!self.eventsListeners || self.destroyed) return self;
      if (!self.eventsAnyListeners) return self;
      const index = self.eventsAnyListeners.indexOf(handler);
      if (index >= 0) {
        self.eventsAnyListeners.splice(index, 1);
      }
      return self;
    },
    off(events2, handler) {
      const self = this;
      if (!self.eventsListeners || self.destroyed) return self;
      if (!self.eventsListeners) return self;
      events2.split(" ").forEach((event2) => {
        if (typeof handler === "undefined") {
          self.eventsListeners[event2] = [];
        } else if (self.eventsListeners[event2]) {
          self.eventsListeners[event2].forEach((eventHandler, index) => {
            if (eventHandler === handler || eventHandler.__emitterProxy && eventHandler.__emitterProxy === handler) {
              self.eventsListeners[event2].splice(index, 1);
            }
          });
        }
      });
      return self;
    },
    emit(...args) {
      const self = this;
      if (!self.eventsListeners || self.destroyed) return self;
      if (!self.eventsListeners) return self;
      let events2;
      let data;
      let context;
      if (typeof args[0] === "string" || Array.isArray(args[0])) {
        events2 = args[0];
        data = args.slice(1, args.length);
        context = self;
      } else {
        events2 = args[0].events;
        data = args[0].data;
        context = args[0].context || self;
      }
      data.unshift(context);
      const eventsArray = Array.isArray(events2) ? events2 : events2.split(" ");
      eventsArray.forEach((event2) => {
        if (self.eventsAnyListeners && self.eventsAnyListeners.length) {
          self.eventsAnyListeners.forEach((eventHandler) => {
            eventHandler.apply(context, [event2, ...data]);
          });
        }
        if (self.eventsListeners && self.eventsListeners[event2]) {
          self.eventsListeners[event2].forEach((eventHandler) => {
            eventHandler.apply(context, data);
          });
        }
      });
      return self;
    }
  };
  function updateSize() {
    const swiper = this;
    let width;
    let height;
    const el = swiper.el;
    if (typeof swiper.params.width !== "undefined" && swiper.params.width !== null) {
      width = swiper.params.width;
    } else {
      width = el.clientWidth;
    }
    if (typeof swiper.params.height !== "undefined" && swiper.params.height !== null) {
      height = swiper.params.height;
    } else {
      height = el.clientHeight;
    }
    if (width === 0 && swiper.isHorizontal() || height === 0 && swiper.isVertical()) {
      return;
    }
    width = width - parseInt(elementStyle(el, "padding-left") || 0, 10) - parseInt(elementStyle(el, "padding-right") || 0, 10);
    height = height - parseInt(elementStyle(el, "padding-top") || 0, 10) - parseInt(elementStyle(el, "padding-bottom") || 0, 10);
    if (Number.isNaN(width)) width = 0;
    if (Number.isNaN(height)) height = 0;
    Object.assign(swiper, {
      width,
      height,
      size: swiper.isHorizontal() ? width : height
    });
  }
  function updateSlides() {
    const swiper = this;
    function getDirectionPropertyValue(node, label) {
      return parseFloat(node.getPropertyValue(swiper.getDirectionLabel(label)) || 0);
    }
    const params = swiper.params;
    const {
      wrapperEl,
      slidesEl,
      rtlTranslate: rtl,
      wrongRTL
    } = swiper;
    const isVirtual = swiper.virtual && params.virtual.enabled;
    const previousSlidesLength = isVirtual ? swiper.virtual.slides.length : swiper.slides.length;
    const slides = elementChildren(slidesEl, `.${swiper.params.slideClass}, swiper-slide`);
    const slidesLength = isVirtual ? swiper.virtual.slides.length : slides.length;
    let snapGrid = [];
    const slidesGrid = [];
    const slidesSizesGrid = [];
    let offsetBefore = params.slidesOffsetBefore;
    if (typeof offsetBefore === "function") {
      offsetBefore = params.slidesOffsetBefore.call(swiper);
    }
    let offsetAfter = params.slidesOffsetAfter;
    if (typeof offsetAfter === "function") {
      offsetAfter = params.slidesOffsetAfter.call(swiper);
    }
    const previousSnapGridLength = swiper.snapGrid.length;
    const previousSlidesGridLength = swiper.slidesGrid.length;
    const swiperSize = swiper.size - offsetBefore - offsetAfter;
    let spaceBetween = params.spaceBetween;
    let slidePosition = -offsetBefore;
    let prevSlideSize = 0;
    let index = 0;
    if (typeof swiperSize === "undefined") {
      return;
    }
    if (typeof spaceBetween === "string" && spaceBetween.indexOf("%") >= 0) {
      spaceBetween = parseFloat(spaceBetween.replace("%", "")) / 100 * swiperSize;
    } else if (typeof spaceBetween === "string") {
      spaceBetween = parseFloat(spaceBetween);
    }
    swiper.virtualSize = -spaceBetween - offsetBefore - offsetAfter;
    slides.forEach((slideEl) => {
      if (rtl) {
        slideEl.style.marginLeft = "";
      } else {
        slideEl.style.marginRight = "";
      }
      slideEl.style.marginBottom = "";
      slideEl.style.marginTop = "";
    });
    if (params.centeredSlides && params.cssMode) {
      setCSSProperty(wrapperEl, "--swiper-centered-offset-before", "");
      setCSSProperty(wrapperEl, "--swiper-centered-offset-after", "");
    }
    if (params.cssMode) {
      setCSSProperty(wrapperEl, "--swiper-slides-offset-before", `${offsetBefore}px`);
      setCSSProperty(wrapperEl, "--swiper-slides-offset-after", `${offsetAfter}px`);
    }
    const gridEnabled = params.grid && params.grid.rows > 1 && swiper.grid;
    if (gridEnabled) {
      swiper.grid.initSlides(slides);
    } else if (swiper.grid) {
      swiper.grid.unsetSlides();
    }
    let slideSize;
    const shouldResetSlideSize = params.slidesPerView === "auto" && params.breakpoints && Object.keys(params.breakpoints).filter((key) => {
      return typeof params.breakpoints[key].slidesPerView !== "undefined";
    }).length > 0;
    for (let i = 0; i < slidesLength; i += 1) {
      slideSize = 0;
      const slide2 = slides[i];
      if (slide2) {
        if (gridEnabled) {
          swiper.grid.updateSlide(i, slide2, slides);
        }
        if (elementStyle(slide2, "display") === "none") continue;
      }
      if (isVirtual && params.slidesPerView === "auto") {
        if (params.virtual.slidesPerViewAutoSlideSize) {
          slideSize = params.virtual.slidesPerViewAutoSlideSize;
        }
        if (slideSize && slide2) {
          if (params.roundLengths) slideSize = Math.floor(slideSize);
          slide2.style[swiper.getDirectionLabel("width")] = `${slideSize}px`;
        }
      } else if (params.slidesPerView === "auto") {
        if (shouldResetSlideSize) {
          slide2.style[swiper.getDirectionLabel("width")] = ``;
        }
        const slideStyles = getComputedStyle(slide2);
        const currentTransform = slide2.style.transform;
        const currentWebKitTransform = slide2.style.webkitTransform;
        if (currentTransform) {
          slide2.style.transform = "none";
        }
        if (currentWebKitTransform) {
          slide2.style.webkitTransform = "none";
        }
        if (params.roundLengths) {
          slideSize = swiper.isHorizontal() ? elementOuterSize(slide2, "width", true) : elementOuterSize(slide2, "height", true);
        } else {
          const width = getDirectionPropertyValue(slideStyles, "width");
          const paddingLeft = getDirectionPropertyValue(slideStyles, "padding-left");
          const paddingRight = getDirectionPropertyValue(slideStyles, "padding-right");
          const marginLeft = getDirectionPropertyValue(slideStyles, "margin-left");
          const marginRight = getDirectionPropertyValue(slideStyles, "margin-right");
          const boxSizing = slideStyles.getPropertyValue("box-sizing");
          if (boxSizing && boxSizing === "border-box") {
            slideSize = width + marginLeft + marginRight;
          } else {
            const {
              clientWidth,
              offsetWidth
            } = slide2;
            slideSize = width + paddingLeft + paddingRight + marginLeft + marginRight + (offsetWidth - clientWidth);
          }
        }
        if (currentTransform) {
          slide2.style.transform = currentTransform;
        }
        if (currentWebKitTransform) {
          slide2.style.webkitTransform = currentWebKitTransform;
        }
        if (params.roundLengths) slideSize = Math.floor(slideSize);
      } else {
        slideSize = (swiperSize - (params.slidesPerView - 1) * spaceBetween) / params.slidesPerView;
        if (params.roundLengths) slideSize = Math.floor(slideSize);
        if (slide2) {
          slide2.style[swiper.getDirectionLabel("width")] = `${slideSize}px`;
        }
      }
      if (slide2) {
        slide2.swiperSlideSize = slideSize;
      }
      slidesSizesGrid.push(slideSize);
      if (params.centeredSlides) {
        slidePosition = slidePosition + slideSize / 2 + prevSlideSize / 2 + spaceBetween;
        if (prevSlideSize === 0 && i !== 0) slidePosition = slidePosition - swiperSize / 2 - spaceBetween;
        if (i === 0) slidePosition = slidePosition - swiperSize / 2 - spaceBetween;
        if (Math.abs(slidePosition) < 1 / 1e3) slidePosition = 0;
        if (params.roundLengths) slidePosition = Math.floor(slidePosition);
        if (index % params.slidesPerGroup === 0) snapGrid.push(slidePosition);
        slidesGrid.push(slidePosition);
      } else {
        if (params.roundLengths) slidePosition = Math.floor(slidePosition);
        if ((index - Math.min(swiper.params.slidesPerGroupSkip, index)) % swiper.params.slidesPerGroup === 0) snapGrid.push(slidePosition);
        slidesGrid.push(slidePosition);
        slidePosition = slidePosition + slideSize + spaceBetween;
      }
      swiper.virtualSize += slideSize + spaceBetween;
      prevSlideSize = slideSize;
      index += 1;
    }
    swiper.virtualSize = Math.max(swiper.virtualSize, swiperSize) + offsetAfter;
    if (rtl && wrongRTL && (params.effect === "slide" || params.effect === "coverflow")) {
      wrapperEl.style.width = `${swiper.virtualSize + spaceBetween}px`;
    }
    if (params.setWrapperSize) {
      wrapperEl.style[swiper.getDirectionLabel("width")] = `${swiper.virtualSize + spaceBetween}px`;
    }
    if (gridEnabled) {
      swiper.grid.updateWrapperSize(slideSize, snapGrid);
    }
    if (!params.centeredSlides) {
      const isFractionalSlidesPerView = params.slidesPerView !== "auto" && params.slidesPerView % 1 !== 0;
      const shouldSnapToSlideEdge = params.snapToSlideEdge && !params.loop && (params.slidesPerView === "auto" || isFractionalSlidesPerView);
      let lastAllowedSnapIndex = snapGrid.length;
      if (shouldSnapToSlideEdge) {
        let minVisibleSlides;
        if (params.slidesPerView === "auto") {
          minVisibleSlides = 1;
          let accumulatedSize = 0;
          for (let i = slidesSizesGrid.length - 1; i >= 0; i -= 1) {
            accumulatedSize += slidesSizesGrid[i] + (i < slidesSizesGrid.length - 1 ? spaceBetween : 0);
            if (accumulatedSize <= swiperSize) {
              minVisibleSlides = slidesSizesGrid.length - i;
            } else {
              break;
            }
          }
        } else {
          minVisibleSlides = Math.floor(params.slidesPerView);
        }
        lastAllowedSnapIndex = Math.max(slidesLength - minVisibleSlides, 0);
      }
      const newSlidesGrid = [];
      for (let i = 0; i < snapGrid.length; i += 1) {
        let slidesGridItem = snapGrid[i];
        if (params.roundLengths) slidesGridItem = Math.floor(slidesGridItem);
        if (shouldSnapToSlideEdge) {
          if (i <= lastAllowedSnapIndex) {
            newSlidesGrid.push(slidesGridItem);
          }
        } else if (snapGrid[i] <= swiper.virtualSize - swiperSize) {
          newSlidesGrid.push(slidesGridItem);
        }
      }
      snapGrid = newSlidesGrid;
      if (Math.floor(swiper.virtualSize - swiperSize) - Math.floor(snapGrid[snapGrid.length - 1]) > 1) {
        if (!shouldSnapToSlideEdge) {
          snapGrid.push(swiper.virtualSize - swiperSize);
        }
      }
    }
    if (isVirtual && params.loop) {
      const size = slidesSizesGrid[0] + spaceBetween;
      if (params.slidesPerGroup > 1) {
        const groups = Math.ceil((swiper.virtual.slidesBefore + swiper.virtual.slidesAfter) / params.slidesPerGroup);
        const groupSize = size * params.slidesPerGroup;
        for (let i = 0; i < groups; i += 1) {
          snapGrid.push(snapGrid[snapGrid.length - 1] + groupSize);
        }
      }
      for (let i = 0; i < swiper.virtual.slidesBefore + swiper.virtual.slidesAfter; i += 1) {
        if (params.slidesPerGroup === 1) {
          snapGrid.push(snapGrid[snapGrid.length - 1] + size);
        }
        slidesGrid.push(slidesGrid[slidesGrid.length - 1] + size);
        swiper.virtualSize += size;
      }
    }
    if (snapGrid.length === 0) snapGrid = [0];
    if (spaceBetween !== 0) {
      const key = swiper.isHorizontal() && rtl ? "marginLeft" : swiper.getDirectionLabel("marginRight");
      slides.filter((_, slideIndex) => {
        if (!params.cssMode || params.loop) return true;
        if (slideIndex === slides.length - 1) {
          return false;
        }
        return true;
      }).forEach((slideEl) => {
        slideEl.style[key] = `${spaceBetween}px`;
      });
    }
    if (params.centeredSlides && params.centeredSlidesBounds) {
      let allSlidesSize = 0;
      slidesSizesGrid.forEach((slideSizeValue) => {
        allSlidesSize += slideSizeValue + (spaceBetween || 0);
      });
      allSlidesSize -= spaceBetween;
      const maxSnap = allSlidesSize > swiperSize ? allSlidesSize - swiperSize : 0;
      snapGrid = snapGrid.map((snap) => {
        if (snap <= 0) return -offsetBefore;
        if (snap > maxSnap) return maxSnap + offsetAfter;
        return snap;
      });
    }
    if (params.centerInsufficientSlides) {
      let allSlidesSize = 0;
      slidesSizesGrid.forEach((slideSizeValue) => {
        allSlidesSize += slideSizeValue + (spaceBetween || 0);
      });
      allSlidesSize -= spaceBetween;
      if (allSlidesSize < swiperSize) {
        const allSlidesOffset = (swiperSize - allSlidesSize) / 2;
        snapGrid.forEach((snap, snapIndex) => {
          snapGrid[snapIndex] = snap - allSlidesOffset;
        });
        slidesGrid.forEach((snap, snapIndex) => {
          slidesGrid[snapIndex] = snap + allSlidesOffset;
        });
      }
    }
    Object.assign(swiper, {
      slides,
      snapGrid,
      slidesGrid,
      slidesSizesGrid
    });
    if (params.centeredSlides && params.cssMode && !params.centeredSlidesBounds) {
      setCSSProperty(wrapperEl, "--swiper-centered-offset-before", `${-snapGrid[0]}px`);
      setCSSProperty(wrapperEl, "--swiper-centered-offset-after", `${swiper.size / 2 - slidesSizesGrid[slidesSizesGrid.length - 1] / 2}px`);
      const addToSnapGrid = -swiper.snapGrid[0];
      const addToSlidesGrid = -swiper.slidesGrid[0];
      swiper.snapGrid = swiper.snapGrid.map((v) => v + addToSnapGrid);
      swiper.slidesGrid = swiper.slidesGrid.map((v) => v + addToSlidesGrid);
    }
    if (slidesLength !== previousSlidesLength) {
      swiper.emit("slidesLengthChange");
    }
    if (snapGrid.length !== previousSnapGridLength) {
      if (swiper.params.watchOverflow) swiper.checkOverflow();
      swiper.emit("snapGridLengthChange");
    }
    if (slidesGrid.length !== previousSlidesGridLength) {
      swiper.emit("slidesGridLengthChange");
    }
    if (params.watchSlidesProgress) {
      swiper.updateSlidesOffset();
    }
    swiper.emit("slidesUpdated");
    if (!isVirtual && !params.cssMode && (params.effect === "slide" || params.effect === "fade")) {
      const backFaceHiddenClass = `${params.containerModifierClass}backface-hidden`;
      const hasClassBackfaceClassAdded = swiper.el.classList.contains(backFaceHiddenClass);
      if (slidesLength <= params.maxBackfaceHiddenSlides) {
        if (!hasClassBackfaceClassAdded) swiper.el.classList.add(backFaceHiddenClass);
      } else if (hasClassBackfaceClassAdded) {
        swiper.el.classList.remove(backFaceHiddenClass);
      }
    }
  }
  function updateAutoHeight(speed) {
    const swiper = this;
    const activeSlides = [];
    const isVirtual = swiper.virtual && swiper.params.virtual.enabled;
    let newHeight = 0;
    let i;
    if (typeof speed === "number") {
      swiper.setTransition(speed);
    } else if (speed === true) {
      swiper.setTransition(swiper.params.speed);
    }
    const getSlideByIndex = (index) => {
      if (isVirtual) {
        return swiper.slides[swiper.getSlideIndexByData(index)];
      }
      return swiper.slides[index];
    };
    if (swiper.params.slidesPerView !== "auto" && swiper.params.slidesPerView > 1) {
      if (swiper.params.centeredSlides) {
        (swiper.visibleSlides || []).forEach((slide2) => {
          activeSlides.push(slide2);
        });
      } else {
        for (i = 0; i < Math.ceil(swiper.params.slidesPerView); i += 1) {
          const index = swiper.activeIndex + i;
          if (index > swiper.slides.length && !isVirtual) break;
          activeSlides.push(getSlideByIndex(index));
        }
      }
    } else {
      activeSlides.push(getSlideByIndex(swiper.activeIndex));
    }
    for (i = 0; i < activeSlides.length; i += 1) {
      if (typeof activeSlides[i] !== "undefined") {
        const height = activeSlides[i].offsetHeight;
        newHeight = height > newHeight ? height : newHeight;
      }
    }
    if (newHeight || newHeight === 0) swiper.wrapperEl.style.height = `${newHeight}px`;
  }
  function updateSlidesOffset() {
    const swiper = this;
    const slides = swiper.slides;
    const minusOffset = swiper.isElement ? swiper.isHorizontal() ? swiper.wrapperEl.offsetLeft : swiper.wrapperEl.offsetTop : 0;
    for (let i = 0; i < slides.length; i += 1) {
      slides[i].swiperSlideOffset = (swiper.isHorizontal() ? slides[i].offsetLeft : slides[i].offsetTop) - minusOffset - swiper.cssOverflowAdjustment();
    }
  }
  var toggleSlideClasses$1 = (slideEl, condition, className) => {
    if (condition && !slideEl.classList.contains(className)) {
      slideEl.classList.add(className);
    } else if (!condition && slideEl.classList.contains(className)) {
      slideEl.classList.remove(className);
    }
  };
  function updateSlidesProgress(translate2 = this && this.translate || 0) {
    const swiper = this;
    const params = swiper.params;
    const {
      slides,
      rtlTranslate: rtl,
      snapGrid
    } = swiper;
    if (slides.length === 0) return;
    if (typeof slides[0].swiperSlideOffset === "undefined") swiper.updateSlidesOffset();
    let offsetCenter = -translate2;
    if (rtl) offsetCenter = translate2;
    swiper.visibleSlidesIndexes = [];
    swiper.visibleSlides = [];
    let spaceBetween = params.spaceBetween;
    if (typeof spaceBetween === "string" && spaceBetween.indexOf("%") >= 0) {
      spaceBetween = parseFloat(spaceBetween.replace("%", "")) / 100 * swiper.size;
    } else if (typeof spaceBetween === "string") {
      spaceBetween = parseFloat(spaceBetween);
    }
    for (let i = 0; i < slides.length; i += 1) {
      const slide2 = slides[i];
      let slideOffset = slide2.swiperSlideOffset;
      if (params.cssMode && params.centeredSlides) {
        slideOffset -= slides[0].swiperSlideOffset;
      }
      const slideProgress = (offsetCenter + (params.centeredSlides ? swiper.minTranslate() : 0) - slideOffset) / (slide2.swiperSlideSize + spaceBetween);
      const originalSlideProgress = (offsetCenter - snapGrid[0] + (params.centeredSlides ? swiper.minTranslate() : 0) - slideOffset) / (slide2.swiperSlideSize + spaceBetween);
      const slideBefore = -(offsetCenter - slideOffset);
      const slideAfter = slideBefore + swiper.slidesSizesGrid[i];
      const isFullyVisible = slideBefore >= 0 && slideBefore <= swiper.size - swiper.slidesSizesGrid[i];
      const isVisible = slideBefore >= 0 && slideBefore < swiper.size - 1 || slideAfter > 1 && slideAfter <= swiper.size || slideBefore <= 0 && slideAfter >= swiper.size;
      if (isVisible) {
        swiper.visibleSlides.push(slide2);
        swiper.visibleSlidesIndexes.push(i);
      }
      toggleSlideClasses$1(slide2, isVisible, params.slideVisibleClass);
      toggleSlideClasses$1(slide2, isFullyVisible, params.slideFullyVisibleClass);
      slide2.progress = rtl ? -slideProgress : slideProgress;
      slide2.originalProgress = rtl ? -originalSlideProgress : originalSlideProgress;
    }
  }
  function updateProgress(translate2) {
    const swiper = this;
    if (typeof translate2 === "undefined") {
      const multiplier = swiper.rtlTranslate ? -1 : 1;
      translate2 = swiper && swiper.translate && swiper.translate * multiplier || 0;
    }
    const params = swiper.params;
    const translatesDiff = swiper.maxTranslate() - swiper.minTranslate();
    let {
      progress,
      isBeginning,
      isEnd,
      progressLoop
    } = swiper;
    const wasBeginning = isBeginning;
    const wasEnd = isEnd;
    if (translatesDiff === 0) {
      progress = 0;
      isBeginning = true;
      isEnd = true;
    } else {
      progress = (translate2 - swiper.minTranslate()) / translatesDiff;
      const isBeginningRounded = Math.abs(translate2 - swiper.minTranslate()) < 1;
      const isEndRounded = Math.abs(translate2 - swiper.maxTranslate()) < 1;
      isBeginning = isBeginningRounded || progress <= 0;
      isEnd = isEndRounded || progress >= 1;
      if (isBeginningRounded) progress = 0;
      if (isEndRounded) progress = 1;
    }
    if (params.loop) {
      const firstSlideIndex = swiper.getSlideIndexByData(0);
      const lastSlideIndex = swiper.getSlideIndexByData(swiper.slides.length - 1);
      const firstSlideTranslate = swiper.slidesGrid[firstSlideIndex];
      const lastSlideTranslate = swiper.slidesGrid[lastSlideIndex];
      const translateMax = swiper.slidesGrid[swiper.slidesGrid.length - 1];
      const translateAbs = Math.abs(translate2);
      if (translateAbs >= firstSlideTranslate) {
        progressLoop = (translateAbs - firstSlideTranslate) / translateMax;
      } else {
        progressLoop = (translateAbs + translateMax - lastSlideTranslate) / translateMax;
      }
      if (progressLoop > 1) progressLoop -= 1;
    }
    Object.assign(swiper, {
      progress,
      progressLoop,
      isBeginning,
      isEnd
    });
    if (params.watchSlidesProgress || params.centeredSlides && params.autoHeight) swiper.updateSlidesProgress(translate2);
    if (isBeginning && !wasBeginning) {
      swiper.emit("reachBeginning toEdge");
    }
    if (isEnd && !wasEnd) {
      swiper.emit("reachEnd toEdge");
    }
    if (wasBeginning && !isBeginning || wasEnd && !isEnd) {
      swiper.emit("fromEdge");
    }
    swiper.emit("progress", progress);
  }
  var toggleSlideClasses = (slideEl, condition, className) => {
    if (condition && !slideEl.classList.contains(className)) {
      slideEl.classList.add(className);
    } else if (!condition && slideEl.classList.contains(className)) {
      slideEl.classList.remove(className);
    }
  };
  function updateSlidesClasses() {
    const swiper = this;
    const {
      slides,
      params,
      slidesEl,
      activeIndex
    } = swiper;
    const isVirtual = swiper.virtual && params.virtual.enabled;
    const gridEnabled = swiper.grid && params.grid && params.grid.rows > 1;
    const getFilteredSlide = (selector) => {
      return elementChildren(slidesEl, `.${params.slideClass}${selector}, swiper-slide${selector}`)[0];
    };
    let activeSlide;
    let prevSlide;
    let nextSlide;
    if (isVirtual) {
      if (params.loop) {
        let slideIndex = activeIndex - swiper.virtual.slidesBefore;
        if (slideIndex < 0) slideIndex = swiper.virtual.slides.length + slideIndex;
        if (slideIndex >= swiper.virtual.slides.length) slideIndex -= swiper.virtual.slides.length;
        activeSlide = getFilteredSlide(`[data-swiper-slide-index="${slideIndex}"]`);
      } else {
        activeSlide = getFilteredSlide(`[data-swiper-slide-index="${activeIndex}"]`);
      }
    } else {
      if (gridEnabled) {
        activeSlide = slides.find((slideEl) => slideEl.column === activeIndex);
        nextSlide = slides.find((slideEl) => slideEl.column === activeIndex + 1);
        prevSlide = slides.find((slideEl) => slideEl.column === activeIndex - 1);
      } else {
        activeSlide = slides[activeIndex];
      }
    }
    if (activeSlide) {
      if (!gridEnabled) {
        nextSlide = elementNextAll(activeSlide, `.${params.slideClass}, swiper-slide`)[0];
        if (params.loop && !nextSlide) {
          nextSlide = slides[0];
        }
        prevSlide = elementPrevAll(activeSlide, `.${params.slideClass}, swiper-slide`)[0];
        if (params.loop && !prevSlide === 0) {
          prevSlide = slides[slides.length - 1];
        }
      }
    }
    slides.forEach((slideEl) => {
      toggleSlideClasses(slideEl, slideEl === activeSlide, params.slideActiveClass);
      toggleSlideClasses(slideEl, slideEl === nextSlide, params.slideNextClass);
      toggleSlideClasses(slideEl, slideEl === prevSlide, params.slidePrevClass);
    });
    swiper.emitSlidesClasses();
  }
  var processLazyPreloader = (swiper, imageEl) => {
    if (!swiper || swiper.destroyed || !swiper.params) return;
    const slideSelector = () => swiper.isElement ? `swiper-slide` : `.${swiper.params.slideClass}`;
    const slideEl = imageEl.closest(slideSelector());
    if (slideEl) {
      let lazyEl = slideEl.querySelector(`.${swiper.params.lazyPreloaderClass}`);
      if (!lazyEl && swiper.isElement) {
        if (slideEl.shadowRoot) {
          lazyEl = slideEl.shadowRoot.querySelector(`.${swiper.params.lazyPreloaderClass}`);
        } else {
          requestAnimationFrame(() => {
            if (slideEl.shadowRoot) {
              lazyEl = slideEl.shadowRoot.querySelector(`.${swiper.params.lazyPreloaderClass}`);
              if (lazyEl && !lazyEl.lazyPreloaderManaged) lazyEl.remove();
            }
          });
        }
      }
      if (lazyEl && !lazyEl.lazyPreloaderManaged) lazyEl.remove();
    }
  };
  var unlazy = (swiper, index) => {
    if (!swiper.slides[index]) return;
    const imageEl = swiper.slides[index].querySelector('[loading="lazy"]');
    if (imageEl) imageEl.removeAttribute("loading");
  };
  var preload = (swiper) => {
    if (!swiper || swiper.destroyed || !swiper.params) return;
    let amount = swiper.params.lazyPreloadPrevNext;
    const len = swiper.slides.length;
    if (!len || !amount || amount < 0) return;
    amount = Math.min(amount, len);
    const slidesPerView = swiper.params.slidesPerView === "auto" ? swiper.slidesPerViewDynamic() : Math.ceil(swiper.params.slidesPerView);
    const activeIndex = swiper.activeIndex;
    if (swiper.params.grid && swiper.params.grid.rows > 1) {
      const activeColumn = activeIndex;
      const preloadColumns = [activeColumn - amount];
      preloadColumns.push(...Array.from({
        length: amount
      }).map((_, i) => {
        return activeColumn + slidesPerView + i;
      }));
      swiper.slides.forEach((slideEl, i) => {
        if (preloadColumns.includes(slideEl.column)) unlazy(swiper, i);
      });
      return;
    }
    const slideIndexLastInView = activeIndex + slidesPerView - 1;
    if (swiper.params.rewind || swiper.params.loop) {
      for (let i = activeIndex - amount; i <= slideIndexLastInView + amount; i += 1) {
        const realIndex = (i % len + len) % len;
        if (realIndex < activeIndex || realIndex > slideIndexLastInView) unlazy(swiper, realIndex);
      }
    } else {
      for (let i = Math.max(activeIndex - amount, 0); i <= Math.min(slideIndexLastInView + amount, len - 1); i += 1) {
        if (i !== activeIndex && (i > slideIndexLastInView || i < activeIndex)) {
          unlazy(swiper, i);
        }
      }
    }
  };
  function getActiveIndexByTranslate(swiper) {
    const {
      slidesGrid,
      params
    } = swiper;
    const translate2 = swiper.rtlTranslate ? swiper.translate : -swiper.translate;
    let activeIndex;
    for (let i = 0; i < slidesGrid.length; i += 1) {
      if (typeof slidesGrid[i + 1] !== "undefined") {
        if (translate2 >= slidesGrid[i] && translate2 < slidesGrid[i + 1] - (slidesGrid[i + 1] - slidesGrid[i]) / 2) {
          activeIndex = i;
        } else if (translate2 >= slidesGrid[i] && translate2 < slidesGrid[i + 1]) {
          activeIndex = i + 1;
        }
      } else if (translate2 >= slidesGrid[i]) {
        activeIndex = i;
      }
    }
    if (params.normalizeSlideIndex) {
      if (activeIndex < 0 || typeof activeIndex === "undefined") activeIndex = 0;
    }
    return activeIndex;
  }
  function updateActiveIndex(newActiveIndex) {
    const swiper = this;
    const translate2 = swiper.rtlTranslate ? swiper.translate : -swiper.translate;
    const {
      snapGrid,
      params,
      activeIndex: previousIndex,
      realIndex: previousRealIndex,
      snapIndex: previousSnapIndex
    } = swiper;
    let activeIndex = newActiveIndex;
    let snapIndex;
    const getVirtualRealIndex = (aIndex) => {
      let realIndex2 = aIndex - swiper.virtual.slidesBefore;
      if (realIndex2 < 0) {
        realIndex2 = swiper.virtual.slides.length + realIndex2;
      }
      if (realIndex2 >= swiper.virtual.slides.length) {
        realIndex2 -= swiper.virtual.slides.length;
      }
      return realIndex2;
    };
    if (typeof activeIndex === "undefined") {
      activeIndex = getActiveIndexByTranslate(swiper);
    }
    if (snapGrid.indexOf(translate2) >= 0) {
      snapIndex = snapGrid.indexOf(translate2);
    } else {
      const skip = Math.min(params.slidesPerGroupSkip, activeIndex);
      snapIndex = skip + Math.floor((activeIndex - skip) / params.slidesPerGroup);
    }
    if (snapIndex >= snapGrid.length) snapIndex = snapGrid.length - 1;
    if (activeIndex === previousIndex && !swiper.params.loop) {
      if (snapIndex !== previousSnapIndex) {
        swiper.snapIndex = snapIndex;
        swiper.emit("snapIndexChange");
      }
      return;
    }
    if (activeIndex === previousIndex && swiper.params.loop && swiper.virtual && swiper.params.virtual.enabled) {
      swiper.realIndex = getVirtualRealIndex(activeIndex);
      return;
    }
    const gridEnabled = swiper.grid && params.grid && params.grid.rows > 1;
    let realIndex;
    if (swiper.virtual && params.virtual.enabled) {
      if (params.loop) {
        realIndex = getVirtualRealIndex(activeIndex);
      } else {
        realIndex = activeIndex;
      }
    } else if (gridEnabled) {
      const firstSlideInColumn = swiper.slides.find((slideEl) => slideEl.column === activeIndex);
      let activeSlideIndex = parseInt(firstSlideInColumn.getAttribute("data-swiper-slide-index"), 10);
      if (Number.isNaN(activeSlideIndex)) {
        activeSlideIndex = Math.max(swiper.slides.indexOf(firstSlideInColumn), 0);
      }
      realIndex = Math.floor(activeSlideIndex / params.grid.rows);
    } else if (swiper.slides[activeIndex]) {
      const slideIndex = swiper.slides[activeIndex].getAttribute("data-swiper-slide-index");
      if (slideIndex) {
        realIndex = parseInt(slideIndex, 10);
      } else {
        realIndex = activeIndex;
      }
    } else {
      realIndex = activeIndex;
    }
    Object.assign(swiper, {
      previousSnapIndex,
      snapIndex,
      previousRealIndex,
      realIndex,
      previousIndex,
      activeIndex
    });
    if (swiper.initialized) {
      preload(swiper);
    }
    swiper.emit("activeIndexChange");
    swiper.emit("snapIndexChange");
    if (swiper.initialized || swiper.params.runCallbacksOnInit) {
      if (previousRealIndex !== realIndex) {
        swiper.emit("realIndexChange");
      }
      swiper.emit("slideChange");
    }
  }
  function updateClickedSlide(el, path) {
    const swiper = this;
    const params = swiper.params;
    let slide2 = el.closest(`.${params.slideClass}, swiper-slide`);
    if (!slide2 && swiper.isElement && path && path.length > 1 && path.includes(el)) {
      [...path.slice(path.indexOf(el) + 1, path.length)].forEach((pathEl) => {
        if (!slide2 && pathEl.matches && pathEl.matches(`.${params.slideClass}, swiper-slide`)) {
          slide2 = pathEl;
        }
      });
    }
    let slideFound = false;
    let slideIndex;
    if (slide2) {
      for (let i = 0; i < swiper.slides.length; i += 1) {
        if (swiper.slides[i] === slide2) {
          slideFound = true;
          slideIndex = i;
          break;
        }
      }
    }
    if (slide2 && slideFound) {
      swiper.clickedSlide = slide2;
      if (swiper.virtual && swiper.params.virtual.enabled) {
        swiper.clickedIndex = parseInt(slide2.getAttribute("data-swiper-slide-index"), 10);
      } else {
        swiper.clickedIndex = slideIndex;
      }
    } else {
      swiper.clickedSlide = void 0;
      swiper.clickedIndex = void 0;
      return;
    }
    if (params.slideToClickedSlide && swiper.clickedIndex !== void 0 && swiper.clickedIndex !== swiper.activeIndex) {
      swiper.slideToClickedSlide();
    }
  }
  var update = {
    updateSize,
    updateSlides,
    updateAutoHeight,
    updateSlidesOffset,
    updateSlidesProgress,
    updateProgress,
    updateSlidesClasses,
    updateActiveIndex,
    updateClickedSlide
  };
  function getSwiperTranslate(axis = this.isHorizontal() ? "x" : "y") {
    const swiper = this;
    const {
      params,
      rtlTranslate: rtl,
      translate: translate2,
      wrapperEl
    } = swiper;
    if (params.virtualTranslate) {
      return rtl ? -translate2 : translate2;
    }
    if (params.cssMode) {
      return translate2;
    }
    let currentTranslate = getTranslate(wrapperEl, axis);
    currentTranslate += swiper.cssOverflowAdjustment();
    if (rtl) currentTranslate = -currentTranslate;
    return currentTranslate || 0;
  }
  function setTranslate(translate2, byController) {
    const swiper = this;
    const {
      rtlTranslate: rtl,
      params,
      wrapperEl,
      progress
    } = swiper;
    let x = 0;
    let y = 0;
    const z = 0;
    if (swiper.isHorizontal()) {
      x = rtl ? -translate2 : translate2;
    } else {
      y = translate2;
    }
    if (params.roundLengths) {
      x = Math.floor(x);
      y = Math.floor(y);
    }
    swiper.previousTranslate = swiper.translate;
    swiper.translate = swiper.isHorizontal() ? x : y;
    if (params.cssMode) {
      wrapperEl[swiper.isHorizontal() ? "scrollLeft" : "scrollTop"] = swiper.isHorizontal() ? -x : -y;
    } else if (!params.virtualTranslate) {
      if (swiper.isHorizontal()) {
        x -= swiper.cssOverflowAdjustment();
      } else {
        y -= swiper.cssOverflowAdjustment();
      }
      wrapperEl.style.transform = `translate3d(${x}px, ${y}px, ${z}px)`;
    }
    let newProgress;
    const translatesDiff = swiper.maxTranslate() - swiper.minTranslate();
    if (translatesDiff === 0) {
      newProgress = 0;
    } else {
      newProgress = (translate2 - swiper.minTranslate()) / translatesDiff;
    }
    if (newProgress !== progress) {
      swiper.updateProgress(translate2);
    }
    swiper.emit("setTranslate", swiper.translate, byController);
  }
  function minTranslate() {
    return -this.snapGrid[0];
  }
  function maxTranslate() {
    return -this.snapGrid[this.snapGrid.length - 1];
  }
  function translateTo(translate2 = 0, speed = this.params.speed, runCallbacks = true, translateBounds = true, internal) {
    const swiper = this;
    const {
      params,
      wrapperEl
    } = swiper;
    if (swiper.animating && params.preventInteractionOnTransition) {
      return false;
    }
    const minTranslate2 = swiper.minTranslate();
    const maxTranslate2 = swiper.maxTranslate();
    let newTranslate;
    if (translateBounds && translate2 > minTranslate2) newTranslate = minTranslate2;
    else if (translateBounds && translate2 < maxTranslate2) newTranslate = maxTranslate2;
    else newTranslate = translate2;
    swiper.updateProgress(newTranslate);
    if (params.cssMode) {
      const isH = swiper.isHorizontal();
      if (speed === 0) {
        wrapperEl[isH ? "scrollLeft" : "scrollTop"] = -newTranslate;
      } else {
        if (!swiper.support.smoothScroll) {
          animateCSSModeScroll({
            swiper,
            targetPosition: -newTranslate,
            side: isH ? "left" : "top"
          });
          return true;
        }
        wrapperEl.scrollTo({
          [isH ? "left" : "top"]: -newTranslate,
          behavior: "smooth"
        });
      }
      return true;
    }
    if (speed === 0) {
      swiper.setTransition(0);
      swiper.setTranslate(newTranslate);
      if (runCallbacks) {
        swiper.emit("beforeTransitionStart", speed, internal);
        swiper.emit("transitionEnd");
      }
    } else {
      swiper.setTransition(speed);
      swiper.setTranslate(newTranslate);
      if (runCallbacks) {
        swiper.emit("beforeTransitionStart", speed, internal);
        swiper.emit("transitionStart");
      }
      if (!swiper.animating) {
        swiper.animating = true;
        if (!swiper.onTranslateToWrapperTransitionEnd) {
          swiper.onTranslateToWrapperTransitionEnd = function transitionEnd2(e) {
            if (!swiper || swiper.destroyed) return;
            if (e.target !== this) return;
            swiper.wrapperEl.removeEventListener("transitionend", swiper.onTranslateToWrapperTransitionEnd);
            swiper.onTranslateToWrapperTransitionEnd = null;
            delete swiper.onTranslateToWrapperTransitionEnd;
            swiper.animating = false;
            if (runCallbacks) {
              swiper.emit("transitionEnd");
            }
          };
        }
        swiper.wrapperEl.addEventListener("transitionend", swiper.onTranslateToWrapperTransitionEnd);
      }
    }
    return true;
  }
  var translate = {
    getTranslate: getSwiperTranslate,
    setTranslate,
    minTranslate,
    maxTranslate,
    translateTo
  };
  function setTransition(duration, byController) {
    const swiper = this;
    if (!swiper.params.cssMode) {
      swiper.wrapperEl.style.transitionDuration = `${duration}ms`;
      swiper.wrapperEl.style.transitionDelay = duration === 0 ? `0ms` : "";
    }
    swiper.emit("setTransition", duration, byController);
  }
  function transitionEmit({
    swiper,
    runCallbacks,
    direction,
    step
  }) {
    const {
      activeIndex,
      previousIndex
    } = swiper;
    let dir = direction;
    if (!dir) {
      if (activeIndex > previousIndex) dir = "next";
      else if (activeIndex < previousIndex) dir = "prev";
      else dir = "reset";
    }
    swiper.emit(`transition${step}`);
    if (runCallbacks && dir === "reset") {
      swiper.emit(`slideResetTransition${step}`);
    } else if (runCallbacks && activeIndex !== previousIndex) {
      swiper.emit(`slideChangeTransition${step}`);
      if (dir === "next") {
        swiper.emit(`slideNextTransition${step}`);
      } else {
        swiper.emit(`slidePrevTransition${step}`);
      }
    }
  }
  function transitionStart(runCallbacks = true, direction) {
    const swiper = this;
    const {
      params
    } = swiper;
    if (params.cssMode) return;
    if (params.autoHeight) {
      swiper.updateAutoHeight();
    }
    transitionEmit({
      swiper,
      runCallbacks,
      direction,
      step: "Start"
    });
  }
  function transitionEnd(runCallbacks = true, direction) {
    const swiper = this;
    const {
      params
    } = swiper;
    swiper.animating = false;
    if (params.cssMode) return;
    swiper.setTransition(0);
    transitionEmit({
      swiper,
      runCallbacks,
      direction,
      step: "End"
    });
  }
  var transition = {
    setTransition,
    transitionStart,
    transitionEnd
  };
  function slideTo(index = 0, speed, runCallbacks = true, internal, initial) {
    if (typeof index === "string") {
      index = parseInt(index, 10);
    }
    const swiper = this;
    let slideIndex = index;
    if (slideIndex < 0) slideIndex = 0;
    const {
      params,
      snapGrid,
      slidesGrid,
      previousIndex,
      activeIndex,
      rtlTranslate: rtl,
      wrapperEl,
      enabled
    } = swiper;
    if (!enabled && !internal && !initial || swiper.destroyed || swiper.animating && params.preventInteractionOnTransition) {
      return false;
    }
    if (typeof speed === "undefined") {
      speed = swiper.params.speed;
    }
    const skip = Math.min(swiper.params.slidesPerGroupSkip, slideIndex);
    let snapIndex = skip + Math.floor((slideIndex - skip) / swiper.params.slidesPerGroup);
    if (snapIndex >= snapGrid.length) snapIndex = snapGrid.length - 1;
    const translate2 = -snapGrid[snapIndex];
    if (params.normalizeSlideIndex) {
      for (let i = 0; i < slidesGrid.length; i += 1) {
        const normalizedTranslate = -Math.floor(translate2 * 100);
        const normalizedGrid = Math.floor(slidesGrid[i] * 100);
        const normalizedGridNext = Math.floor(slidesGrid[i + 1] * 100);
        if (typeof slidesGrid[i + 1] !== "undefined") {
          if (normalizedTranslate >= normalizedGrid && normalizedTranslate < normalizedGridNext - (normalizedGridNext - normalizedGrid) / 2) {
            slideIndex = i;
          } else if (normalizedTranslate >= normalizedGrid && normalizedTranslate < normalizedGridNext) {
            slideIndex = i + 1;
          }
        } else if (normalizedTranslate >= normalizedGrid) {
          slideIndex = i;
        }
      }
    }
    if (swiper.initialized && slideIndex !== activeIndex) {
      if (!swiper.allowSlideNext && (rtl ? translate2 > swiper.translate && translate2 > swiper.minTranslate() : translate2 < swiper.translate && translate2 < swiper.minTranslate())) {
        return false;
      }
      if (!swiper.allowSlidePrev && translate2 > swiper.translate && translate2 > swiper.maxTranslate()) {
        if ((activeIndex || 0) !== slideIndex) {
          return false;
        }
      }
    }
    if (slideIndex !== (previousIndex || 0) && runCallbacks) {
      swiper.emit("beforeSlideChangeStart");
    }
    swiper.updateProgress(translate2);
    let direction;
    if (slideIndex > activeIndex) direction = "next";
    else if (slideIndex < activeIndex) direction = "prev";
    else direction = "reset";
    const isVirtual = swiper.virtual && swiper.params.virtual.enabled;
    const isInitialVirtual = isVirtual && initial;
    if (!isInitialVirtual && (rtl && -translate2 === swiper.translate || !rtl && translate2 === swiper.translate)) {
      swiper.updateActiveIndex(slideIndex);
      if (params.autoHeight) {
        swiper.updateAutoHeight();
      }
      swiper.updateSlidesClasses();
      if (params.effect !== "slide") {
        swiper.setTranslate(translate2);
      }
      if (direction !== "reset") {
        swiper.transitionStart(runCallbacks, direction);
        swiper.transitionEnd(runCallbacks, direction);
      }
      return false;
    }
    if (params.cssMode) {
      const isH = swiper.isHorizontal();
      const t = rtl ? translate2 : -translate2;
      if (speed === 0) {
        if (isVirtual) {
          swiper.wrapperEl.style.scrollSnapType = "none";
          swiper._immediateVirtual = true;
        }
        if (isVirtual && !swiper._cssModeVirtualInitialSet && swiper.params.initialSlide > 0) {
          swiper._cssModeVirtualInitialSet = true;
          requestAnimationFrame(() => {
            wrapperEl[isH ? "scrollLeft" : "scrollTop"] = t;
          });
        } else {
          wrapperEl[isH ? "scrollLeft" : "scrollTop"] = t;
        }
        if (isVirtual) {
          requestAnimationFrame(() => {
            swiper.wrapperEl.style.scrollSnapType = "";
            swiper._immediateVirtual = false;
          });
        }
      } else {
        if (!swiper.support.smoothScroll) {
          animateCSSModeScroll({
            swiper,
            targetPosition: t,
            side: isH ? "left" : "top"
          });
          return true;
        }
        wrapperEl.scrollTo({
          [isH ? "left" : "top"]: t,
          behavior: "smooth"
        });
      }
      return true;
    }
    const browser2 = getBrowser();
    const isSafari = browser2.isSafari;
    if (isVirtual && !initial && isSafari && swiper.isElement) {
      swiper.virtual.update(false, false, slideIndex);
    }
    swiper.setTransition(speed);
    swiper.setTranslate(translate2);
    swiper.updateActiveIndex(slideIndex);
    swiper.updateSlidesClasses();
    swiper.emit("beforeTransitionStart", speed, internal);
    swiper.transitionStart(runCallbacks, direction);
    if (speed === 0) {
      swiper.transitionEnd(runCallbacks, direction);
    } else if (!swiper.animating) {
      swiper.animating = true;
      if (!swiper.onSlideToWrapperTransitionEnd) {
        swiper.onSlideToWrapperTransitionEnd = function transitionEnd2(e) {
          if (!swiper || swiper.destroyed) return;
          if (e.target !== this) return;
          swiper.wrapperEl.removeEventListener("transitionend", swiper.onSlideToWrapperTransitionEnd);
          swiper.onSlideToWrapperTransitionEnd = null;
          delete swiper.onSlideToWrapperTransitionEnd;
          swiper.transitionEnd(runCallbacks, direction);
        };
      }
      swiper.wrapperEl.addEventListener("transitionend", swiper.onSlideToWrapperTransitionEnd);
    }
    return true;
  }
  function slideToLoop(index = 0, speed, runCallbacks = true, internal) {
    if (typeof index === "string") {
      const indexAsNumber = parseInt(index, 10);
      index = indexAsNumber;
    }
    const swiper = this;
    if (swiper.destroyed) return;
    if (typeof speed === "undefined") {
      speed = swiper.params.speed;
    }
    const gridEnabled = swiper.grid && swiper.params.grid && swiper.params.grid.rows > 1;
    let newIndex = index;
    if (swiper.params.loop) {
      if (swiper.virtual && swiper.params.virtual.enabled) {
        newIndex = newIndex + swiper.virtual.slidesBefore;
      } else {
        let targetSlideIndex;
        if (gridEnabled) {
          const slideIndex = newIndex * swiper.params.grid.rows;
          targetSlideIndex = swiper.slides.find((slideEl) => slideEl.getAttribute("data-swiper-slide-index") * 1 === slideIndex).column;
        } else {
          targetSlideIndex = swiper.getSlideIndexByData(newIndex);
        }
        const cols = gridEnabled ? Math.ceil(swiper.slides.length / swiper.params.grid.rows) : swiper.slides.length;
        const {
          centeredSlides,
          slidesOffsetBefore,
          slidesOffsetAfter
        } = swiper.params;
        const bothDirections = centeredSlides || !!slidesOffsetBefore || !!slidesOffsetAfter;
        let slidesPerView = swiper.params.slidesPerView;
        if (slidesPerView === "auto") {
          slidesPerView = swiper.slidesPerViewDynamic();
        } else {
          slidesPerView = Math.ceil(parseFloat(swiper.params.slidesPerView, 10));
          if (bothDirections && slidesPerView % 2 === 0) {
            slidesPerView = slidesPerView + 1;
          }
        }
        let needLoopFix = cols - targetSlideIndex < slidesPerView;
        if (bothDirections) {
          needLoopFix = needLoopFix || targetSlideIndex < Math.ceil(slidesPerView / 2);
        }
        if (internal && bothDirections && swiper.params.slidesPerView !== "auto" && !gridEnabled) {
          needLoopFix = false;
        }
        if (needLoopFix) {
          const direction = bothDirections ? targetSlideIndex < swiper.activeIndex ? "prev" : "next" : targetSlideIndex - swiper.activeIndex - 1 < swiper.params.slidesPerView ? "next" : "prev";
          swiper.loopFix({
            direction,
            slideTo: true,
            activeSlideIndex: direction === "next" ? targetSlideIndex + 1 : targetSlideIndex - cols + 1,
            slideRealIndex: direction === "next" ? swiper.realIndex : void 0
          });
        }
        if (gridEnabled) {
          const slideIndex = newIndex * swiper.params.grid.rows;
          newIndex = swiper.slides.find((slideEl) => slideEl.getAttribute("data-swiper-slide-index") * 1 === slideIndex).column;
        } else {
          newIndex = swiper.getSlideIndexByData(newIndex);
        }
      }
    }
    requestAnimationFrame(() => {
      swiper.slideTo(newIndex, speed, runCallbacks, internal);
    });
    return swiper;
  }
  function slideNext(speed, runCallbacks = true, internal) {
    const swiper = this;
    const {
      enabled,
      params,
      animating
    } = swiper;
    if (!enabled || swiper.destroyed) return swiper;
    if (typeof speed === "undefined") {
      speed = swiper.params.speed;
    }
    let perGroup = params.slidesPerGroup;
    if (params.slidesPerView === "auto" && params.slidesPerGroup === 1 && params.slidesPerGroupAuto) {
      perGroup = Math.max(swiper.slidesPerViewDynamic("current", true), 1);
    }
    const increment = swiper.activeIndex < params.slidesPerGroupSkip ? 1 : perGroup;
    const isVirtual = swiper.virtual && params.virtual.enabled;
    if (params.loop) {
      if (animating && !isVirtual && params.loopPreventsSliding) return false;
      swiper.loopFix({
        direction: "next"
      });
      swiper._clientLeft = swiper.wrapperEl.clientLeft;
      if (swiper.activeIndex === swiper.slides.length - 1 && params.cssMode) {
        requestAnimationFrame(() => {
          swiper.slideTo(swiper.activeIndex + increment, speed, runCallbacks, internal);
        });
        return true;
      }
    }
    if (params.rewind && swiper.isEnd) {
      return swiper.slideTo(0, speed, runCallbacks, internal);
    }
    return swiper.slideTo(swiper.activeIndex + increment, speed, runCallbacks, internal);
  }
  function slidePrev(speed, runCallbacks = true, internal) {
    const swiper = this;
    const {
      params,
      snapGrid,
      slidesGrid,
      rtlTranslate,
      enabled,
      animating
    } = swiper;
    if (!enabled || swiper.destroyed) return swiper;
    if (typeof speed === "undefined") {
      speed = swiper.params.speed;
    }
    const isVirtual = swiper.virtual && params.virtual.enabled;
    if (params.loop) {
      if (animating && !isVirtual && params.loopPreventsSliding) return false;
      swiper.loopFix({
        direction: "prev"
      });
      swiper._clientLeft = swiper.wrapperEl.clientLeft;
    }
    const translate2 = rtlTranslate ? swiper.translate : -swiper.translate;
    function normalize(val) {
      if (val < 0) return -Math.floor(Math.abs(val));
      return Math.floor(val);
    }
    const normalizedTranslate = normalize(translate2);
    const normalizedSnapGrid = snapGrid.map((val) => normalize(val));
    const isFreeMode = params.freeMode && params.freeMode.enabled;
    let prevSnap = snapGrid[normalizedSnapGrid.indexOf(normalizedTranslate) - 1];
    if (typeof prevSnap === "undefined" && (params.cssMode || isFreeMode)) {
      let prevSnapIndex;
      snapGrid.forEach((snap, snapIndex) => {
        if (normalizedTranslate >= snap) {
          prevSnapIndex = snapIndex;
        }
      });
      if (typeof prevSnapIndex !== "undefined") {
        prevSnap = isFreeMode ? snapGrid[prevSnapIndex] : snapGrid[prevSnapIndex > 0 ? prevSnapIndex - 1 : prevSnapIndex];
      }
    }
    let prevIndex = 0;
    if (typeof prevSnap !== "undefined") {
      prevIndex = slidesGrid.indexOf(prevSnap);
      if (prevIndex < 0) prevIndex = swiper.activeIndex - 1;
      if (params.slidesPerView === "auto" && params.slidesPerGroup === 1 && params.slidesPerGroupAuto) {
        prevIndex = prevIndex - swiper.slidesPerViewDynamic("previous", true) + 1;
        prevIndex = Math.max(prevIndex, 0);
      }
    }
    if (params.rewind && swiper.isBeginning) {
      const lastIndex = swiper.params.virtual && swiper.params.virtual.enabled && swiper.virtual ? swiper.virtual.slides.length - 1 : swiper.slides.length - 1;
      return swiper.slideTo(lastIndex, speed, runCallbacks, internal);
    } else if (params.loop && swiper.activeIndex === 0 && params.cssMode) {
      requestAnimationFrame(() => {
        swiper.slideTo(prevIndex, speed, runCallbacks, internal);
      });
      return true;
    }
    return swiper.slideTo(prevIndex, speed, runCallbacks, internal);
  }
  function slideReset(speed, runCallbacks = true, internal) {
    const swiper = this;
    if (swiper.destroyed) return;
    if (typeof speed === "undefined") {
      speed = swiper.params.speed;
    }
    return swiper.slideTo(swiper.activeIndex, speed, runCallbacks, internal);
  }
  function slideToClosest(speed, runCallbacks = true, internal, threshold = 0.5) {
    const swiper = this;
    if (swiper.destroyed) return;
    if (typeof speed === "undefined") {
      speed = swiper.params.speed;
    }
    let index = swiper.activeIndex;
    const skip = Math.min(swiper.params.slidesPerGroupSkip, index);
    const snapIndex = skip + Math.floor((index - skip) / swiper.params.slidesPerGroup);
    const translate2 = swiper.rtlTranslate ? swiper.translate : -swiper.translate;
    if (translate2 >= swiper.snapGrid[snapIndex]) {
      const currentSnap = swiper.snapGrid[snapIndex];
      const nextSnap = swiper.snapGrid[snapIndex + 1];
      if (translate2 - currentSnap > (nextSnap - currentSnap) * threshold) {
        index += swiper.params.slidesPerGroup;
      }
    } else {
      const prevSnap = swiper.snapGrid[snapIndex - 1];
      const currentSnap = swiper.snapGrid[snapIndex];
      if (translate2 - prevSnap <= (currentSnap - prevSnap) * threshold) {
        index -= swiper.params.slidesPerGroup;
      }
    }
    index = Math.max(index, 0);
    index = Math.min(index, swiper.slidesGrid.length - 1);
    return swiper.slideTo(index, speed, runCallbacks, internal);
  }
  function slideToClickedSlide() {
    const swiper = this;
    if (swiper.destroyed) return;
    const {
      params,
      slidesEl
    } = swiper;
    const slidesPerView = params.slidesPerView === "auto" ? swiper.slidesPerViewDynamic() : params.slidesPerView;
    let slideToIndex = swiper.getSlideIndexWhenGrid(swiper.clickedIndex);
    let realIndex;
    const slideSelector = swiper.isElement ? `swiper-slide` : `.${params.slideClass}`;
    const isGrid = swiper.grid && swiper.params.grid && swiper.params.grid.rows > 1;
    if (params.loop) {
      if (swiper.animating) return;
      realIndex = parseInt(swiper.clickedSlide.getAttribute("data-swiper-slide-index"), 10);
      if (params.centeredSlides) {
        swiper.slideToLoop(realIndex);
      } else if (slideToIndex > (isGrid ? (swiper.slides.length - slidesPerView) / 2 - (swiper.params.grid.rows - 1) : swiper.slides.length - slidesPerView)) {
        swiper.loopFix();
        slideToIndex = swiper.getSlideIndex(elementChildren(slidesEl, `${slideSelector}[data-swiper-slide-index="${realIndex}"]`)[0]);
        nextTick(() => {
          swiper.slideTo(slideToIndex);
        });
      } else {
        swiper.slideTo(slideToIndex);
      }
    } else {
      swiper.slideTo(slideToIndex);
    }
  }
  var slide = {
    slideTo,
    slideToLoop,
    slideNext,
    slidePrev,
    slideReset,
    slideToClosest,
    slideToClickedSlide
  };
  function loopCreate(slideRealIndex, initial) {
    const swiper = this;
    const {
      params,
      slidesEl
    } = swiper;
    if (!params.loop || swiper.virtual && swiper.params.virtual.enabled) return;
    const initSlides = () => {
      const slides = elementChildren(slidesEl, `.${params.slideClass}, swiper-slide`);
      slides.forEach((el, index) => {
        el.setAttribute("data-swiper-slide-index", index);
      });
    };
    const clearBlankSlides = () => {
      const slides = elementChildren(slidesEl, `.${params.slideBlankClass}`);
      slides.forEach((el) => {
        el.remove();
      });
      if (slides.length > 0) {
        swiper.recalcSlides();
        swiper.updateSlides();
      }
    };
    const gridEnabled = swiper.grid && params.grid && params.grid.rows > 1;
    if (params.loopAddBlankSlides && (params.slidesPerGroup > 1 || gridEnabled)) {
      clearBlankSlides();
    }
    const slidesPerGroup = params.slidesPerGroup * (gridEnabled ? params.grid.rows : 1);
    const shouldFillGroup = swiper.slides.length % slidesPerGroup !== 0;
    const shouldFillGrid = gridEnabled && swiper.slides.length % params.grid.rows !== 0;
    const addBlankSlides = (amountOfSlides) => {
      for (let i = 0; i < amountOfSlides; i += 1) {
        const slideEl = swiper.isElement ? createElement("swiper-slide", [params.slideBlankClass]) : createElement("div", [params.slideClass, params.slideBlankClass]);
        swiper.slidesEl.append(slideEl);
      }
    };
    if (shouldFillGroup) {
      if (params.loopAddBlankSlides) {
        const slidesToAdd = slidesPerGroup - swiper.slides.length % slidesPerGroup;
        addBlankSlides(slidesToAdd);
        swiper.recalcSlides();
        swiper.updateSlides();
      } else {
        showWarning("Swiper Loop Warning: The number of slides is not even to slidesPerGroup, loop mode may not function properly. You need to add more slides (or make duplicates, or empty slides)");
      }
      initSlides();
    } else if (shouldFillGrid) {
      if (params.loopAddBlankSlides) {
        const slidesToAdd = params.grid.rows - swiper.slides.length % params.grid.rows;
        addBlankSlides(slidesToAdd);
        swiper.recalcSlides();
        swiper.updateSlides();
      } else {
        showWarning("Swiper Loop Warning: The number of slides is not even to grid.rows, loop mode may not function properly. You need to add more slides (or make duplicates, or empty slides)");
      }
      initSlides();
    } else {
      initSlides();
    }
    const bothDirections = params.centeredSlides || !!params.slidesOffsetBefore || !!params.slidesOffsetAfter;
    swiper.loopFix({
      slideRealIndex,
      direction: bothDirections ? void 0 : "next",
      initial
    });
  }
  function loopFix({
    slideRealIndex,
    slideTo: slideTo2 = true,
    direction,
    setTranslate: setTranslate2,
    activeSlideIndex,
    initial,
    byController,
    byMousewheel
  } = {}) {
    const swiper = this;
    if (!swiper.params.loop) return;
    swiper.emit("beforeLoopFix");
    const {
      slides,
      allowSlidePrev,
      allowSlideNext,
      slidesEl,
      params
    } = swiper;
    const {
      centeredSlides,
      slidesOffsetBefore,
      slidesOffsetAfter,
      initialSlide
    } = params;
    const bothDirections = centeredSlides || !!slidesOffsetBefore || !!slidesOffsetAfter;
    swiper.allowSlidePrev = true;
    swiper.allowSlideNext = true;
    if (swiper.virtual && params.virtual.enabled) {
      if (slideTo2) {
        if (!bothDirections && swiper.snapIndex === 0) {
          swiper.slideTo(swiper.virtual.slides.length, 0, false, true);
        } else if (bothDirections && swiper.snapIndex < params.slidesPerView) {
          swiper.slideTo(swiper.virtual.slides.length + swiper.snapIndex, 0, false, true);
        } else if (swiper.snapIndex === swiper.snapGrid.length - 1) {
          swiper.slideTo(swiper.virtual.slidesBefore, 0, false, true);
        }
      }
      swiper.allowSlidePrev = allowSlidePrev;
      swiper.allowSlideNext = allowSlideNext;
      swiper.emit("loopFix");
      return;
    }
    let slidesPerView = params.slidesPerView;
    if (slidesPerView === "auto") {
      slidesPerView = swiper.slidesPerViewDynamic();
    } else {
      slidesPerView = Math.ceil(parseFloat(params.slidesPerView, 10));
      if (bothDirections && slidesPerView % 2 === 0) {
        slidesPerView = slidesPerView + 1;
      }
    }
    const slidesPerGroup = params.slidesPerGroupAuto ? slidesPerView : params.slidesPerGroup;
    let loopedSlides = bothDirections ? Math.max(slidesPerGroup, Math.ceil(slidesPerView / 2)) : slidesPerGroup;
    if (loopedSlides % slidesPerGroup !== 0) {
      loopedSlides += slidesPerGroup - loopedSlides % slidesPerGroup;
    }
    loopedSlides += params.loopAdditionalSlides;
    swiper.loopedSlides = loopedSlides;
    const gridEnabled = swiper.grid && params.grid && params.grid.rows > 1;
    if (slides.length < slidesPerView + loopedSlides || swiper.params.effect === "cards" && slides.length < slidesPerView + loopedSlides * 2) {
      showWarning("Swiper Loop Warning: The number of slides is not enough for loop mode, it will be disabled or not function properly. You need to add more slides (or make duplicates) or lower the values of slidesPerView and slidesPerGroup parameters");
    } else if (gridEnabled && params.grid.fill === "row") {
      showWarning("Swiper Loop Warning: Loop mode is not compatible with grid.fill = `row`");
    }
    const prependSlidesIndexes = [];
    const appendSlidesIndexes = [];
    const cols = gridEnabled ? Math.ceil(slides.length / params.grid.rows) : slides.length;
    const isInitialOverflow = initial && cols - initialSlide < slidesPerView && !bothDirections;
    let activeIndex = isInitialOverflow ? initialSlide : swiper.activeIndex;
    if (typeof activeSlideIndex === "undefined") {
      activeSlideIndex = swiper.getSlideIndex(slides.find((el) => el.classList.contains(params.slideActiveClass)));
    } else {
      activeIndex = activeSlideIndex;
    }
    const isNext = direction === "next" || !direction;
    const isPrev = direction === "prev" || !direction;
    let slidesPrepended = 0;
    let slidesAppended = 0;
    const activeColIndex = gridEnabled ? slides[activeSlideIndex].column : activeSlideIndex;
    const activeColIndexWithShift = activeColIndex + (bothDirections && typeof setTranslate2 === "undefined" ? -slidesPerView / 2 + 0.5 : 0);
    if (activeColIndexWithShift < loopedSlides) {
      slidesPrepended = Math.max(loopedSlides - activeColIndexWithShift, slidesPerGroup);
      for (let i = 0; i < loopedSlides - activeColIndexWithShift; i += 1) {
        const index = i - Math.floor(i / cols) * cols;
        if (gridEnabled) {
          const colIndexToPrepend = cols - index - 1;
          for (let i2 = slides.length - 1; i2 >= 0; i2 -= 1) {
            if (slides[i2].column === colIndexToPrepend) prependSlidesIndexes.push(i2);
          }
        } else {
          prependSlidesIndexes.push(cols - index - 1);
        }
      }
    } else if (activeColIndexWithShift + slidesPerView > cols - loopedSlides) {
      slidesAppended = Math.max(activeColIndexWithShift - (cols - loopedSlides * 2), slidesPerGroup);
      if (isInitialOverflow) {
        slidesAppended = Math.max(slidesAppended, slidesPerView - cols + initialSlide + 1);
      }
      for (let i = 0; i < slidesAppended; i += 1) {
        const index = i - Math.floor(i / cols) * cols;
        if (gridEnabled) {
          slides.forEach((slide2, slideIndex) => {
            if (slide2.column === index) appendSlidesIndexes.push(slideIndex);
          });
        } else {
          appendSlidesIndexes.push(index);
        }
      }
    }
    swiper.__preventObserver__ = true;
    requestAnimationFrame(() => {
      swiper.__preventObserver__ = false;
    });
    if (swiper.params.effect === "cards" && slides.length < slidesPerView + loopedSlides * 2) {
      if (appendSlidesIndexes.includes(activeSlideIndex)) {
        appendSlidesIndexes.splice(appendSlidesIndexes.indexOf(activeSlideIndex), 1);
      }
      if (prependSlidesIndexes.includes(activeSlideIndex)) {
        prependSlidesIndexes.splice(prependSlidesIndexes.indexOf(activeSlideIndex), 1);
      }
    }
    if (isPrev) {
      prependSlidesIndexes.forEach((index) => {
        slides[index].swiperLoopMoveDOM = true;
        slidesEl.prepend(slides[index]);
        slides[index].swiperLoopMoveDOM = false;
      });
    }
    if (isNext) {
      appendSlidesIndexes.forEach((index) => {
        slides[index].swiperLoopMoveDOM = true;
        slidesEl.append(slides[index]);
        slides[index].swiperLoopMoveDOM = false;
      });
    }
    swiper.recalcSlides();
    if (params.slidesPerView === "auto") {
      swiper.updateSlides();
    } else if (gridEnabled && (prependSlidesIndexes.length > 0 && isPrev || appendSlidesIndexes.length > 0 && isNext)) {
      swiper.slides.forEach((slide2, slideIndex) => {
        swiper.grid.updateSlide(slideIndex, slide2, swiper.slides);
      });
    }
    if (params.watchSlidesProgress) {
      swiper.updateSlidesOffset();
    }
    if (slideTo2) {
      if (prependSlidesIndexes.length > 0 && isPrev) {
        if (typeof slideRealIndex === "undefined") {
          const currentSlideTranslate = swiper.slidesGrid[activeIndex];
          const newSlideTranslate = swiper.slidesGrid[activeIndex + slidesPrepended];
          const diff = newSlideTranslate - currentSlideTranslate;
          if (byMousewheel) {
            swiper.setTranslate(swiper.translate - diff);
          } else {
            swiper.slideTo(activeIndex + Math.ceil(slidesPrepended), 0, false, true);
            if (setTranslate2) {
              swiper.touchEventsData.startTranslate = swiper.touchEventsData.startTranslate - diff;
              swiper.touchEventsData.currentTranslate = swiper.touchEventsData.currentTranslate - diff;
            }
          }
        } else {
          if (setTranslate2) {
            const shift = gridEnabled ? prependSlidesIndexes.length / params.grid.rows : prependSlidesIndexes.length;
            swiper.slideTo(swiper.activeIndex + shift, 0, false, true);
            swiper.touchEventsData.currentTranslate = swiper.translate;
          }
        }
      } else if (appendSlidesIndexes.length > 0 && isNext) {
        if (typeof slideRealIndex === "undefined") {
          const currentSlideTranslate = swiper.slidesGrid[activeIndex];
          const newSlideTranslate = swiper.slidesGrid[activeIndex - slidesAppended];
          const diff = newSlideTranslate - currentSlideTranslate;
          if (byMousewheel) {
            swiper.setTranslate(swiper.translate - diff);
          } else {
            swiper.slideTo(activeIndex - slidesAppended, 0, false, true);
            if (setTranslate2) {
              swiper.touchEventsData.startTranslate = swiper.touchEventsData.startTranslate - diff;
              swiper.touchEventsData.currentTranslate = swiper.touchEventsData.currentTranslate - diff;
            }
          }
        } else {
          const shift = gridEnabled ? appendSlidesIndexes.length / params.grid.rows : appendSlidesIndexes.length;
          swiper.slideTo(swiper.activeIndex - shift, 0, false, true);
        }
      }
    }
    swiper.allowSlidePrev = allowSlidePrev;
    swiper.allowSlideNext = allowSlideNext;
    if (swiper.controller && swiper.controller.control && !byController) {
      const loopParams = {
        slideRealIndex,
        direction,
        setTranslate: setTranslate2,
        activeSlideIndex,
        byController: true
      };
      if (Array.isArray(swiper.controller.control)) {
        swiper.controller.control.forEach((c) => {
          if (!c.destroyed && c.params.loop) c.loopFix({
            ...loopParams,
            slideTo: c.params.slidesPerView === params.slidesPerView ? slideTo2 : false
          });
        });
      } else if (swiper.controller.control instanceof swiper.constructor && swiper.controller.control.params.loop) {
        swiper.controller.control.loopFix({
          ...loopParams,
          slideTo: swiper.controller.control.params.slidesPerView === params.slidesPerView ? slideTo2 : false
        });
      }
    }
    swiper.emit("loopFix");
  }
  function loopDestroy() {
    const swiper = this;
    const {
      params,
      slidesEl
    } = swiper;
    if (!params.loop || !slidesEl || swiper.virtual && swiper.params.virtual.enabled) return;
    swiper.recalcSlides();
    const newSlidesOrder = [];
    swiper.slides.forEach((slideEl) => {
      const index = typeof slideEl.swiperSlideIndex === "undefined" ? slideEl.getAttribute("data-swiper-slide-index") * 1 : slideEl.swiperSlideIndex;
      newSlidesOrder[index] = slideEl;
    });
    swiper.slides.forEach((slideEl) => {
      slideEl.removeAttribute("data-swiper-slide-index");
    });
    newSlidesOrder.forEach((slideEl) => {
      slidesEl.append(slideEl);
    });
    swiper.recalcSlides();
    swiper.slideTo(swiper.realIndex, 0);
  }
  var loop = {
    loopCreate,
    loopFix,
    loopDestroy
  };
  function setGrabCursor(moving) {
    const swiper = this;
    if (!swiper.params.simulateTouch || swiper.params.watchOverflow && swiper.isLocked || swiper.params.cssMode) return;
    const el = swiper.params.touchEventsTarget === "container" ? swiper.el : swiper.wrapperEl;
    if (swiper.isElement) {
      swiper.__preventObserver__ = true;
    }
    el.style.cursor = "move";
    el.style.cursor = moving ? "grabbing" : "grab";
    if (swiper.isElement) {
      requestAnimationFrame(() => {
        swiper.__preventObserver__ = false;
      });
    }
  }
  function unsetGrabCursor() {
    const swiper = this;
    if (swiper.params.watchOverflow && swiper.isLocked || swiper.params.cssMode) {
      return;
    }
    if (swiper.isElement) {
      swiper.__preventObserver__ = true;
    }
    swiper[swiper.params.touchEventsTarget === "container" ? "el" : "wrapperEl"].style.cursor = "";
    if (swiper.isElement) {
      requestAnimationFrame(() => {
        swiper.__preventObserver__ = false;
      });
    }
  }
  var grabCursor = {
    setGrabCursor,
    unsetGrabCursor
  };
  function closestElement(selector, base = this) {
    function __closestFrom(el) {
      if (!el || el === getDocument() || el === getWindow()) return null;
      if (el.assignedSlot) el = el.assignedSlot;
      const found = el.closest(selector);
      if (!found && !el.getRootNode) {
        return null;
      }
      return found || __closestFrom(el.getRootNode().host);
    }
    return __closestFrom(base);
  }
  function preventEdgeSwipe(swiper, event2, startX) {
    const window2 = getWindow();
    const {
      params
    } = swiper;
    const edgeSwipeDetection = params.edgeSwipeDetection;
    const edgeSwipeThreshold = params.edgeSwipeThreshold;
    if (edgeSwipeDetection && (startX <= edgeSwipeThreshold || startX >= window2.innerWidth - edgeSwipeThreshold)) {
      if (edgeSwipeDetection === "prevent") {
        event2.preventDefault();
        return true;
      }
      return false;
    }
    return true;
  }
  function onTouchStart(event2) {
    const swiper = this;
    const document2 = getDocument();
    let e = event2;
    if (e.originalEvent) e = e.originalEvent;
    const data = swiper.touchEventsData;
    if (e.type === "pointerdown") {
      if (data.pointerId !== null && data.pointerId !== e.pointerId) {
        return;
      }
      data.pointerId = e.pointerId;
    } else if (e.type === "touchstart" && e.targetTouches.length === 1) {
      data.touchId = e.targetTouches[0].identifier;
    }
    if (e.type === "touchstart") {
      preventEdgeSwipe(swiper, e, e.targetTouches[0].pageX);
      return;
    }
    const {
      params,
      touches,
      enabled
    } = swiper;
    if (!enabled) return;
    if (!params.simulateTouch && e.pointerType === "mouse") return;
    if (swiper.animating && params.preventInteractionOnTransition) {
      return;
    }
    if (!swiper.animating && params.cssMode && params.loop) {
      swiper.loopFix();
    }
    let targetEl = e.target;
    if (params.touchEventsTarget === "wrapper") {
      if (!elementIsChildOf(targetEl, swiper.wrapperEl)) return;
    }
    if ("which" in e && e.which === 3) return;
    if ("button" in e && e.button > 0) return;
    if (data.isTouched && data.isMoved) return;
    const swipingClassHasValue = !!params.noSwipingClass && params.noSwipingClass !== "";
    const eventPath = e.composedPath ? e.composedPath() : e.path;
    if (swipingClassHasValue && e.target && e.target.shadowRoot && eventPath) {
      targetEl = eventPath[0];
    }
    const noSwipingSelector = params.noSwipingSelector ? params.noSwipingSelector : `.${params.noSwipingClass}`;
    const isTargetShadow = !!(e.target && e.target.shadowRoot);
    if (params.noSwiping && (isTargetShadow ? closestElement(noSwipingSelector, targetEl) : targetEl.closest(noSwipingSelector))) {
      swiper.allowClick = true;
      return;
    }
    if (params.swipeHandler) {
      if (!targetEl.closest(params.swipeHandler)) return;
    }
    touches.currentX = e.pageX;
    touches.currentY = e.pageY;
    const startX = touches.currentX;
    const startY = touches.currentY;
    if (!preventEdgeSwipe(swiper, e, startX)) {
      return;
    }
    Object.assign(data, {
      isTouched: true,
      isMoved: false,
      allowTouchCallbacks: true,
      isScrolling: void 0,
      startMoving: void 0
    });
    touches.startX = startX;
    touches.startY = startY;
    data.touchStartTime = now();
    swiper.allowClick = true;
    swiper.updateSize();
    swiper.swipeDirection = void 0;
    if (params.threshold > 0) data.allowThresholdMove = false;
    let preventDefault = true;
    if (targetEl.matches(data.focusableElements)) {
      preventDefault = false;
      if (targetEl.nodeName === "SELECT") {
        data.isTouched = false;
      }
    }
    if (document2.activeElement && document2.activeElement.matches(data.focusableElements) && document2.activeElement !== targetEl && (e.pointerType === "mouse" || e.pointerType !== "mouse" && !targetEl.matches(data.focusableElements))) {
      document2.activeElement.blur();
    }
    const shouldPreventDefault = preventDefault && swiper.allowTouchMove && params.touchStartPreventDefault;
    if ((params.touchStartForcePreventDefault || shouldPreventDefault) && !targetEl.isContentEditable) {
      e.preventDefault();
    }
    if (params.freeMode && params.freeMode.enabled && swiper.freeMode && swiper.animating && !params.cssMode) {
      swiper.freeMode.onTouchStart();
    }
    swiper.emit("touchStart", e);
  }
  function onTouchMove(event2) {
    const document2 = getDocument();
    const swiper = this;
    const data = swiper.touchEventsData;
    const {
      params,
      touches,
      rtlTranslate: rtl,
      enabled
    } = swiper;
    if (!enabled) return;
    if (!params.simulateTouch && event2.pointerType === "mouse") return;
    let e = event2;
    if (e.originalEvent) e = e.originalEvent;
    if (e.type === "pointermove") {
      if (data.touchId !== null) return;
      const id = e.pointerId;
      if (id !== data.pointerId) return;
    }
    let targetTouch;
    if (e.type === "touchmove") {
      targetTouch = [...e.changedTouches].find((t) => t.identifier === data.touchId);
      if (!targetTouch || targetTouch.identifier !== data.touchId) return;
    } else {
      targetTouch = e;
    }
    if (!data.isTouched) {
      if (data.startMoving && data.isScrolling) {
        swiper.emit("touchMoveOpposite", e);
      }
      return;
    }
    const pageX = targetTouch.pageX;
    const pageY = targetTouch.pageY;
    if (e.preventedByNestedSwiper) {
      touches.startX = pageX;
      touches.startY = pageY;
      return;
    }
    if (!swiper.allowTouchMove) {
      if (!e.target.matches(data.focusableElements)) {
        swiper.allowClick = false;
      }
      if (data.isTouched) {
        Object.assign(touches, {
          startX: pageX,
          startY: pageY,
          currentX: pageX,
          currentY: pageY
        });
        data.touchStartTime = now();
      }
      return;
    }
    if (params.touchReleaseOnEdges && !params.loop) {
      if (swiper.isVertical()) {
        if (pageY < touches.startY && swiper.translate <= swiper.maxTranslate() || pageY > touches.startY && swiper.translate >= swiper.minTranslate()) {
          data.isTouched = false;
          data.isMoved = false;
          return;
        }
      } else if (rtl && (pageX > touches.startX && -swiper.translate <= swiper.maxTranslate() || pageX < touches.startX && -swiper.translate >= swiper.minTranslate())) {
        return;
      } else if (!rtl && (pageX < touches.startX && swiper.translate <= swiper.maxTranslate() || pageX > touches.startX && swiper.translate >= swiper.minTranslate())) {
        return;
      }
    }
    if (document2.activeElement && document2.activeElement.matches(data.focusableElements) && document2.activeElement !== e.target && e.pointerType !== "mouse") {
      document2.activeElement.blur();
    }
    if (document2.activeElement) {
      if (e.target === document2.activeElement && e.target.matches(data.focusableElements)) {
        data.isMoved = true;
        swiper.allowClick = false;
        return;
      }
    }
    if (data.allowTouchCallbacks) {
      swiper.emit("touchMove", e);
    }
    touches.previousX = touches.currentX;
    touches.previousY = touches.currentY;
    touches.currentX = pageX;
    touches.currentY = pageY;
    const diffX = touches.currentX - touches.startX;
    const diffY = touches.currentY - touches.startY;
    if (swiper.params.threshold && Math.sqrt(diffX ** 2 + diffY ** 2) < swiper.params.threshold) return;
    if (typeof data.isScrolling === "undefined") {
      let touchAngle;
      if (swiper.isHorizontal() && touches.currentY === touches.startY || swiper.isVertical() && touches.currentX === touches.startX) {
        data.isScrolling = false;
      } else {
        if (diffX * diffX + diffY * diffY >= 25) {
          touchAngle = Math.atan2(Math.abs(diffY), Math.abs(diffX)) * 180 / Math.PI;
          data.isScrolling = swiper.isHorizontal() ? touchAngle > params.touchAngle : 90 - touchAngle > params.touchAngle;
        }
      }
    }
    if (data.isScrolling) {
      swiper.emit("touchMoveOpposite", e);
    }
    if (typeof data.startMoving === "undefined") {
      if (touches.currentX !== touches.startX || touches.currentY !== touches.startY) {
        data.startMoving = true;
      }
    }
    if (data.isScrolling || e.type === "touchmove" && data.preventTouchMoveFromPointerMove) {
      data.isTouched = false;
      return;
    }
    if (!data.startMoving) {
      return;
    }
    swiper.allowClick = false;
    if (!params.cssMode && e.cancelable) {
      e.preventDefault();
    }
    if (params.touchMoveStopPropagation && !params.nested) {
      e.stopPropagation();
    }
    let diff = swiper.isHorizontal() ? diffX : diffY;
    let touchesDiff = swiper.isHorizontal() ? touches.currentX - touches.previousX : touches.currentY - touches.previousY;
    if (params.oneWayMovement) {
      diff = Math.abs(diff) * (rtl ? 1 : -1);
      touchesDiff = Math.abs(touchesDiff) * (rtl ? 1 : -1);
    }
    touches.diff = diff;
    diff *= params.touchRatio;
    if (rtl) {
      diff = -diff;
      touchesDiff = -touchesDiff;
    }
    const prevTouchesDirection = swiper.touchesDirection;
    swiper.swipeDirection = diff > 0 ? "prev" : "next";
    swiper.touchesDirection = touchesDiff > 0 ? "prev" : "next";
    const isLoop = swiper.params.loop && !params.cssMode;
    const allowLoopFix = swiper.touchesDirection === "next" && swiper.allowSlideNext || swiper.touchesDirection === "prev" && swiper.allowSlidePrev;
    if (!data.isMoved) {
      if (isLoop && allowLoopFix) {
        swiper.loopFix({
          direction: swiper.swipeDirection
        });
      }
      data.startTranslate = swiper.getTranslate();
      swiper.setTransition(0);
      if (swiper.animating) {
        const evt = new window.CustomEvent("transitionend", {
          bubbles: true,
          cancelable: true,
          detail: {
            bySwiperTouchMove: true
          }
        });
        swiper.wrapperEl.dispatchEvent(evt);
      }
      data.allowMomentumBounce = false;
      if (params.grabCursor && (swiper.allowSlideNext === true || swiper.allowSlidePrev === true)) {
        swiper.setGrabCursor(true);
      }
      swiper.emit("sliderFirstMove", e);
    }
    let loopFixed;
    (/* @__PURE__ */ new Date()).getTime();
    if (params._loopSwapReset !== false && data.isMoved && data.allowThresholdMove && prevTouchesDirection !== swiper.touchesDirection && isLoop && allowLoopFix && Math.abs(diff) >= 1) {
      Object.assign(touches, {
        startX: pageX,
        startY: pageY,
        currentX: pageX,
        currentY: pageY,
        startTranslate: data.currentTranslate
      });
      data.loopSwapReset = true;
      data.startTranslate = data.currentTranslate;
      return;
    }
    swiper.emit("sliderMove", e);
    data.isMoved = true;
    data.currentTranslate = diff + data.startTranslate;
    let disableParentSwiper = true;
    let resistanceRatio = params.resistanceRatio;
    if (params.touchReleaseOnEdges) {
      resistanceRatio = 0;
    }
    if (diff > 0) {
      if (isLoop && allowLoopFix && !loopFixed && data.allowThresholdMove && data.currentTranslate > (params.centeredSlides ? swiper.minTranslate() - swiper.slidesSizesGrid[swiper.activeIndex + 1] - (params.slidesPerView !== "auto" && swiper.slides.length - params.slidesPerView >= 2 ? swiper.slidesSizesGrid[swiper.activeIndex + 1] + swiper.params.spaceBetween : 0) - swiper.params.spaceBetween : swiper.minTranslate())) {
        swiper.loopFix({
          direction: "prev",
          setTranslate: true,
          activeSlideIndex: 0
        });
      }
      if (data.currentTranslate > swiper.minTranslate()) {
        disableParentSwiper = false;
        if (params.resistance) {
          data.currentTranslate = swiper.minTranslate() - 1 + (-swiper.minTranslate() + data.startTranslate + diff) ** resistanceRatio;
        }
      }
    } else if (diff < 0) {
      if (isLoop && allowLoopFix && !loopFixed && data.allowThresholdMove && data.currentTranslate < (params.centeredSlides ? swiper.maxTranslate() + swiper.slidesSizesGrid[swiper.slidesSizesGrid.length - 1] + swiper.params.spaceBetween + (params.slidesPerView !== "auto" && swiper.slides.length - params.slidesPerView >= 2 ? swiper.slidesSizesGrid[swiper.slidesSizesGrid.length - 1] + swiper.params.spaceBetween : 0) : swiper.maxTranslate())) {
        swiper.loopFix({
          direction: "next",
          setTranslate: true,
          activeSlideIndex: swiper.slides.length - (params.slidesPerView === "auto" ? swiper.slidesPerViewDynamic() : Math.ceil(parseFloat(params.slidesPerView, 10)))
        });
      }
      if (data.currentTranslate < swiper.maxTranslate()) {
        disableParentSwiper = false;
        if (params.resistance) {
          data.currentTranslate = swiper.maxTranslate() + 1 - (swiper.maxTranslate() - data.startTranslate - diff) ** resistanceRatio;
        }
      }
    }
    if (disableParentSwiper) {
      e.preventedByNestedSwiper = true;
    }
    if (!swiper.allowSlideNext && swiper.swipeDirection === "next" && data.currentTranslate < data.startTranslate) {
      data.currentTranslate = data.startTranslate;
    }
    if (!swiper.allowSlidePrev && swiper.swipeDirection === "prev" && data.currentTranslate > data.startTranslate) {
      data.currentTranslate = data.startTranslate;
    }
    if (!swiper.allowSlidePrev && !swiper.allowSlideNext) {
      data.currentTranslate = data.startTranslate;
    }
    if (params.threshold > 0) {
      if (Math.abs(diff) > params.threshold || data.allowThresholdMove) {
        if (!data.allowThresholdMove) {
          data.allowThresholdMove = true;
          touches.startX = touches.currentX;
          touches.startY = touches.currentY;
          data.currentTranslate = data.startTranslate;
          touches.diff = swiper.isHorizontal() ? touches.currentX - touches.startX : touches.currentY - touches.startY;
          return;
        }
      } else {
        data.currentTranslate = data.startTranslate;
        return;
      }
    }
    if (!params.followFinger || params.cssMode) return;
    if (params.freeMode && params.freeMode.enabled && swiper.freeMode || params.watchSlidesProgress) {
      swiper.updateActiveIndex();
      swiper.updateSlidesClasses();
    }
    if (params.freeMode && params.freeMode.enabled && swiper.freeMode) {
      swiper.freeMode.onTouchMove();
    }
    swiper.updateProgress(data.currentTranslate);
    swiper.setTranslate(data.currentTranslate);
  }
  function onTouchEnd(event2) {
    const swiper = this;
    const data = swiper.touchEventsData;
    let e = event2;
    if (e.originalEvent) e = e.originalEvent;
    let targetTouch;
    const isTouchEvent = e.type === "touchend" || e.type === "touchcancel";
    if (!isTouchEvent) {
      if (data.touchId !== null) return;
      if (e.pointerId !== data.pointerId) return;
      targetTouch = e;
    } else {
      targetTouch = [...e.changedTouches].find((t) => t.identifier === data.touchId);
      if (!targetTouch || targetTouch.identifier !== data.touchId) return;
    }
    if (["pointercancel", "pointerout", "pointerleave", "contextmenu"].includes(e.type)) {
      const proceed = ["pointercancel", "contextmenu"].includes(e.type) && (swiper.browser.isSafari || swiper.browser.isWebView);
      if (!proceed) {
        return;
      }
    }
    data.pointerId = null;
    data.touchId = null;
    const {
      params,
      touches,
      rtlTranslate: rtl,
      slidesGrid,
      enabled
    } = swiper;
    if (!enabled) return;
    if (!params.simulateTouch && e.pointerType === "mouse") return;
    if (data.allowTouchCallbacks) {
      swiper.emit("touchEnd", e);
    }
    data.allowTouchCallbacks = false;
    if (!data.isTouched) {
      if (data.isMoved && params.grabCursor) {
        swiper.setGrabCursor(false);
      }
      data.isMoved = false;
      data.startMoving = false;
      return;
    }
    if (params.grabCursor && data.isMoved && data.isTouched && (swiper.allowSlideNext === true || swiper.allowSlidePrev === true)) {
      swiper.setGrabCursor(false);
    }
    const touchEndTime = now();
    const timeDiff = touchEndTime - data.touchStartTime;
    if (swiper.allowClick) {
      const pathTree = e.path || e.composedPath && e.composedPath();
      swiper.updateClickedSlide(pathTree && pathTree[0] || e.target, pathTree);
      swiper.emit("tap click", e);
      if (timeDiff < 300 && touchEndTime - data.lastClickTime < 300) {
        swiper.emit("doubleTap doubleClick", e);
      }
    }
    data.lastClickTime = now();
    nextTick(() => {
      if (!swiper.destroyed) swiper.allowClick = true;
    });
    if (!data.isTouched || !data.isMoved || !swiper.swipeDirection || touches.diff === 0 && !data.loopSwapReset || data.currentTranslate === data.startTranslate && !data.loopSwapReset) {
      data.isTouched = false;
      data.isMoved = false;
      data.startMoving = false;
      return;
    }
    data.isTouched = false;
    data.isMoved = false;
    data.startMoving = false;
    let currentPos;
    if (params.followFinger) {
      currentPos = rtl ? swiper.translate : -swiper.translate;
    } else {
      currentPos = -data.currentTranslate;
    }
    if (params.cssMode) {
      return;
    }
    if (params.freeMode && params.freeMode.enabled) {
      swiper.freeMode.onTouchEnd({
        currentPos
      });
      return;
    }
    const swipeToLast = currentPos >= -swiper.maxTranslate() && !swiper.params.loop;
    let stopIndex = 0;
    let groupSize = swiper.slidesSizesGrid[0];
    for (let i = 0; i < slidesGrid.length; i += i < params.slidesPerGroupSkip ? 1 : params.slidesPerGroup) {
      const increment2 = i < params.slidesPerGroupSkip - 1 ? 1 : params.slidesPerGroup;
      if (typeof slidesGrid[i + increment2] !== "undefined") {
        if (swipeToLast || currentPos >= slidesGrid[i] && currentPos < slidesGrid[i + increment2]) {
          stopIndex = i;
          groupSize = slidesGrid[i + increment2] - slidesGrid[i];
        }
      } else if (swipeToLast || currentPos >= slidesGrid[i]) {
        stopIndex = i;
        groupSize = slidesGrid[slidesGrid.length - 1] - slidesGrid[slidesGrid.length - 2];
      }
    }
    let rewindFirstIndex = null;
    let rewindLastIndex = null;
    if (params.rewind) {
      if (swiper.isBeginning) {
        rewindLastIndex = params.virtual && params.virtual.enabled && swiper.virtual ? swiper.virtual.slides.length - 1 : swiper.slides.length - 1;
      } else if (swiper.isEnd) {
        rewindFirstIndex = 0;
      }
    }
    const ratio = (currentPos - slidesGrid[stopIndex]) / groupSize;
    const increment = stopIndex < params.slidesPerGroupSkip - 1 ? 1 : params.slidesPerGroup;
    if (timeDiff > params.longSwipesMs) {
      if (!params.longSwipes) {
        swiper.slideTo(swiper.activeIndex);
        return;
      }
      if (swiper.swipeDirection === "next") {
        if (ratio >= params.longSwipesRatio) swiper.slideTo(params.rewind && swiper.isEnd ? rewindFirstIndex : stopIndex + increment);
        else swiper.slideTo(stopIndex);
      }
      if (swiper.swipeDirection === "prev") {
        if (ratio > 1 - params.longSwipesRatio) {
          swiper.slideTo(stopIndex + increment);
        } else if (rewindLastIndex !== null && ratio < 0 && Math.abs(ratio) > params.longSwipesRatio) {
          swiper.slideTo(rewindLastIndex);
        } else {
          swiper.slideTo(stopIndex);
        }
      }
    } else {
      if (!params.shortSwipes) {
        swiper.slideTo(swiper.activeIndex);
        return;
      }
      const isNavButtonTarget = swiper.navigation && (e.target === swiper.navigation.nextEl || e.target === swiper.navigation.prevEl);
      if (!isNavButtonTarget) {
        if (swiper.swipeDirection === "next") {
          swiper.slideTo(rewindFirstIndex !== null ? rewindFirstIndex : stopIndex + increment);
        }
        if (swiper.swipeDirection === "prev") {
          swiper.slideTo(rewindLastIndex !== null ? rewindLastIndex : stopIndex);
        }
      } else if (e.target === swiper.navigation.nextEl) {
        swiper.slideTo(stopIndex + increment);
      } else {
        swiper.slideTo(stopIndex);
      }
    }
  }
  function onResize() {
    const swiper = this;
    const {
      params,
      el
    } = swiper;
    if (el && el.offsetWidth === 0) return;
    if (params.breakpoints) {
      swiper.setBreakpoint();
    }
    const {
      allowSlideNext,
      allowSlidePrev,
      snapGrid
    } = swiper;
    const isVirtual = swiper.virtual && swiper.params.virtual.enabled;
    swiper.allowSlideNext = true;
    swiper.allowSlidePrev = true;
    swiper.updateSize();
    swiper.updateSlides();
    swiper.updateSlidesClasses();
    const isVirtualLoop = isVirtual && params.loop;
    if ((params.slidesPerView === "auto" || params.slidesPerView > 1) && swiper.isEnd && !swiper.isBeginning && !swiper.params.centeredSlides && !isVirtualLoop) {
      swiper.slideTo(swiper.slides.length - 1, 0, false, true);
    } else {
      if (swiper.params.loop && !isVirtual) {
        swiper.slideToLoop(swiper.realIndex, 0, false, true);
      } else {
        swiper.slideTo(swiper.activeIndex, 0, false, true);
      }
    }
    if (swiper.autoplay && swiper.autoplay.running && swiper.autoplay.paused) {
      clearTimeout(swiper.autoplay.resizeTimeout);
      swiper.autoplay.resizeTimeout = setTimeout(() => {
        if (swiper.autoplay && swiper.autoplay.running && swiper.autoplay.paused) {
          swiper.autoplay.resume();
        }
      }, 500);
    }
    swiper.allowSlidePrev = allowSlidePrev;
    swiper.allowSlideNext = allowSlideNext;
    if (swiper.params.watchOverflow && snapGrid !== swiper.snapGrid) {
      swiper.checkOverflow();
    }
  }
  function onClick(e) {
    const swiper = this;
    if (!swiper.enabled) return;
    if (!swiper.allowClick) {
      if (swiper.params.preventClicks) e.preventDefault();
      if (swiper.params.preventClicksPropagation && swiper.animating) {
        e.stopPropagation();
        e.stopImmediatePropagation();
      }
    }
  }
  function onScroll() {
    const swiper = this;
    const {
      wrapperEl,
      rtlTranslate,
      enabled
    } = swiper;
    if (!enabled) return;
    swiper.previousTranslate = swiper.translate;
    if (swiper.isHorizontal()) {
      swiper.translate = -wrapperEl.scrollLeft;
    } else {
      swiper.translate = -wrapperEl.scrollTop;
    }
    if (swiper.translate === 0) swiper.translate = 0;
    swiper.updateActiveIndex();
    swiper.updateSlidesClasses();
    let newProgress;
    const translatesDiff = swiper.maxTranslate() - swiper.minTranslate();
    if (translatesDiff === 0) {
      newProgress = 0;
    } else {
      newProgress = (swiper.translate - swiper.minTranslate()) / translatesDiff;
    }
    if (newProgress !== swiper.progress) {
      swiper.updateProgress(rtlTranslate ? -swiper.translate : swiper.translate);
    }
    swiper.emit("setTranslate", swiper.translate, false);
  }
  function onLoad(e) {
    const swiper = this;
    processLazyPreloader(swiper, e.target);
    if (swiper.params.cssMode || swiper.params.slidesPerView !== "auto" && !swiper.params.autoHeight) {
      return;
    }
    swiper.update();
  }
  function onDocumentTouchStart() {
    const swiper = this;
    if (swiper.documentTouchHandlerProceeded) return;
    swiper.documentTouchHandlerProceeded = true;
    if (swiper.params.touchReleaseOnEdges) {
      swiper.el.style.touchAction = "auto";
    }
  }
  var events = (swiper, method) => {
    const document2 = getDocument();
    const {
      params,
      el,
      wrapperEl,
      device
    } = swiper;
    const capture = !!params.nested;
    const domMethod = method === "on" ? "addEventListener" : "removeEventListener";
    const swiperMethod = method;
    if (!el || typeof el === "string") return;
    document2[domMethod]("touchstart", swiper.onDocumentTouchStart, {
      passive: false,
      capture
    });
    el[domMethod]("touchstart", swiper.onTouchStart, {
      passive: false
    });
    el[domMethod]("pointerdown", swiper.onTouchStart, {
      passive: false
    });
    document2[domMethod]("touchmove", swiper.onTouchMove, {
      passive: false,
      capture
    });
    document2[domMethod]("pointermove", swiper.onTouchMove, {
      passive: false,
      capture
    });
    document2[domMethod]("touchend", swiper.onTouchEnd, {
      passive: true
    });
    document2[domMethod]("pointerup", swiper.onTouchEnd, {
      passive: true
    });
    document2[domMethod]("pointercancel", swiper.onTouchEnd, {
      passive: true
    });
    document2[domMethod]("touchcancel", swiper.onTouchEnd, {
      passive: true
    });
    document2[domMethod]("pointerout", swiper.onTouchEnd, {
      passive: true
    });
    document2[domMethod]("pointerleave", swiper.onTouchEnd, {
      passive: true
    });
    document2[domMethod]("contextmenu", swiper.onTouchEnd, {
      passive: true
    });
    if (params.preventClicks || params.preventClicksPropagation) {
      el[domMethod]("click", swiper.onClick, true);
    }
    if (params.cssMode) {
      wrapperEl[domMethod]("scroll", swiper.onScroll);
    }
    if (params.updateOnWindowResize) {
      swiper[swiperMethod](device.ios || device.android ? "resize orientationchange observerUpdate" : "resize observerUpdate", onResize, true);
    } else {
      swiper[swiperMethod]("observerUpdate", onResize, true);
    }
    el[domMethod]("load", swiper.onLoad, {
      capture: true
    });
  };
  function attachEvents() {
    const swiper = this;
    const {
      params
    } = swiper;
    swiper.onTouchStart = onTouchStart.bind(swiper);
    swiper.onTouchMove = onTouchMove.bind(swiper);
    swiper.onTouchEnd = onTouchEnd.bind(swiper);
    swiper.onDocumentTouchStart = onDocumentTouchStart.bind(swiper);
    if (params.cssMode) {
      swiper.onScroll = onScroll.bind(swiper);
    }
    swiper.onClick = onClick.bind(swiper);
    swiper.onLoad = onLoad.bind(swiper);
    events(swiper, "on");
  }
  function detachEvents() {
    const swiper = this;
    events(swiper, "off");
  }
  var events$1 = {
    attachEvents,
    detachEvents
  };
  var isGridEnabled = (swiper, params) => {
    return swiper.grid && params.grid && params.grid.rows > 1;
  };
  function setBreakpoint() {
    const swiper = this;
    const {
      realIndex,
      initialized,
      params,
      el
    } = swiper;
    const breakpoints2 = params.breakpoints;
    if (!breakpoints2 || breakpoints2 && Object.keys(breakpoints2).length === 0) return;
    const document2 = getDocument();
    const breakpointsBase = params.breakpointsBase === "window" || !params.breakpointsBase ? params.breakpointsBase : "container";
    const breakpointContainer = ["window", "container"].includes(params.breakpointsBase) || !params.breakpointsBase ? swiper.el : document2.querySelector(params.breakpointsBase);
    const breakpoint = swiper.getBreakpoint(breakpoints2, breakpointsBase, breakpointContainer);
    if (!breakpoint || swiper.currentBreakpoint === breakpoint) return;
    const breakpointOnlyParams = breakpoint in breakpoints2 ? breakpoints2[breakpoint] : void 0;
    const breakpointParams = breakpointOnlyParams || swiper.originalParams;
    const wasMultiRow = isGridEnabled(swiper, params);
    const isMultiRow = isGridEnabled(swiper, breakpointParams);
    const wasGrabCursor = swiper.params.grabCursor;
    const isGrabCursor = breakpointParams.grabCursor;
    const wasEnabled = params.enabled;
    if (wasMultiRow && !isMultiRow) {
      el.classList.remove(`${params.containerModifierClass}grid`, `${params.containerModifierClass}grid-column`);
      swiper.emitContainerClasses();
    } else if (!wasMultiRow && isMultiRow) {
      el.classList.add(`${params.containerModifierClass}grid`);
      if (breakpointParams.grid.fill && breakpointParams.grid.fill === "column" || !breakpointParams.grid.fill && params.grid.fill === "column") {
        el.classList.add(`${params.containerModifierClass}grid-column`);
      }
      swiper.emitContainerClasses();
    }
    if (wasGrabCursor && !isGrabCursor) {
      swiper.unsetGrabCursor();
    } else if (!wasGrabCursor && isGrabCursor) {
      swiper.setGrabCursor();
    }
    ["navigation", "pagination", "scrollbar"].forEach((prop) => {
      if (typeof breakpointParams[prop] === "undefined") return;
      const wasModuleEnabled = params[prop] && params[prop].enabled;
      const isModuleEnabled = breakpointParams[prop] && breakpointParams[prop].enabled;
      if (wasModuleEnabled && !isModuleEnabled) {
        swiper[prop].disable();
      }
      if (!wasModuleEnabled && isModuleEnabled) {
        swiper[prop].enable();
      }
    });
    const directionChanged = breakpointParams.direction && breakpointParams.direction !== params.direction;
    const needsReLoop = params.loop && (breakpointParams.slidesPerView !== params.slidesPerView || directionChanged);
    const wasLoop = params.loop;
    if (directionChanged && initialized) {
      swiper.changeDirection();
    }
    extend2(swiper.params, breakpointParams);
    const isEnabled = swiper.params.enabled;
    const hasLoop = swiper.params.loop;
    Object.assign(swiper, {
      allowTouchMove: swiper.params.allowTouchMove,
      allowSlideNext: swiper.params.allowSlideNext,
      allowSlidePrev: swiper.params.allowSlidePrev
    });
    if (wasEnabled && !isEnabled) {
      swiper.disable();
    } else if (!wasEnabled && isEnabled) {
      swiper.enable();
    }
    swiper.currentBreakpoint = breakpoint;
    swiper.emit("_beforeBreakpoint", breakpointParams);
    if (initialized) {
      if (needsReLoop) {
        swiper.loopDestroy();
        swiper.loopCreate(realIndex);
        swiper.updateSlides();
      } else if (!wasLoop && hasLoop) {
        swiper.loopCreate(realIndex);
        swiper.updateSlides();
      } else if (wasLoop && !hasLoop) {
        swiper.loopDestroy();
      }
    }
    swiper.emit("breakpoint", breakpointParams);
  }
  function getBreakpoint(breakpoints2, base = "window", containerEl) {
    if (!breakpoints2 || base === "container" && !containerEl) return void 0;
    let breakpoint = false;
    const window2 = getWindow();
    const currentHeight = base === "window" ? window2.innerHeight : containerEl.clientHeight;
    const points = Object.keys(breakpoints2).map((point) => {
      if (typeof point === "string" && point.indexOf("@") === 0) {
        const minRatio = parseFloat(point.substr(1));
        const value = currentHeight * minRatio;
        return {
          value,
          point
        };
      }
      return {
        value: point,
        point
      };
    });
    points.sort((a, b) => parseInt(a.value, 10) - parseInt(b.value, 10));
    for (let i = 0; i < points.length; i += 1) {
      const {
        point,
        value
      } = points[i];
      if (base === "window") {
        if (window2.matchMedia(`(min-width: ${value}px)`).matches) {
          breakpoint = point;
        }
      } else if (value <= containerEl.clientWidth) {
        breakpoint = point;
      }
    }
    return breakpoint || "max";
  }
  var breakpoints = {
    setBreakpoint,
    getBreakpoint
  };
  function prepareClasses(entries, prefix) {
    const resultClasses = [];
    entries.forEach((item) => {
      if (typeof item === "object") {
        Object.keys(item).forEach((classNames) => {
          if (item[classNames]) {
            resultClasses.push(prefix + classNames);
          }
        });
      } else if (typeof item === "string") {
        resultClasses.push(prefix + item);
      }
    });
    return resultClasses;
  }
  function addClasses() {
    const swiper = this;
    const {
      classNames,
      params,
      rtl,
      el,
      device
    } = swiper;
    const suffixes = prepareClasses(["initialized", params.direction, {
      "free-mode": swiper.params.freeMode && params.freeMode.enabled
    }, {
      "autoheight": params.autoHeight
    }, {
      "rtl": rtl
    }, {
      "grid": params.grid && params.grid.rows > 1
    }, {
      "grid-column": params.grid && params.grid.rows > 1 && params.grid.fill === "column"
    }, {
      "android": device.android
    }, {
      "ios": device.ios
    }, {
      "css-mode": params.cssMode
    }, {
      "centered": params.cssMode && params.centeredSlides
    }, {
      "watch-progress": params.watchSlidesProgress
    }], params.containerModifierClass);
    classNames.push(...suffixes);
    el.classList.add(...classNames);
    swiper.emitContainerClasses();
  }
  function removeClasses() {
    const swiper = this;
    const {
      el,
      classNames
    } = swiper;
    if (!el || typeof el === "string") return;
    el.classList.remove(...classNames);
    swiper.emitContainerClasses();
  }
  var classes = {
    addClasses,
    removeClasses
  };
  function checkOverflow() {
    const swiper = this;
    const {
      isLocked: wasLocked,
      params
    } = swiper;
    const {
      slidesOffsetBefore
    } = params;
    if (slidesOffsetBefore) {
      const lastSlideIndex = swiper.slides.length - 1;
      const lastSlideRightEdge = swiper.slidesGrid[lastSlideIndex] + swiper.slidesSizesGrid[lastSlideIndex] + slidesOffsetBefore * 2;
      swiper.isLocked = swiper.size > lastSlideRightEdge;
    } else {
      swiper.isLocked = swiper.snapGrid.length === 1;
    }
    if (params.allowSlideNext === true) {
      swiper.allowSlideNext = !swiper.isLocked;
    }
    if (params.allowSlidePrev === true) {
      swiper.allowSlidePrev = !swiper.isLocked;
    }
    if (wasLocked && wasLocked !== swiper.isLocked) {
      swiper.isEnd = false;
    }
    if (wasLocked !== swiper.isLocked) {
      swiper.emit(swiper.isLocked ? "lock" : "unlock");
    }
  }
  var checkOverflow$1 = {
    checkOverflow
  };
  var defaults = {
    init: true,
    direction: "horizontal",
    oneWayMovement: false,
    swiperElementNodeName: "SWIPER-CONTAINER",
    touchEventsTarget: "wrapper",
    initialSlide: 0,
    speed: 300,
    cssMode: false,
    updateOnWindowResize: true,
    resizeObserver: true,
    nested: false,
    createElements: false,
    eventsPrefix: "swiper",
    enabled: true,
    focusableElements: "input, select, option, textarea, button, video, label",
    // Overrides
    width: null,
    height: null,
    //
    preventInteractionOnTransition: false,
    // ssr
    userAgent: null,
    url: null,
    // To support iOS's swipe-to-go-back gesture (when being used in-app).
    edgeSwipeDetection: false,
    edgeSwipeThreshold: 20,
    // Autoheight
    autoHeight: false,
    // Set wrapper width
    setWrapperSize: false,
    // Virtual Translate
    virtualTranslate: false,
    // Effects
    effect: "slide",
    // 'slide' or 'fade' or 'cube' or 'coverflow' or 'flip'
    // Breakpoints
    breakpoints: void 0,
    breakpointsBase: "window",
    // Slides grid
    spaceBetween: 0,
    slidesPerView: 1,
    slidesPerGroup: 1,
    slidesPerGroupSkip: 0,
    slidesPerGroupAuto: false,
    centeredSlides: false,
    centeredSlidesBounds: false,
    slidesOffsetBefore: 0,
    // in px
    slidesOffsetAfter: 0,
    // in px
    normalizeSlideIndex: true,
    centerInsufficientSlides: false,
    snapToSlideEdge: false,
    // Disable swiper and hide navigation when container not overflow
    watchOverflow: true,
    // Round length
    roundLengths: false,
    // Touches
    touchRatio: 1,
    touchAngle: 45,
    simulateTouch: true,
    shortSwipes: true,
    longSwipes: true,
    longSwipesRatio: 0.5,
    longSwipesMs: 300,
    followFinger: true,
    allowTouchMove: true,
    threshold: 5,
    touchMoveStopPropagation: false,
    touchStartPreventDefault: true,
    touchStartForcePreventDefault: false,
    touchReleaseOnEdges: false,
    // Unique Navigation Elements
    uniqueNavElements: true,
    // Resistance
    resistance: true,
    resistanceRatio: 0.85,
    // Progress
    watchSlidesProgress: false,
    // Cursor
    grabCursor: false,
    // Clicks
    preventClicks: true,
    preventClicksPropagation: true,
    slideToClickedSlide: false,
    // loop
    loop: false,
    loopAddBlankSlides: true,
    loopAdditionalSlides: 0,
    loopPreventsSliding: true,
    // rewind
    rewind: false,
    // Swiping/no swiping
    allowSlidePrev: true,
    allowSlideNext: true,
    swipeHandler: null,
    // '.swipe-handler',
    noSwiping: true,
    noSwipingClass: "swiper-no-swiping",
    noSwipingSelector: null,
    // Passive Listeners
    passiveListeners: true,
    maxBackfaceHiddenSlides: 10,
    // NS
    containerModifierClass: "swiper-",
    // NEW
    slideClass: "swiper-slide",
    slideBlankClass: "swiper-slide-blank",
    slideActiveClass: "swiper-slide-active",
    slideVisibleClass: "swiper-slide-visible",
    slideFullyVisibleClass: "swiper-slide-fully-visible",
    slideNextClass: "swiper-slide-next",
    slidePrevClass: "swiper-slide-prev",
    wrapperClass: "swiper-wrapper",
    lazyPreloaderClass: "swiper-lazy-preloader",
    lazyPreloadPrevNext: 0,
    // Callbacks
    runCallbacksOnInit: true,
    // Internals
    _emitClasses: false
  };
  function moduleExtendParams(params, allModulesParams) {
    return function extendParams(obj = {}) {
      const moduleParamName = Object.keys(obj)[0];
      const moduleParams = obj[moduleParamName];
      if (typeof moduleParams !== "object" || moduleParams === null) {
        extend2(allModulesParams, obj);
        return;
      }
      if (params[moduleParamName] === true) {
        params[moduleParamName] = {
          enabled: true
        };
      }
      if (moduleParamName === "navigation" && params[moduleParamName] && params[moduleParamName].enabled && !params[moduleParamName].prevEl && !params[moduleParamName].nextEl) {
        params[moduleParamName].auto = true;
      }
      if (["pagination", "scrollbar"].indexOf(moduleParamName) >= 0 && params[moduleParamName] && params[moduleParamName].enabled && !params[moduleParamName].el) {
        params[moduleParamName].auto = true;
      }
      if (!(moduleParamName in params && "enabled" in moduleParams)) {
        extend2(allModulesParams, obj);
        return;
      }
      if (typeof params[moduleParamName] === "object" && !("enabled" in params[moduleParamName])) {
        params[moduleParamName].enabled = true;
      }
      if (!params[moduleParamName]) params[moduleParamName] = {
        enabled: false
      };
      extend2(allModulesParams, obj);
    };
  }
  var prototypes = {
    eventsEmitter,
    update,
    translate,
    transition,
    slide,
    loop,
    grabCursor,
    events: events$1,
    breakpoints,
    checkOverflow: checkOverflow$1,
    classes
  };
  var extendedDefaults = {};
  var Swiper = class _Swiper {
    constructor(...args) {
      let el;
      let params;
      if (args.length === 1 && args[0].constructor && Object.prototype.toString.call(args[0]).slice(8, -1) === "Object") {
        params = args[0];
      } else {
        [el, params] = args;
      }
      if (!params) params = {};
      params = extend2({}, params);
      if (el && !params.el) params.el = el;
      const document2 = getDocument();
      if (params.el && typeof params.el === "string" && document2.querySelectorAll(params.el).length > 1) {
        const swipers = [];
        document2.querySelectorAll(params.el).forEach((containerEl) => {
          const newParams = extend2({}, params, {
            el: containerEl
          });
          swipers.push(new _Swiper(newParams));
        });
        return swipers;
      }
      const swiper = this;
      swiper.__swiper__ = true;
      swiper.support = getSupport();
      swiper.device = getDevice({
        userAgent: params.userAgent
      });
      swiper.browser = getBrowser();
      swiper.eventsListeners = {};
      swiper.eventsAnyListeners = [];
      swiper.modules = [...swiper.__modules__];
      if (params.modules && Array.isArray(params.modules)) {
        params.modules.forEach((mod) => {
          if (typeof mod === "function" && swiper.modules.indexOf(mod) < 0) {
            swiper.modules.push(mod);
          }
        });
      }
      const allModulesParams = {};
      swiper.modules.forEach((mod) => {
        mod({
          params,
          swiper,
          extendParams: moduleExtendParams(params, allModulesParams),
          on: swiper.on.bind(swiper),
          once: swiper.once.bind(swiper),
          off: swiper.off.bind(swiper),
          emit: swiper.emit.bind(swiper)
        });
      });
      const swiperParams = extend2({}, defaults, allModulesParams);
      swiper.params = extend2({}, swiperParams, extendedDefaults, params);
      swiper.originalParams = extend2({}, swiper.params);
      swiper.passedParams = extend2({}, params);
      if (swiper.params && swiper.params.on) {
        Object.keys(swiper.params.on).forEach((eventName) => {
          swiper.on(eventName, swiper.params.on[eventName]);
        });
      }
      if (swiper.params && swiper.params.onAny) {
        swiper.onAny(swiper.params.onAny);
      }
      Object.assign(swiper, {
        enabled: swiper.params.enabled,
        el,
        // Classes
        classNames: [],
        // Slides
        slides: [],
        slidesGrid: [],
        snapGrid: [],
        slidesSizesGrid: [],
        // isDirection
        isHorizontal() {
          return swiper.params.direction === "horizontal";
        },
        isVertical() {
          return swiper.params.direction === "vertical";
        },
        // Indexes
        activeIndex: 0,
        realIndex: 0,
        //
        isBeginning: true,
        isEnd: false,
        // Props
        translate: 0,
        previousTranslate: 0,
        progress: 0,
        velocity: 0,
        animating: false,
        cssOverflowAdjustment() {
          return Math.trunc(this.translate / 2 ** 23) * 2 ** 23;
        },
        // Locks
        allowSlideNext: swiper.params.allowSlideNext,
        allowSlidePrev: swiper.params.allowSlidePrev,
        // Touch Events
        touchEventsData: {
          isTouched: void 0,
          isMoved: void 0,
          allowTouchCallbacks: void 0,
          touchStartTime: void 0,
          isScrolling: void 0,
          currentTranslate: void 0,
          startTranslate: void 0,
          allowThresholdMove: void 0,
          // Form elements to match
          focusableElements: swiper.params.focusableElements,
          // Last click time
          lastClickTime: 0,
          clickTimeout: void 0,
          // Velocities
          velocities: [],
          allowMomentumBounce: void 0,
          startMoving: void 0,
          pointerId: null,
          touchId: null
        },
        // Clicks
        allowClick: true,
        // Touches
        allowTouchMove: swiper.params.allowTouchMove,
        touches: {
          startX: 0,
          startY: 0,
          currentX: 0,
          currentY: 0,
          diff: 0
        },
        // Images
        imagesToLoad: [],
        imagesLoaded: 0
      });
      swiper.emit("_swiper");
      if (swiper.params.init) {
        swiper.init();
      }
      return swiper;
    }
    getDirectionLabel(property) {
      if (this.isHorizontal()) {
        return property;
      }
      return {
        "width": "height",
        "margin-top": "margin-left",
        "margin-bottom ": "margin-right",
        "margin-left": "margin-top",
        "margin-right": "margin-bottom",
        "padding-left": "padding-top",
        "padding-right": "padding-bottom",
        "marginRight": "marginBottom"
      }[property];
    }
    getSlideIndex(slideEl) {
      const {
        slidesEl,
        params
      } = this;
      const slides = elementChildren(slidesEl, `.${params.slideClass}, swiper-slide`);
      const firstSlideIndex = elementIndex(slides[0]);
      return elementIndex(slideEl) - firstSlideIndex;
    }
    getSlideIndexByData(index) {
      return this.getSlideIndex(this.slides.find((slideEl) => slideEl.getAttribute("data-swiper-slide-index") * 1 === index));
    }
    getSlideIndexWhenGrid(index) {
      if (this.grid && this.params.grid && this.params.grid.rows > 1) {
        if (this.params.grid.fill === "column") {
          index = Math.floor(index / this.params.grid.rows);
        } else if (this.params.grid.fill === "row") {
          index = index % Math.ceil(this.slides.length / this.params.grid.rows);
        }
      }
      return index;
    }
    recalcSlides() {
      const swiper = this;
      const {
        slidesEl,
        params
      } = swiper;
      swiper.slides = elementChildren(slidesEl, `.${params.slideClass}, swiper-slide`);
    }
    enable() {
      const swiper = this;
      if (swiper.enabled) return;
      swiper.enabled = true;
      if (swiper.params.grabCursor) {
        swiper.setGrabCursor();
      }
      swiper.emit("enable");
    }
    disable() {
      const swiper = this;
      if (!swiper.enabled) return;
      swiper.enabled = false;
      if (swiper.params.grabCursor) {
        swiper.unsetGrabCursor();
      }
      swiper.emit("disable");
    }
    setProgress(progress, speed) {
      const swiper = this;
      progress = Math.min(Math.max(progress, 0), 1);
      const min = swiper.minTranslate();
      const max = swiper.maxTranslate();
      const current = (max - min) * progress + min;
      swiper.translateTo(current, typeof speed === "undefined" ? 0 : speed);
      swiper.updateActiveIndex();
      swiper.updateSlidesClasses();
    }
    emitContainerClasses() {
      const swiper = this;
      if (!swiper.params._emitClasses || !swiper.el) return;
      const cls = swiper.el.className.split(" ").filter((className) => {
        return className.indexOf("swiper") === 0 || className.indexOf(swiper.params.containerModifierClass) === 0;
      });
      swiper.emit("_containerClasses", cls.join(" "));
    }
    getSlideClasses(slideEl) {
      const swiper = this;
      if (swiper.destroyed) return "";
      return slideEl.className.split(" ").filter((className) => {
        return className.indexOf("swiper-slide") === 0 || className.indexOf(swiper.params.slideClass) === 0;
      }).join(" ");
    }
    emitSlidesClasses() {
      const swiper = this;
      if (!swiper.params._emitClasses || !swiper.el) return;
      const updates = [];
      swiper.slides.forEach((slideEl) => {
        const classNames = swiper.getSlideClasses(slideEl);
        updates.push({
          slideEl,
          classNames
        });
        swiper.emit("_slideClass", slideEl, classNames);
      });
      swiper.emit("_slideClasses", updates);
    }
    slidesPerViewDynamic(view = "current", exact = false) {
      const swiper = this;
      const {
        params,
        slides,
        slidesGrid,
        slidesSizesGrid,
        size: swiperSize,
        activeIndex
      } = swiper;
      let spv = 1;
      if (typeof params.slidesPerView === "number") return params.slidesPerView;
      if (params.centeredSlides) {
        let slideSize = slides[activeIndex] ? Math.ceil(slides[activeIndex].swiperSlideSize) : 0;
        let breakLoop;
        for (let i = activeIndex + 1; i < slides.length; i += 1) {
          if (slides[i] && !breakLoop) {
            slideSize += Math.ceil(slides[i].swiperSlideSize);
            spv += 1;
            if (slideSize > swiperSize) breakLoop = true;
          }
        }
        for (let i = activeIndex - 1; i >= 0; i -= 1) {
          if (slides[i] && !breakLoop) {
            slideSize += slides[i].swiperSlideSize;
            spv += 1;
            if (slideSize > swiperSize) breakLoop = true;
          }
        }
      } else {
        if (view === "current") {
          for (let i = activeIndex + 1; i < slides.length; i += 1) {
            const slideInView = exact ? slidesGrid[i] + slidesSizesGrid[i] - slidesGrid[activeIndex] < swiperSize : slidesGrid[i] - slidesGrid[activeIndex] < swiperSize;
            if (slideInView) {
              spv += 1;
            }
          }
        } else {
          for (let i = activeIndex - 1; i >= 0; i -= 1) {
            const slideInView = slidesGrid[activeIndex] - slidesGrid[i] < swiperSize;
            if (slideInView) {
              spv += 1;
            }
          }
        }
      }
      return spv;
    }
    update() {
      const swiper = this;
      if (!swiper || swiper.destroyed) return;
      const {
        snapGrid,
        params
      } = swiper;
      if (params.breakpoints) {
        swiper.setBreakpoint();
      }
      [...swiper.el.querySelectorAll('[loading="lazy"]')].forEach((imageEl) => {
        if (imageEl.complete) {
          processLazyPreloader(swiper, imageEl);
        }
      });
      swiper.updateSize();
      swiper.updateSlides();
      swiper.updateProgress();
      swiper.updateSlidesClasses();
      function setTranslate2() {
        const translateValue = swiper.rtlTranslate ? swiper.translate * -1 : swiper.translate;
        const newTranslate = Math.min(Math.max(translateValue, swiper.maxTranslate()), swiper.minTranslate());
        swiper.setTranslate(newTranslate);
        swiper.updateActiveIndex();
        swiper.updateSlidesClasses();
      }
      let translated;
      if (params.freeMode && params.freeMode.enabled && !params.cssMode) {
        setTranslate2();
        if (params.autoHeight) {
          swiper.updateAutoHeight();
        }
      } else {
        if ((params.slidesPerView === "auto" || params.slidesPerView > 1) && swiper.isEnd && !params.centeredSlides) {
          const slides = swiper.virtual && params.virtual.enabled ? swiper.virtual.slides : swiper.slides;
          translated = swiper.slideTo(slides.length - 1, 0, false, true);
        } else {
          translated = swiper.slideTo(swiper.activeIndex, 0, false, true);
        }
        if (!translated) {
          setTranslate2();
        }
      }
      if (params.watchOverflow && snapGrid !== swiper.snapGrid) {
        swiper.checkOverflow();
      }
      swiper.emit("update");
    }
    changeDirection(newDirection, needUpdate = true) {
      const swiper = this;
      const currentDirection = swiper.params.direction;
      if (!newDirection) {
        newDirection = currentDirection === "horizontal" ? "vertical" : "horizontal";
      }
      if (newDirection === currentDirection || newDirection !== "horizontal" && newDirection !== "vertical") {
        return swiper;
      }
      swiper.el.classList.remove(`${swiper.params.containerModifierClass}${currentDirection}`);
      swiper.el.classList.add(`${swiper.params.containerModifierClass}${newDirection}`);
      swiper.emitContainerClasses();
      swiper.params.direction = newDirection;
      swiper.slides.forEach((slideEl) => {
        if (newDirection === "vertical") {
          slideEl.style.width = "";
        } else {
          slideEl.style.height = "";
        }
      });
      swiper.emit("changeDirection");
      if (needUpdate) swiper.update();
      return swiper;
    }
    changeLanguageDirection(direction) {
      const swiper = this;
      if (swiper.rtl && direction === "rtl" || !swiper.rtl && direction === "ltr") return;
      swiper.rtl = direction === "rtl";
      swiper.rtlTranslate = swiper.params.direction === "horizontal" && swiper.rtl;
      if (swiper.rtl) {
        swiper.el.classList.add(`${swiper.params.containerModifierClass}rtl`);
        swiper.el.dir = "rtl";
      } else {
        swiper.el.classList.remove(`${swiper.params.containerModifierClass}rtl`);
        swiper.el.dir = "ltr";
      }
      swiper.update();
    }
    mount(element) {
      const swiper = this;
      if (swiper.mounted) return true;
      let el = element || swiper.params.el;
      if (typeof el === "string") {
        el = document.querySelector(el);
      }
      if (!el) {
        return false;
      }
      el.swiper = swiper;
      if (el.parentNode && el.parentNode.host && el.parentNode.host.nodeName === swiper.params.swiperElementNodeName.toUpperCase()) {
        swiper.isElement = true;
      }
      const getWrapperSelector = () => {
        return `.${(swiper.params.wrapperClass || "").trim().split(" ").join(".")}`;
      };
      const getWrapper = () => {
        if (el && el.shadowRoot && el.shadowRoot.querySelector) {
          const res = el.shadowRoot.querySelector(getWrapperSelector());
          return res;
        }
        return elementChildren(el, getWrapperSelector())[0];
      };
      let wrapperEl = getWrapper();
      if (!wrapperEl && swiper.params.createElements) {
        wrapperEl = createElement("div", swiper.params.wrapperClass);
        el.append(wrapperEl);
        elementChildren(el, `.${swiper.params.slideClass}`).forEach((slideEl) => {
          wrapperEl.append(slideEl);
        });
      }
      Object.assign(swiper, {
        el,
        wrapperEl,
        slidesEl: swiper.isElement && !el.parentNode.host.slideSlots ? el.parentNode.host : wrapperEl,
        hostEl: swiper.isElement ? el.parentNode.host : el,
        mounted: true,
        // RTL
        rtl: el.dir.toLowerCase() === "rtl" || elementStyle(el, "direction") === "rtl",
        rtlTranslate: swiper.params.direction === "horizontal" && (el.dir.toLowerCase() === "rtl" || elementStyle(el, "direction") === "rtl"),
        wrongRTL: elementStyle(wrapperEl, "display") === "-webkit-box"
      });
      return true;
    }
    init(el) {
      const swiper = this;
      if (swiper.initialized) return swiper;
      const mounted = swiper.mount(el);
      if (mounted === false) return swiper;
      swiper.emit("beforeInit");
      if (swiper.params.breakpoints) {
        swiper.setBreakpoint();
      }
      swiper.addClasses();
      swiper.updateSize();
      swiper.updateSlides();
      if (swiper.params.watchOverflow) {
        swiper.checkOverflow();
      }
      if (swiper.params.grabCursor && swiper.enabled) {
        swiper.setGrabCursor();
      }
      if (swiper.params.loop && swiper.virtual && swiper.params.virtual.enabled) {
        swiper.slideTo(swiper.params.initialSlide + swiper.virtual.slidesBefore, 0, swiper.params.runCallbacksOnInit, false, true);
      } else {
        swiper.slideTo(swiper.params.initialSlide, 0, swiper.params.runCallbacksOnInit, false, true);
      }
      if (swiper.params.loop) {
        swiper.loopCreate(void 0, true);
      }
      swiper.attachEvents();
      const lazyElements = [...swiper.el.querySelectorAll('[loading="lazy"]')];
      if (swiper.isElement) {
        lazyElements.push(...swiper.hostEl.querySelectorAll('[loading="lazy"]'));
      }
      lazyElements.forEach((imageEl) => {
        if (imageEl.complete) {
          processLazyPreloader(swiper, imageEl);
        } else {
          imageEl.addEventListener("load", (e) => {
            processLazyPreloader(swiper, e.target);
          });
        }
      });
      preload(swiper);
      swiper.initialized = true;
      preload(swiper);
      swiper.emit("init");
      swiper.emit("afterInit");
      return swiper;
    }
    destroy(deleteInstance = true, cleanStyles = true) {
      const swiper = this;
      const {
        params,
        el,
        wrapperEl,
        slides
      } = swiper;
      if (typeof swiper.params === "undefined" || swiper.destroyed) {
        return null;
      }
      swiper.emit("beforeDestroy");
      swiper.initialized = false;
      swiper.detachEvents();
      if (params.loop) {
        swiper.loopDestroy();
      }
      if (cleanStyles) {
        swiper.removeClasses();
        if (el && typeof el !== "string") {
          el.removeAttribute("style");
        }
        if (wrapperEl) {
          wrapperEl.removeAttribute("style");
        }
        if (slides && slides.length) {
          slides.forEach((slideEl) => {
            slideEl.classList.remove(params.slideVisibleClass, params.slideFullyVisibleClass, params.slideActiveClass, params.slideNextClass, params.slidePrevClass);
            slideEl.removeAttribute("style");
            slideEl.removeAttribute("data-swiper-slide-index");
          });
        }
      }
      swiper.emit("destroy");
      Object.keys(swiper.eventsListeners).forEach((eventName) => {
        swiper.off(eventName);
      });
      if (deleteInstance !== false) {
        if (swiper.el && typeof swiper.el !== "string") {
          swiper.el.swiper = null;
        }
        deleteProps(swiper);
      }
      swiper.destroyed = true;
      return null;
    }
    static extendDefaults(newDefaults) {
      extend2(extendedDefaults, newDefaults);
    }
    static get extendedDefaults() {
      return extendedDefaults;
    }
    static get defaults() {
      return defaults;
    }
    static installModule(mod) {
      if (!_Swiper.prototype.__modules__) _Swiper.prototype.__modules__ = [];
      const modules = _Swiper.prototype.__modules__;
      if (typeof mod === "function" && modules.indexOf(mod) < 0) {
        modules.push(mod);
      }
    }
    static use(module) {
      if (Array.isArray(module)) {
        module.forEach((m) => _Swiper.installModule(m));
        return _Swiper;
      }
      _Swiper.installModule(module);
      return _Swiper;
    }
  };
  Object.keys(prototypes).forEach((prototypeGroup) => {
    Object.keys(prototypes[prototypeGroup]).forEach((protoMethod) => {
      Swiper.prototype[protoMethod] = prototypes[prototypeGroup][protoMethod];
    });
  });
  Swiper.use([Resize, Observer]);

  // src/utils/exterior-scheme-modal.ts
  var NEW_COMMUNITY_EXTERIOR_IMAGE_URLS = {
    glenview: {
      spanishContemporary: [
        "https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22eddb81b67658917d147c_Sch%201%20-%20Sunlit%20Ivory.webp",
        "https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22edd689113f6185fb81bc_Sch%202%20-%20Sandstone%20Villa.webp",
        "https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22edd72ba437a787a12c6e_Sch%203%20-%20Stone%20Garden.webp",
        "https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22edd765053904adda70f1_Sch%204%20-%20Sienna%20Stone.webp",
        "https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22edd754f23ca1aa66fd5c_Sch%205%20-%20Coastal%20Villa.webp"
      ],
      transitionalRanch: [
        "https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22edeba8e815ef475c3e2c_Sch%201%20-%20White%20Oak%20Ranch.webp",
        "https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22edeb74297c1a3021d0b4_Sch%202%20-%20Midnight%20Ridge.webp",
        "https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22edebb734c9412a1851a1_Sch%203%20-%20Oakstone.webp",
        "https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22edea46c4dce897c622c0_Sch%204%20-%20White%20Mason.webp",
        "https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22edeaf11078832301af0d_Sch%205%20-%20Black%20Timber.webp"
      ],
      coastalColonial: [
        "https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22edac6e6422b45442464d_Sch%202%20-%20Stone%20Harbor.webp",
        "https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22edac9d58911e051d3fba_Sch%203%20-%20Seabreeze.webp",
        "https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22edac8f40d304dd481aec_Sch%204%20-%20Ivory%20%26%20Onyx.webp",
        "https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22edace365374d2b4c2c3f_Sch%205%20-%20Coastal%20Stone.webp"
      ],
      englishCottage: [
        "https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22edbe0c3370fb3e35ffaf_Sch%202%20-%20Abbey%20Iron.webp",
        "https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22edbea3771290396ed4df_Sch%203%20-%20Bronze%20Meadow.webp",
        "https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22edbef4494d74c17404a9_Sch%204%20-%20Manor%20Brick.webp",
        "https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22edbe2c42ef25e857568f_Sch%205%20-%20Chateau%20Stone.webp"
      ]
    },
    elm: {
      spanishContemporary: [
        "https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22ecc8f3437fec84c633be_Sch%201%20-%20Sunlit%20Ivory.webp",
        "https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22ecc8f4494d74c17399e4_Sch%202%20-%20Sandstone%20Villa.webp",
        "https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22ecca2472a39b3cbd7498_Sch%203%20-%20Stone%20Garden.webp",
        "https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22eccaae1ca7e49161fbc8_Sch%204%20-%20Sienna%20Stone.webp",
        "https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22ecca872355c22f8eaadf_Sch%205%20-%20Coastal%20Villa.webp"
      ],
      transitionalRanch: [
        "https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22ecac0c3370fb3e356423_Sch%201%20-%20White%20Oak%20Ranch.webp",
        "https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22ecac269d95cd19e0e026_Sch%202%20-%20Midnight%20Ridge.webp",
        "https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22ecacf110788323011ee1_Sch%203%20-%20Oakstone.webp",
        "https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22ecab55c9aaa9438a7a06_Sch%204%20-%20White%20Mason.webp",
        "https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22ecac08f434791bad029e_Sch%205%20-%20Black%20Timber.webp"
      ],
      coastalColonial: [
        "https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22ec7e9d58911e051c5dc8_Sch%202%20-%20Stone%20Harbor.webp",
        "https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22ec7f2472a39b3cbd5614_Sch%203%20-%20Seabreeze.webp",
        "https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22ec7e61f18799715386b8_Sch%204%20-%20Ivory%20%26%20Onyx.webp",
        "https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22ec7fb75aee6fe61ebf09_Sch%205%20-%20Coastal%20Stone.webp"
      ],
      englishCottage: [
        "https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22ec90872355c22f8e89a8_Sch%202%20-%20Abbey%20Iron.webp",
        "https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22ec9061f1879971538dfd_Sch%203%20-%20Bronze%20Meadow.webp",
        "https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22ec9095a46fd82b1cb0b3_Sch%204%20-%20Manor%20Brick.webp",
        "https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22ec908f40d304dd4776a6_Sch%205%20-%20Chateau%20Stone.webp"
      ]
    },
    willow: {
      spanishContemporary: [
        "https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22f0c220e6f459b8cc97fc_Sch%201%20-%20Sunlit%20Ivory.webp",
        "https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22f0c3679eea90bc21737e_Sch%202%20-%20Sandstone%20Villa.webp",
        "https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22f0c227f295bf102c73d9_Sch%203%20-%20Stone%20Garden.webp",
        "https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22f0c23b306ae798b2d5b7_Sch%204%20-%20Sienna%20Stone.webp",
        "https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22f0c207d8f3773f4fde0e_Sch%205%20-%20Coastal%20Villa.webp"
      ],
      transitionalRanch: [
        "https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22f0e02f638a601d29fc82_Sch%201%20-%20White%20Oak%20Ranch.webp",
        "https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22f0e02d888efac45336f8_Sch%202%20-%20Midnight%20Ridge.webp",
        "https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22f0e0b734c9412a19d579_Sch%203%20-%20Oakstone.webp",
        "https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22f0e0cd6d5d498ce2e8ac_Sch%204%20-%20White%20Mason.webp",
        "https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22f0df57edcdcc3c089676_Sch%205%20-%20Black%20Timber.webp"
      ],
      coastalColonial: [
        "https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22f084544db6edddd13c4b_Sch%202%20-%20Stone%20Harbor.webp",
        "https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22f08420e6f459b8cc8171_Sch%203%20-%20Seabreeze.webp",
        "https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22f084ae64905f6a6340f6_Sch%204%20-%20Ivory%20%26%20Onyx.webp",
        "https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22f084f11078832302fea2_Sch%205%20-%20Coastal%20Stone.webp"
      ],
      englishCottage: [
        "https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22f0a218fa7f2207b9e007_Sch%202%20-%20Abbey%20Iron.webp",
        "https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22f0a1a3771290397042a1_Sch%203%20-%20Bronze%20Meadow.webp",
        "https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22f0a1ae1ca7e491642775_Sch%204%20-%20Manor%20Brick.webp",
        "https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22f0a12d888efac453195c_Sch%205%20-%20Chateau%20Stone.webp"
      ]
    },
    vista: {
      spanishContemporary: [
        "https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22f167939798a0c8459ed2_Sch%201%20-%20Sunlit%20Ivory.webp",
        "https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22f1666982be65b05567c0_Sch%202%20-%20Sandstone%20Villa.webp",
        "https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22f167f461c0c66341fa0d_Sch%203%20-%20Stone%20Garden.webp",
        "https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22f1672c42ef25e859297c_Sch%204%20-%20Sienna%20Stone.webp",
        "https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22f1664ff4597241d8f033_Sch%205%20-%20Coastal%20Villa.webp"
      ],
      transitionalRanch: [
        "https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22f14f550f4fd0cf5a4561_Sch%201%20-%20White%20Oak%20Ranch.webp",
        "https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22f14e20e6f459b8ccc7ed_Sch%202%20-%20Midnight%20Ridge.webp",
        "https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22f14f52e0fbbd6afa96b4_Sch%203%20-%20Oakstone.webp",
        "https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22f14e32d82c66475c84c6_Sch%204%20-%20White%20Mason.webp",
        "https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22f14f4ff4597241d8e0f7_Sch%205%20-%20Black%20Timber.webp"
      ],
      coastalColonial: [
        "https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22f1b73b306ae798b3454e_Sch%202%20-%20Stone%20Harbor.webp",
        "https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22f1b7fccec2bd9f7f3bf0_Sch%203%20-%20Seabreeze.webp",
        "https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22f1b7f3437fec84c94c74_Sch%204%20-%20Ivory%20%26%20Onyx.webp",
        "https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22f1b75d778b0e1d343aec_Sch%205%20-%20Coastal%20Stone.webp"
      ],
      englishCottage: [
        "https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22f193475a005a81e89db1_Sch%202%20-%20Abbey%20Iron.webp",
        "https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22f1939619a764f4d5f48a_Sch%203%20-%20Bronze%20Meadow.webp",
        "https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22f1939ab120a2472fcc9b_Sch%204%20-%20Manor%20Brick.webp",
        "https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22f193f1107883230392a1_Sch%205%20-%20Chateau%20Stone.webp"
      ]
    },
    ambrose: {
      spanishContemporary: [
        "https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22ed1e9d58911e051cc527_Sch%201%20-%20Sunlit%20Ivory.webp",
        "https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22ed1e50c5363e89576c23_Sch%202%20-%20Sandstone%20Villa.webp",
        "https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22ed1e57edcdcc3c06dc7f_Sch%203%20-%20Stone%20Garden.webp",
        "https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22ed1e55c9aaa9438ac2b6_Sch%204%20-%20Sienna%20Stone.webp",
        "https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22ed1e0c3370fb3e359ffd_Sch%205%20-%20Coastal%20Villa.webp"
      ],
      transitionalRanch: [
        "https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22ed3920e6f459b8caf257_Sch%201%20-%20White%20Oak%20Ranch.webp",
        "https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22ed3af8c13be94948c3b2_Sch%202%20-%20Midnight%20Ridge.webp",
        "https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22ed3a61f1879971541248_Sch%203%20-%20Oakstone.webp",
        "https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22ed3a220472fb3ac3475b_Sch%204%20-%20White%20Mason.webp",
        "https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22ed3a939798a0c843907b_Sch%205%20-%20Black%20Timber.webp"
      ],
      coastalColonial: [
        "https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22ecef2ba437a787a0b71d_Sch%202%20-%20Stone%20Harbor.webp",
        "https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22ecefc74ccc360e2beea9_Sch%203%20-%20Seabreeze.webp",
        "https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22ecf0475a005a81e66998_Sch%204%20-%20Ivory%20%26%20Onyx.webp",
        "https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22ecef9619a764f4d3abc5_Sch%205%20-%20Coastal%20Stone.webp"
      ],
      englishCottage: [
        "https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22ed04269d95cd19e1032b_Sch%202%20-%20Abbey%20Iron.webp",
        "https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22ed048157506f00ae1c15_Sch%203%20-%20Bronze%20Meadow.webp",
        "https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22ed04a8e815ef475bc111_Sch%204%20-%20Manor%20Brick.webp",
        "https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22ed0445c164b3134e1b2d_Sch%205%20-%20Chateau%20Stone.webp"
      ]
    },
    alder: {
      spanishContemporary: [
        "https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22ef9295a46fd82b1e4964_Sch%201%20-%20Sunlit%20Ivory.webp",
        "https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22ed1e50c5363e89576c23_Sch%202%20-%20Sandstone%20Villa.webp",
        "https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22ed1e57edcdcc3c06dc7f_Sch%203%20-%20Stone%20Garden.webp",
        "https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22ed1e55c9aaa9438ac2b6_Sch%204%20-%20Sienna%20Stone.webp",
        "https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22ed1e0c3370fb3e359ffd_Sch%205%20-%20Coastal%20Villa.webp"
      ],
      transitionalRanch: [
        "https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22efe29d58911e051e60b9_Sch%201%20-%20White%20Oak%20Ranch.webp",
        "https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22efe4f8ae2a21e657e6c5_Sch%202%20-%20Midnight%20Ridge.webp",
        "https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22efe445c164b3134f6b84_Sch%203%20-%20Oakstone.webp",
        "https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22efe32d10f7997d7b25c6_Sch%204%20-%20White%20Mason.webp",
        "https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22efe227f295bf102bdd5f_Sch%205%20-%20Black%20Timber.webp"
      ],
      coastalColonial: [
        "https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22ef67cd6d5d498ce2266f_Sch%202%20-%20Stone%20Harbor.webp",
        "https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22ef6a438168dc11d43cdb_Sch%203%20-%20Seabreeze.webp",
        "https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22ef682ba437a787a1fdc9_Sch%204%20-%20Ivory%20%26%20Onyx.webp",
        "https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22ef6874297c1a3022840a_Sch%205%20-%20Coastal%20Stone.webp"
      ],
      englishCottage: [
        "https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22ef7cdb1b9afafad4b525_Sch%202%20-%20Abbey%20Iron.webp",
        "https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22ef7c94fec08c5d9f1fb1_Sch%203%20-%20Bronze%20Meadow.webp",
        "https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22ef7c679eea90bc20be8b_Sch%204%20-%20Manor%20Brick.webp",
        "https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/6a22ef7c8157506f00af4584_Sch%205%20-%20Chateau%20Stone.webp"
      ]
    }
  };
  var CRAFTSMAN_NAMES = [
    "Classic Cream",
    "Soft Green",
    "Coastal Navy",
    "Warm Taupe",
    "Natural Charcoal"
  ];
  var JANES_COTTAGE_NAMES = [
    "Warm White",
    "Dusk Gray",
    "Neutral Stone",
    "Soft White",
    "Historic Gray"
  ];
  var SPANISH_NAMES = [
    "Coastal White",
    "Natural Gray",
    "Garden Olive",
    "Rich Bronze",
    "Warm Earth Clay"
  ];
  var SPANISH_CONTEMPORARY_SCHEMES = [
    { number: 1, name: "Sunlit Ivory" },
    { number: 2, name: "Sandstone Villa" },
    { number: 3, name: "Stone Garden" },
    { number: 4, name: "Sienna Stone" },
    { number: 5, name: "Coastal Villa" }
  ];
  var TRANSITIONAL_RANCH_SCHEMES = [
    { number: 1, name: "White Oak Ranch" },
    { number: 2, name: "Midnight Ridge" },
    { number: 3, name: "Oakstone" },
    { number: 4, name: "White Mason" },
    { number: 5, name: "Black Timber" }
  ];
  var COASTAL_COLONIAL_SCHEMES = [
    { number: 2, name: "Stone Harbor" },
    { number: 3, name: "Seabreeze" },
    { number: 4, name: "Ivory & Onyx" },
    { number: 5, name: "Coastal Stone" }
  ];
  var ENGLISH_COTTAGE_SCHEMES = [
    { number: 2, name: "Abbey Iron" },
    { number: 3, name: "Bronze Meadow" },
    { number: 4, name: "Manor Brick" },
    { number: 5, name: "Chateau Stone" }
  ];
  var EXTERIOR_IMAGE_SETS_BY_PLAN = {
    echo: {
      craftsman: [
        "https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69fa1179b6b2a0ae1e8ce5be_Eaton5_Craftsman_Sch1_ClassicCream.webp",
        "https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69fa11798c7f61ed170d02c1_Eaton5_Craftsman_Sch2_SoftGreen.webp",
        "https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69fa1178d4e789851d726afd_Eaton5_Craftsman_Sch3_CoastalNavy.webp",
        "https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69fa1179e37e4c9da35dd349_Eaton5_Craftsman_Sch4_WarmTaupe.webp",
        "https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69fa117934eb986df4409a80_Eaton5_Craftsman_Sch5_NaturalCharcoal.webp"
      ],
      janesCottage: [
        "https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f1f967ed46f583c45fb319_Eaton5_Janes_Cottage_Sch1_WarmWhite.webp",
        "https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f1f9673f19c0a2d78cbb9e_Eaton5_Janes_Cottage_Sch2_DuskGray.webp",
        "https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f1f967165e83dd2af826bb_Eaton5_Janes_Cottage_Sch3_NeutralStone.webp",
        "https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f1f967a7a2df84652e1078_Eaton5_Janes_Cottage_Sch4_SoftWhite.webp",
        "https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f1f9676e59091671c162ac_Eaton5_Janes_Cottage_Sch5_HistoricGray.webp"
      ],
      spanish: [
        "https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f1f981d8030b85e86c5eee_Eaton5_Spanish_Sch1)CoastalWhite.webp",
        "https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f1f9818dfc10b3ad322043_Eaton5_Spanish_Sch2_NaturalGray.webp",
        "https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f1f981b3fba19edac10345_Eaton5_Spanish_Sch3_GardenOlive.webp",
        "https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f1f9818582aeea3838bcd3_Eaton5_Spanish_Sch4_RichBronze.webp",
        "https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f1f981af3855fd07a02254_Eaton5_Spanish_Sch5_WarmEarthClay.webp"
      ]
    },
    merrick: {
      craftsman: [
        "https://cdn.prod.website-files.com/601ca16f9dfe00cc7bb4027c/69f3003b93c53e9b6387d557_69f1f95450b85abd3d949f4e_Eaton4_Craftsman_Sch1_ClassicCream.webp",
        "https://cdn.prod.website-files.com/601ca16f9dfe00cc7bb4027c/69f3003b93c53e9b6387d562_69f1f953252b3600fcbe4e80_Eaton4_Craftsman_Sch2_SoftGreen.webp",
        "https://cdn.prod.website-files.com/601ca16f9dfe00cc7bb4027c/69f3003a93c53e9b6387d547_69f1f954f0cccea740cd8b9f_Eaton4_Craftsman_Sch3_CoastalNavy.webp",
        "https://cdn.prod.website-files.com/601ca16f9dfe00cc7bb4027c/69f3003b93c53e9b6387d56d_69f1f955180a5af38a774901_Eaton4_Craftsman_Sch4_WarmTaupe.webp",
        "https://cdn.prod.website-files.com/601ca16f9dfe00cc7bb4027c/69f3003c93c53e9b6387d581_69f1f953ceb831e555c6f0c2_Eaton4_Craftsman_Sch5_NaturalCharcoal.webp"
      ],
      janesCottage: [
        "https://cdn.prod.website-files.com/601ca16f9dfe00cc7bb4027c/69f3003b93c53e9b6387d565_69f1fa3cc74e38671839449b_Eaton4_Janes_Cottage_Sch1_WarmWhite.webp",
        "https://cdn.prod.website-files.com/601ca16f9dfe00cc7bb4027c/69f3003c93c53e9b6387d57e_69f1fa3cff957cd5197530f5_Eaton4_Janes_Cottage_Sch2_DuskGray.webp",
        "https://cdn.prod.website-files.com/601ca16f9dfe00cc7bb4027c/69f3003b93c53e9b6387d55d_69f1fa3c848b541b0e090d97_Eaton4_Janes_Cottage_Sch3_NeutralStone.webp",
        "https://cdn.prod.website-files.com/601ca16f9dfe00cc7bb4027c/69f3003c93c53e9b6387d578_69f1fa3cf9c32ba7ba62c7e7_Eaton4_Janes_Cottage_Sch4_SoftWhite.webp",
        "https://cdn.prod.website-files.com/601ca16f9dfe00cc7bb4027c/69f3003a93c53e9b6387d54b_69f1fa3c26c535b3fa92955a_Eaton4_Janes_Cottage_Sch5_HistoricGray.webp"
      ],
      spanish: [
        "https://cdn.prod.website-files.com/601ca16f9dfe00cc7bb4027c/69f3003c93c53e9b6387d575_69f1fa27d27c3c9e6b23ce8d_Eaton4_Spanish_Sch1_CoastalWhite.webp",
        "https://cdn.prod.website-files.com/601ca16f9dfe00cc7bb4027c/69f3003a93c53e9b6387d54f_69f1fa27b19d1d6237faa1b6_Eaton4_Spanish_Sch2_NaturalGray.webp",
        "https://cdn.prod.website-files.com/601ca16f9dfe00cc7bb4027c/69f3003c93c53e9b6387d589_69f1fa27adcc4b13bfb7229e_Eaton4_Spanish_Sch3_GardenOlive.webp",
        "https://cdn.prod.website-files.com/601ca16f9dfe00cc7bb4027c/69f3003c93c53e9b6387d586_69f1fa2704074b196573ba2a_Eaton4_Spanish_Sch4_RichBronze.webp",
        "https://cdn.prod.website-files.com/601ca16f9dfe00cc7bb4027c/69f3003b93c53e9b6387d55a_69f1fa27d874fa8f14184b4c_Eaton4_Spanish_Sch5_WarmEarthClay.webp"
      ]
    },
    chaney: {
      craftsman: [
        "https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f1f8a6a7a2df84652df1c2_Eaton3_Craftsman_Sch1_ClassicCream.webp",
        "https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f1f8a571c267c5a6d19d59_Eaton3_Craftsman_Sch2_SoftGreen.webp",
        "https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f1f8a46e59091671c1452c_Eaton3_Craftsman_Sch3_CoastalNavy.webp",
        "https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f1f8a5151e31161533467a_Eaton3_Craftsman_Sch4_WarmTaupe.webp",
        "https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f1f8a5535e1ec75c9ed78b_Eaton3_Craftsman_Sch5_NaturalCharcoal.webp"
      ],
      janesCottage: [
        "https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f1f8b8a76017d864898f1c_Eaton3_Janes_Sch1_WarmWhite.webp",
        "https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f1f8b826f327fe8b8314c3_Eaton3_Janes_Sch2_DuskGray.webp",
        "https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f1f8b86e1c34584269d0b4_Eaton3_Janes_Sch3_NeutralStone.webp",
        "https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f1f8b80f8abd2778a65c61_Eaton3_Janes_Sch4_SoftWhite.webp",
        "https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f1f8b839d6f0b57222e683_Eaton3_Janes_Sch5_HistoricGray.webp"
      ],
      spanish: [
        "https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f1f8d119e08a63bb87a563_Eaton3_Spanish_Sch1_CoastalWhite.webp",
        "https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f1f8d1c002eece10343349_Eaton3_Spanish_Sch2_NaturalGray.webp",
        "https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f1f8d20cb4d186330f5414_Eaton3_Spanish_Sch3_GardenOlive.webp",
        "https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f1f8d2d0bc4c3d311c6867_Eaton3_Spanish_Sch4_RichBronze.webp",
        "https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f1f8d1f3573cd92cb08111_Eaton3_Spanish_Sch5_WArmEarthClay.webp"
      ]
    },
    loma: {
      craftsman: [
        "https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f1f998b885bb7225449c8e_Eaton2_Craftsman_Sch1_ClassicCream.webp",
        "https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f1f998ff957cd519750e2b_Eaton2_Craftsman_Sch2_SoftGreen.webp",
        "https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f1f99867d6924479cbd2bb_Eaton2_Craftsman_Sch3_CoastalNavy.webp",
        "https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f1f99816ad2a104acb7728_Eaton2_Craftsman_Sch4_WarmTaupe.webp",
        "https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f1f9987417fe7fb74e6bbd_Eaton2_Craftsman_Sch5_NaturalCharcoal.webp"
      ],
      janesCottage: [
        "https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f1f9c94e811fb2f2915ccd_Eaton2_Janes_Sch1_WarmWhite.webp",
        "https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f1f9c9444f0e9cf3870f8e_Eaton2_Janes_Sch2_DuskGray.webp",
        "https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f1f9c9e11203e2617c9946_Eaton2_Janes_Sch3_NeutralStone.webp",
        "https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f1f9c9255e1fbe5ac33217_Eaton2_Janes_Sch4_SoftWhite.webp",
        "https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f1f9c9d3067f0a7efe5fd6_Eaton2_Janes_Sch5_HistoricGray.webp"
      ],
      spanish: [
        "https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f1fa0096a959af0bd4ed45_Eaton2_Spanish_Sch1_CoastalWhite.webp",
        "https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f1fa00112be277eea18bd4_Eaton2_Spanish_Sch2_NaturalGray.webp",
        "https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f1f9ff24369ae8059a02bd_Eaton2_Spanish_Sch3_GardenOlive.webp",
        "https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f1fa0052b6244c225fa903_Eaton2_Spanish_Sch4_RichBronze.webp",
        "https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f1fa079e2ec043052c58e5_Eaton2_Spanish_Sch5_WarmEarthClay.webp"
      ]
    },
    sycamore: {
      craftsman: [
        "https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f1fa921c26d9ee20d7557e_Eaton1_Craftsman_Sch1_ClassicCream.webp",
        "https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f1fa9346432d98c0974cee_Eaton1_Craftsman_Sch2_SoftGreen.webp",
        "https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f1fa93d99dbd042136a8c5_Eaton1_Craftsman_Sch3_CoastalNavy.webp",
        "https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f1fa9275c170937d547cda_Eaton1_Craftsman_Sch4_WarmTaupe.webp",
        "https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f1fa93db5a646b559687d6_Eaton1_Craftsman_Sch5_NaturalCharcoal.webp"
      ],
      janesCottage: [
        "https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f1faac9a388e1b666a2e9f_Eaton1_Janes_Cottage_Sch1_WarmWhite.webp",
        "https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f1faac4cfe0437b90b4fee_Eaton1_Janes_Cottage_Sch2_DuskGray.webp",
        "https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f1faac6ce7a3c2af1aee22_Eaton1_Janes_Cottage_Sch3_NeutralStone.webp",
        "https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f1faac00a3f24d2deca82a_Eaton1_Janes_Cottage_Sch4_SoftWhite.webp",
        "https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f1faace73112fa77de5962_Eaton1_Janes_Cottage_Sch5_HistoricGray.webp"
      ],
      spanish: [
        "https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f1facacf7104f7e2bb4532_Eaton1_Spanish_Sch1_CoastalWhite.webp",
        "https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f1faca832e56e8d1302425_Eaton1_Spanish_Sch2_NaturalGray.webp",
        "https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f1faca7fcd4a25484de868_Eaton1_Spanish_Sch3_GardenOlive.webp",
        "https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f1facabdcd44c1fee09803_Eaton1_Spanish_Sch4_RichBronze.webp",
        "https://cdn.prod.website-files.com/601ca16f0bb27e965ee867a0/69f1faca151e31161533c3d7_Eaton1_Spanish_Sch5_WarmEarthClay.webp"
      ]
    }
  };
  var toSchemes = (names, urls) => names.map((name, index) => ({
    schemeNumber: index + 1,
    name,
    imageUrl: urls[index] ?? ""
  }));
  var toNumberedSchemes = (schemes, urls) => schemes.map((scheme, index) => ({
    schemeNumber: scheme.number,
    name: scheme.name,
    imageUrl: urls[index] ?? ""
  }));
  var buildNewCommunityExteriors = (planSlug) => {
    const imageUrls = NEW_COMMUNITY_EXTERIOR_IMAGE_URLS[planSlug];
    return [
      {
        style: "Spanish Contemporary",
        slug: `${planSlug}-spanish-contemporary`,
        colorSchemes: toNumberedSchemes(SPANISH_CONTEMPORARY_SCHEMES, [
          ...imageUrls.spanishContemporary
        ])
      },
      {
        style: "Transitional Ranch",
        slug: `${planSlug}-transitional-ranch`,
        colorSchemes: toNumberedSchemes(TRANSITIONAL_RANCH_SCHEMES, [...imageUrls.transitionalRanch])
      },
      {
        style: "Coastal Colonial",
        slug: `${planSlug}-coastal-colonial`,
        colorSchemes: toNumberedSchemes(COASTAL_COLONIAL_SCHEMES, [...imageUrls.coastalColonial])
      },
      {
        style: "English Cottage",
        slug: `${planSlug}-english-cottage`,
        colorSchemes: toNumberedSchemes(ENGLISH_COTTAGE_SCHEMES, [...imageUrls.englishCottage])
      }
    ];
  };
  var buildExteriorsForPlan = (planSlug) => {
    const imageSet = EXTERIOR_IMAGE_SETS_BY_PLAN[planSlug];
    return [
      {
        style: "Craftsman",
        slug: "craftsman-style",
        colorSchemes: toSchemes(CRAFTSMAN_NAMES, imageSet.craftsman)
      },
      {
        style: "Janes Cottage",
        slug: "janes-cottage",
        colorSchemes: toSchemes(JANES_COTTAGE_NAMES, imageSet.janesCottage)
      },
      {
        style: "Spanish Transitional",
        slug: "spanish-transitional",
        colorSchemes: toSchemes(SPANISH_NAMES, imageSet.spanish)
      }
    ];
  };
  var EXTERIORS_BY_PLAN = {
    echo: buildExteriorsForPlan("echo"),
    merrick: buildExteriorsForPlan("merrick"),
    chaney: buildExteriorsForPlan("chaney"),
    loma: buildExteriorsForPlan("loma"),
    sycamore: buildExteriorsForPlan("sycamore"),
    glenview: buildNewCommunityExteriors("glenview"),
    elm: buildNewCommunityExteriors("elm"),
    willow: buildNewCommunityExteriors("willow"),
    vista: buildNewCommunityExteriors("vista"),
    ambrose: buildNewCommunityExteriors("ambrose"),
    alder: buildNewCommunityExteriors("alder")
  };

  // src/utils/rebuild-map.ts
  var MAP_POINTS = [
    { id: "tubbs-fire", label: "Tubbs Fire - Santa Rosa, CA", x: 10.72, y: 153.05 },
    {
      id: "glass-complex",
      label: "Glass Complex - Napa & Sonoma Counties, CA",
      x: 21.83,
      y: 161.4
    },
    {
      id: "czu-complex",
      label: "CZU Comples - Santa Cruz & San Mateo Counties, CA",
      x: 21.83,
      y: 173.78
    },
    { id: "woolsey-fire", label: "Woolsey Fire - Malibu, CA", x: 28.69, y: 226.88 },
    { id: "eaton-fire", label: "Eaton Fire - Altadena, CA", x: 38.96, y: 236.7 },
    { id: "palisades-fire", label: "Palisades Fire - Pacific Palisades, CA", x: 54.67, y: 225.59 },
    { id: "marshall-fire", label: "Marshall Fire - Boulder County, CO", x: 197.87, y: 188.96 },
    {
      id: "hurricane-ian",
      label: "Hurricane Ian - Fort Myers Beach, FL",
      x: 490.3,
      y: 350.64
    },
    {
      id: "hurricane-dorian",
      label: "Hurricane Dorian, The Bahamas",
      x: 555.09,
      y: 380.6
    }
  ];
  var RebuildMapController = class {
    svgEl = null;
    activeId = null;
    isPanning = false;
    markerById = /* @__PURE__ */ new Map();
    cardById = /* @__PURE__ */ new Map();
    tooltipEl = null;
    MIN_ZOOM = 1;
    MAX_ZOOM = 8;
    DISABLE_ZOOM_WITH_MOUSE_SCROLL = true;
    originalViewBox = { x: 0, y: 0, w: 582.03, h: 399.02 };
    vb = { ...this.originalViewBox };
    init() {
      if (!this.injectSvg()) return;
      this.bindMarkers();
      this.bindCards();
      this.bindZoom();
      this.injectZoomControls();
    }
    injectSvg() {
      const textHolder = document.querySelector('[dev-target="svg-text-holder"]');
      const targetWrapper = document.querySelector('[dev-target="svg-target-wrapper"]');
      if (!textHolder || !targetWrapper) return false;
      const rawMarkup = textHolder.textContent?.trim() ?? "";
      if (!rawMarkup.includes("<svg")) return false;
      const svgMarkup = rawMarkup.replace(/=\d+"/g, '="');
      targetWrapper.innerHTML = svgMarkup;
      this.svgEl = targetWrapper.querySelector("svg");
      if (!this.svgEl) return false;
      const svgStyle = this.svgEl.querySelector("style");
      if (svgStyle?.textContent) {
        svgStyle.textContent = svgStyle.textContent.replace(/\u00A0/g, " ");
      }
      this.svgEl.style.width = "100%";
      this.svgEl.style.height = "100%";
      this.svgEl.style.display = "block";
      this.svgEl.classList.add("rebuild-map__svg");
      this.ensureTooltip();
      const viewBoxTokens = this.svgEl.getAttribute("viewBox")?.split(/[\s,]+/).map((token) => Number.parseFloat(token)).filter((token) => Number.isFinite(token));
      if (viewBoxTokens?.length === 4) {
        const [x, y, w, h] = viewBoxTokens;
        this.originalViewBox = { x, y, w, h };
        this.vb = { ...this.originalViewBox };
        this.applyViewBox();
      }
      return true;
    }
    ensureTooltip() {
      const wrapper = this.svgEl?.parentElement;
      if (!wrapper) return;
      if (getComputedStyle(wrapper).position === "static") {
        wrapper.style.position = "relative";
      }
      const tooltip = document.createElement("div");
      tooltip.className = "rebuild-map__tooltip";
      tooltip.setAttribute("aria-hidden", "true");
      wrapper.appendChild(tooltip);
      this.tooltipEl = tooltip;
    }
    bindMarkers() {
      if (!this.svgEl) return;
      const circles = Array.from(this.svgEl.querySelectorAll("circle"));
      if (circles.length < MAP_POINTS.length) return;
      const available = [...circles];
      MAP_POINTS.forEach((point) => {
        const marker = this.pickNearestMarker(point, available);
        if (!marker) return;
        this.markerById.set(point.id, marker);
        marker.dataset.rebuildPointId = point.id;
        marker.setAttribute("aria-label", point.label);
        marker.setAttribute("title", point.label);
        marker.classList.add("rebuild-map__marker");
        marker.addEventListener("mouseenter", () => this.highlight(point.id));
        marker.addEventListener("mouseleave", () => this.clearHighlight());
        marker.addEventListener("mousedown", (event2) => event2.stopPropagation());
        marker.addEventListener(
          "touchstart",
          (event2) => {
            event2.preventDefault();
            event2.stopPropagation();
            this.highlight(point.id, true);
          },
          { passive: false }
        );
        marker.addEventListener("click", () => this.highlight(point.id, true));
      });
    }
    pickNearestMarker(point, available) {
      if (!available.length) return void 0;
      let bestIndex = 0;
      let bestDistance = Number.POSITIVE_INFINITY;
      available.forEach((marker2, index) => {
        const cx = Number.parseFloat(marker2.getAttribute("cx") ?? "");
        const cy = Number.parseFloat(marker2.getAttribute("cy") ?? "");
        if (!Number.isFinite(cx) || !Number.isFinite(cy)) return;
        const distance = Math.hypot(cx - point.x, cy - point.y);
        if (distance < bestDistance) {
          bestDistance = distance;
          bestIndex = index;
        }
      });
      const [marker] = available.splice(bestIndex, 1);
      return marker;
    }
    bindCards() {
      const listContainer = document.querySelector(
        '[dev-target="rebuild-map-point-list"]'
      );
      let cards = document.querySelectorAll(
        '[dev-target="rebuild-map-point"][map-point-id]'
      );
      if (!cards.length && listContainer) {
        listContainer.innerHTML = MAP_POINTS.map(
          (point) => `<button class="rebuild-map__card" type="button" dev-target="rebuild-map-point" map-point-id="${point.id}">${point.label}</button>`
        ).join("");
        cards = listContainer.querySelectorAll(
          '[dev-target="rebuild-map-point"][map-point-id]'
        );
      }
      cards.forEach((card) => {
        const pointId = card.getAttribute("map-point-id");
        if (!pointId) return;
        this.cardById.set(pointId, card);
        card.addEventListener("mouseenter", () => this.highlight(pointId));
        card.addEventListener("mouseleave", () => this.clearHighlight());
        card.addEventListener("focus", () => this.highlight(pointId));
        card.addEventListener("blur", () => this.clearHighlight());
        card.addEventListener("click", () => this.highlight(pointId));
      });
    }
    highlight(pointId, scrollToCard = false) {
      if (this.isPanning) return;
      if (this.activeId === pointId && !scrollToCard) return;
      this.clearHighlight();
      this.activeId = pointId;
      this.markerById.get(pointId)?.classList.add("rebuild-map__marker--active");
      this.showTooltip(pointId);
      const card = this.cardById.get(pointId);
      if (card) {
        card.classList.add("rebuild-map__card--active");
        if (scrollToCard) {
          card.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }
    }
    clearHighlight() {
      this.activeId = null;
      this.svgEl?.querySelector(".rebuild-map__marker--active")?.classList.remove("rebuild-map__marker--active");
      document.querySelector(".rebuild-map__card--active")?.classList.remove("rebuild-map__card--active");
      this.hideTooltip();
    }
    showTooltip(pointId) {
      if (!this.svgEl || !this.tooltipEl) return;
      const marker = this.markerById.get(pointId);
      const point = MAP_POINTS.find((entry) => entry.id === pointId);
      if (!marker || !point) return;
      const markerRect = marker.getBoundingClientRect();
      const wrapperRect = this.svgEl.parentElement?.getBoundingClientRect();
      if (!wrapperRect) return;
      const [title, subtitle] = this.splitLabel(point.label);
      this.tooltipEl.innerHTML = `
      <div class="rebuild-map__tooltip-title">${title}</div>
      <div class="rebuild-map__tooltip-subtitle">${subtitle.toUpperCase()}</div>
    `;
      const left = markerRect.left - wrapperRect.left + markerRect.width + 8;
      const top = markerRect.top - wrapperRect.top - 8;
      this.tooltipEl.style.left = `${left}px`;
      this.tooltipEl.style.top = `${top}px`;
      this.tooltipEl.classList.add("is-visible");
    }
    hideTooltip() {
      this.tooltipEl?.classList.remove("is-visible");
    }
    splitLabel(label) {
      if (label.includes(" - ")) {
        const [title, subtitle] = label.split(/\s-\s(.+)/);
        return [title.trim(), subtitle.trim()];
      }
      const commaIndex = label.indexOf(",");
      if (commaIndex >= 0) {
        const title = label.slice(0, commaIndex).trim();
        const subtitle = label.slice(commaIndex + 1).trim();
        return [title, subtitle];
      }
      return [label.trim(), ""];
    }
    applyViewBox() {
      const { x, y, w, h } = this.vb;
      this.svgEl?.setAttribute("viewBox", `${x} ${y} ${w} ${h}`);
    }
    clampViewBox() {
      this.vb.x = Math.max(
        this.originalViewBox.x,
        Math.min(this.vb.x, this.originalViewBox.x + this.originalViewBox.w - this.vb.w)
      );
      this.vb.y = Math.max(
        this.originalViewBox.y,
        Math.min(this.vb.y, this.originalViewBox.y + this.originalViewBox.h - this.vb.h)
      );
      this.applyViewBox();
    }
    toSvgPoint(clientX, clientY) {
      const rect = this.svgEl.getBoundingClientRect();
      return {
        x: this.vb.x + (clientX - rect.left) / rect.width * this.vb.w,
        y: this.vb.y + (clientY - rect.top) / rect.height * this.vb.h
      };
    }
    zoomAround(scale, originX, originY) {
      const newW = this.vb.w * scale;
      const zoom = this.originalViewBox.w / newW;
      if (zoom < this.MIN_ZOOM || zoom > this.MAX_ZOOM) return;
      this.vb.x = originX + (this.vb.x - originX) * scale;
      this.vb.y = originY + (this.vb.y - originY) * scale;
      this.vb.w = newW;
      this.vb.h *= scale;
      this.clampViewBox();
    }
    zoomBy(scale) {
      const cx = this.vb.x + this.vb.w / 2;
      const cy = this.vb.y + this.vb.h / 2;
      this.zoomAround(scale, cx, cy);
    }
    resetZoom() {
      this.vb = { ...this.originalViewBox };
      this.applyViewBox();
    }
    bindZoom() {
      if (!this.svgEl) return;
      const svg = this.svgEl;
      svg.addEventListener(
        "wheel",
        (event2) => {
          if (this.DISABLE_ZOOM_WITH_MOUSE_SCROLL) return;
          event2.preventDefault();
          const scale = event2.deltaY < 0 ? 0.85 : 1 / 0.85;
          const { x, y } = this.toSvgPoint(event2.clientX, event2.clientY);
          this.zoomAround(scale, x, y);
        },
        { passive: false }
      );
      let startClient = { x: 0, y: 0 };
      let startVb = { ...this.vb };
      svg.addEventListener("mousedown", (event2) => {
        if (event2.button !== 0 && event2.button !== 1) return;
        event2.preventDefault();
        this.isPanning = true;
        startClient = { x: event2.clientX, y: event2.clientY };
        startVb = { ...this.vb };
        svg.classList.add("lot-map__svg--panning");
      });
      window.addEventListener("mousemove", (event2) => {
        if (!this.isPanning) return;
        const rect = svg.getBoundingClientRect();
        this.vb.x = startVb.x - (event2.clientX - startClient.x) / rect.width * startVb.w;
        this.vb.y = startVb.y - (event2.clientY - startClient.y) / rect.height * startVb.h;
        this.clampViewBox();
      });
      window.addEventListener("mouseup", (event2) => {
        if (!this.isPanning || event2.button !== 0 && event2.button !== 1) return;
        this.isPanning = false;
        svg.classList.remove("lot-map__svg--panning");
      });
      let isTouching = false;
      let lastDist = 0;
      let lastMid = { x: 0, y: 0 };
      const touchDist = (touches) => Math.hypot(touches[0].clientX - touches[1].clientX, touches[0].clientY - touches[1].clientY);
      const touchMid = (touches) => ({
        x: (touches[0].clientX + touches[1].clientX) / 2,
        y: (touches[0].clientY + touches[1].clientY) / 2
      });
      svg.addEventListener(
        "touchstart",
        (event2) => {
          event2.preventDefault();
          isTouching = true;
          if (event2.touches.length === 2) {
            this.isPanning = false;
            lastDist = touchDist(event2.touches);
            lastMid = touchMid(event2.touches);
          } else {
            this.isPanning = true;
            startClient = { x: event2.touches[0].clientX, y: event2.touches[0].clientY };
            startVb = { ...this.vb };
            svg.classList.add("lot-map__svg--panning");
          }
        },
        { passive: false }
      );
      window.addEventListener(
        "touchmove",
        (event2) => {
          if (!isTouching) return;
          event2.preventDefault();
          if (event2.touches.length === 2) {
            this.isPanning = false;
            svg.classList.remove("lot-map__svg--panning");
            const dist = touchDist(event2.touches);
            const mid = touchMid(event2.touches);
            const scale = lastDist / dist;
            const origin = this.toSvgPoint(mid.x, mid.y);
            this.zoomAround(scale, origin.x, origin.y);
            const rect = svg.getBoundingClientRect();
            this.vb.x -= (mid.x - lastMid.x) / rect.width * this.vb.w;
            this.vb.y -= (mid.y - lastMid.y) / rect.height * this.vb.h;
            this.clampViewBox();
            lastDist = dist;
            lastMid = mid;
          } else if (event2.touches.length === 1 && this.isPanning) {
            const rect = svg.getBoundingClientRect();
            const dx = (event2.touches[0].clientX - startClient.x) / rect.width * startVb.w;
            const dy = (event2.touches[0].clientY - startClient.y) / rect.height * startVb.h;
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
        svg.classList.remove("lot-map__svg--panning");
      });
    }
    injectZoomControls() {
      const wrapper = this.svgEl?.parentElement;
      if (!wrapper) return;
      if (getComputedStyle(wrapper).position === "static") {
        wrapper.style.position = "relative";
      }
      const controls = document.createElement("div");
      controls.className = "lot-map__zoom-controls";
      controls.setAttribute("aria-label", "Map zoom controls");
      controls.innerHTML = `
      <button class="lot-map__zoom-btn" data-zoom="in" title="Zoom in" aria-label="Zoom in">+</button>
      <button class="lot-map__zoom-btn" data-zoom="reset" title="Reset zoom" aria-label="Reset zoom">\u2299</button>
      <button class="lot-map__zoom-btn" data-zoom="out" title="Zoom out" aria-label="Zoom out">\u2212</button>
    `;
      controls.addEventListener("click", (event2) => {
        const button = event2.target.closest("[data-zoom]");
        if (!button) return;
        const action = button.dataset.zoom;
        if (action === "in") this.zoomBy(0.7);
        else if (action === "out") this.zoomBy(1 / 0.7);
        else if (action === "reset") this.resetZoom();
      });
      wrapper.appendChild(controls);
    }
  };

  // src/rebuild.ts
  var galleryConfigs = [
    {
      triggerSelector: '[dev-target="slide-image-wrapper"]',
      imageSelector: '[dev-target="forward-image"]',
      containerSelector: "[explore-swiper]"
    }
  ];
  galleryConfigs.forEach((config) => {
    const element = document.querySelector(config.triggerSelector);
    if (!element) {
      console.error(`GalleryController: element not found \u2014 ${config.triggerSelector}`);
      return;
    }
  });
  window.Webflow ||= [];
  window.Webflow.push(() => {
    const rebuildMapController = new RebuildMapController();
    rebuildMapController.init();
  });
})();
//# sourceMappingURL=rebuild.js.map
