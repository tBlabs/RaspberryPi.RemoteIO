"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const inversify_1 = require("inversify");
const pigpio_1 = require("pigpio");
const Types_1 = require("../../IoC/Types");
let DigitalInputIoFactory = class DigitalInputIoFactory {
    constructor(_log) {
        this._log = _log;
    }
    Create(entry) {
        const io = new DigitalInputIO(this._log, entry);
        return io;
    }
};
DigitalInputIoFactory = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(Types_1.Types.ILogger)),
    __metadata("design:paramtypes", [Object])
], DigitalInputIoFactory);
exports.DigitalInputIoFactory = DigitalInputIoFactory;
class DigitalInputIO {
    constructor(_log, entry) {
        this._log = _log;
        this.state = (-1);
        try {
            _log.Log(`Registering "${entry.name}"...`);
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
                default: throw new Error(`Invalid pull value`);
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
                default: throw new Error(`Invalid edge value`);
            }
            this.IO = new pigpio_1.Gpio(entry.pin, {
                mode: pigpio_1.Gpio.INPUT,
                pullUpDown: pull,
                edge: edge
            });
            this.IO.on('interrupt', (level) => {
                var _a;
                if (this.state !== level) {
                    this.state = level;
                    (_a = this.OnStateChange) === null || _a === void 0 ? void 0 : _a.call(this, this.state);
                }
            });
            _log.Log("Registered.");
        }
        catch (error) {
            _log.Error("Registering error:", error.message);
        }
    }
}
exports.DigitalInputIO = DigitalInputIO;
//# sourceMappingURL=InputIO.js.map