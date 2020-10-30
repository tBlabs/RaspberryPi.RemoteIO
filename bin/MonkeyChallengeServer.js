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
const SocketClient = require("socket.io-client");
const inversify_1 = require("inversify");
const Config_1 = require("./Services/Config/Config");
let MonkeyChallengeServer = class MonkeyChallengeServer {
    constructor(_config) {
        this._config = _config;
    }
    get IsConnected() {
        var _a;
        return (_a = this.socketClient) === null || _a === void 0 ? void 0 : _a.connected;
    }
    get ConnectionString() {
        return this._config.MonkeyServer;
    }
    Connect(addr, id) {
        var _a, _b;
        if ((_a = this.socketClient) === null || _a === void 0 ? void 0 : _a.connected)
            (_b = this.socketClient) === null || _b === void 0 ? void 0 : _b.disconnect();
        const connectionString = `${addr}/monkey?id=${id}`;
        console.log('Trying to connect to ', connectionString);
        this.socketClient = SocketClient(connectionString, { rejectUnauthorized: false });
        this.socketClient.on('connect', () => {
            console.log(`Connected to Monkey-Challenge-Server (${connectionString}) as ${this.socketClient.id}`);
        });
        this.socketClient.on('disconnect', () => {
            console.log('Disconnected from', connectionString);
        });
    }
    SendSensorState(state) {
        if (this.IsConnected) {
            this.socketClient.emit('update', state);
        }
    }
};
MonkeyChallengeServer = __decorate([
    inversify_1.injectable(),
    __metadata("design:paramtypes", [Config_1.MonkeyConfig])
], MonkeyChallengeServer);
exports.MonkeyChallengeServer = MonkeyChallengeServer;
//# sourceMappingURL=MonkeyChallengeServer.js.map