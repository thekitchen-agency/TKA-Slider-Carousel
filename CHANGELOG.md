# Changelog

All notable changes to this project will be documented in this file.

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
