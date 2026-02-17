* add interactive 360 degree object rotation transition type ([abc1234](https://github.com/thekitchen-agency/TKA-Slider-Carousel/commit/abc1234))
* fix vite pathing and disable jekyll for github pages ([4257880](https://github.com/thekitchen-agency/TKA-Slider-Carousel/commit/425788045d893a8ae8734400c83d2a7e44e613d0))

## [1.5.0] - 2026-02-17
### Added
- New `type: '360'` transition for interactive object rotation.
- Performance-optimized frame switching using direct DOM manipulation to eliminate flickering.
- `rotationSpeed` option to control rotation velocity relative to slider movement.

# [1.4.0](https://github.com/thekitchen-agency/TKA-Slider-Carousel/compare/v1.3.0...v1.4.0) (2026-02-17)


### Bug Fixes

* correct setup-node action in deploy workflow ([adaff49](https://github.com/thekitchen-agency/TKA-Slider-Carousel/commit/adaff49afb8d672513b5032da664424c0352f8bb))


### Features

* fix path resolution in documentation build config ([a8d771c](https://github.com/thekitchen-agency/TKA-Slider-Carousel/commit/a8d771c8283038cfd413782ef91ba164a70e2678))

# [1.3.0](https://github.com/thekitchen-agency/TKA-Slider-Carousel/compare/v1.2.0...v1.3.0) (2026-02-17)


### Features

* add comprehensive documentation and interactive showcase site ([4e1b6d9](https://github.com/thekitchen-agency/TKA-Slider-Carousel/commit/4e1b6d9a4d370cf68baa173458a046063da71512))

# [1.2.0](https://github.com/thekitchen-agency/TKA-Slider-Carousel/compare/v1.1.0...v1.2.0) (2026-02-17)


### Features

* added documentation ([36efdbb](https://github.com/thekitchen-agency/TKA-Slider-Carousel/commit/36efdbb46c5a63ec5ca7d49a0794589d137709fe))

# [1.1.0](https://github.com/thekitchen-agency/TKA-Slider-Carousel/compare/v1.0.3...v1.1.0) (2026-02-17)


### Features

* added methods to control slider apart from internal controls ([715d6b1](https://github.com/thekitchen-agency/TKA-Slider-Carousel/commit/715d6b1ee1bccc033878300ea14f779c967179b0))

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
