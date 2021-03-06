"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PwmIO = void 0;
const pigpio_1 = require("pigpio");
class PwmIO {
    constructor(_log, entry) {
        this._log = _log;
        try {
            _log.Log(`Registering "${entry.name}"...`);
            this.Name = entry.name;
            this.IO = new pigpio_1.Gpio(entry.pin, { mode: pigpio_1.Gpio.OUTPUT });
            _log.Log("Registered.");
        }
        catch (error) {
            _log.Error(`Registering error: ${error.message}. Is app running on Raspberry Pi?`);
        }
    }
    Set(dutyCycle) {
        try {
            this._log.Trace(`Setting pwm "${this.Name}" duty value to ${dutyCycle}...`);
            if (dutyCycle < 0 || dutyCycle > 255) {
                throw new Error(`Duty cycle out of range (0-255). ${dutyCycle} was given.`);
            }
            this.IO.pwmWrite(dutyCycle);
            this._log.Trace(`"${this.Name}" set to ${dutyCycle}.`);
        }
        catch (error) {
            this._log.Error('PWM duty cycle write problem:', error);
        }
    }
}
exports.PwmIO = PwmIO;
//# sourceMappingURL=PwmIO.js.map