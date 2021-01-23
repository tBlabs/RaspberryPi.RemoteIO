"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsoleOutput = void 0;
require("reflect-metadata");
const inversify_1 = require("inversify");
let ConsoleOutput = class ConsoleOutput {
    constructor() {
        this.timeSinceLastLog = -1;
    }
    Print(str) {
        if (str === '') {
            console.log('');
            return;
        }
        const now = +(new Date());
        const diff = now - (this.timeSinceLastLog == (-1) ? now : this.timeSinceLastLog);
        this.timeSinceLastLog = now;
        const s = ("+" + diff.toString()).padStart(6, ' ') + ` | ${str}`;
        console.log(s);
    }
};
ConsoleOutput = __decorate([
    inversify_1.injectable()
], ConsoleOutput);
exports.ConsoleOutput = ConsoleOutput;
//# sourceMappingURL=ConsoleOutput.js.map