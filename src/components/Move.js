import gsap from 'gsap';

/**
 * Component to handle track movement using GSAP.

 * @param {import('../core/Slider').Slider} slider 
 */
export default function Move(slider, Components, events) {
    const Move = {
        /**
         * GSAP Timeline or Tween reference
         */
        tween: null,

        mount() {
            this.bind();
        },

        bind() {
            events.on('resize', () => {
                this.to(slider.state.index, { duration: 0 });
            });
        },

        /**
         * Move to a specific index.
         * @param {number} index 
         * @param {Object} options 
         */
        to(index, options = {}) {
            const { Track, Html } = Components;
            const { animationDuration, animationEase, type } = slider.options;

            const duration = options.duration !== undefined ? options.duration : (animationDuration / 1000);
            const ease = options.ease || animationEase;

            if (this.tween) this.tween.kill();

            // Handle looping for effects that don't use clones (fan/fade)
            if ((type === 'fade' || type === 'fan') && slider.options.loop) {
                const count = Html.slides.length;
                if (index >= count) index = 0;
                if (index < 0) index = count - 1;
            }

            // Update index immediately to prevent race conditions on rapid clicks
            slider.state.index = index;
            slider.state.animationDuration = duration;

            if (type === 'fade' || type === 'fan') {
                // In fade/fan mode, we don't move the track. 
                // We just update states and let the Effects component handle opacity/transform.
                events.emit('move', { x: 0 }); // Effects engine needs this event
                events.emit('move.after', { index: slider.state.index });
                return;
            }

            const coordinate = Track.getCoordinate(index);
            const totalWidth = Html.slides.length * (Track.slideWidth + slider.options.gap); // This is not quite right for loop swap

            this.tween = gsap.to(Html.track, {
                x: -coordinate,
                duration: duration,
                ease: ease,
                overwrite: 'auto',
                onUpdate: () => {
                    const currentX = gsap.getProperty(Html.track, 'x');

                    // If we are looping, we might want to check for early swaps during long momentum
                    // However, we usually just let onComplete handle it for discrete indices.
                    // For now, let's keep it simple and just emit move.
                    events.emit('move', { x: currentX });
                },
                onComplete: () => {
                    slider.state.animationDuration = 0;

                    let jumped = false;
                    if (slider.options.loop) {
                        jumped = this.loop(slider.state.index);
                    }

                    // Only emit move.after if we didn't already emit it via jump()
                    if (!jumped) {
                        events.emit('move.after', { index: slider.state.index });
                    }
                }
            });
        },


        /**
         * Seamlessly jump when hitting clones.
         * Returns true if a jump occurred.
         */
        loop(index) {
            const clonesCount = slider.clonesCount || 0;
            const originalCount = Components.Html.slides.length - (clonesCount * 2);

            // Use a small epsilon to avoid floating point issues
            const eps = 0.001;

            // If we are at the prepended clones (start)
            if (index < clonesCount - eps) {
                this.jump(index + originalCount);
                return true;
            }
            // If we are at the appended clones (end)
            else if (index > (originalCount + clonesCount - 1) + eps) {
                this.jump(index - originalCount);
                return true;
            }

            return false;
        },


        /**
         * Snap-check for coordinates during dragging/inertia.
         * Swaps track position if it goes too far.
         * @param {number} x Current x coordinate
         * @returns {number|null} New x if swapped, else null
         */
        loopX(x) {
            if (!slider.options.loop) return null;

            const { Track, Html } = Components;
            const clonesCount = slider.clonesCount || 0;
            const originalCount = Html.slides.length - (clonesCount * 2);

            if (originalCount <= 0) return null;

            const slideWidthWithGap = Track.slideWidth + slider.options.gap;
            const totalWidth = originalCount * slideWidthWithGap;

            const pos = -x;
            const startLimit = Track.getCoordinate(clonesCount);
            const endLimit = Track.getCoordinate(clonesCount + originalCount);

            // If we've dragged past the original slides into clones, jump back.
            // We give it a little "buffer" of half a slide so it doesn't jump too aggressively.
            if (pos < startLimit - (slideWidthWithGap * 0.5)) {
                return x - totalWidth;
            }

            if (pos > endLimit - (slideWidthWithGap * 0.5)) {
                return x + totalWidth;
            }

            return null;
        },


        /**
         * Jump to an index without animation.
         */
        jump(index) {
            const { Track, Html } = Components;
            const { type } = slider.options;

            slider.state.index = index;

            if (type === 'fade' || type === 'fan') {
                events.emit('move', { x: 0, jump: true });
                events.emit('move.after', { index });
                return;
            }

            const coordinate = Track.getCoordinate(index);

            gsap.set(Html.track, { x: -coordinate });

            // CRITICAL: Emit move even during jumps so Effects can sync instantly
            events.emit('move', { x: -coordinate, jump: true });
            events.emit('move.after', { index });
        }
    };

    return Move;
}
