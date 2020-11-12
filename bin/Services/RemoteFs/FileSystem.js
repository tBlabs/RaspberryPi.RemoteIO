"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const inversify_1 = require("inversify");
const fs = require("fs");
let FileSystem = class FileSystem {
    async WriteFile(fileName, data) {
        return new Promise((resolve, reject) => {
            fs.writeFile(fileName, data, (err) => {
                if (err)
                    reject("Could not save file.");
                resolve();
            });
        });
    }
    async ReadFile(fileName) {
        return new Promise((resolve, reject) => {
            fs.readFile(fileName, (err, data) => {
                if (err)
                    reject("Could not read file.");
                resolve(data === null || data === void 0 ? void 0 : data.toString());
            });
        });
    }
};
FileSystem = __decorate([
    inversify_1.injectable()
], FileSystem);
exports.FileSystem = FileSystem;
//# sourceMappingURL=FileSystem.js.map