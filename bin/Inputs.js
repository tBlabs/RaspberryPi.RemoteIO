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
const Types_1 = require("./IoC/Types");
class InputIO {
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
                (_a = this.onStateChangeCallback) === null || _a === void 0 ? void 0 : _a.call(this, this.state);
            }
        });
    }
    get State() {
        return this.state;
    }
    OnStateChange(callback) {
        console.log('OnStateChange assign');
        this.onStateChangeCallback = callback;
    }
}
exports.InputIO = InputIO;
let Inputs = class Inputs {
    constructor(_config, _log) {
        this._config = _config;
        this._log = _log;
    }
    async Init() {
        this._config.Inputs.forEach(io => {
            console.log('REG', io);
            const input = new InputIO(io);
            input.OnStateChange((state) => {
                var _a;
                console.log('inp.onstatCh assign');
                (_a = this.callback) === null || _a === void 0 ? void 0 : _a.call(this, input.Name, state);
            });
        });
    }
    OnChange(callback) {
        this.callback = callback;
    }
};
Inputs = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(Types_1.Types.IConfig)),
    __param(1, inversify_1.inject(Types_1.Types.ILogger)),
    __metadata("design:paramtypes", [Object, Object])
], Inputs);
exports.Inputs = Inputs;
//# sourceMappingURL=Inputs.js.map