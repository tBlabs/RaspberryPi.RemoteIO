"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pigpio_1 = require("pigpio");
class PwmIO {
    constructor(entry) {
        this.Name = entry.name;
        this.IO = new pigpio_1.Gpio(entry.pin, { mode: pigpio_1.Gpio.OUTPUT });
    }
    async Set(dutyCycle) {
        return new Promise((resolve) => {
            this.IO.pwmWrite(dutyCycle);
            resolve();
        });
    }
}
exports.PwmIO = PwmIO;
//# sourceMappingURL=PwmIO.js.map