"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function DelayAsync(delayInMs) {
    return new Promise((resolve) => {
        return setTimeout(() => resolve(), delayInMs);
    });
}
exports.DelayAsync = DelayAsync;
//# sourceMappingURL=DelayAsync.js.map