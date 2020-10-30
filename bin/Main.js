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
const inversify_1 = require("inversify");
const Config_1 = require("./Services/Config/Config");
const HelpBuilder_1 = require("./HelpBuilder");
const Server_1 = require("./Server");
const Outputs_1 = require("./Outputs");
let Main = class Main {
    constructor(_config, _server, _outputs) {
        this._config = _config;
        this._server = _server;
        this._outputs = _outputs;
    }
    async Start() {
        await this._config.Init();
        this._server.OnQuery('/', (req, res) => {
            const help = new HelpBuilder_1.HelpBuilder("Raspberry.RemoteIO")
                .Glossary("Raspberry", "Raspberry Pi Zero board")
                .Config("Server Port", this._config.Port.toString(), "8000")
                .Config("Outputs", JSON.stringify(this._config.Outputs), "empty", `[{ "name": "Led", "pin": 4 }]`)
                .Api('/set/output/:name/:value', `Set specified Output IO to given value (0 or 1)`)
                .Api('/get/output/:name/value', `Returns Output current value`);
            res.send(help.ToString());
        });
        this._server.OnCommand('/set/output/:name/:value', params => this._outputs.SetValue(params.name, params.value));
        this._server.OnQuery('/get/output/:name/value', (req, res) => res.send(this._outputs.GetValue(req.params.name)));
        this._server.Start(this._config.Port);
        process.on('SIGINT', () => {
            console.log('SIGINT detected. Disposing IO...');
            this._outputs.Dispose();
        });
    }
};
Main = __decorate([
    inversify_1.injectable(),
    __metadata("design:paramtypes", [Config_1.Config,
        Server_1.Server,
        Outputs_1.Outputs])
], Main);
exports.Main = Main;
//# sourceMappingURL=Main.js.map