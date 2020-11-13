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
const Host_1 = require("./Host");
const DigitalOutputs_1 = require("./Peripherals/DigitalOutputs/DigitalOutputs");
const Types_1 = require("./IoC/Types");
const HelpBuilder_1 = require("./Utils/HelpBuilder/HelpBuilder");
const PwmOutputs_1 = require("./Peripherals/Pwms/PwmOutputs");
const DigitalInputs_1 = require("./Peripherals/DigitalInputs/DigitalInputs");
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
        await this.LoadConfiguration();
        await this.InitIo();
        this.RegisterDigitalOutputsHandlers();
        this.RegisterAnalogOutputsHandlers();
        this.RegisterDigitalInputsHandlers();
        this.RegisterHelpHandler();
        this.EngageHeartbeat();
        this._server.Start();
        this.RegisterSigInt();
    }
    RegisterSigInt() {
        process.on('SIGINT', () => {
            this._log.Error('SIGINT detected. Closing server & disposing IO...');
            this._server.Dispose();
            this._outputs.Dispose();
        });
    }
    EngageHeartbeat() {
        let i = 0;
        setInterval(() => {
            this._server.SendToAllClients('heartbeat', i);
            i++;
        }, 10 * 1000);
    }
    RegisterDigitalInputsHandlers() {
        this._inputs.OnChange((name, value) => {
            this._server.SendToAllClients('input-change', name, value);
        });
    }
    RegisterHelpHandler() {
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
                .Api('/set/pwm/:name/:value', `Set specified PWM IO to given value (from 0 to 255)`)
                .Requirement('Active "Remote Shell" utility', 'Is necessary to download config file. (fs module may be used instead /IFileSystem/).')
                .Requirement(`Config file "config.json" in "${this._config.ConfigFileDir}"`, 'Is necessary to start the app. Defines server port and IO configuration.');
            res.send(help.ToString());
        });
    }
    RegisterAnalogOutputsHandlers() {
        this._server.OnCommand('/set/pwm/:name/:value', params => {
            this._pwms.SetValue(params.name, +params.value);
        });
    }
    RegisterDigitalOutputsHandlers() {
        this._server.OnCommand('/set/output/:name/:value', async (params) => {
            await this._outputs.SetValue(params.name, +params.value);
        });
        this._server.OnQuery('/get/output/:name/value', async (req, res) => {
            var _a;
            res.send(await ((_a = this._outputs.GetValue(req.params.name)) === null || _a === void 0 ? void 0 : _a.toString()) || "");
        });
    }
    async InitIo() {
        try {
            await this._outputs.Init();
            await this._pwms.Init();
            await this._inputs.Init();
        }
        catch (error) {
            this.problems.push("⚡ Could not load IO driver on this machine. onoff and pigpio libraries works only on Raspberry Pi.");
        }
    }
    async LoadConfiguration() {
        try {
            this._log.Log(`Loading config...`); // This probably won't work because log.SetLogLevel is after config load
            await this._config.Init();
            this._log.SetLogLevel(this._config.LogsLevel); // This must be here due to circular dependency :(
            this._log.Trace(`Config loaded:`, this._config.Raw);
        }
        catch (error) {
            this._log.Error('Could not load config', error.message);
            this.problems.push(`⚡ Could not load configuration: ${error}`);
        }
    }
};
Main = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(Types_1.Types.IConfig)),
    __param(1, inversify_1.inject(Types_1.Types.ILogger)),
    __metadata("design:paramtypes", [Object, Object, Host_1.Host,
        DigitalInputs_1.DigitalInputs,
        PwmOutputs_1.Pwms,
        DigitalOutputs_1.DigitalOutputs])
], Main);
exports.Main = Main;
//# sourceMappingURL=Main.js.map