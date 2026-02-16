/**
 * Plugin to handle bullet/dot navigation.
 * @param {import('../core/Slider').Slider} slider 
 */
export default function Bullets(slider, Components, events) {
    const Bullets = {
        wrapper: null,
        items: [],

        mount() {
            this.bind();
            this.render();
        },

        bind() {
            events.on('move.after', () => {
                this.active();
            });

            events.on('mount.after', () => {
                this.render();
            });
        },

        render() {
            const { Html } = Components;
            const { perView, loop } = slider.options;

            // Attempt to find existing wrapper
            this.wrapper = Html.root.querySelector('[data-tka-bullets]');
            if (!this.wrapper) return;

            // Clear
            this.wrapper.innerHTML = '';
            this.items = [];

            // Calculate number of bullets
            // In loop mode, we skip the clones in our count
            const slidesCount = loop
                ? Html.slides.length - (slider.clonesCount * 2)
                : Html.slides.length;

            for (let i = 0; i < slidesCount; i++) {
                const button = document.createElement('button');
                button.className = 'tka-bullet';
                button.setAttribute('data-tka-bullet', i);

                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    const targetIndex = loop ? i + slider.clonesCount : i;
                    Components.Move.to(targetIndex);
                });

                this.wrapper.appendChild(button);
                this.items.push(button);
            }

            this.active();
        },

        active() {
            if (!this.wrapper) return;

            const { loop } = slider.options;
            const { index } = slider.state;

            // Normalize index for dots
            let activeIndex = index;
            if (loop) {
                const slidesCount = Components.Html.slides.length - (slider.clonesCount * 2);
                activeIndex = (index - slider.clonesCount) % slidesCount;
                if (activeIndex < 0) activeIndex += slidesCount;
            }

            this.items.forEach((item, i) => {
                if (i === activeIndex) {
                    item.classList.add('is-active');
                } else {
                    item.classList.remove('is-active');
                }
            });
        }
    };

    return Bullets;
}
