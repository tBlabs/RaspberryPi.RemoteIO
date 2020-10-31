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
require("reflect-metadata");
const Types_1 = require("../../IoC/Types");
const axios_1 = require("axios");
const ExecOutput_1 = require("./ExecOutput");
let RemoteShell = class RemoteShell {
    constructor(_log) {
        this._log = _log;
    }
    ExecAsync(cmd) {
        return new Promise(async (resolve, reject) => {
            var _a, _b, _c, _d, _e;
            this._log.Trace('Exec:', cmd, `@ ${process.env.HTTP_TO_CLI}/shell64`);
            try {
                const cmdAsBase64 = Buffer.from(cmd).toString('base64');
                const response = await axios_1.default.get(`${process.env.HTTP_TO_CLI}/shell64/${cmdAsBase64}`, { timeout: 5 * 1000, responseType: 'text', transformResponse: [] }); // We need to use transformResponse because  responseType='text' is not working (https://github.com/axios/axios/issues/2791)
                this._log.Trace('Result:', response.data, `(http status: ${response.status})`);
                resolve(new ExecOutput_1.ExecOutput(0, response.data, ""));
            }
            catch (error) {
                if ((error.code === 'ETIMEDOUT') || ((_a = error.message) === null || _a === void 0 ? void 0 : _a.includes("timeout"))) {
                    this._log.Error('Remote Shell request timeout. Device is probably offline.');
                    reject(new ExecOutput_1.ExecOutput(+!0, "", "REMOTE SHELL TIMEOUT"));
                    return;
                }
                this._log.Trace('Error result:', (_b = error.response) === null || _b === void 0 ? void 0 : _b.data, ' (http status: ', (_c = error.response) === null || _c === void 0 ? void 0 : _c.status, ')');
                resolve(new ExecOutput_1.ExecOutput((_d = error.response) === null || _d === void 0 ? void 0 : _d.status, "", (_e = error.response) === null || _e === void 0 ? void 0 : _e.data));
            }
        });
    }
};
RemoteShell = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(Types_1.Types.ILogger)),
    __metadata("design:paramtypes", [Object])
], RemoteShell);
exports.RemoteShell = RemoteShell;
//# sourceMappingURL=RemoteShell.js.map