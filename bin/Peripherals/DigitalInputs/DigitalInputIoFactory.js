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
exports.DigitalInputIoFactory = void 0;
const inversify_1 = require("inversify");
const Types_1 = require("../../IoC/Types");
const DigitalInputIO_1 = require("./DigitalInputIO");
let DigitalInputIoFactory = class DigitalInputIoFactory {
    constructor(_log) {
        this._log = _log;
    }
    Create(entry) {
        const io = new DigitalInputIO_1.DigitalInputIO(this._log, entry);
        return io;
    }
};
DigitalInputIoFactory = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(Types_1.Types.ILogger)),
    __metadata("design:paramtypes", [Object])
], DigitalInputIoFactory);
exports.DigitalInputIoFactory = DigitalInputIoFactory;
//# sourceMappingURL=DigitalInputIoFactory.js.map