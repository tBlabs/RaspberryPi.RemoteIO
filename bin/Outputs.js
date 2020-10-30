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
const Config_1 = require("./Services/Config/Config");
class OutputIO {
    constructor(output) {
        this.Name = output.name;
        this.IO = new onoff_1.Gpio(output.pin, 'out');
    }
    Set(value) {
        this.IO.writeSync(value);
    }
    Get() {
        return this.IO.readSync();
    }
    Dispose() {
        this.IO.unexport();
    }
}
exports.OutputIO = OutputIO;
let Outputs = class Outputs {
    constructor(_config) {
        this._config = _config;
        this.outputs = [];
    }
    Init() {
        this._config.Outputs.forEach((o) => {
            const output = new OutputIO(o);
            this.outputs.push(output);
        });
    }
    SetValue(name, value) {
        var _a;
        (_a = this.outputs.find(x => x.Name === name)) === null || _a === void 0 ? void 0 : _a.Set(value);
    }
    GetValue(name) {
        var _a;
        return (_a = this.outputs.find(x => x.Name === name)) === null || _a === void 0 ? void 0 : _a.Get();
    }
    Dispose() {
        this.outputs.forEach((o) => {
            o.Dispose();
        });
    }
};
Outputs = __decorate([
    inversify_1.injectable(),
    __metadata("design:paramtypes", [Config_1.Config])
], Outputs);
exports.Outputs = Outputs;
//# sourceMappingURL=Outputs.js.map