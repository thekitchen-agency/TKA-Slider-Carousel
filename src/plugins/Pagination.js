/**
 * Plugin to handle pagination text (e.g. "1 / 5").
 * @param {import('../core/Slider').Slider} slider 
 */
export default function Pagination(slider, Components, events) {
    const Pagination = {
        el: null,

        mount() {
            if (!slider.options.pagination) return;

            const { Html } = Components;
            this.el = typeof slider.options.pagination === 'string'
                ? Html.root.querySelector(slider.options.pagination)
                : Html.root.querySelector('[data-tka-pagination]');

            if (this.el) {
                this.bind();
                this.update();
            }
        },

        bind() {
            events.on('move.after', () => this.update());
        },

        update() {
            if (!this.el) return;

            const { Html } = Components;
            const { perView, loop } = slider.options;

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
