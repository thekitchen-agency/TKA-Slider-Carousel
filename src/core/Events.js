/**
 * A lightweight event emitter for the slider.
 */
export class Events {
    constructor() {
        this.events = {};
    }

    /**
     * Subscribe to an event.
     * @param {string} event - The event name.
     * @param {Function} callback - The callback function.
     * @returns {Object} - An object with an `off` method to unsubscribe.
     */
    on(event, callback) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(callback);

        return {
            off: () => this.off(event, callback),
        };
    }

    /**
     * Unsubscribe from an event.
     * @param {string} event - The event name.
     * @param {Function} callback - The callback function to remove.
     */
    off(event, callback) {
        if (!this.events[event]) return;
        this.events[event] = this.events[event].filter((cb) => cb !== callback);
    }

    /**
     * Emit an event.
     * @param {string} event - The event name.
     * @param {any} data - Data to pass to listeners.
     */
    emit(event, data = null) {
        if (!this.events[event]) return;
        this.events[event].forEach((callback) => callback(data));
    }
}
