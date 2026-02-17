import d from "gsap";
import { Draggable as I } from "gsap/Draggable";
class V {
  constructor() {
    this.events = {};
  }
  /**
   * Subscribe to an event.
   * @param {string} event - The event name.
   * @param {Function} callback - The callback function.
   * @returns {Object} - An object with an `off` method to unsubscribe.
   */
  on(o, s) {
    return this.events[o] || (this.events[o] = []), this.events[o].push(s), {
      off: () => this.off(o, s)
    };
  }
  /**
   * Unsubscribe from an event.
   * @param {string} event - The event name.
   * @param {Function} callback - The callback function to remove.
   */
  off(o, s) {
    this.events[o] && (this.events[o] = this.events[o].filter((f) => f !== s));
  }
  /**
   * Emit an event.
   * @param {string} event - The event name.
   * @param {any} data - Data to pass to listeners.
   */
  emit(o, s = null) {
    this.events[o] && this.events[o].forEach((f) => f(s));
  }
}
function $(t, o, s) {
  return {
    root: null,
    track: null,
    slides: [],
    mount() {
      this.root = t.container, this.track = this.root.querySelector(".tka-slider__track"), this.root.classList.add(`tka-slider--${t.options.type}`), this.collectSlides();
    },
    collectSlides() {
      this.slides = Array.from(this.track.children);
    }
  };
}
function B(t, o, s) {
  return {
    /**
     * Coordinate offset for the track.
     */
    x: 0,
    /**
     * Width of a single slide.
     */
    slideWidth: 0,
    mount() {
      this.calculate(), window.addEventListener("resize", () => {
        this.calculate(), s.emit("resize");
      });
    },
    calculate() {
      const { Html: e } = o, { perView: a, gap: i } = t.options, n = e.root.offsetWidth;
      this.slideWidth = (n - i * (a - 1)) / a, e.slides.forEach((c) => {
        c.style.width = `${this.slideWidth}px`, c.style.marginRight = `${i}px`;
      }), t.log(`Track calculated: slideWidth=${this.slideWidth}`);
    },
    /**
     * Get the position of a slide by index.
     * @param {number} index
     */
    getCoordinate(e) {
      const { gap: a } = t.options;
      return e * (this.slideWidth + a) - this.getOffset();
    },
    /**
     * Get the offset based on focusAt setting.
     */
    getOffset() {
      const { focusAt: e, gap: a } = t.options, { Html: i } = o;
      return e === "center" ? i.root.offsetWidth / 2 - this.slideWidth / 2 : typeof e == "number" ? e * (this.slideWidth + a) : 0;
    }
  };
}
function F(t, o, s) {
  return {
    /**
     * GSAP Timeline or Tween reference
     */
    tween: null,
    mount() {
      this.bind();
    },
    bind() {
      s.on("resize", () => {
        this.to(t.state.index, { duration: 0 });
      });
    },
    /**
     * Move to a specific index.
     * @param {number} index 
     * @param {Object} options 
     */
    to(e, a = {}) {
      const { Track: i, Html: n } = o, { animationDuration: c, animationEase: l, type: h } = t.options, g = a.duration !== void 0 ? a.duration : c / 1e3, u = a.ease || l;
      if (this.tween && this.tween.kill(), (h === "fade" || h === "fan") && t.options.loop) {
        const v = n.slides.length;
        e >= v && (e = 0), e < 0 && (e = v - 1);
      }
      if (t.state.index = e, t.state.animationDuration = g, h === "fade" || h === "fan") {
        s.emit("move", { x: 0 }), s.emit("move.after", { index: t.state.index });
        return;
      }
      const w = i.getCoordinate(e);
      this.tween = d.to(n.track, {
        x: -w,
        duration: g,
        ease: u,
        onUpdate: () => {
          s.emit("move", { x: d.getProperty(n.track, "x") });
        },
        onComplete: () => {
          t.state.animationDuration = 0;
          let v = !1;
          t.options.loop && (v = this.loop(t.state.index)), v || s.emit("move.after", { index: t.state.index });
        }
      });
    },
    /**
     * Seamlessly jump when hitting clones.
     * Returns true if a jump occurred.
     */
    loop(e) {
      const { Track: a, Html: i } = o, n = t.clonesCount || 0, l = i.slides.length - n * 2, h = 1e-3;
      return e < n - h ? (this.jump(e + l), !0) : e > l + n - 1 + h ? (this.jump(e - l), !0) : !1;
    },
    /**
     * Jump to an index without animation.
     */
    jump(e) {
      const { Track: a, Html: i } = o, { type: n } = t.options;
      if (t.state.index = e, n === "fade" || n === "fan") {
        s.emit("move", { x: 0, jump: !0 }), s.emit("move.after", { index: e });
        return;
      }
      const c = a.getCoordinate(e);
      d.set(i.track, { x: -c }), s.emit("move", { x: -c, jump: !0 }), s.emit("move.after", { index: e });
    }
  };
}
function Y(t, o, s) {
  return {
    draggable: null,
    mount() {
      this.init();
    },
    init() {
      d.registerPlugin(I);
      const { Html: e, Move: a, Track: i } = o, n = t.options.type === "fan", c = t.options.type === "fade";
      this.draggable = I.create(e.track, {
        type: n ? "x,y" : "x",
        trigger: e.root,
        edgeResistance: 0.65,
        inertia: !0,
        onDragStart: () => {
          t.state.isDragging = !0, a.tween && a.tween.kill(), s.emit("drag.start");
        },
        onDrag: function() {
          const l = t.options.swipeThreshold || 80;
          if (c || n) {
            if (Math.sqrt(this.x * this.x + this.y * this.y) > l * 3) {
              this.endDrag();
              return;
            }
            d.set(e.track, { x: 0, y: 0 }), s.emit("drag", { x: this.x, y: this.y });
            return;
          }
          s.emit("drag", { x: this.x });
        },
        onDragEnd: function() {
          if (t.state.isDragging = !1, c || n) {
            d.set(e.track, { x: 0, y: 0 });
            const w = t.options.swipeThreshold || 80;
            Math.sqrt(this.x * this.x + this.y * this.y) > w ? n ? this.x > 0 ? a.to(t.state.index - 1) : a.to(t.state.index + 1) : this.getDirection() === "left" ? a.to(t.state.index + 1) : this.getDirection() === "right" && a.to(t.state.index - 1) : s.emit("move", { x: 0 }), s.emit("drag.end");
            return;
          }
          const l = this.x, h = i.slideWidth + t.options.gap, g = i.getOffset();
          let u = Math.round((g - l) / h);
          t.options.loop || (u = Math.max(0, Math.min(u, e.slides.length - 1))), a.to(u);
        }
      })[0];
    },
    disable() {
      this.draggable && this.draggable.disable();
    },
    enable() {
      this.draggable && this.draggable.enable();
    }
  };
}
function N(t, o, s) {
  return {
    items: [],
    mount() {
      t.options.loop && t.options.type !== "fade" && t.options.type !== "fan" ? this.run() : t.clonesCount = 0;
    },
    remove() {
      const { Html: e } = o;
      e.track.querySelectorAll(".tka-slider__slide--clone").forEach((i) => i.remove()), e.collectSlides();
    },
    run() {
      this.remove();
      const { Html: e } = o, { perView: a, breakpoints: i } = t.options;
      let n = a;
      i && Object.values(i).forEach((u) => {
        u.perView > n && (n = u.perView);
      });
      const c = Math.ceil(n), l = e.slides;
      t.clonesCount = c;
      const h = l.slice(0, c).map((u) => u.cloneNode(!0));
      l.slice(-c).map((u) => u.cloneNode(!0)).reverse().forEach((u) => {
        u.classList.add("tka-slider__slide--clone"), e.track.insertBefore(u, e.track.firstChild);
      }), h.forEach((u) => {
        u.classList.add("tka-slider__slide--clone"), e.track.appendChild(u);
      }), o.Html.collectSlides(), o.Track.calculate(), t.state.index += c, t.log(`Cloned ${c} slides on each side.`);
    }
  };
}
function G(t, o, s) {
  return {
    mount() {
      this.bind(), this.update();
    },
    bind() {
      s.on("move.after", () => {
        this.update();
      });
    },
    update() {
      const { Html: e } = o, { index: a } = t.state;
      e.slides.forEach((i, n) => {
        n === a ? i.classList.contains("is-active") || (i.classList.add("is-active"), s.emit("slide.active", { index: n, slide: i })) : i.classList.contains("is-active") && (i.classList.remove("is-active"), s.emit("slide.inactive", { index: n, slide: i }));
      });
    }
  };
}
function Z(t, o, s) {
  return {
    interval: null,
    mount() {
      t.options.autoplay && (this.start(), this.bind());
    },
    bind() {
      const { Html: e } = o;
      t.options.hoverPause && (e.root.addEventListener("mouseenter", () => this.stop()), e.root.addEventListener("mouseleave", () => this.start())), s.on("drag.start", () => this.stop()), s.on("drag.end", () => {
        t.options.autoplay && this.start();
      });
    },
    start() {
      t.options.autoplay && (this.stop(), this.interval = setInterval(() => {
        const { Move: e } = o;
        e.to(t.state.index + 1);
      }, typeof t.options.autoplay == "number" ? t.options.autoplay : 3e3));
    },
    stop() {
      this.interval && (clearInterval(this.interval), this.interval = null);
    }
  };
}
function K(t, o, s) {
  return {
    prevItems: [],
    nextItems: [],
    mount() {
      this.bind();
    },
    bind() {
      const { Html: e } = o;
      e.root.querySelectorAll("[data-tka-control]").forEach((i) => {
        const n = i.getAttribute("data-tka-control");
        i.addEventListener("click", (c) => {
          c.preventDefault(), this.move(n);
        }), n === "<" && this.prevItems.push(i), n === ">" && this.nextItems.push(i);
      });
    },
    move(e) {
      const { Move: a } = o, { index: i } = t.state;
      if (e === ">")
        a.to(i + 1);
      else if (e === "<")
        a.to(i - 1);
      else if (e.startsWith("=")) {
        let n = parseInt(e.substring(1));
        t.options.loop && t.options.type === "slide" && (n += t.clonesCount || 0), a.to(n);
      }
    }
  };
}
function U(t, o, s) {
  return {
    wrapper: null,
    items: [],
    mount() {
      this.bind(), this.render();
    },
    bind() {
      s.on("move.after", () => {
        this.active();
      }), s.on("mount.after", () => {
        this.render();
      });
    },
    render() {
      const { Html: e } = o, { perView: a, loop: i } = t.options;
      if (this.wrapper = e.root.querySelector("[data-tka-bullets]"), !this.wrapper) return;
      this.wrapper.innerHTML = "", this.items = [];
      const n = i ? e.slides.length - t.clonesCount * 2 : e.slides.length;
      for (let c = 0; c < n; c++) {
        const l = document.createElement("button");
        l.className = "tka-bullet", l.setAttribute("data-tka-bullet", c), l.addEventListener("click", (h) => {
          h.preventDefault();
          const g = i ? c + t.clonesCount : c;
          o.Move.to(g);
        }), this.wrapper.appendChild(l), this.items.push(l);
      }
      this.active();
    },
    active() {
      if (!this.wrapper) return;
      const { loop: e } = t.options, { index: a } = t.state;
      let i = a;
      if (e) {
        const n = o.Html.slides.length - t.clonesCount * 2;
        i = (a - t.clonesCount) % n, i < 0 && (i += n);
      }
      this.items.forEach((n, c) => {
        c === i ? n.classList.add("is-active") : n.classList.remove("is-active");
      });
    }
  };
}
function J(t, o, s) {
  return {
    isRevealed: !1,
    mount() {
      this.bind();
      const { type: e, revealOnMount: a } = t.options;
      a ? (this.isRevealed = !0, setTimeout(() => this.reveal(), 50)) : (this.isRevealed = !1, setTimeout(() => {
        this.update(d.getProperty(o.Html.track, "x"), !0);
      }, 10));
    },
    reveal() {
      const { type: e } = t.options;
      if (this.isRevealed = !0, e === "fan") {
        this.update(0, !0);
        const a = o.Html.slides.map((i) => i.querySelector(".demo-slide") || i.children[0]).filter(Boolean);
        d.from(a, {
          y: 100,
          rotation: 0,
          opacity: 0,
          scale: 0.9,
          duration: 0.8,
          stagger: 0.1,
          ease: "back.out(1.2)",
          onComplete: () => this.update(0, !0)
        });
      } else
        this.update(d.getProperty(o.Html.track, "x"), !0);
    },
    bind() {
      s.on("move", ({ x: e, jump: a }) => {
        this.update(e, a);
      }), s.on("drag", ({ x: e, y: a }) => {
        this.update(e, !1, a);
      }), s.on("resize", () => {
        this.update(d.getProperty(o.Html.track, "x"), !0);
      });
    },
    update(e, a = !1, i = 0) {
      const { Html: n, Track: c } = o, {
        type: l,
        scaleOnCenter: h,
        scaleAmount: g,
        scaleRange: u,
        gap: w,
        animationEase: v
      } = t.options, j = c.slideWidth + w, q = a ? 0 : t.state.animationDuration || 0;
      n.slides.forEach((E, L) => {
        let M = E.querySelector(".demo-slide") || E.children[0];
        if (!M) return;
        let S, W, m = L - t.state.index;
        const T = n.slides.length;
        t.options.loop && (l === "fade" || l === "fan") && (m = (L - t.state.index) % T, m > T / 2 && (m -= T), m < -T / 2 && (m += T));
        const _ = Math.abs(m);
        if (l === "fade" || l === "fan")
          S = _, W = m;
        else {
          const p = c.getCoordinate(L), x = e + p;
          S = Math.abs(x) / j, W = x / j;
        }
        let y = 1;
        if (h) {
          const p = u || 1;
          y = 1 - Math.min(S, p) / p * (1 - g), y = Math.max(g, Math.min(1, y));
        }
        const r = { overwrite: !0 };
        if (l === "coverflow")
          r.rotationY = W * -30, r.z = S * -100, r.opacity = this.isRevealed ? 1 - Math.min(S, 2) * 0.2 : 0, r.scale = y;
        else if (l === "360") {
          const p = M.querySelector(".tka-360-container") || M, x = Array.from(p.children).filter(
            (k) => k.classList.contains("tka-360-frame") || p.children.length > 1
          ), A = x.length;
          if (A > 1) {
            const k = t.options.rotationSpeed || 1;
            let b = Math.round(-W * k) % A;
            b < 0 && (b += A), p._tka_last_frame !== b && (x.forEach((D, O) => {
              const C = O === b;
              D.style.opacity = C ? "1" : "0", D.style.visibility = C ? "visible" : "hidden", D.style.zIndex = C ? "2" : "1";
            }), p._tka_last_frame = b);
          }
          r.scale = y, r.opacity = this.isRevealed ? 1 : 0, r.x = 0, r.y = 0, r.rotationY = 0;
        } else if (l === "fade" || l === "fan") {
          if (l === "fade")
            r.opacity = this.isRevealed ? Math.max(0, 1 - _) : 0, r.scale = y, r.z = 0, r.x = 0, r.y = 0, r.rotation = 0;
          else if (l === "fan") {
            const p = t.options.rotateFactor || 15, x = t.options.scaleFactor || 0.1, A = t.options.fanTranslateY || 5, k = t.options.fanSpace || 160, b = t.options.fanTilt || 15, D = t.options.fanTranslateZ || -100, O = t.options.activeRotation || 0, C = t.options.activeScale !== void 0 ? t.options.activeScale : 1, P = t.options.activeTranslateY || 0;
            if (m === 0)
              r.rotation = (t.state.isDragging ? e / 15 : 0) + O, r.rotationY = t.state.isDragging ? e / 8 : 0, r.rotationX = t.state.isDragging ? -i / 8 : 0, r.x = e, r.y = i + P, r.opacity = this.isRevealed ? 1 : 0, r.scale = C, r.z = 150;
            else if (_ === 1) {
              const R = m === 1, H = t.state.isDragging ? 0.2 : 0;
              r.scale = 1 - x, r.y = A + i * H, r.opacity = this.isRevealed ? 0.9 : 0, r.z = D, r.rotationX = -5 + i / 20 * H, r.x = (R ? k : -k) + e * H, r.rotation = (R ? p : -p) + e / 10 * H, r.rotationY = (R ? b : -b) + e / 20 * H;
            } else
              r.opacity = 0, r.z = -300, r.scale = 0.5, r.x = (m > 0 ? 1 : -1) * 300, r.y = 0;
            r.ease = t.options.fanEase || "power2.out", E.style.zIndex = m === 0 ? 20 : 10 - _;
          }
        } else
          r.scale = y, r.opacity = this.isRevealed ? h && y < 1 ? 0.6 : 1 : 0, r.rotationY = 0, r.z = 0, r.rotation = 0, r.x = 0, r.y = 0;
        L === t.state.index ? E.classList.add("is-active") : E.classList.remove("is-active"), r.duration = q, r.ease || (r.ease = v), a ? d.set(M, r) : d.to(M, r);
      });
    }
  };
}
function Q(t, o, s) {
  return {
    originalOptions: null,
    mount() {
      this.originalOptions = Object.assign({}, t.options), this.bind(), this.check();
    },
    bind() {
      window.addEventListener("resize", () => {
        this.check();
      });
    },
    check() {
      const { breakpoints: e } = this.originalOptions;
      if (!e || Object.keys(e).length === 0) return;
      const a = window.innerWidth;
      let i = null;
      const n = Object.keys(e).map(Number).sort((l, h) => h - l);
      for (const l of n)
        a <= l && (i = e[l]);
      const c = i ? Object.assign({}, this.originalOptions, i) : this.originalOptions;
      (c.perView !== t.options.perView || c.gap !== t.options.gap || c.focusAt !== t.options.focusAt) && this.apply(c);
    },
    apply(e) {
      t.log("Applying breakpoint options:", e), t.options = Object.assign(t.options, e), o.Track && o.Track.calculate(), o.Clones, o.Move && o.Move.jump(t.state.index), s.emit("breakpoint.change", e);
    }
  };
}
function X(t, o, s) {
  return {
    mount() {
      this.applyLabels(), t.options.keyboard && this.bind();
    },
    bind() {
      const { Html: e } = o;
      e.root.setAttribute("tabindex", "0"), e.root.addEventListener("keydown", (a) => {
        const { Move: i } = o;
        a.key === "ArrowRight" ? i.to(t.state.index + 1) : a.key === "ArrowLeft" && i.to(t.state.index - 1);
      });
    },
    applyLabels() {
      const { Html: e } = o, { loop: a } = t.options, i = t.clonesCount || 0;
      e.root.setAttribute("role", "region"), e.root.setAttribute("aria-label", "Image Slider"), e.track.setAttribute("role", "list"), e.slides.forEach((n, c) => {
        let l = c;
        if (a) {
          const h = e.slides.length - i * 2;
          l = (c - i) % h, l < 0 && (l += h);
        }
        n.setAttribute("role", "listitem"), n.setAttribute("aria-label", `Slide ${l + 1}`);
      }), s.on("move.after", ({ index: n }) => {
        e.slides.forEach((c, l) => {
          l === n ? c.setAttribute("aria-hidden", "false") : c.setAttribute("aria-hidden", "true");
        });
      });
    }
  };
}
function tt(t, o, s) {
  return {
    el: null,
    mount() {
      if (!t.options.pagination) return;
      const { Html: e } = o;
      this.el = typeof t.options.pagination == "string" ? e.root.querySelector(t.options.pagination) : e.root.querySelector("[data-tka-pagination]"), this.el && (this.bind(), this.update());
    },
    bind() {
      s.on("move.after", () => this.update());
    },
    update() {
      if (!this.el) return;
      const { Html: e } = o, { perView: a, loop: i } = t.options, n = i ? e.slides.length - t.clonesCount * 2 : e.slides.length;
      let c = t.state.index;
      i && (c = (t.state.index - t.clonesCount) % n, c < 0 && (c += n)), this.el.innerText = `${c + 1} / ${n}`;
    }
  };
}
const et = {
  Html: $,
  Track: B,
  Move: F,
  Drag: Y,
  Clones: N,
  Classes: G,
  Autoplay: Z,
  Controls: K,
  Bullets: U,
  Effects: J,
  Breakpoints: Q,
  A11y: X,
  Pagination: tt
};
class z {
  constructor(o, s = {}) {
    this.selector = o, this.options = Object.assign(z.defaults, s), this.events = new V(), this.state = {
      index: 0,
      isDragging: !1,
      animationDuration: 0
    }, this.clonesCount = 0, this.components = {}, this.init();
  }
  static get defaults() {
    return {
      startAt: 0,
      perView: 1,
      focusAt: 0,
      // 0 for left, 'center' for middle
      gap: 0,
      loop: !1,
      autoplay: !1,
      // interval in ms or false
      hoverPause: !0,
      type: "slide",
      // slide, fade, coverflow
      animationDuration: 600,
      animationEase: "power2.out",
      pagination: !1,
      // boolean or selector
      keyboard: !0,
      scaleGradual: !1,
      // Fan specifics
      rotateFactor: 15,
      scaleFactor: 0.1,
      fanTranslateY: 5,
      fanSpace: 160,
      activeRotation: 0,
      activeScale: 1,
      activeTranslateY: 0,
      breakpoints: {},
      swipeThreshold: 80,
      // Distance to trigger swipe
      debug: !1,
      revealOnMount: !0
    };
  }
  init() {
    if (this.log("Initializing slider..."), this.container = typeof this.selector == "string" ? document.querySelector(this.selector) : this.selector, !this.container) {
      console.error(`[TkaSlider] Container not found: ${this.selector}`);
      return;
    }
    if (this.container.tka_slider)
      return this.log("Slider already attached to this element. Returning existing instance."), this.container.tka_slider;
    this.container.tka_slider = this, this.log("Slider initialized.");
  }
  /**
   * Helper to log messages if debug is enabled.
   */
  log(...o) {
    this.options.debug && console.log("[TkaSlider]", ...o);
  }
  /**
   * Mount components to the slider.
   */
  mount() {
    if (this._isMounted)
      return this.log("Slider already mounted. Skipping."), this;
    this.events.emit("mount.before"), this._components = Object.assign({}, et, this.options.components);
    for (const o in this._components)
      typeof this._components[o] == "function" && (this.components[o] = this._components[o](this, this.components, this.events));
    for (const o in this.components)
      this.components[o].mount && this.components[o].mount();
    if (this._isMounted = !0, this.events.emit("mount.after"), this.components.Move) {
      const o = this.options.startAt + (this.options.loop && this.clonesCount || 0);
      this.components.Move.jump(o);
    }
    return this;
  }
  /**
   * Register core components internal helper
   * (Ideally we export a default list of components)
   */
  register(o) {
    return this.options.components = Object.assign({}, this.options.components, o), this;
  }
  on(o, s) {
    return this.events.on(o, s);
  }
  /**
   * Reveal the slider (trigger entrance animation)
   */
  reveal() {
    return this.components.Effects && this.components.Effects.reveal && this.components.Effects.reveal(), this;
  }
  /**
   * Programmatically move the slider to a specific slide or direction.
   * Supports:
   * - Number: logical index (e.g. 2 for 3rd slide)
   * - Pattern: '>', '<', '=2' (for logical index 2)
   * 
   * @param {string|number} pattern 
   * @returns {this}
   */
  go(o) {
    if (this.components.Controls) {
      const s = typeof o == "number" ? `=${o}` : o;
      this.components.Controls.move(s);
    }
    return this;
  }
  /**
   * Instantly jump to a specific logical index without animation.
   * @param {number} index 
   * @returns {this}
   */
  jump(o) {
    let s = o;
    return this.options.loop && this.options.type === "slide" && (s += this.clonesCount || 0), this.components.Move && this.components.Move.jump(s), this;
  }
}
export {
  z as default
};
