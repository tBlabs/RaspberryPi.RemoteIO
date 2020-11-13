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
const express = require("express");
const cors = require("cors");
const Types_1 = require("./IoC/Types");
const SocketIoHost = require("socket.io");
// import { Socket } from 'socket.io';
const http = require("http");
const Clients_1 = require("./Clients");
let Host = class Host {
    constructor(_log, _config) {
        this._log = _log;
        this._config = _config;
        this.clients = new Clients_1.Clients();
        this.expressServer = express();
        this.expressServer.use(cors());
        this.httpServer = http.createServer(this.expressServer);
        const socketHost = SocketIoHost(this.httpServer);
        console.log('SOCKET REG');
        socketHost.on('error', (e) => this._log.Log(`SOCKET ERROR ${e}`));
        socketHost.on('connection', (socket) => {
            // console.log('ADDING NEW CLIENT', socket.id);
            this.clients.Add(socket);
        });
        this.expressServer.get('/ping', (req, res) => res.send('pong'));
    }
    SendToAllClients(eventName, ...args) {
        this.clients.SendToAll(eventName, args);
    }
    OnCommand(url, callback) {
        this.expressServer.get(url, (req, res) => {
            try {
                callback(req.params);
                res.sendStatus(200);
            }
            catch (error) {
                res.sendStatus(500);
            }
        });
    }
    OnQuery(url, callback) {
        this.expressServer.get(url, (req, res) => {
            try {
                callback(req, res);
            }
            catch (error) {
                res.sendStatus(500);
            }
        });
    }
    Start() {
        // this.server = this.expressServer.listen(this._config.Port, () => this._log.Log(`Raspberry Pi Remote IO server started @ ${this._config.Port}`));
        this.server = this.httpServer.listen(this._config.Port, () => this._log.Log(`Raspberry Pi Remote IO server started @ ${this._config.Port}`));
    }
    Dispose() {
        this.server.close(() => this._log.Log('Server closed.'));
    }
};
Host = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(Types_1.Types.ILogger)),
    __param(1, inversify_1.inject(Types_1.Types.IConfig)),
    __metadata("design:paramtypes", [Object, Object])
], Host);
exports.Host = Host;
//# sourceMappingURL=Host.js.map