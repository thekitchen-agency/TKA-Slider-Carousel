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

## 🎮 Public Methods

Once you have a slider instance, you can control it programmatically:

```javascript
// Animate to a specific index (0-indexed)
// This handles loops automatically!
slider.go(2); 

// Use patterns for relative movement
slider.go('>'); // Next
slider.go('<'); // Prev
slider.go('=0'); // Jump to first slide with animation

// Jump to a specific index instantly (no animation)
slider.jump(3);
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

## � Development & Releases

This project uses **Semantic Release** to automate versioning and NPM publishing. Versioning is determined by your commit messages.

### Commit Conventions
To trigger a release, use the following prefix in your commit messages:

- **`fix: ...`** → 🛠️ **Patch Release** (e.g., 1.0.2 → 1.0.3)
  - Use for bug fixes.
- **`feat: ...`** → ✨ **Minor Release** (e.g., 1.0.2 → 1.1.0)
  - Use for new features.
- **`perf: ...`** → 🚀 **Patch Release**
  - Use for performance improvements.
- **`feat!: ...`** or **`fix!: ...`** → 💥 **Major Release** (e.g., 1.1.0 → 2.0.0)
  - Use for breaking changes. Include `BREAKING CHANGE:` in the commit footer.

### Automated Workflow
1.  Push your changes to the `main` branch.
2.  GitHub Actions will analyze your commits.
3.  If a release-triggering commit is found, it will:
    - Bump the version in `package.json`.
    - Update `CHANGELOG.md`.
    - Create a new Git Tag and GitHub Release.
    - Publish to NPM.

---

## 📄 License
ISC © 2026
