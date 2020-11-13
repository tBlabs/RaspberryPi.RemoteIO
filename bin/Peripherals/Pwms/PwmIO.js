"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pigpio_1 = require("pigpio");
class PwmIO {
    constructor(_log, entry) {
        this._log = _log;
        _log.Log(`Registering "${entry.name}"...`);
        this.Name = entry.name;
        try {
            this.IO = new pigpio_1.Gpio(entry.pin, { mode: pigpio_1.Gpio.OUTPUT });
            _log.Log("Registered.");
        }
        catch (error) {
            _log.Error(`Registering error: ${error.message}. Is app running at Raspberry Pi?`);
        }
    }
    Set(dutyCycle) {
        try {
            this._log.Trace(`Setting pwm "${name}" duty value to ${dutyCycle}...`);
            if (dutyCycle < 0 || dutyCycle > 255) {
                throw new Error(`Duty cycle out of range (0-255). ${dutyCycle} was given.`);
            }
            this.IO.pwmWrite(dutyCycle);
            this._log.Trace(`"${name}" set to ${dutyCycle}.`);
        }
        catch (error) {
            this._log.Error('PWM duty cycle write problem:', error);
        }
    }
}
exports.PwmIO = PwmIO;
//# sourceMappingURL=PwmIO.js.map