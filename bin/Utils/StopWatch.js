"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StopWatch = void 0;
class StopWatch {
    constructor(startRightNow) {
        this.startRightNow = startRightNow;
        this.startMoment = 0;
        this.canWork = false;
        if (startRightNow)
            this.Start();
    }
    get CurrentTimestamp() {
        return +new Date();
    }
    Start() {
        this.startMoment = this.CurrentTimestamp;
        this.canWork = true;
    }
    Stop() {
        return this.CurrentTimestamp - this.startMoment;
    }
    get ElapsedMs() {
        return this.CurrentTimestamp - this.startMoment;
    }
    HasElapsed(ms) {
        if (((this.canWork) && (this.CurrentTimestamp - this.startMoment) > ms)) {
            this.canWork = false;
            return true;
        }
        return false;
    }
}
exports.StopWatch = StopWatch;
//# sourceMappingURL=StopWatch.js.map