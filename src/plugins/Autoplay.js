/**
 * Plugin to handle automatic sliding.
 * @param {import('../core/Slider').Slider} slider 
 */
export default function Autoplay(slider, Components, events) {
    const Autoplay = {
        interval: null,

        mount() {
            if (slider.options.autoplay) {
                this.start();
                this.bind();
            }
        },

        bind() {
            const { Html } = Components;

            if (slider.options.hoverPause) {
                Html.root.addEventListener('mouseenter', () => this.stop());
                Html.root.addEventListener('mouseleave', () => this.start());
            }

            events.on('drag.start', () => this.stop());
            events.on('drag.end', () => {
                if (slider.options.autoplay) this.start();
            });
        },

        start() {
            if (!slider.options.autoplay) return;
            this.stop();
            this.interval = setInterval(() => {
                const { Move } = Components;
                // Always move to next index, loop handled by Move
                Move.to(slider.state.index + 1);
            }, typeof slider.options.autoplay === 'number' ? slider.options.autoplay : 3000);
        },

        stop() {
            if (this.interval) {
                clearInterval(this.interval);
                this.interval = null;
            }
        }
    };

    return Autoplay;
}
