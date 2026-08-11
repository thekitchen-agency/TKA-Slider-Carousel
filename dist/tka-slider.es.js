import f from "gsap";
import { Draggable as q } from "gsap/Draggable";
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
  on(o, a) {
    return this.events[o] || (this.events[o] = []), this.events[o].push(a), {
      off: () => this.off(o, a)
    };
  }
  /**
   * Unsubscribe from an event.
   * @param {string} event - The event name.
   * @param {Function} callback - The callback function to remove.
   */
  off(o, a) {
    this.events[o] && (this.events[o] = this.events[o].filter((h) => h !== a));
  }
  /**
   * Emit an event.
   * @param {string} event - The event name.
   * @param {any} data - Data to pass to listeners.
   */
  emit(o, a = null) {
    this.events[o] && this.events[o].forEach((h) => h(a));
  }
}
function Y(t, o, a) {
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
function X(t, o, a) {
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
        this.calculate(), a.emit("resize");
      });
    },
    calculate() {
      const { Html: e } = o, { perView: s, gap: n } = t.options, i = e.root.offsetWidth;
      this.slideWidth = (i - n * (s - 1)) / s, e.slides.forEach((c) => {
        c.style.width = `${this.slideWidth}px`, c.style.marginRight = `${n}px`;
      }), t.log(`Track calculated: slideWidth=${this.slideWidth}`);
    },
    /**
     * Get the position of a slide by index.
     * @param {number} index
     */
    getCoordinate(e) {
      const { gap: s } = t.options;
      return e * (this.slideWidth + s) - this.getOffset();
    },
    /**
     * Get the offset based on focusAt setting.
     */
    getOffset() {
      const { focusAt: e, gap: s } = t.options, { Html: n } = o;
      return e === "center" ? n.root.offsetWidth / 2 - this.slideWidth / 2 : typeof e == "number" ? e * (this.slideWidth + s) : 0;
    }
  };
}
function G(t, o, a) {
  const h = {
    /**
     * GSAP Timeline or Tween reference
     */
    tween: null,
    mount() {
      h.bind();
    },
    bind() {
      a.on("resize", () => {
        h.to(t.state.index, { duration: 0 });
      });
    },
    /**
     * Move to a specific index.
     * @param {number} index 
     * @param {Object} options 
     */
    to(e, s = {}) {
      const { Track: n, Html: i } = o, { animationDuration: c, animationEase: l, type: p } = t.options, g = s.duration !== void 0 ? s.duration : c / 1e3, u = s.ease || l;
      if (h.tween && h.tween.kill(), (p === "fade" || p === "fan") && t.options.loop) {
        const y = i.slides.length;
        e >= y && (e = 0), e < 0 && (e = y - 1);
      }
      if (t.options.loop && (p === "slide" || p === "coverflow" || p === "360" || p === "single-rotate")) {
        const y = i.slides.length - 1, m = 0;
        e > y ? e = y : e < m && (e = m);
      }
      if (t.options.loop && (p === "slide" || p === "coverflow" || p === "360" || p === "single-rotate")) {
        const y = t.clonesCount || 0, m = i.slides.length - y * 2;
        if (m > 0) {
          const P = n.slideWidth + t.options.gap, b = m * P;
          for (; e >= y + m; ) {
            e -= m, t.state.index -= m;
            const C = f.getProperty(i.track, "x") || 0;
            f.set(i.track, { x: C + b });
          }
          for (; e < y; ) {
            e += m, t.state.index += m;
            const C = f.getProperty(i.track, "x") || 0;
            f.set(i.track, { x: C - b });
          }
          a.emit("move", { x: f.getProperty(i.track, "x"), jump: !0 });
        }
      }
      if (t.state.index = e, t.state.animationDuration = g, p === "fade" || p === "fan") {
        a.emit("move", { x: 0 }), a.emit("move.after", { index: t.state.index });
        return;
      }
      const E = n.getCoordinate(e);
      i.slides.length * (n.slideWidth + t.options.gap), h.tween = f.to(i.track, {
        x: -E,
        duration: g,
        ease: u,
        overwrite: "auto",
        onUpdate: () => {
          const y = f.getProperty(i.track, "x");
          a.emit("move", { x: y });
        },
        onComplete: () => {
          t.state.animationDuration = 0, t.options.loop && h.loop(t.state.index), a.emit("move.after", { index: t.state.index });
        }
      });
    },
    /**
     * Seamlessly jump when hitting clones.
     * Returns true if a jump occurred.
     */
    loop(e) {
      const s = t.clonesCount || 0, n = o.Html.slides.length - s * 2, i = 1e-3;
      return e < s - i ? (h.jump(e + n), !0) : e > n + s - 1 + i ? (h.jump(e - n), !0) : !1;
    },
    /**
     * Snap-check for coordinates during dragging/inertia.
     * Swaps track position if it goes too far.
     * @param {number} x Current x coordinate
     * @returns {number|null} New x if swapped, else null
     */
    loopX(e) {
      if (!t.options.loop) return null;
      const { Track: s, Html: n } = o, i = t.clonesCount || 0, c = n.slides.length - i * 2;
      if (c <= 0) return null;
      const l = s.slideWidth + t.options.gap, p = c * l, g = -e, u = s.getCoordinate(i), E = s.getCoordinate(i + c);
      return g < u - l * 0.5 ? e - p : g > E - l * 0.5 ? e + p : null;
    },
    /**
     * Jump to an index without animation.
     */
    jump(e) {
      const { Track: s, Html: n } = o, { type: i } = t.options;
      if (t.state.index = e, i === "fade" || i === "fan") {
        a.emit("move", { x: 0, jump: !0 }), a.emit("move.after", { index: e });
        return;
      }
      const c = s.getCoordinate(e);
      f.set(n.track, { x: -c }), a.emit("move", { x: -c, jump: !0 }), a.emit("move.after", { index: e });
    }
  };
  return h;
}
function N(t, o, a) {
  return {
    draggable: null,
    mount() {
      this.init();
    },
    init() {
      f.registerPlugin(q);
      const { Html: e, Move: s, Track: n } = o, i = t.options.type === "fan", c = t.options.type === "fade";
      this.draggable = q.create(e.track, {
        type: i ? "x,y" : "x",
        trigger: e.root,
        edgeResistance: 0.65,
        // Removed inertia: true to prevent throw tweens from conflicting with Move.to() snaps
        onDragStart: () => {
          t.state.isDragging = !0, t.state.animationDuration = 0, s.tween && s.tween.kill(), a.emit("drag.start");
        },
        onDrag: function() {
          const l = t.options.swipeThreshold || 80;
          if (c || i) {
            if (Math.sqrt(this.x * this.x + this.y * this.y) > l * 3) {
              this.endDrag();
              return;
            }
            f.set(e.track, { x: 0, y: 0 }), a.emit("drag", { x: this.x, y: this.y });
            return;
          }
          if (t.options.loop) {
            const p = s.loopX(this.x);
            if (p !== null) {
              const g = p - this.x;
              this.x = p, this.startX -= g, f.set(this.target, { x: p }), this.update();
            }
          }
          a.emit("drag", { x: this.x });
        },
        onThrowUpdate: function() {
          if (!c && !i && t.options.loop) {
            const l = s.loopX(this.x);
            l !== null && (f.set(this.target, { x: l }), this.update());
          }
          a.emit("drag", { x: this.x });
        },
        onDragEnd: function() {
          if (t.state.isDragging = !1, this.tween && this.tween.kill(), c || i) {
            f.set(e.track, { x: 0, y: 0 });
            const E = t.options.swipeThreshold || 80;
            Math.sqrt(this.x * this.x + this.y * this.y) > E ? i ? this.x > 0 ? s.to(t.state.index - 1) : s.to(t.state.index + 1) : this.getDirection() === "left" ? s.to(t.state.index + 1) : this.getDirection() === "right" && s.to(t.state.index - 1) : a.emit("move", { x: 0 }), a.emit("drag.end");
            return;
          }
          const l = this.x, p = n.slideWidth + t.options.gap, g = n.getOffset();
          let u = Math.round((g - l) / p);
          t.options.loop || (u = Math.max(0, Math.min(u, e.slides.length - 1))), s.to(u);
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
function U(t, o, a) {
  return {
    items: [],
    mount() {
      t.options.loop && t.options.type !== "fade" && t.options.type !== "fan" ? this.run() : t.clonesCount = 0;
    },
    remove() {
      const { Html: e } = o;
      e.track.querySelectorAll(".tka-slider__slide--clone").forEach((n) => n.remove()), e.collectSlides();
    },
    run() {
      this.remove();
      const { Html: e } = o, { perView: s, breakpoints: n } = t.options;
      let i = s;
      n && Object.values(n).forEach((u) => {
        u.perView > i && (i = u.perView);
      });
      const c = Math.ceil(i), l = e.slides;
      t.clonesCount = c;
      const p = l.slice(0, c).map((u) => u.cloneNode(!0));
      l.slice(-c).map((u) => u.cloneNode(!0)).reverse().forEach((u) => {
        u.classList.add("tka-slider__slide--clone"), e.track.insertBefore(u, e.track.firstChild);
      }), p.forEach((u) => {
        u.classList.add("tka-slider__slide--clone"), e.track.appendChild(u);
      }), o.Html.collectSlides(), o.Track.calculate(), t.state.index += c, t.log(`Cloned ${c} slides on each side.`);
    }
  };
}
function Z(t, o, a) {
  return {
    mount() {
      this.bind(), this.update();
    },
    bind() {
      a.on("move.after", () => {
        this.update();
      });
    },
    update() {
      const { Html: e } = o, { index: s } = t.state;
      e.slides.forEach((n, i) => {
        i === s ? n.classList.contains("is-active") || (n.classList.add("is-active"), a.emit("slide.active", { index: i, slide: n })) : n.classList.contains("is-active") && (n.classList.remove("is-active"), a.emit("slide.inactive", { index: i, slide: n }));
      });
    }
  };
}
function K(t, o, a) {
  return {
    interval: null,
    mount() {
      t.options.autoplay && (this.start(), this.bind());
    },
    bind() {
      const { Html: e } = o;
      t.options.hoverPause && (e.root.addEventListener("mouseenter", () => this.stop()), e.root.addEventListener("mouseleave", () => this.start())), a.on("drag.start", () => this.stop()), a.on("drag.end", () => {
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
function J(t, o, a) {
  return {
    prevItems: [],
    nextItems: [],
    mount() {
      this.bind(), this.update();
    },
    bind() {
      const { Html: e } = o;
      let s = e.root.querySelectorAll("[data-tka-control]");
      s.length === 0 && e.root.parentElement && (s = e.root.parentElement.querySelectorAll("[data-tka-control]")), console.log("[TkaSlider] Controls bound for", e.root.id, "found:", s.length), s.forEach((n) => {
        const i = n.getAttribute("data-tka-control");
        n.addEventListener("click", (c) => {
          c.preventDefault(), console.log("[TkaSlider] Clicked control:", i, "for", e.root.id), t.options.arrows && this.move(i);
        }), i === "<" && this.prevItems.push(n), i === ">" && this.nextItems.push(n);
      }), a.on("breakpoint.change", () => {
        this.update();
      });
    },
    update() {
      const { arrows: e } = t.options;
      [...this.prevItems, ...this.nextItems].forEach((n) => {
        n.style.display = e ? "" : "none";
      });
    },
    move(e) {
      const { Move: s } = o, { index: n } = t.state;
      if (e === ">")
        s.to(n + 1);
      else if (e === "<")
        s.to(n - 1);
      else if (e.startsWith("=")) {
        let i = parseInt(e.substring(1));
        t.options.loop && (t.options.type === "slide" || t.options.type === "coverflow" || t.options.type === "360" || t.options.type === "single-rotate") && (i += t.clonesCount || 0), s.to(i);
      }
    }
  };
}
function Q(t, o, a) {
  return {
    wrapper: null,
    items: [],
    mount() {
      this.bind(), this.render();
    },
    bind() {
      a.on("move.after", () => {
        this.active();
      }), a.on("mount.after", () => {
        this.render();
      }), a.on("breakpoint.change", () => {
        this.render();
      });
    },
    render() {
      const { Html: e } = o, { perView: s, loop: n, bullets: i } = t.options;
      if (this.wrapper = e.root.querySelector("[data-tka-bullets]"), !this.wrapper) return;
      if (this.wrapper.innerHTML = "", this.items = [], i)
        this.wrapper.style.display = "";
      else {
        this.wrapper.style.display = "none";
        return;
      }
      const c = n ? e.slides.length - t.clonesCount * 2 : e.slides.length;
      for (let l = 0; l < c; l++) {
        const p = document.createElement("button");
        p.className = "tka-bullet", p.setAttribute("data-tka-bullet", l), p.addEventListener("click", (g) => {
          g.preventDefault();
          const u = n ? l + t.clonesCount : l;
          o.Move.to(u);
        }), this.wrapper.appendChild(p), this.items.push(p);
      }
      this.active();
    },
    active() {
      if (!this.wrapper) return;
      const { loop: e } = t.options, { index: s } = t.state;
      let n = s;
      if (e) {
        const i = o.Html.slides.length - t.clonesCount * 2;
        n = (s - t.clonesCount) % i, n < 0 && (n += i);
      }
      this.items.forEach((i, c) => {
        c === n ? i.classList.add("is-active") : i.classList.remove("is-active");
      });
    }
  };
}
function tt(t, o, a) {
  return {
    isRevealed: !1,
    mount() {
      this.bind();
      const { type: e, revealOnMount: s } = t.options;
      s ? (this.isRevealed = !0, setTimeout(() => this.reveal(), 50)) : (this.isRevealed = !1, setTimeout(() => {
        this.update(f.getProperty(o.Html.track, "x"), !0);
      }, 10));
    },
    reveal() {
      const { type: e } = t.options;
      if (this.isRevealed = !0, e === "fan") {
        this.update(0, !0);
        const s = o.Html.slides.map((n) => n.querySelector(".demo-slide") || n.children[0]).filter(Boolean);
        f.from(s, {
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
        this.update(f.getProperty(o.Html.track, "x"), !0);
    },
    bind() {
      a.on("move", ({ x: e, jump: s }) => {
        this.update(e, s);
      }), a.on("drag", ({ x: e, y: s }) => {
        this.update(e, !1, s);
      }), a.on("resize", () => {
        this.update(f.getProperty(o.Html.track, "x"), !0);
      });
    },
    update(e, s = !1, n = 0) {
      const { Html: i, Track: c } = o, {
        type: l,
        scaleOnCenter: p,
        scaleAmount: g,
        scaleRange: u,
        gap: E,
        animationEase: y
      } = t.options, m = c.slideWidth + E, P = s ? 0 : t.state.animationDuration || 0;
      i.slides.forEach((b, C) => {
        let O = b.querySelector(".demo-slide") || b.children[0];
        if (!O) return;
        let M, T, x = C - t.state.index;
        const H = i.slides.length;
        t.options.loop && (l === "fade" || l === "fan") && (x = (C - t.state.index) % H, x > H / 2 && (x -= H), x < -H / 2 && (x += H));
        const j = Math.abs(x);
        if (l === "fade" || l === "fan")
          M = j, T = x;
        else {
          const d = c.getCoordinate(C), k = e + d;
          M = Math.abs(k) / m, T = k / m;
        }
        let D = 1, I = 0;
        if (p) {
          let d = u || 1;
          t.options.scaleGradual && !u && (d = Math.max(1, t.options.perView)), I = Math.min(M, d) / d, D = 1 - I * (1 - g), D = Math.max(g, Math.min(1, D));
        }
        const r = { overwrite: !0 };
        if (l === "coverflow") {
          const d = t.options.coverflowRotation || 45, k = t.options.coverflowDepth || -200, w = t.options.perspective || 1e3;
          f.set(i.root, { perspective: w }), r.rotationY = T * -d, r.z = M * k, r.scale = D, r.opacity = this.isRevealed ? 1 - Math.min(M, 2) * 0.2 : 0, b.style.zIndex = 10 - Math.floor(M);
        } else if (l === "single-rotate") {
          const d = t.options.singleRotateOpacity !== void 0 ? t.options.singleRotateOpacity : 0.15, k = t.options.singleRotateRadius !== void 0 ? t.options.singleRotateRadius : 1500, w = t.options.singleRotateInvert !== void 0 ? t.options.singleRotateInvert : !1, R = T * (m / k), v = Math.abs(R), A = w ? 1 : -1, L = w ? 1 : -1;
          r.rotation = A * R * (180 / Math.PI), r.scale = 1, r.opacity = this.isRevealed ? Math.max(0, 1 - M * (1 - d)) : 0;
          const S = b.offsetHeight || 550, _ = c.slideWidth, z = t.options.gap || 0, W = T * (_ / 2 + _ / 2 * Math.cos(v) + S / 2 * Math.sin(v) + z), $ = L * (S / 2 + _ / 2 * Math.sin(v) - S / 2 * Math.cos(v)), F = T * m;
          r.x = W - F, r.y = $, r.rotationY = 0, r.z = 0, b.style.zIndex = 10 - Math.floor(M);
        } else if (l === "360") {
          const d = O.querySelector(".tka-360-container") || O, k = Array.from(d.children).filter(
            (R) => R.classList.contains("tka-360-frame") || d.children.length > 1
          ), w = k.length;
          if (w > 1) {
            const R = t.options.rotationSpeed || 1;
            let v = Math.round(-T * R) % w;
            v < 0 && (v += w), d._tka_last_frame !== v && (k.forEach((A, L) => {
              const S = L === v;
              A.style.opacity = S ? "1" : "0", A.style.visibility = S ? "visible" : "hidden", A.style.zIndex = S ? "2" : "1";
            }), d._tka_last_frame = v);
          }
          r.scale = D, r.opacity = this.isRevealed ? 1 : 0, r.x = 0, r.y = 0, r.rotationY = 0;
        } else if (l === "fade" || l === "fan") {
          if (l === "fade")
            r.opacity = this.isRevealed ? Math.max(0, 1 - j) : 0, r.scale = D, r.z = 0, r.x = 0, r.y = 0, r.rotation = 0;
          else if (l === "fan") {
            const d = t.options.rotateFactor || 15, k = t.options.scaleFactor || 0.1, w = t.options.fanTranslateY || 5, R = t.options.fanSpace || 160, v = t.options.fanTilt || 15, A = t.options.fanTranslateZ || -100, L = t.options.activeRotation || 0, S = t.options.activeScale !== void 0 ? t.options.activeScale : 1, _ = t.options.activeTranslateY || 0;
            if (x === 0)
              r.rotation = (t.state.isDragging ? e / 15 : 0) + L, r.rotationY = t.state.isDragging ? e / 8 : 0, r.rotationX = t.state.isDragging ? -n / 8 : 0, r.x = e, r.y = n + _, r.opacity = this.isRevealed ? 1 : 0, r.scale = S, r.z = 150;
            else if (j === 1) {
              const z = x === 1, W = t.state.isDragging ? 0.2 : 0;
              r.scale = 1 - k, r.y = w + n * W, r.opacity = this.isRevealed ? 0.9 : 0, r.z = A, r.rotationX = -5 + n / 20 * W, r.x = (z ? R : -R) + e * W, r.rotation = (z ? d : -d) + e / 10 * W, r.rotationY = (z ? v : -v) + e / 20 * W;
            } else
              r.opacity = 0, r.z = -300, r.scale = 0.5, r.x = (x > 0 ? 1 : -1) * 300, r.y = 0;
            r.ease = t.options.fanEase || "power2.out", b.style.zIndex = x === 0 ? 20 : 10 - j;
          }
        } else {
          if (r.scale = D, p) {
            const d = t.options.scaleOpacity !== void 0 ? t.options.scaleOpacity : 0.6;
            r.opacity = this.isRevealed ? 1 - I * (1 - d) : 0, t.options.scaleDepth && (r.z = I * -t.options.scaleDepth), t.options.scaleBlur ? r.filter = `blur(${I * t.options.scaleBlur}px)` : r.filter = "blur(0px)", b.style.zIndex = 10 - Math.floor(M);
          } else
            r.opacity = this.isRevealed ? 1 : 0, r.z = 0;
          r.rotationY = 0, r.rotation = 0, r.x = 0, r.y = 0;
        }
        C === t.state.index ? b.classList.add("is-active") : b.classList.remove("is-active"), r.duration = P, r.ease || (r.ease = y), s || (l === "slide" || l === "coverflow" || l === "360" || l === "single-rotate") ? f.set(O, r) : f.to(O, r);
      });
    }
  };
}
function et(t, o, a) {
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
      const s = window.innerWidth;
      let n = null;
      const i = Object.keys(e).map(Number).sort((l, p) => p - l);
      for (const l of i)
        s <= l && (n = e[l]);
      const c = n ? Object.assign({}, this.originalOptions, n) : this.originalOptions;
      (c.perView !== t.options.perView || c.gap !== t.options.gap || c.focusAt !== t.options.focusAt || c.arrows !== t.options.arrows || c.bullets !== t.options.bullets || c.pagination !== t.options.pagination) && this.apply(c);
    },
    apply(e) {
      t.log("Applying breakpoint options:", e), t.options = Object.assign(t.options, e), o.Track && o.Track.calculate(), o.Clones, o.Move && o.Move.jump(t.state.index), a.emit("breakpoint.change", e);
    }
  };
}
function ot(t, o, a) {
  return {
    mount() {
      this.applyLabels(), t.options.keyboard && this.bind();
    },
    bind() {
      const { Html: e } = o;
      e.root.setAttribute("tabindex", "0"), e.root.addEventListener("keydown", (s) => {
        const { Move: n } = o;
        s.key === "ArrowRight" ? n.to(t.state.index + 1) : s.key === "ArrowLeft" && n.to(t.state.index - 1);
      });
    },
    applyLabels() {
      const { Html: e } = o, { loop: s } = t.options, n = t.clonesCount || 0;
      e.root.setAttribute("role", "region"), e.root.setAttribute("aria-label", "Image Slider"), e.track.setAttribute("role", "list"), e.slides.forEach((i, c) => {
        let l = c;
        if (s) {
          const p = e.slides.length - n * 2;
          l = (c - n) % p, l < 0 && (l += p);
        }
        i.setAttribute("role", "listitem"), i.setAttribute("aria-label", `Slide ${l + 1}`);
      }), a.on("move.after", ({ index: i }) => {
        e.slides.forEach((c, l) => {
          l === i ? c.setAttribute("aria-hidden", "false") : c.setAttribute("aria-hidden", "true");
        });
      });
    }
  };
}
function nt(t, o, a) {
  return {
    el: null,
    mount() {
      this.bind(), this.update();
    },
    bind() {
      a.on("move.after", () => this.update()), a.on("breakpoint.change", () => this.update());
    },
    update() {
      const { pagination: e, loop: s } = t.options, { Html: n } = o;
      if (!this.el && e && (this.el = typeof e == "string" ? n.root.querySelector(e) : n.root.querySelector("[data-tka-pagination]")), !this.el) return;
      if (e)
        this.el.style.display = "";
      else {
        this.el.style.display = "none";
        return;
      }
      const i = s ? n.slides.length - t.clonesCount * 2 : n.slides.length;
      let c = t.state.index;
      s && (c = (t.state.index - t.clonesCount) % i, c < 0 && (c += i)), this.el.innerText = `${c + 1} / ${i}`;
    }
  };
}
const st = {
  Html: Y,
  Track: X,
  Move: G,
  Drag: N,
  Clones: U,
  Classes: Z,
  Autoplay: K,
  Controls: J,
  Bullets: Q,
  Effects: tt,
  Breakpoints: et,
  A11y: ot,
  Pagination: nt
};
class B {
  constructor(o, a = {}) {
    this.selector = o, this.options = Object.assign(B.defaults, a), this.events = new V(), this.state = {
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
      arrows: !0,
      bullets: !0,
      keyboard: !0,
      scaleGradual: !1,
      scaleOnCenter: !1,
      scaleAmount: 0.8,
      scaleRange: 1,
      scaleOpacity: 1,
      scaleDepth: 0,
      scaleBlur: 0,
      // Fan specifics
      rotateFactor: 15,
      scaleFactor: 0.1,
      fanTranslateY: 5,
      fanSpace: 160,
      activeRotation: 0,
      activeScale: 1,
      activeTranslateY: 0,
      // Single-rotate specifics
      singleRotateRotation: 20,
      singleRotateDepth: -120,
      singleRotateScale: 0.9,
      singleRotateOpacity: 0.15,
      singleRotateShift: 0.25,
      singleRotateRadius: 1500,
      singleRotateInvert: !1,
      // Coverflow specifics
      coverflowRotation: 45,
      coverflowDepth: -200,
      perspective: 1e3,
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
    this.events.emit("mount.before"), this._components = Object.assign({}, st, this.options.components);
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
  on(o, a) {
    return this.events.on(o, a);
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
      const a = typeof o == "number" ? `=${o}` : o;
      this.components.Controls.move(a);
    }
    return this;
  }
  /**
   * Instantly jump to a specific logical index without animation.
   * @param {number} index 
   * @returns {this}
   */
  jump(o) {
    let a = o;
    return this.options.loop && (this.options.type === "slide" || this.options.type === "coverflow" || this.options.type === "360" || this.options.type === "single-rotate") && (a += this.clonesCount || 0), this.components.Move && this.components.Move.jump(a), this;
  }
}
export {
  B as default
};
