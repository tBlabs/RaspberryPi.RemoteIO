"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const onoff_1 = require("onoff");
class OutputIO {
    constructor(output) {
        this.Name = output.name;
        this.IO = new onoff_1.Gpio(output.pin, 'out');
    }
    async Set(value) {
        // this.IO.writeSync(value);
        return new Promise((resolve, reject) => {
            this.IO.write(value, (err) => {
                if (err)
                    reject(err);
                resolve();
            });
        });
    }
    async Get() {
        // return this.IO.readSync();
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