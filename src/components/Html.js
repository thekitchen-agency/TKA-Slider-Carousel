/**
 * Component to handle DOM elements.
 * @param {import('../core/Slider').Slider} slider 
 */
export default function Html(slider, Components, events) {
    const Html = {
        root: null,
        track: null,
        slides: [],

        mount() {
            this.root = slider.container;
            this.track = this.root.querySelector('.tka-slider__track');

            // Add mode class
            this.root.classList.add(`tka-slider--${slider.options.type}`);

            this.collectSlides();
        },

        collectSlides() {
            this.slides = Array.from(this.track.children);
        }

    };

    return Html;
}
