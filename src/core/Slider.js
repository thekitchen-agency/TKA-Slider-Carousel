import { Events } from './Events';
import { Components as CoreComponents } from '../components/index';


export class Slider {
    constructor(selector, options = {}) {
        this.selector = selector;
        this.options = Object.assign(Slider.defaults, options);
        this.events = new Events();
        this.state = {
            index: 0,
            isDragging: false,
            animationDuration: 0,
        };


        this.clonesCount = 0;
        this.components = {};


        this.init();
    }

    static get defaults() {
        return {
            startAt: 0,
            perView: 1,
            focusAt: 0, // 0 for left, 'center' for middle
            gap: 0,
            loop: false,
            autoplay: false, // interval in ms or false
            hoverPause: true,
            type: 'slide', // slide, fade, coverflow
            animationDuration: 600,
            animationEase: 'power2.out',
            pagination: false, // boolean or selector
            keyboard: true,
            scaleGradual: false,

            // Fan specifics
            rotateFactor: 15,
            scaleFactor: 0.1,
            fanTranslateY: 5,
            fanSpace: 160,
            activeRotation: 0,
            activeScale: 1,
            activeTranslateY: 0,

            breakpoints: {},
            swipeThreshold: 80, // Distance to trigger swipe
            debug: false,
            revealOnMount: true,
        };
    }

    init() {
        this.log('Initializing slider...');
        this.container = typeof this.selector === 'string'
            ? document.querySelector(this.selector)
            : this.selector;

        if (!this.container) {
            console.error(`[TkaSlider] Container not found: ${this.selector}`);
            return;
        }

        // Prevent multiple sliders on the same element
        if (this.container.tka_slider) {
            this.log('Slider already attached to this element. Returning existing instance.');
            return this.container.tka_slider;
        }
        this.container.tka_slider = this;

        this.log('Slider initialized.');
    }


    /**
     * Helper to log messages if debug is enabled.
     */
    log(...args) {
        if (this.options.debug) {
            console.log(`[TkaSlider]`, ...args);
        }
    }

    /**
     * Mount components to the slider.
     */
    mount() {
        if (this._isMounted) {
            this.log('Slider already mounted. Skipping.');
            return this;
        }

        this.events.emit('mount.before');

        // Merge core and user components
        this._components = Object.assign({}, CoreComponents, this.options.components);


        // Initialize Components
        // 1. Instantiate
        for (const name in this._components) {
            if (typeof this._components[name] === 'function') {
                this.components[name] = this._components[name](this, this.components, this.events);
            }
        }

        // 2. Mount
        for (const name in this.components) {
            if (this.components[name].mount) {
                this.components[name].mount();
            }
        }

        this._isMounted = true;
        this.events.emit('mount.after');

        // Initial jump to starting index
        if (this.components.Move) {
            const startIndex = this.options.startAt + (this.options.loop ? (this.clonesCount || 0) : 0);
            this.components.Move.jump(startIndex);
        }


        return this;
    }



    /**
     * Register core components internal helper
     * (Ideally we export a default list of components)
     */
    register(components) {
        this.options.components = Object.assign({}, this.options.components, components);
        return this;
    }

    on(event, callback) {
        return this.events.on(event, callback);
    }

    /**
     * Reveal the slider (trigger entrance animation)
     */
    reveal() {
        if (this.components.Effects && this.components.Effects.reveal) {
            this.components.Effects.reveal();
        }
        return this;
    }

    /**
     * Programmatically move the slider to a specific slide or direction.
     * Supports:
     * - Number: logical index (e.g. 2 for 3rd slide)
     * - Pattern: '>', '<', '=2' (for logical index 2)
     * 
     * @param {string|number} pattern 
     * @returns {this}
     */
    go(pattern) {
        if (this.components.Controls) {
            const p = typeof pattern === 'number' ? `=${pattern}` : pattern;
            this.components.Controls.move(p);
        }
        return this;
    }

    /**
     * Instantly jump to a specific logical index without animation.
     * @param {number} index 
     * @returns {this}
     */
    jump(index) {
        let target = index;
        if (this.options.loop && this.options.type === 'slide') {
            target += (this.clonesCount || 0);
        }

        if (this.components.Move) {
            this.components.Move.jump(target);
        }

        return this;
    }
}
