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
exports.DigitalInputs = void 0;
const inversify_1 = require("inversify");
const Types_1 = require("../../IoC/Types");
const DigitalInputIoFactory_1 = require("./DigitalInputIoFactory");
let DigitalInputs = class DigitalInputs {
    constructor(_digitalInputFactory, _config, _log) {
        this._digitalInputFactory = _digitalInputFactory;
        this._config = _config;
        this._log = _log;
        this.inputs = [];
    }
    Init() {
        this._config.Inputs.forEach(io => {
            const input = this._digitalInputFactory.Create(io);
            this.inputs.push(input);
            input.OnStateChange = (state) => {
                var _a;
                (_a = this.callback) === null || _a === void 0 ? void 0 : _a.call(this, input.Name, state);
            };
        });
    }
    GetValue(name) {
        this._log.Trace(`Reading output "${name}" value...`);
        const io = this.inputs.find(x => x.Name === name);
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
    OnChange(callback) {
        this.callback = callback;
    }
};
DigitalInputs = __decorate([
    inversify_1.injectable(),
    __param(1, inversify_1.inject(Types_1.Types.IConfig)),
    __param(2, inversify_1.inject(Types_1.Types.ILogger)),
    __metadata("design:paramtypes", [DigitalInputIoFactory_1.DigitalInputIoFactory, Object, Object])
], DigitalInputs);
exports.DigitalInputs = DigitalInputs;
//# sourceMappingURL=DigitalInputs.js.map