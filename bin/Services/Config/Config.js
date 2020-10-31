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
let Config = class Config {
    constructor(_fs) {
        this._fs = _fs;
        this.configFileName = "config.json";
    }
    get Port() {
        return this.config.port;
    }
    get Outputs() {
        return this.config.outputs;
    }
    get ConfigFileName() {
        return this.configFileName;
    }
    async Init() {
        try {
            const configAsString = await this._fs.ReadFile("/home/pi/RaspberryPi.RemoteIO/" + this.configFileName);
            this.config = JSON.parse(configAsString);
            console.log(this.config);
        }
        catch (error) {
            throw new Error('COULD NOT LOAD CONFIG. APP HALTED.');
        }
    }
};
Config = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(Types_1.Types.IFileSystem)),
    __metadata("design:paramtypes", [Object])
], Config);
exports.Config = Config;
//# sourceMappingURL=Config.js.map