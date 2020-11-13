"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pigpio_1 = require("pigpio");
class InputIO {
    // private onStateChangeCallback!: (state: number) => void;
    constructor(entry) {
        this.state = (-1);
        this.Name = entry.name;
        let pull = pigpio_1.Gpio.PUD_OFF;
        let edge = pigpio_1.Gpio.EITHER_EDGE;
        switch (entry.pull) {
            case "none":
                pull = pigpio_1.Gpio.PUD_OFF;
                break;
            case "up":
                pull = pigpio_1.Gpio.PUD_UP;
                break;
            case "down":
                pull = pigpio_1.Gpio.PUD_DOWN;
                break;
        }
        switch (entry.edge) {
            case "both":
                edge = pigpio_1.Gpio.EITHER_EDGE;
                break;
            case "rising":
                edge = pigpio_1.Gpio.RISING_EDGE;
                break;
            case "falling":
                edge = pigpio_1.Gpio.FALLING_EDGE;
                break;
        }
        this.IO = new pigpio_1.Gpio(entry.pin, {
            mode: pigpio_1.Gpio.INPUT,
            pullUpDown: pull,
            edge: edge
        });
        this.IO.on('interrupt', (level) => {
            var _a;
            if (this.state !== level) {
                console.log('INTERR', this.state, level);
                this.state = level;
                (_a = this.OnStateChange) === null || _a === void 0 ? void 0 : _a.call(this, this.state);
            }
        });
    }
    get State() {
        return this.state;
    }
}
exports.InputIO = InputIO;
//# sourceMappingURL=InputIO.js.map