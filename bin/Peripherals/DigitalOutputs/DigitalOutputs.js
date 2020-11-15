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
const Types_1 = require("../../IoC/Types");
const DigitalOutputFactory_1 = require("./DigitalOutputFactory");
let DigitalOutputs = class DigitalOutputs {
    constructor(_digitalOutputFactory, _config, _log) {
        this._digitalOutputFactory = _digitalOutputFactory;
        this._config = _config;
        this._log = _log;
        this.outputs = [];
    }
    Init() {
        this._config.Outputs.forEach((io) => {
            const output = this._digitalOutputFactory.Create(io);
            this.outputs.push(output);
        });
    }
    SetValue(name, value) {
        this._log.Trace(`Setting output "${name}" to value ${value}...`);
        const io = this.outputs.find(x => x.Name === name);
        if (io === undefined) {
            this._log.Trace(`IO not found`);
            throw new Error(`IO "${name}" not found.`);
        }
        else {
            io.Set(+value);
            this._log.Trace(`"${name}" set to ${value}.`);
        }
    }
    GetValue(name) {
        this._log.Trace(`Reading output "${name}" value...`);
        const io = this.outputs.find(x => x.Name === name);
        if (io === undefined) {
            this._log.Trace(`IO not found`);
            throw new Error(`IO "${name}" not found.`);
        }
        else {
            const value = io.Get();
            this._log.Trace(`"${name}" value is ${value}.`);
            return value;
        }
    }
};
DigitalOutputs = __decorate([
    inversify_1.injectable(),
    __param(1, inversify_1.inject(Types_1.Types.IConfig)),
    __param(2, inversify_1.inject(Types_1.Types.ILogger)),
    __metadata("design:paramtypes", [DigitalOutputFactory_1.DigitalOutputFactory, Object, Object])
], DigitalOutputs);
exports.DigitalOutputs = DigitalOutputs;
//# sourceMappingURL=DigitalOutputs.js.map