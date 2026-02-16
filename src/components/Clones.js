/**
 * Component to handle slide cloning for infinite looping.
 * @param {import('../core/Slider').Slider} slider 
 */
export default function Clones(slider, Components, events) {
    const Clones = {
        items: [],

        mount() {
            if (slider.options.loop && slider.options.type !== 'fade' && slider.options.type !== 'fan') {
                this.run();
            } else {
                slider.clonesCount = 0;
            }
        },

        remove() {
            const { Html } = Components;
            const clones = Html.track.querySelectorAll('.tka-slider__slide--clone');
            clones.forEach(clone => clone.remove());
            Html.collectSlides();
        },

        run() {
            this.remove();
            const { Html } = Components;

            const { perView, breakpoints } = slider.options;

            // We need to find the maximum perView across all breakpoints to ensure 
            // we never run out of clones when resizing.
            let maxPerView = perView;
            if (breakpoints) {
                Object.values(breakpoints).forEach(breakpoint => {
                    if (breakpoint.perView > maxPerView) {
                        maxPerView = breakpoint.perView;
                    }
                });
            }

            const count = Math.ceil(maxPerView);
            const slides = Html.slides;

            // Store clones count for other components
            slider.clonesCount = count;


            // Clone from end and prepend to beginning
            const append = slides.slice(0, count).map(slide => slide.cloneNode(true));
            const prepend = slides.slice(-count).map(slide => slide.cloneNode(true));

            // Reverse for prepending so the first one in the list stays at the end of the prepended group
            prepend.reverse().forEach(clone => {
                clone.classList.add('tka-slider__slide--clone');
                Html.track.insertBefore(clone, Html.track.firstChild);
            });


            append.forEach(clone => {
                clone.classList.add('tka-slider__slide--clone');
                Html.track.appendChild(clone);
            });

            // Update Html slides collection
            Components.Html.collectSlides();

            // RECALCULATE Track now that we have more slides
            Components.Track.calculate();

            // Adjust start index to skip prepended clones
            slider.state.index += count;


            slider.log(`Cloned ${count} slides on each side.`);
        }
    };

    return Clones;
}
