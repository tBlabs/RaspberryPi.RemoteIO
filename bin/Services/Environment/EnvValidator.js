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
let EnvValidator = class EnvValidator {
    constructor(_log) {
        this._log = _log;
    }
    Validate() {
        const isEnvValid = this.MustBeDir('CONFIG_FILE_DIR')
            && this.MayBeUrl('REMOTE_SHELL');
        if (!isEnvValid)
            this._log.Error(`Can not start the application without correct value.`);
        return isEnvValid;
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
        const isValid = (dir !== undefined) && (dir.trim().length > 0); // TODO: poor validation
        if (!isValid)
            this._log.Error(`.env variable "${paramName}" is not valid. Should be DIRECTORY but is "${dir}".`);
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
EnvValidator = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(Types_1.Types.ILogger)),
    __metadata("design:paramtypes", [Object])
], EnvValidator);
exports.EnvValidator = EnvValidator;
//# sourceMappingURL=EnvValidator.js.map