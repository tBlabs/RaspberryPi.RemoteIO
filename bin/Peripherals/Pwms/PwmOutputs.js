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
const PwmIoFactory_1 = require("./PwmIoFactory");
let Pwms = class Pwms {
    constructor(_pwmIoFactory, _config, _log) {
        this._pwmIoFactory = _pwmIoFactory;
        this._config = _config;
        this._log = _log;
        this.pwms = [];
    }
    Init() {
        this._config.Pwms.forEach((io) => {
            const pwm = this._pwmIoFactory.Create(io);
            this.pwms.push(pwm);
        });
    }
    async SetValue(name, value) {
        const io = this.pwms.find(x => x.Name === name);
        if (io === undefined) {
            this._log.Error(`IO not found`);
            throw new Error(`IO "${name}" not found.`);
        }
        await io.Set(+value);
    }
};
Pwms = __decorate([
    inversify_1.injectable(),
    __param(1, inversify_1.inject(Types_1.Types.IConfig)),
    __param(2, inversify_1.inject(Types_1.Types.ILogger)),
    __metadata("design:paramtypes", [PwmIoFactory_1.PwmIoFactory, Object, Object])
], Pwms);
exports.Pwms = Pwms;
//# sourceMappingURL=PwmOutputs.js.map