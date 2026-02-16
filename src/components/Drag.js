import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';

/**
 * Component to handle dragging using GSAP Draggable.
 * @param {import('../core/Slider').Slider} slider 
 */
export default function Drag(slider, Components, events) {
    const Drag = {
        draggable: null,

        mount() {
            this.init();
        },

        init() {
            gsap.registerPlugin(Draggable);
            const { Html, Move } = Components;
            const isFan = slider.options.type === 'fan';
            const isFade = slider.options.type === 'fade';

            // For fan/fade, we use the root as trigger but keep track static
            this.draggable = Draggable.create(Html.track, {
                type: isFan ? 'x,y' : 'x',
                trigger: Html.root,
                edgeResistance: 0.65,
                inertia: true,
                onDragStart: () => {
                    slider.state.isDragging = true;
                    if (Move.tween) Move.tween.kill();
                    events.emit('drag.start');
                },
                onDrag: function () {
                    const threshold = slider.options.swipeThreshold || 80;

                    if (isFade || isFan) {
                        // Limit "extreme" dragging: auto-swipe if distance is very high
                        const dist = Math.sqrt(this.x * this.x + this.y * this.y);
                        if (dist > threshold * 3) {
                            this.endDrag();
                            return;
                        }

                        // IMPORTANT: Force the track to stay at origin so the absolute 
                        // children (slides) don't all shift together.
                        gsap.set(Html.track, { x: 0, y: 0 });

                        // Emit the drag values to the Effects component
                        events.emit('drag', { x: this.x, y: this.y });
                        return;
                    }
                    events.emit('drag', { x: this.x });
                },
                onDragEnd: function () {
                    slider.state.isDragging = false;

                    if (isFade || isFan) {
                        // Reset track one last time to be safe
                        gsap.set(Html.track, { x: 0, y: 0 });

                        const threshold = slider.options.swipeThreshold || 80;
                        const dist = Math.sqrt(this.x * this.x + this.y * this.y);

                        if (dist > threshold) {
                            // Determine direction and move
                            if (isFan) {
                                if (this.x > 0) Move.to(slider.state.index - 1);
                                else Move.to(slider.state.index + 1);
                            } else {
                                if (this.getDirection() === 'left') Move.to(slider.state.index + 1);
                                else if (this.getDirection() === 'right') Move.to(slider.state.index - 1);
                            }
                        } else {
                            // Snap back to center
                            events.emit('move', { x: 0 });
                        }

                        events.emit('drag.end');
                        return;
                    }

                    // Calculate which slide to snap to
                    const currentX = this.x;
                    const slideWidthWithGap = Track.slideWidth + slider.options.gap;
                    const offset = Track.getOffset();

                    // Math: index = (offset - currentX) / (W+G)
                    let targetIndex = Math.round((offset - currentX) / slideWidthWithGap);

                    // Constrain index if not looping
                    if (!slider.options.loop) {
                        targetIndex = Math.max(0, Math.min(targetIndex, Html.slides.length - 1));
                    }

                    Move.to(targetIndex);
                }
            })[0];
        },

        disable() {
            if (this.draggable) this.draggable.disable();
        },

        enable() {
            if (this.draggable) this.draggable.enable();
        }
    };

    return Drag;
}
