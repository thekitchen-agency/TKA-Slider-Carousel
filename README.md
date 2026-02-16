# TKA Slider Carousel

A premium, high-performance slider library powered by **GSAP**. Designed for silky-smooth infinite looping, 3D effects, and robust touch/drag physics.

## 🚀 Features
- 🎭 **Advanced Transitions**: Default `slide`, smooth `fade`, and premium 3D `coverflow`.
- 🔄 **Infinite Looping**: Seamlessly loops slides with intelligent cloning.
- 📱 **Fully Responsive**: Breakpoint-based configuration for `perView`, `gap`, and even transition types.
- 🖱️ **Drag & Touch Support**: Powered by GSAP Draggable with momentum and snapping.
- ♿ **Accessibility**: Built-in keyboard navigation (Arrow keys) and ARIA support.
- 🔢 **Pagination & Controls**: Easy integration with custom dots, arrows, and fraction pagination (e.g., "1 / 5").
- ⏱️ **Autoplay**: Fully configurable with `hoverPause` support.

## 📦 Installation

```bash
# GSAP is a peer dependency, so you should install both
npm install tka-slider-carousel gsap
```

## 🛠 Usage

### HTML Structure
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
  <div class="tka-pagination" data-tka-pagination></div>
</div>
```

### Initialization (ESM)
```javascript
import Slider from 'tka-slider-carousel';
import 'tka-slider-carousel/style.css';
import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';

// Register GSAP plugins
gsap.registerPlugin(Draggable);

const slider = new Slider('#my-slider', {
  type: 'coverflow',
  perView: 3,
  focusAt: 'center',
  loop: true,
  autoplay: 4000,
  pagination: true
}).mount();
```

## ⚙️ Options
| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `type` | `String` | `'slide'` | Transition type: `slide`, `fade`, or `coverflow`. |
| `perView` | `Number` | `1` | Number of slides visible at once. |
| `focusAt` | `String\|Number` | `0` | Center slide focus: `0` (left) or `'center'`. |
| `loop` | `Boolean` | `false` | Enable infinite looping. |
| `autoplay` | `Number\|Boolean` | `false` | Milliseconds for autoplay or `false`. |
| `animationDuration` | `Number` | `600` | Transition speed in ms. |
| `revealOnMount` | `Boolean` | `true` | Whether to trigger entrance animation immediately on mount. |
| `activeRotation` | `Number` | `0` | (Fan only) Base rotation for the active slide. |
| `activeScale` | `Number` | `1` | (Fan only) Scale factor for the active slide. |
| `activeTranslateY` | `Number` | `0` | (Fan only) Vertical offset for the active slide. |
| `breakpoints` | `Object` | `{}` | Responsive settings based on max-width. |

## 🎨 Styling
The package comes with minimal base styles. You can import the default CSS:
```javascript
import 'tka-slider-carousel/style.css';
```

## 📄 License
ISC © 2026
# TKA-Slider-Carousel
