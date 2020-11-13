"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
            _log.Log(`Registering error:`, error.message);
        }
    }
    // public async Set(value: BinaryValue): Promise<void>
    // {
    //     return new Promise((resolve, reject) =>
    //     {
    //         this.IO.write(value, (err) =>
    //         {
    //             if (err)
    //                 reject(err);
    //             resolve();
    //         });
    //     });
    // }
    Set(value) {
        this.IO.digitalWrite(value);
    }
    Get() {
        return this.IO.digitalRead();
    }
}
exports.DigitalOutputIO = DigitalOutputIO;
//# sourceMappingURL=DigitalOutputIO.js.map