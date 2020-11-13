"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const onoff_1 = require("onoff");
class OutputIO {
    constructor(entry) {
        console.log(`Registering "${entry.name}"...`);
        this.Name = entry.name;
        try {
            this.IO = new onoff_1.Gpio(entry.pin, 'out');
            console.log("Registered.");
        }
        catch (error) {
            console.log(`Registering error:`, error.message);
        }
    }
    async Set(value) {
        return new Promise((resolve, reject) => {
            this.IO.write(value, (err) => {
                if (err)
                    reject(err);
                resolve();
            });
        });
    }
    async Get() {
        return new Promise((resolve, reject) => {
            this.IO.read((err, value) => {
                if (err)
                    reject(err);
                resolve(value);
            });
        });
    }
    Dispose() {
        this.IO.unexport();
    }
}
exports.OutputIO = OutputIO;
//# sourceMappingURL=OutputIO.js.map