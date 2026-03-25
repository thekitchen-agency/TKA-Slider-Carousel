/**
 * Plugin to handle pagination text (e.g. "1 / 5").
 * @param {import('../core/Slider').Slider} slider 
 */
export default function Pagination(slider, Components, events) {
    const Pagination = {
        el: null,

        mount() {
            this.bind();
            this.update();
        },

        bind() {
            events.on('move.after', () => this.update());
            events.on('breakpoint.change', () => this.update());
        },

        update() {
            const { pagination, loop } = slider.options;
            const { Html } = Components;

            if (!this.el && pagination) {
                this.el = typeof pagination === 'string'
                    ? Html.root.querySelector(pagination)
                    : Html.root.querySelector('[data-tka-pagination]');
            }

            if (!this.el) return;

            if (!pagination) {
                this.el.style.display = 'none';
                return;
            } else {
                this.el.style.display = '';
            }

            const total = loop
                ? Html.slides.length - (slider.clonesCount * 2)
                : Html.slides.length;

            let current = slider.state.index;
            if (loop) {
                current = (slider.state.index - slider.clonesCount) % total;
                if (current < 0) current += total;
            }

            // 1-based indexing for display
            this.el.innerText = `${current + 1} / ${total}`;
        }
    };

    return Pagination;
}
