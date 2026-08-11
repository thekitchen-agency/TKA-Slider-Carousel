/**
 * Plugin to handle arrow navigation.
 * @param {import('../core/Slider').Slider} slider 
 */
export default function Controls(slider, Components, events) {
    const Controls = {
        prevItems: [],
        nextItems: [],

        mount() {
            this.bind();
            this.update();
        },

        bind() {
            const { Html } = Components;

            // Look for data-tka-control attributes inside root or parent container
            let controls = Html.root.querySelectorAll('[data-tka-control]');
            if (controls.length === 0 && Html.root.parentElement) {
                controls = Html.root.parentElement.querySelectorAll('[data-tka-control]');
            }

            console.log('[TkaSlider] Controls bound for', Html.root.id, 'found:', controls.length);

            controls.forEach(el => {
                const direction = el.getAttribute('data-tka-control');

                el.addEventListener('click', (e) => {
                    e.preventDefault();
                    console.log('[TkaSlider] Clicked control:', direction, 'for', Html.root.id);
                    if (!slider.options.arrows) return; // Don't move if disabled
                    this.move(direction);
                });

                if (direction === '<') this.prevItems.push(el);
                if (direction === '>') this.nextItems.push(el);
            });

            events.on('breakpoint.change', () => {
                this.update();
            });
        },

        update() {
            const { arrows } = slider.options;
            const items = [...this.prevItems, ...this.nextItems];
            
            items.forEach(el => {
                el.style.display = arrows ? '' : 'none';
            });
        },

        move(direction) {
            const { Move } = Components;
            const { index } = slider.state;

            if (direction === '>') {
                Move.to(index + 1);
            } else if (direction === '<') {
                Move.to(index - 1);
            } else if (direction.startsWith('=')) {
                // Jump to specific logical index, e.g. "=2"
                let moveIndex = parseInt(direction.substring(1));

                // Account for clones if in loop mode
                if (slider.options.loop && (slider.options.type === 'slide' || slider.options.type === 'coverflow' || slider.options.type === '360' || slider.options.type === 'single-rotate')) {
                    moveIndex += (slider.clonesCount || 0);
                }

                Move.to(moveIndex);
            }
        }
    };

    return Controls;
}
