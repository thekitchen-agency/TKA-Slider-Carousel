# TKA Slider Carousel

A premium, high-performance slider library powered by **GSAP**. Designed for silky-smooth infinite looping, 3D effects, and robust touch/drag physics.

[![NPM Version](https://img.shields.io/npm/v/tka-slider-carousel.svg)](https://www.npmjs.com/package/tka-slider-carousel)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

---

## ✨ Features

- 🎭 **Advanced Transitions**: Default `slide`, smooth `fade`, premium 3D `coverflow`, and our flagship `fan` stack.
- 🔄 **Infinite Looping**: Seamlessly loops slides with intelligent cloning.
- 📱 **Fully Responsive**: Breakpoint-based configuration for `perView`, `gap`, and even transition types.
- 🖱️ **Drag & Touch Support**: Powered by GSAP Draggable with momentum and snapping.
- ♿ **Accessibility**: Built-in keyboard navigation (Arrow keys) and ARIA support.
- 🔢 **Pagination & Controls**: Easy integration with custom dots, arrows, and fraction pagination (e.g., "1 / 5").
- ⏱️ **Autoplay**: Fully configurable with `hoverPause` support.

---

## 🚀 Quick Start

### 1. Installation

```bash
# GSAP is a peer dependency
npm install tka-slider-carousel gsap
```

### 2. HTML Structure

```html
<div class="tka-slider" id="my-slider">
  <div class="tka-slider__track">
    <div class="tka-slider__slide">Slide 1</div>
    <div class="tka-slider__slide">Slide 2</div>
    <div class="tka-slider__slide">Slide 3</div>
  </div>

  <!-- Optional Elements -->
  <div class="tka-controls">
    <button data-tka-control="<">Prev</button>
    <button data-tka-control=">">Next</button>
  </div>
  <div class="tka-bullets" data-tka-bullets></div>
</div>
```

### 3. Initialization

```javascript
import Slider from 'tka-slider-carousel';
import 'tka-slider-carousel/style.css';
import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';

gsap.registerPlugin(Draggable);

const slider = new Slider('#my-slider', {
  type: 'coverflow',
  perView: 3,
  focusAt: 'center',
  loop: true,
  autoplay: 4000
}).mount();
```

---

## 📚 Documentation

For a full list of configuration options, public methods, and events, please refer to our:

👉 **[Full API Documentation (DOCUMENTATION.md)](./DOCUMENTATION.md)**

---

## 🎮 Development & Releases

This project uses **Semantic Release** to automate versioning and NPM publishing.

- **`fix: ...`** → 🛠️ Patch Release
- **`feat: ...`** → ✨ Minor Release
- **`feat!: ...`** → 💥 Major Release (Breaking Change)

---

## 📄 License
ISC © 2026

