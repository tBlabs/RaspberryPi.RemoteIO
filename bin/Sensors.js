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
Object.defineProperty(exports, "__esModule", { value: true });
const onoff_1 = require("onoff");
const inversify_1 = require("inversify");
let Sensors = class Sensors {
    constructor() {
        this.sensor1 = new onoff_1.Gpio(24, 'in', 'both', { debounceTimeout: 10 });
        this.sensor2 = new onoff_1.Gpio(25, 'in', 'both', { debounceTimeout: 10 });
        this.sensor1.watch((err, value) => {
            var _a;
            if (err)
                throw err;
            (_a = this.sensorAChangeCallback) === null || _a === void 0 ? void 0 : _a.call(this, value);
        });
        this.sensor2.watch((err, value) => {
            var _a;
            if (err)
                throw err;
            (_a = this.sensorBChangeCallback) === null || _a === void 0 ? void 0 : _a.call(this, value);
        });
    }
    get StateAsString() {
        return "A: " + this.sensor1.readSync() ? "1" : "0"
            + "B: " + this.sensor2.readSync() ? "1" : "0";
    }
    get Sensor1State() {
        return this.sensor1.readSync();
    }
    get Sensor2State() {
        return this.sensor2.readSync();
    }
    SensorAChange(callback) {
        this.sensorAChangeCallback = callback;
    }
    SensorBChange(callback) {
        this.sensorBChangeCallback = callback;
    }
    Dispose() {
        this.sensor1.unexport();
        this.sensor2.unexport();
    }
};
Sensors = __decorate([
    inversify_1.injectable(),
    __metadata("design:paramtypes", [])
], Sensors);
exports.Sensors = Sensors;
//# sourceMappingURL=Sensors.js.map