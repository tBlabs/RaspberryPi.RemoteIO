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
    constructor(_args, _fs) {
        this._args = _args;
        this._fs = _fs;
        this.CONFIG_FILE_DIR = "/home/pi/RaspberryPi.RemoteIO/config.json";
    }
    async Init() {
        try {
            const configAsString = await this._fs.ReadFile(this.CONFIG_FILE_DIR);
            this.config = JSON.parse(configAsString);
        }
        catch (error) {
            throw new Error(`Could not load config file (from ${this.CONFIG_FILE_DIR}). Was remote shell active (@ ${process.env.REMOTE_SHELL}) at the moment of app start?`);
        }
    }
    get Port() {
        var _a;
        return this._args.Args.port || ((_a = this.config) === null || _a === void 0 ? void 0 : _a.port) || 8000;
    }
    get Outputs() {
        var _a;
        return ((_a = this.config) === null || _a === void 0 ? void 0 : _a.outputs) || [];
    }
    get Pwms() {
        var _a;
        return ((_a = this.config) === null || _a === void 0 ? void 0 : _a.pwms) || [];
    }
    get LogsLevel() {
        var _a;
        if (this._args.Args.logsLevel !== undefined)
            return +this._args.Args.logsLevel;
        if (((_a = this.config) === null || _a === void 0 ? void 0 : _a.logsLevel) !== undefined)
            return this.config.logsLevel;
        return 1;
    }
    get ConfigFileDir() {
        return this.CONFIG_FILE_DIR;
    }
};
Config = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(Types_1.Types.IStartupArgs)),
    __param(1, inversify_1.inject(Types_1.Types.IFileSystem)),
    __metadata("design:paramtypes", [Object, Object])
], Config);
exports.Config = Config;
//# sourceMappingURL=Config.js.map