"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DigitalOutputIO = void 0;
const pigpio_1 = require("pigpio");
class DigitalOutputIO // implements IDisposable
 {
    constructor(_log, entry) {
        try {
            _log.Log(`Registering "${entry.name}"...`);
            this.Name = entry.name;
            // this.IO = new Gpio(entry.pin, 'out');
            this.IO = new pigpio_1.Gpio(entry.pin, { mode: pigpio_1.Gpio.OUTPUT });
            _log.Log("Registered.");
        }
        catch (error) {
            _log.Error(`Registering error: ${error.message}. Is app running on Raspberry Pi?`);
        }
    }
    Set(value) {
        this.IO.digitalWrite(value);
    }
    Get() {
        return this.IO.digitalRead();
    }
}
exports.DigitalOutputIO = DigitalOutputIO;
//# sourceMappingURL=DigitalOutputIO.js.map