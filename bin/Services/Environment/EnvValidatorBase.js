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
exports.EnvValidatorBase = void 0;
const inversify_1 = require("inversify");
let EnvValidatorBase = class EnvValidatorBase {
    constructor(_log) {
        this._log = _log;
    }
    MustBeOneOf(paramName, options) {
        const variable = process.env[paramName];
        const isValid = (variable !== undefined) && (options.includes(variable));
        if (!isValid)
            this._log.Error(`.env variable "${paramName}" is not valid. Should be ONE OF [${options.join(", ")}] but is "${variable}".`);
        return isValid;
    }
    MustBeDir(paramName) {
        const dir = process.env[paramName];
        const isValid = (dir !== undefined) && (dir.trim().length > 0); // T ODO: poor validation
        if (!isValid)
            this._log.Error(`.env variable "${paramName}" is not valid. Should be DIRECTORY but is "${dir}".`);
        return isValid;
    }
    MustBeUrl(paramName) {
        const url = process.env[paramName];
        const isValid = (url !== undefined) && (url.trim().length > 0); // T ODO: poor validation
        if (!isValid)
            this._log.Error(`.env variable "${paramName}" is not valid. Should be URL but is "${url}".`);
        return isValid;
    }
    MayBeUrl(paramName) {
        const url = process.env[paramName];
        if ((url === undefined) || (url === ""))
            return true;
        const isValid = (url.trim().length > 0); // TODO: poor validation
        if (!isValid)
            this._log.Error(`.env variable "${paramName}" is not valid. Should be URL or EMPTY but is "${url}".`);
        return isValid;
    }
};
EnvValidatorBase = __decorate([
    inversify_1.injectable(),
    __metadata("design:paramtypes", [Object])
], EnvValidatorBase);
exports.EnvValidatorBase = EnvValidatorBase;
//# sourceMappingURL=EnvValidatorBase.js.map