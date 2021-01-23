"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExecOutput = void 0;
class ExecOutput {
    constructor(code, stdout, stderr) {
        this.code = code;
        this.stdout = stdout;
        this.stderr = stderr;
    }
    get IsSuccess() {
        return this.code === 0;
    }
    get StdOut() {
        var _a;
        return (_a = this.stdout) === null || _a === void 0 ? void 0 : _a.trim();
    }
    get StdErr() {
        var _a;
        return (_a = this.stderr) === null || _a === void 0 ? void 0 : _a.trim();
    }
    get Message() {
        return this.StdOut.length ? this.StdOut : this.StdErr;
    }
}
exports.ExecOutput = ExecOutput;
//# sourceMappingURL=ExecOutput.js.map