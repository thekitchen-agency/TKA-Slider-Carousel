# TKA Slider Carousel - Ultimate Documentation

Welcome to the definitive guide for **TKA Slider Carousel**. This document is structured to help you master every detail of the library, from core layout to advanced 3D visual effects.

---

## 🏗 HTML Structure

The slider requires a specific hierarchy. Data attributes like `data-tka-control`, `data-tka-bullets`, and `data-tka-pagination` are used by the library to automatically hook into your UI.

```html
<div class="tka-slider" id="my-slider">
  <div class="tka-slider__track">
    <!-- Slides -->
    <div class="tka-slider__slide">
      <div class="demo-slide">Slide 1</div>
    </div>
    <div class="tka-slider__slide">
       <!-- 360 frames go here if type is '360' -->
    </div>
    ...
  </div>

  <!-- UI Modules (Optional) -->
  <div class="tka-controls">
    <button data-tka-control="<">Prev</button>
    <button data-tka-control=">">Next</button>
  </div>
  <div class="tka-bullets" data-tka-bullets></div>
  <div class="tka-pagination" data-tka-pagination></div>
</div>
```

---

## 🛠 1. Core Configuration (Global)

These settings apply regardless of the transition type selected.

| Option | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `type` | `String` | `'slide'` | Transition engine: `'slide'`, `'fade'`, `'coverflow'`, `'fan'`, or `'360'`. |
| `startAt` | `Number` | `0` | Starting slide index. |
| `perView` | `Number` | `1` | Number of slides visible in the viewport. |
| `focusAt` | `String\|Number` | `0` | Align active slide to: `0` (left), `'center'`, or a specific index offset. |
| `gap` | `Number` | `0` | Pixel-spacing between slides. Supports negative values for overlap. |
| `loop` | `Boolean` | `false` | Enable infinite wrap-around. |
| `revealOnMount` | `Boolean` | `true` | Automatically trigger entrance animation on load. |
| `debug` | `Boolean` | `false` | Log internal events and state changes to console. |
| `breakpoints` | `Object` | `{}` | Key-value pairs of `max-width: { options }` for responsive design. |

---

## ⚡ 2. Animation & Interaction

| Option | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `animationDuration` | `Number` | `600` | Duration of transitions in milliseconds. |
| `animationEase` | `String` | `'power2.out'` | GSAP ease string (e.g., `'expo.inOut'`, `'back.out'`). |
| `autoplay` | `Number\|Boolean` | `false` | Interval in ms for auto-sliding. `false` to disable. |
| `hoverPause` | `Boolean` | `true` | Pause `autoplay` when cursor is over the slider. |
| `keyboard` | `Boolean` | `true` | Enable navigation via Arrow keys. |
| `swipeThreshold` | `Number` | `80` | Minimum drag distance (px) to trigger a slide change. |

---

## 🎨 3. Effect Settings

### A. Slide & Coverflow Effects
Settings used for standard horizontal sliding or the 3D 'coverflow' mode.

| Option | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `scaleOnCenter` | `Boolean` | `false` | Scales down non-active slides based on distance from focus. |
| `scaleAmount` | `Number` | `0.8` | The minimum scale of distant slides (0 to 1). |
| `scaleRange` | `Number` | `1` | Range (in slide widths) over which scaling occurs. |
| `scaleGradual` | `Boolean` | `false` | Automatically sets `scaleRange` to reach the viewport edges. |
| `scaleOpacity` | `Number` | `1` | Minimum opacity for distant slides. |
| `scaleDepth` | `Number` | `0` | Applies Z-axis translation (depth) based on distance. |
| `scaleBlur` | `Number` | `0` | Applies a gaussian blur filter based on distance. |
| `perspective` | `Number` | `1000` | CSS perspective for 3D modes (primarily coverflow/fan). |
| `coverflowRotation` | `Number` | `45` | Y-axis rotation angle for side slides in coverflow mode. |
| `coverflowDepth` | `Number` | `-200` | Depth offset (Z) for side slides in coverflow mode. |

### B. Fan (Stack) Effect
The signature card-fanning interaction (`type: 'fan'`).

| Option | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `rotateFactor` | `Number` | `15` | Vertical rotation angle for background cards. |
| `scaleFactor` | `Number` | `0.1` | Incremental scale reduction for background cards. |
| `fanSpace` | `Number` | `160` | Horizontal spacing between cards in the fan stack. |
| `fanTranslateY` | `Number` | `5` | Vertical stagger offset for each card in the fan. |
| `fanTilt` | `Number` | `15` | 3D Y-axis tilt for non-active cards. |
| `fanTranslateZ` | `Number` | `-100` | Depth translation (Z) for background cards. |
| `fanEase` | `String` | `'power2.out'` | Animation ease specifically for fan movements. |
| `activeRotation` | `Number` | `0` | Starting rotation for the front-most card. |
| `activeScale` | `Number` | `1` | Scale of the front-most card. |
| `activeTranslateY` | `Number` | `0` | Vertical offset for the front-most card. |

### C. 360° Object Rotation
Interactive frame-based rotation (`type: '360'`).

| Option | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `rotationSpeed` | `Number` | `1` | Sensitivity of rotation. Maps slide-width movement to frame shifts. |

---

## 🎮 4. Public API & Instance Properties

### Methods
| Method | Description |
| :--- | :--- |
| `mount()` | Initializes the slider. Returns `this`. |
| `go(pattern)` | Navigates. Pattern can be `'>'`, `'<'`, `'=2'`, or index `2`. |
| `jump(index)` | Instantly move to an index without animation. |
| `reveal()` | Triggers the entrance animation manually. |
| `on(event, cb)` | Subscribe to an event. Returns an object with an `off()` method. |
| `off(event, cb)` | Unsubscribe from an event. |
| `register(comps)` | Dynamically add/replace core components or plugins. |

### State & Properties
You can access raw data through the instance:
- `slider.state.index`: The current active index.
- `slider.state.isDragging`: Boolean flag for user interaction.
- `slider.state.animationDuration`: Current speed of the running transition.
- `slider.container`: Reference to the root DOM element.
- `slider.clonesCount`: Number of cloned slides per side (if looping).

---

## 🔔 5. Events

Use `slider.on('event', data => ...)` to hook into the lifecycle.

| Event | Data | Description |
| :--- | :--- | :--- |
| `mount.before` | `null` | Pre-init hook. |
| `mount.after` | `null` | Slider is ready and entrance animation started. |
| `move` | `{ x, jump }` | Emitted every frame during movement. |
| `move.after` | `{ index }` | Movement/Transition complete. |
| `drag.start` | `null` | User interaction started. |
| `drag` | `{ x, y }` | Continuous drag update. Includes Y-axis for Fan mode. |
| `drag.end` | `null` | User interaction finished. |
| `slide.active` | `{ index, slide }` | A slide gained the active state. |
| `slide.inactive` | `{ index, slide }` | A slide lost its active state. |
| `resize` | `null` | Screen size change detected. |
| `breakpoint.change`| `options` | New responsive settings applied. |

---

## 🧩 6. UI Modules (Plugins)

| Module | Activation | Functionality |
| :--- | :--- | :--- |
| **Controls** | Auto-detects `[data-tka-control]` | Arrow navigation and jump links. |
| **Bullets** | Auto-detects `[data-tka-bullets]` | Generates dot indicators. |
| **Pagination**| Option `pagination` | Displays current index (e.g. "1 / 5"). |
| **Autoplay** | Option `autoplay` | Automatic timed navigation. |
| **A11y** | Option `keyboard: true` | Screen reader Support and keyboard focus. |

---

## 💡 Practical Examples

### Dynamic Plugin Registration
```javascript
const MyPlugin = (slider, components, events) => {
  return {
    mount() {
      events.on('slide.active', ({ index }) => {
        console.log('You are viewing slide:', index);
      });
    }
  };
};

const slider = new Slider('#id', {
  components: { MyPlugin }
}).mount();
```

---

## 🌈 7. Building Custom Animation Effects

The library's modular architecture allows you to build entirely new transition types by creating a custom component that hooks into the core events.

### How it works
Internal effects (like 'fan' or '360') use the `move` and `drag` events to update slide transforms in real-time. You can do the same by listening to these events and using GSAP.

### Example: A "Vertical Flip" Effect
```javascript
const FlipEffect = (slider, components, events) => {
  return {
    mount() {
      // Listen to the move event (fired on every frame of a transition)
      events.on('move', ({ x }) => {
        const { Html, Track } = components;
        const slideWidthWithGap = Track.slideWidth + slider.options.gap;

        Html.slides.forEach((slide, i) => {
          // 1. Calculate relative distance from focus point (0 at center)
          const slideCoord = Track.getCoordinate(i);
          const relativePos = x + slideCoord;
          const normalizedDist = relativePos / slideWidthWithGap;

          // 2. Apply Custom GSAP Animation based on that distance
          gsap.set(slide, {
            rotationX: normalizedDist * 90,
            opacity: 1 - Math.abs(normalizedDist),
            z: Math.abs(normalizedDist) * -500,
            overwrite: true
          });
        });
      });
    }
  };
};
```

### Option A: Adding alongside internal effects (Multi-Stacking)
If you register your effect with a new name, it will run *after* the internal Effects component. This is useful for adding "overlays" to existing transitions.
```javascript
new Slider('#id', {
  components: { FlipEffect }
}).mount();
```

### Option B: Replacing the internal engine (Complete Overwrite)
If you want complete control and want to disable the built-in transitions entirely, replace the `Effects` key:
```javascript
new Slider('#id', {
  components: {
    Effects: FlipEffect // Replaces the core Effects.js logic
  }
}).mount();
```

