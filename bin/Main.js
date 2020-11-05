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
const HelpBuilder_1 = require("./HelpBuilder");
const Host_1 = require("./Host");
const Outputs_1 = require("./Outputs");
const Types_1 = require("./IoC/Types");
let Main = class Main {
    constructor(_config, _log, _server, _outputs) {
        this._config = _config;
        this._log = _log;
        this._server = _server;
        this._outputs = _outputs;
        this.problems = []; // TODO: to trzeba przekuć w jakąś klasę...
    }
    async Start() {
        try {
            await this._config.Init();
        }
        catch (error) // TODO: może warto wsadzić to w metodę?
         {
            this.problems.push("⚡ Could not load configuration from config.json file.");
        }
        this._log.SetLogLevel(this._config.LogsLevel); // This must be here due to circular dependency :(
        try {
            await this._outputs.Init();
        }
        catch (error) {
            this.problems.push("⚡ Could not load IO driver on this machine. Node onoff lib works only on Raspberry Pi.");
        }
        this._server.OnQuery('/', (req, res) => {
            const help = new HelpBuilder_1.HelpBuilder("RaspberryPi.RemoteIO", "Raspberry Pi driver via Http")
                .Warning(this.problems)
                .Config("REMOTE_SHELL", process.env.REMOTE_SHELL, "empty", "REMOTE_SHELL=http://192.168.43.229:3000", 'Environment variable process.env (".env" file)')
                .Config("port", this._config.Port.toString(), "8000", "1234 (number value)", this._config.ConfigFileName)
                .Config("outputs", JSON.stringify(this._config.Outputs), "empty", `[{ "name": "Led", "pin": 4 }]`, this._config.ConfigFileName)
                .Config("logsLevel", this._config.LogsLevel.toString(), "1", `0 - off / 1 - logs / 2 - trace`, `--logsLevel param or in ${this._config.ConfigFileName}`)
                .Api('/set/output/:name/:value', `Set specified Output IO to given value (0 or 1)`)
                .Api('/get/output/:name/value', `Returns Output current value`)
                .Requirement('Active "Remote Shell" utility', 'Is necessary to download config file. (fs module may be used instead /IFileSystem/).')
                .Requirement('Config file "config.json"', 'Is necessary to start the app. Defines server port and IO configuration.');
            res.send(help.ToString());
        });
        this._server.OnCommand('/set/output/:name/:value', params => {
            this._outputs.SetValue(params.name, +params.value);
        });
        this._server.OnQuery('/get/output/:name/value', (req, res) => { var _a; return res.send(((_a = this._outputs.GetValue(req.params.name)) === null || _a === void 0 ? void 0 : _a.toString()) || ""); });
        this._server.Start();
        process.on('SIGINT', () => {
            console.log('SIGINT detected. Closing server & disposing IO...');
            this._server.Dispose();
            this._outputs.Dispose();
        });
    }
};
Main = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(Types_1.Types.IConfig)),
    __param(1, inversify_1.inject(Types_1.Types.ILogger)),
    __metadata("design:paramtypes", [Object, Object, Host_1.Host,
        Outputs_1.Outputs])
], Main);
exports.Main = Main;
//# sourceMappingURL=Main.js.map