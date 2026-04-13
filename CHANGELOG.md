## [1.10.2](https://github.com/thekitchen-agency/tka-slider-carousel/compare/v1.10.1...v1.10.2) (2026-04-13)


### Bug Fixes

* resolve disappearing images and bounds outrun on rapid 360/slider clicks ([55ce84f](https://github.com/thekitchen-agency/tka-slider-carousel/commit/55ce84f555b2f562691f6ef40b0341145ac35eef))

# [1.10.2] - 2026-04-13

### Fixed
- Fixed an issue where rapid clicking would bypass bounds checking, causing the slider to scroll past the cloned DOM elements into empty space.
- Resolved an issue in the 360 viewer where rapid scrolling forced the component to fetch un-rendered frame placeholders, causing images to disappear during the animation.

## [1.10.1](https://github.com/thekitchen-agency/tka-slider-carousel/compare/v1.10.0...v1.10.1) (2026-03-25)

### Bug Fixes

* enable responsive toggles for arrows, bullets and pagination via options ([e25ed54](https://github.com/thekitchen-agency/tka-slider-carousel/commit/e25ed549ee7e8adbfa8568d9080d574e0857a2dd))

# [1.10.1] - 2026-03-25

### Added
- New responsive UI toggles: `arrows`, `bullets`, and `pagination` can now be enabled/disabled via the options object and are fully breakpoint-dependent.

# [1.10.0](https://github.com/thekitchen-agency/tka-slider-carousel/compare/v1.9.0...v1.10.0) (2026-03-25)

### Features
* **core:** optimized 360 rotation, dynamic demo loading, and comprehensive documentation overhaul ([34ea870](https://github.com/thekitchen-agency/tka-slider-carousel/commit/34ea87003c5affbe1a4f9a5e4c86efea38a7f99d))

### Added
- Comprehensive documentation for previously internal visual effects: `scaleGradual`, `scaleOpacity`, `scaleDepth`, and `scaleBlur`.
- New 3D Effect options documented: `perspective`, `coverflowRotation`, and `coverflowDepth`.
- Support for custom animation plugins with documented API and examples.
- New public method `.register()` for dynamic component management.
- New system events: `slide.active`, `slide.inactive`, and `resize`.

### Improved
- Optimized the 360° Object Slider demo with a new dynamic image generator that only loads required angles based on settings.
- Significantly reduced initial asset loading for the 360° demo by skipping non-visible angles (back-view).
- Refined default 360° rotation speed for a more premium "showroom" feel.

# [1.9.0](https://github.com/thekitchen-agency/tka-slider-carousel/compare/v1.8.0...v1.9.0) (2026-03-24)


### Features

* release version 1.8.2 with enhanced animations and scaling ([5424574](https://github.com/thekitchen-agency/tka-slider-carousel/commit/54245743fb61280719b058c5cfdf6ea789c9edc9))

# [1.8.2] - 2026-03-24

### Added
- Gradual scaling effect to enhance slider interaction visuals.
- Improved move animation stability for more fluid transitions.
- Enhanced drag handling for touch and mouse interactions to prevent instability.
- Updated README documentation for Drag & Touch Support.

# [1.8.1] - 2026-03-24

### Fixed
- Resolved an issue where rapid dragging could cause the slider to break apart and lose image display.
- Enhanced stability during fast interactions to prevent the slider from entering an unrecoverable state.

# [1.8.0] - 2026-03-24

### Features
- bump version to 1.8.0, add 360 demo, and improve looping stability

# [1.8.0] - 2026-03-11

### Added
- New 360-degree interactive demo (`demo-360.html`) included in build distribution.
- Enhanced 360 object container logic for the demo site.

### Improved
- Optimized infinite loop logic to handle rapid dragging and high-velocity throws.
- Implemented a "Speed Governor" in the Drag component to cap maximum movement per frame.
- Refined inertia physics with higher resistance and duration caps for better control.
- Improved coordinate synchronization between the physical track and logical state.

# [1.7.0](https://github.com/thekitchen-agency/tka-slider-carousel/compare/v1.6.0...v1.7.0) (2026-02-17)


### Features

* add interactive 360 degree object rotation effect (49e215d), closes hi#performance hi#res

* add interactive 360 degree object rotation transition type (abc1234)
* fix vite pathing and disable jekyll for github pages (4257880)

## [1.5.0] - 2026-02-17
### Added
- New `type: '360'` transition for interactive object rotation.
- Performance-optimized frame switching using direct DOM manipulation to eliminate flickering.
- `rotationSpeed` option to control rotation velocity relative to slider movement.

# [1.4.0](https://github.com/thekitchen-agency/TKA-Slider-Carousel/compare/v1.3.0...v1.4.0) (2026-02-17)


### Bug Fixes

* correct setup-node action in deploy workflow (adaff49)


### Features

* fix path resolution in documentation build config (a8d771c)

# [1.3.0](https://github.com/thekitchen-agency/TKA-Slider-Carousel/compare/v1.2.0...v1.3.0) (2026-02-17)


### Features

* add comprehensive documentation and interactive showcase site (4e1b6d9)

# [1.2.0](https://github.com/thekitchen-agency/TKA-Slider-Carousel/compare/v1.1.0...v1.2.0) (2026-02-17)


### Features

* added documentation (36efdbb)

# [1.1.0](https://github.com/thekitchen-agency/TKA-Slider-Carousel/compare/v1.0.3...v1.1.0) (2026-02-17)


### Features

* added methods to control slider apart from internal controls (715d6b1)

# Changelog

All notable changes to this project will be documented in this file.

## [1.1.0] - 2026-02-17
### Added
- Public `.go()` method for programmatic navigation with pattern support (`>`, `<`, `=index`).
- Public `.jump()` method for instant slider relocation without animation.
- Both methods are logical-index aware and handle clones/looping automatically.

### Improved
- Internal `Controls` move logic now correctly handles logical indexing for jump patterns in loop-enabled sliders.

## [1.0.2] - 2026-02-16
### Added
- New `revealOnMount` configuration option to allow mounting sliders without immediate entrance animations.
- Public `.reveal()` method added to the Slider class for programmatic triggering of entrance effects.
- New customization options for the `fan` effect to style the active slide independently:
  - `activeRotation`: Set base rotation for the active slide.
  - `activeScale`: Set custom scale for the active slide.
  - `activeTranslateY`: Set vertical offset for the active slide.

### Fixed
- Improved GSAP `Draggable` integration by implementing internal plugin registration, resolving initialization errors in modular environments.
- Fixed an issue where the `fan` effect would prematurely apply styles before the entrance animation.
- Optimized initial state calculation for "hidden" sliders to ensure smooth reveal transitions.

## [1.0.1] - 2026-02-15
### Changed
- Production build optimizations for initial deployment.
- Updated asset referencing in demo files to use bundled distribution files.

## [1.0.0] - 2026-02-12
### Added
- Initial release of TKA Slider Carousel.
- Support for multiple transition types: `slide`, `fade`, `coverflow`, and `fan`.
- Silky-smooth infinite looping logic.
- Robust touch and drag physics via GSAP Draggable.
- Fully responsive design with breakpoint-based settings.
- Keyboard navigation and ARIA accessibility.
- Autoplay with hover interruption.
