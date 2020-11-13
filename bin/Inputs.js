"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const inversify_1 = require("inversify");
const pigpio_1 = require("pigpio");
let Inputs = class Inputs {
    async Init() {
        const button = new pigpio_1.Gpio(23, {
            mode: pigpio_1.Gpio.INPUT,
            pullUpDown: pigpio_1.Gpio.PUD_DOWN,
            edge: pigpio_1.Gpio.EITHER_EDGE
        });
        button.on('interrupt', (level) => {
            console.log('LVL', level);
            // led.digitalWrite(level);
        });
    }
    OnChange(callback) {
    }
};
Inputs = __decorate([
    inversify_1.injectable()
], Inputs);
exports.Inputs = Inputs;
//# sourceMappingURL=Inputs.js.map