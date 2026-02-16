/**
 * Component to handle active/inactive classes on slides.
 * @param {import('../core/Slider').Slider} slider 
 */
export default function Classes(slider, Components, events) {
    const Classes = {
        mount() {
            this.bind();
            this.update();
        },

        bind() {
            events.on('move.after', () => {
                this.update();
            });
        },

        update() {
            const { Html } = Components;
            const { index } = slider.state;

            Html.slides.forEach((slide, i) => {
                if (i === index) {
                    if (!slide.classList.contains('is-active')) {
                        slide.classList.add('is-active');
                        events.emit('slide.active', { index: i, slide });
                    }
                } else {
                    if (slide.classList.contains('is-active')) {
                        slide.classList.remove('is-active');
                        events.emit('slide.inactive', { index: i, slide });
                    }
                }
            });
        }
    };

    return Classes;
}
