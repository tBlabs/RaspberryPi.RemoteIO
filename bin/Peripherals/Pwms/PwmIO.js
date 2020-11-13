"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pigpio_1 = require("pigpio");
class PwmIO {
    constructor(entry) {
        console.log(`Registering "${entry.name}"...`);
        this.Name = entry.name;
        try {
            this.IO = new pigpio_1.Gpio(entry.pin, { mode: pigpio_1.Gpio.OUTPUT });
            console.log("Registered.");
        }
        catch (error) {
            console.log(`Registering error:`, error.message);
        }
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