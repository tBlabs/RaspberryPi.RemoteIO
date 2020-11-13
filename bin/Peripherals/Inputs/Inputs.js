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
const InputIO_1 = require("./InputIO");
let Inputs = class Inputs {
    constructor(_config, _log) {
        this._config = _config;
        this._log = _log;
    }
    async Init() {
        this._config.Inputs.forEach(io => {
            // console.log('REG', io);
            const input = new InputIO_1.InputIO(io);
            input.OnStateChange = (state) => {
                var _a;
                // console.log('inp.onstatCh assign');
                (_a = this.callback) === null || _a === void 0 ? void 0 : _a.call(this, input.Name, state);
            };
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