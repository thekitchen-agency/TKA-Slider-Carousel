/**
 * Component to handle track dimensions and slide positioning.
 * @param {import('../core/Slider').Slider} slider 
 */
export default function Track(slider, Components, events) {
    const Track = {
        /**
         * Coordinate offset for the track.
         */
        x: 0,

        /**
         * Width of a single slide.
         */
        slideWidth: 0,

        mount() {
            this.calculate();

            // Recalculate on resize
            window.addEventListener('resize', () => {
                this.calculate();
                events.emit('resize');
            });
        },

        calculate() {
            const { Html } = Components;
            const { perView, gap } = slider.options;

            const containerWidth = Html.root.offsetWidth;

            // Calculate slide width based on perView and gap
            // (W - (gap * (perView - 1))) / perView
            this.slideWidth = (containerWidth - (gap * (perView - 1))) / perView;

            Html.slides.forEach((slide) => {
                slide.style.width = `${this.slideWidth}px`;
                slide.style.marginRight = `${gap}px`;
            });


            slider.log(`Track calculated: slideWidth=${this.slideWidth}`);
        },

        /**
         * Get the position of a slide by index.
         * @param {number} index
         */
        getCoordinate(index) {
            const { gap } = slider.options;
            const baseCoord = index * (this.slideWidth + gap);
            return baseCoord - this.getOffset();
        },

        /**
         * Get the offset based on focusAt setting.
         */
        getOffset() {
            const { focusAt, gap } = slider.options;
            const { Html } = Components;

            if (focusAt === 'center') {
                const containerWidth = Html.root.offsetWidth;
                return (containerWidth / 2) - (this.slideWidth / 2);
            } else if (typeof focusAt === 'number') {
                return focusAt * (this.slideWidth + gap);
            }
            return 0;
        }
    };

    return Track;
}
