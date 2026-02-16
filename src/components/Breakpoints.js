/**
 * Component to handle responsive breakpoints.
 * @param {import('../core/Slider').Slider} slider 
 */
export default function Breakpoints(slider, Components, events) {
    const Breakpoints = {
        originalOptions: null,

        mount() {
            this.originalOptions = Object.assign({}, slider.options);
            this.bind();
            this.check();
        },

        bind() {
            window.addEventListener('resize', () => {
                this.check();
            });
        },

        check() {
            const { breakpoints } = this.originalOptions;
            if (!breakpoints || Object.keys(breakpoints).length === 0) return;

            const windowWidth = window.innerWidth;
            let matchedBreakpoint = null;

            // Sort breakpoints numerically
            const sortedKeys = Object.keys(breakpoints)
                .map(Number)
                .sort((a, b) => b - a); // Match largest first is usually better for mobile-first? 
            // Actually Glide uses "max-width" logic usually. Let's assume keys are "width: { options }"

            // Find the highest breakpoint that matches current width (max-width logic)
            for (const width of sortedKeys) {
                if (windowWidth <= width) {
                    matchedBreakpoint = breakpoints[width];
                }
            }

            const newOptions = matchedBreakpoint
                ? Object.assign({}, this.originalOptions, matchedBreakpoint)
                : this.originalOptions;

            // Only re-init if perView or other layout-breaking options changed
            if (
                newOptions.perView !== slider.options.perView ||
                newOptions.gap !== slider.options.gap ||
                newOptions.focusAt !== slider.options.focusAt
            ) {
                this.apply(newOptions);
            }
        },

        apply(options) {
            slider.log('Applying breakpoint options:', options);

            // Update options
            slider.options = Object.assign(slider.options, options);

            // Components need to recalculate
            if (Components.Track) Components.Track.calculate();
            if (Components.Clones) {
                // Clones are tricky because they change DOM. 
                // For now, let's keep it simple: if perView changed, we might need a full rebuild
                // or just use the largest perView for cloning.
            }

            // Update position
            if (Components.Move) {
                Components.Move.jump(slider.state.index);
            }

            events.emit('breakpoint.change', options);
        }
    };

    return Breakpoints;
}
