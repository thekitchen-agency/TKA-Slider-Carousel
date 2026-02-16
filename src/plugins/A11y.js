/**
 * Plugin to handle keyboard navigation and accessibility.
 * @param {import('../core/Slider').Slider} slider 
 */
export default function A11y(slider, Components, events) {
    const A11y = {
        mount() {
            this.applyLabels();
            if (slider.options.keyboard) {
                this.bind();
            }
        },

        bind() {
            const { Html } = Components;

            // Make slider focusable
            Html.root.setAttribute('tabindex', '0');

            Html.root.addEventListener('keydown', (e) => {
                const { Move } = Components;
                if (e.key === 'ArrowRight') {
                    Move.to(slider.state.index + 1);
                } else if (e.key === 'ArrowLeft') {
                    Move.to(slider.state.index - 1);
                }
            });
        },

        applyLabels() {
            const { Html } = Components;
            const { loop } = slider.options;
            const clonesCount = slider.clonesCount || 0;

            Html.root.setAttribute('role', 'region');
            Html.root.setAttribute('aria-label', 'Image Slider');

            Html.track.setAttribute('role', 'list');

            Html.slides.forEach((slide, i) => {
                let logicalIndex = i;
                if (loop) {
                    const total = Html.slides.length - (clonesCount * 2);
                    logicalIndex = (i - clonesCount) % total;
                    if (logicalIndex < 0) logicalIndex += total;
                }

                slide.setAttribute('role', 'listitem');
                slide.setAttribute('aria-label', `Slide ${logicalIndex + 1}`);
            });

            // Update active state for screen readers
            events.on('move.after', ({ index }) => {
                Html.slides.forEach((slide, i) => {
                    if (i === index) {
                        slide.setAttribute('aria-hidden', 'false');
                    } else {
                        slide.setAttribute('aria-hidden', 'true');
                    }
                });
            });
        }
    };

    return A11y;
}
