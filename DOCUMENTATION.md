# TKA Slider Carousel - Full Documentation

Welcome to the comprehensive guide for **TKA Slider Carousel**. This document covers every option, method, and event available in the library.

---

## 🏗 HTML Structure

The slider requires a specific hierarchy to function correctly. You can add custom classes as needed, but the data attributes and core structure should remain intact for plugins like Bullets or Pagination.

```html
<div class="tka-slider" id="my-slider">
  <div class="tka-slider__track">
    <!-- Slides -->
    <div class="tka-slider__slide">
      <div class="demo-slide">Slide 1</div>
    </div>
    <div class="tka-slider__slide">
      <div class="demo-slide">Slide 2</div>
    </div>
    ...
  </div>

  <!-- Optional: Controls -->
  <div class="tka-controls">
    <button data-tka-control="<">Prev</button>
    <button data-tka-control=">">Next</button>
  </div>

  <!-- Optional: Bullets -->
  <div class="tka-bullets" data-tka-bullets></div>

  <!-- Optional: Pagination (e.g., "1 / 5") -->
  <div class="tka-pagination" data-tka-pagination></div>
</div>
```

---

## ⚙️ Configuration Options

Options are passed as the second argument to the `Slider` constructor.

### Core Options
| Option | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `type` | `String` | `'slide'` | Transition type: `'slide'`, `'fade'`, `'coverflow'`, or `'fan'`. |
| `startAt` | `Number` | `0` | The index of the slide to start on. |
| `perView` | `Number` | `1` | Number of slides visible at once. |
| `focusAt` | `String\|Number` | `0` | Focus position: `0` (left) or `'center'`. |
| `gap` | `Number` | `0` | Space between slides in pixels. |
| `loop` | `Boolean` | `false` | Enable infinite looping. |
| `revealOnMount` | `Boolean` | `true` | Trigger entrance animations immediately after mounting. |
| `debug` | `Boolean` | `false` | Enable console logging for internal states and events. |

### Animation & Physics
| Option | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `animationDuration` | `Number` | `600` | Speed of the transition in milliseconds. |
| `animationEase` | `String` | `'power2.out'` | GSAP ease string (e.g., `'expo.inOut'`, `'back.out(1.7)'`). |
| `swipeThreshold` | `Number` | `80` | Minimum drag distance (px) required to trigger a slide change. |

### Interaction & Autoplay
| Option | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `autoplay` | `Number\|Boolean` | `false` | Auto-slide interval in ms. Set to `false` to disable. |
| `hoverPause` | `Boolean` | `true` | Pause autoplay when the mouse enters the slider area. |
| `keyboard` | `Boolean` | `true` | Enable Arrow Left/Right keyboard navigation. |

### Visual Effects (Scaling)
Applied when `type: 'slide'` or `'coverflow'`.
| Option | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `scaleOnCenter` | `Boolean` | `false` | If true, slides further from the focus point will scale down. |
| `scaleAmount` | `Number` | `0.8` | The minimum scale of non-active slides (0 to 1). |
| `scaleRange` | `Number` | `1` | Range (in slides) over which the scaling occurs. |

### 🪭 Fan Effect Specifics
Used only when `type: 'fan'`.
| Option | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `rotateFactor` | `Number` | `15` | Base rotation angle for side slides in the fan. |
| `scaleFactor` | `Number` | `0.1` | Scale reduction for side slides (e.g., 0.1 becomes 0.9 scale). |
| `fanSpace` | `Number` | `160` | Horizontal spacing between the fanned cards. |
| `fanTranslateY` | `Number` | `5` | Vertical offset for side slides. |
| `fanTilt` | `Number` | `15` | 3D Y-axis rotation (tilt) for side slides. |
| `fanTranslateZ` | `Number` | `-100` | Depth translation (Z-axis) for background slides. |
| `activeRotation` | `Number` | `0` | Base rotation for the active (top) slide. |
| `activeScale` | `Number` | `1` | Scale of the active slide. |
| `activeTranslateY` | `Number` | `0` | Vertical offset for the active slide. |

### 📱 Responsive Breakpoints
Breakpoints use a `max-width` logic.
```javascript
const slider = new Slider('#my-slider', {
  perView: 4,
  breakpoints: {
    1024: {
      perView: 2,
      gap: 20
    },
    600: {
      perView: 1,
      type: 'fade' // You can even change the transition type!
    }
  }
}).mount();
```

---

## 🎮 Public Methods

Once you have a slider instance, you can control it programmatically.

### `mount()`
Initializes components and builds the slider. Returns the instance.
```javascript
slider.mount();
```

### `go(pattern)`
Navigates to a specific slide or direction.
- `'>'`: Next slide.
- `'<'`: Previous slide.
- `'=n'`: Go to logical index `n` (e.g., `'=2'` for the 3rd slide).
- `n`: Equivalent to `'=n'`.

```javascript
slider.go('>');   // Next
slider.go('=0');  // Back to start
```

### `jump(index)`
Instantly moves to a slide index without animation.
```javascript
slider.jump(3);
```

### `on(event, callback)`
Subscribes to internal events.
```javascript
slider.on('move.after', (data) => {
  console.log('Now at index:', data.index);
});
```

### `reveal()`
Manually triggers the entrance animation. Useful if `revealOnMount` is set to `false`.
```javascript
slider.reveal();
```

---

## 🔔 Events

The slider emits several events during its lifecycle. Use `slider.on(name, callback)` to listen to them.

| Event | Data Package | Description |
| :--- | :--- | :--- |
| `mount.before` | `null` | Fired before components are initialized. |
| `mount.after` | `null` | Fired after the slider is fully mounted and ready. |
| `move` | `{ x, jump }` | Fired on every frame of a transition or during a jump. |
| `move.after` | `{ index }` | Fired when a transition completes. |
| `drag.start` | `null` | Fired when the user starts dragging. |
| `drag` | `{ x, y }` | Fired continuously while dragging. |
| `drag.end` | `null` | Fired when the user releases the slide. |
| `breakpoint.change`| `options` | Fired when a responsive breakpoint is triggered. |

---

## 💡 Practical Examples

### Custom External Controls
```javascript
const slider = new Slider('#my-slider').mount();

document.querySelector('.my-custom-next').addEventListener('click', () => {
  slider.go('>');
});
```

### Syncing with Background Colors
```javascript
const colors = ['#3b82f6', '#10b981', '#f59e0b'];

slider.on('move.after', ({ index }) => {
  document.body.style.backgroundColor = colors[index];
});
```

### Dynamic Component Registration
```javascript
// You can build your own plugins!
const MyLogger = (slider, components, events) => {
  return {
    mount() {
      events.on('move.after', (data) => {
        console.log('Custom Logic: we moved to', data.index);
      });
    }
  };
};

new Slider('#id', { 
  components: { MyLogger } 
}).mount();
```
