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
// import { HelpBuilder } from './Utils/HelpBuilder/HelpBuilder';
const Host_1 = require("./Host");
const Outputs_1 = require("./Peripherals/Outputs/Outputs");
const Types_1 = require("./IoC/Types");
const HelpBuilder_1 = require("./Utils/HelpBuilder/HelpBuilder");
const PwmOutputs_1 = require("./Peripherals/Pwms/PwmOutputs");
const Inputs_1 = require("./Peripherals/Inputs/Inputs");
let Main = class Main {
    constructor(_config, _log, _server, _inputs, _pwms, _outputs) {
        this._config = _config;
        this._log = _log;
        this._server = _server;
        this._inputs = _inputs;
        this._pwms = _pwms;
        this._outputs = _outputs;
        this.problems = [];
    }
    async Start() {
        try {
            await this._config.Init();
        }
        catch (error) {
            console.log('Could not load config');
            this.problems.push(`⚡ Could not load configuration: ${error}`);
        }
        this._log.SetLogLevel(this._config.LogsLevel); // This must be here due to circular dependency :(
        try {
            await this._outputs.Init();
            await this._pwms.Init();
            await this._inputs.Init();
        }
        catch (error) {
            this.problems.push("⚡ Could not load IO driver on this machine. onoff and pigpio libraries works only on Raspberry Pi.");
        }
        this._server.OnQuery('/', (req, res) => {
            const help = new HelpBuilder_1.HelpBuilder("RaspberryPi.RemoteIO", "Raspberry Pi driver via Http")
                .Warning(this.problems)
                .Config("USE_REMOTE_SHELL", process.env.USE_REMOTE_SHELL ? "true" : "false", "empty", "USE_REMOTE_SHELL={empty or anything}", 'Environment variable process.env (".env" file)')
                .Config("REMOTE_SHELL", process.env.REMOTE_SHELL, "empty", "REMOTE_SHELL=http://192.168.43.229:3000", 'Environment variable process.env (".env" file)')
                .Config("port", this._config.Port.toString(), "8000", "1234 (number value)", this._config.ConfigFileDir)
                .Config("outputs", JSON.stringify(this._config.Outputs), "empty", `[{ "name": "Led", "pin": 4 }]`, this._config.ConfigFileDir)
                .Config("logsLevel", this._config.LogsLevel.toString(), "1", `0 - off / 1 - logs / 2 - trace`, `--logsLevel param or in ${this._config.ConfigFileDir}`)
                .Api('/set/output/:name/:value', `Set specified Output IO to given value (0 or 1)`)
                .Api('/get/output/:name/value', `Returns Output current value`)
                .Api('/set/pwm/:name/:value', `Set specified Pwm IO to given value (from 0 to 255)`)
                .Requirement('Active "Remote Shell" utility', 'Is necessary to download config file. (fs module may be used instead /IFileSystem/).')
                .Requirement(`Config file "config.json" in "${this._config.ConfigFileDir}"`, 'Is necessary to start the app. Defines server port and IO configuration.');
            res.send(help.ToString());
        });
        this._server.OnCommand('/set/output/:name/:value', params => {
            this._outputs.SetValue(params.name, +params.value);
        });
        this._server.OnQuery('/get/output/:name/value', (req, res) => { var _a; return res.send(((_a = this._outputs.GetValue(req.params.name)) === null || _a === void 0 ? void 0 : _a.toString()) || ""); });
        this._server.OnCommand('/set/pwm/:name/:value', params => {
            this._pwms.SetValue(params.name, +params.value);
        });
        this._inputs.OnChange((name, value) => {
            // console.log('MAIN INPUT ON CHANGE', name, value);
            this._server.SendToAllClients('input-change', name, value);
        });
        let i = 0;
        setInterval(() => {
            this._server.SendToAllClients('isalive', i);
            i = 1 - i;
        }, 1000);
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
        Inputs_1.Inputs,
        PwmOutputs_1.Pwms,
        Outputs_1.Outputs])
], Main);
exports.Main = Main;
//# sourceMappingURL=Main.js.map