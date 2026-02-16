import gsap from 'gsap';

/**
 * Component to handle all visual effects (scaling, coverflow, fading, fan)
 * @param {import('../core/Slider').Slider} slider 
 */
export default function Effects(slider, Components, events) {
    const Effects = {
        isRevealed: false,

        mount() {
            this.bind();
            const { type, revealOnMount } = slider.options;

            if (revealOnMount) {
                this.isRevealed = true;
                setTimeout(() => this.reveal(), 50);
            } else {
                this.isRevealed = false;
                // Still need an initial update to set positions/scales (but hidden)
                setTimeout(() => {
                    this.update(gsap.getProperty(Components.Html.track, 'x'), true);
                }, 10);
            }
        },

        reveal() {
            const { type } = slider.options;
            this.isRevealed = true;

            if (type === 'fan') {
                // Entrance "Deal" Animation
                this.update(0, true);
                const inners = Components.Html.slides.map(s => s.querySelector('.demo-slide')).filter(Boolean);
                gsap.from(inners, {
                    y: 100,
                    rotation: 0,
                    opacity: 0,
                    scale: 0.9,
                    duration: 0.8,
                    stagger: 0.1,
                    ease: 'back.out(1.2)',
                    onComplete: () => this.update(0, true)
                });
            } else {
                this.update(gsap.getProperty(Components.Html.track, 'x'), true);
            }
        },

        bind() {
            events.on('move', ({ x, jump }) => {
                this.update(x, jump);
            });

            events.on('drag', ({ x, y }) => {
                this.update(x, false, y);
            });

            events.on('resize', () => {
                this.update(gsap.getProperty(Components.Html.track, 'x'), true);
            });
        },

        update(trackX, jump = false, trackY = 0) {
            const { Html, Track } = Components;
            const {
                type,
                scaleOnCenter,
                scaleAmount,
                scaleRange,
                gap,
                animationEase
            } = slider.options;

            const slideWidthWithGap = Track.slideWidth + gap;
            const duration = jump ? 0 : (slider.state.animationDuration || 0);

            Html.slides.forEach((slide, i) => {
                const inner = slide.querySelector('.demo-slide');
                if (!inner) return;

                let normalizedDistance, signedDistance;
                let diff = i - slider.state.index;
                const count = Html.slides.length;

                // Handle circular indexing for seamless fan stack
                if (slider.options.loop && (type === 'fade' || type === 'fan')) {
                    diff = (i - slider.state.index) % count;
                    if (diff > count / 2) diff -= count;
                    if (diff < -count / 2) diff += count;
                }

                const absDiff = Math.abs(diff);

                if (type === 'fade' || type === 'fan') {
                    normalizedDistance = absDiff;
                    signedDistance = diff;
                } else {
                    const slideCoord = Track.getCoordinate(i);
                    const relativePos = trackX + slideCoord;
                    normalizedDistance = Math.abs(relativePos) / slideWidthWithGap;
                    signedDistance = relativePos / slideWidthWithGap;
                }

                // Base Scale logic
                let scale = 1;
                if (scaleOnCenter) {
                    const range = scaleRange || 1;
                    scale = 1 - (Math.min(normalizedDistance, range) / range * (1 - scaleAmount));
                    scale = Math.max(scaleAmount, Math.min(1, scale));
                }

                const props = { overwrite: true };

                if (type === 'coverflow') {
                    props.rotationY = signedDistance * -30;
                    props.z = normalizedDistance * -100;
                    props.opacity = this.isRevealed ? (1 - (Math.min(normalizedDistance, 2) * 0.2)) : 0;
                    props.scale = scale;
                }
                else if (type === 'fade' || type === 'fan') {
                    if (type === 'fade') {
                        props.opacity = this.isRevealed ? Math.max(0, 1 - absDiff) : 0;
                        props.scale = scale;
                        props.z = 0;
                        props.x = 0;
                        props.y = 0;
                        props.rotation = 0;
                    }
                    else if (type === 'fan') {
                        const fanRotation = slider.options.rotateFactor || 15;
                        const fanScale = slider.options.scaleFactor || 0.1;
                        const fanTranslateY = slider.options.fanTranslateY || 5;
                        const fanSpace = slider.options.fanSpace || 160;
                        const fanTilt = slider.options.fanTilt || 15; // New: 3D Y-rotation
                        const fanTranslateZ = slider.options.fanTranslateZ || -100; // New: Depth

                        const activeRotation = slider.options.activeRotation || 0;
                        const activeScale = slider.options.activeScale !== undefined ? slider.options.activeScale : 1;
                        const activeTranslateY = slider.options.activeTranslateY || 0;

                        if (diff === 0) {
                            props.rotation = (slider.state.isDragging ? (trackX / 15) : 0) + activeRotation;
                            props.rotationY = slider.state.isDragging ? (trackX / 8) : 0;
                            props.rotationX = slider.state.isDragging ? (-trackY / 8) : 0;
                            props.x = trackX;
                            props.y = trackY + activeTranslateY;
                            props.opacity = this.isRevealed ? 1 : 0;
                            props.scale = activeScale;
                            props.z = 150;
                        }
                        else if (absDiff === 1) {
                            const isRight = diff === 1;
                            const dragFactor = slider.state.isDragging ? 0.2 : 0;
                            props.scale = 1 - fanScale;
                            props.y = fanTranslateY + (trackY * dragFactor);
                            props.opacity = this.isRevealed ? 0.9 : 0;
                            props.z = fanTranslateZ;
                            props.rotationX = -5 + (trackY / 20 * dragFactor);
                            props.x = (isRight ? fanSpace : -fanSpace) + (trackX * dragFactor);
                            props.rotation = (isRight ? fanRotation : -fanRotation) + (trackX / 10 * dragFactor);
                            props.rotationY = (isRight ? fanTilt : -fanTilt) + (trackX / 20 * dragFactor);
                        }
                        else {
                            props.opacity = 0;
                            props.z = -300;
                            props.scale = 0.5;
                            props.x = (diff > 0 ? 1 : -1) * 300;
                            props.y = 0;
                        }
                        props.ease = slider.options.fanEase || 'power2.out';
                        // Z-Index Management for fan
                        slide.style.zIndex = (diff === 0) ? 20 : 10 - absDiff;
                    }
                }
                else {
                    // Default Slide type
                    props.scale = scale;
                    props.opacity = !this.isRevealed ? 0 : (scaleOnCenter ? (scale < 1 ? 0.6 : 1) : 1);
                    props.rotationY = 0;
                    props.z = 0;
                    props.rotation = 0;
                    props.x = 0;
                    props.y = 0;
                }

                // State Classes
                if (i === slider.state.index) {
                    slide.classList.add('is-active');
                } else {
                    slide.classList.remove('is-active');
                }

                props.duration = duration;
                if (!props.ease) props.ease = animationEase;

                if (jump) {
                    gsap.set(inner, props);
                } else {
                    gsap.to(inner, props);
                }
            });
        }
    };

    return Effects;
}
