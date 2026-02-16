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
        },

        bind() {
            const { Html } = Components;

            // Look for data-tka-control attributes
            const controls = Html.root.querySelectorAll('[data-tka-control]');

            controls.forEach(el => {
                const direction = el.getAttribute('data-tka-control');

                el.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.move(direction);
                });

                if (direction === '<') this.prevItems.push(el);
                if (direction === '>') this.nextItems.push(el);
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
                // Jump to specific index, e.g. "=2"
                const moveIndex = parseInt(direction.substring(1));
                Move.to(moveIndex);
            }
        }
    };

    return Controls;
}
