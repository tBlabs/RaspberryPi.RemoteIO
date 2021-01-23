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
const StopWatch_1 = require("./Utils/StopWatch");
const EnvValidator_1 = require("./Services/Environment/EnvValidator");
let Main = class Main {
    constructor(_env, _config, _log, _server, _inputs, _pwms, _outputs) {
        this._env = _env;
        this._config = _config;
        this._log = _log;
        this._server = _server;
        this._inputs = _inputs;
        this._pwms = _pwms;
        this._outputs = _outputs;
        this.problems = [];
    }
    async Start() {
        if (!this._env.Validate())
            return;
        await this.LoadConfiguration();
        this.InitIo();
        this.RegisterDigitalOutputsHandlers();
        this.RegisterAnalogOutputsHandlers();
        this.RegisterDigitalInputsHandlers();
        this.RegisterHelpHandler();
        // this.EngageHeartbeat();
        this._server.Start();
        this.RegisterSigInt();
    }
    RegisterSigInt() {
        process.on('SIGINT', () => {
            this._log.Error('SIGINT detected. Closing server...');
            this._server.Dispose();
        });
    }
    EngageHeartbeat() {
        let i = 0;
        setInterval(() => {
            this._server.SendToAllClients('heartbeat', i);
            i++;
        }, 10 * 1000);
    }
    RegisterHelpHandler() {
        this._server.OnQuery('/', async (req, res) => {
            const help = new HelpBuilder_1.HelpBuilder("RaspberryPi.RemoteIO", "Raspberry Pi IO driver via Http & Socket")
                .Warning(this.problems)
                .Glossary('arg', 'Command line argument (ex. "npm start --port 8000 --logsLevel 2")')
                .Glossary('.env', 'Environment config file named ".env" located in main catalog of the application. Should be defined once and never changed. This file in not attached to git repository.')
                .Glossary('config', 'App configuration file. Defined in: ' + this._config.ConfigFileDir + ' (taken from .env file)')
                .Glossary('Remote Shell', 'Shell/bash/terminal called remotely for example by http (you may use this one: https://github.com/tBlabs/RemoteShell). Should be used only in Development Mode.')
                .Glossary('{event name} @socket', 'Api accessible only via socket client.')
                .Glossary('Development Mode', 'When this app is running on Computer, not Raspberry Pi. Remote Shell required.')
                .Glossary('Production Mode', 'When this app is running on Raspberry Pi, not Computer. Remote Shell not required, internal gonna be used.')
                .Glossary('||', 'if value on the left is not empty use value on the right (Like in Javascript)')
                .Config("CONFIG_FILE_DIR", process.env.CONFIG_FILE_DIR, "empty", "CONFIG_FILE_DIR=./config.json", '.env')
                .Config("REMOTE_SHELL", process.env.REMOTE_SHELL, "empty", "REMOTE_SHELL=http://192.168.43.229:3000", '.env')
                .Config("port", this._config.Port.toString(), "8000", "1234 (number value)", 'arg || config')
                .Config("inputs", JSON.stringify(this._config.Inputs), "empty", `[{ "name": "Button1", "pin": 2, "pull": "none", "edge": "both" }]`, 'config')
                .Config("outputs", JSON.stringify(this._config.Outputs), "empty", `[{ "name": "Led", "pin": 4 }]`, 'config')
                .Config("pwm", JSON.stringify(this._config.Pwms), "empty", `[{ "name": "Led", "pin": 4 }]`, 'config')
                .Config("logsLevel", this._config.LogsLevel.toString(), "1", `0 - off / 1 - logs / 2 - trace`, `arg || config`)
                .Api('/set/output/:name/:value', `Set specified Output IO to given value (0 or 1)`)
                .Api('/get/output/:name/value', `Returns Output current value`)
                .Api('/set/pwm/:name/:value', `Set specified PWM IO to given value (from 0 to 255)`)
                .Api('/get/input/:name/value', `Get specified Digital Input state (0 or 1)`)
                .Api('input-change @socket', `Read Digital Input value`)
                .Requirement('Active "Remote Shell" utility in Development Mode', 'Is necessary to download config file. (fs module may be used instead /interface IFileSystem/).')
                .Requirement(`Config file`, 'Is necessary for app start. Defines server port and IO configuration (look at Config section).');
            res.send(help.ToString());
        });
    }
    RegisterDigitalInputsHandlers() {
        this._server.OnQuery('/get/input/:name/value', async (req, res) => {
            var _a;
            res.send(((_a = this._inputs.GetValue(req.params.name)) === null || _a === void 0 ? void 0 : _a.toString()) || "");
        });
        this._inputs.OnChange((name, value) => {
            this._server.SendToAllClients('input-change', name, value);
        });
    }
    RegisterAnalogOutputsHandlers() {
        this._server.OnCommand('/set/pwm/:name/:value', async (params) => {
            this._pwms.SetValue(params.name, +params.value);
        });
    }
    RegisterDigitalOutputsHandlers() {
        this._server.OnCommand('/set/output/:name/:value', async (params) => {
            const durationTimer = new StopWatch_1.StopWatch(true);
            this._outputs.SetValue(params.name, +params.value);
            this._log.Trace('Operation took', durationTimer.ElapsedMs, 'ms');
        });
        this._server.OnQuery('/get/output/:name/value', async (req, res) => {
            var _a;
            res.send(((_a = this._outputs.GetValue(req.params.name)) === null || _a === void 0 ? void 0 : _a.toString()) || "");
        });
    }
    InitIo() {
        try {
            this._outputs.Init();
            this._pwms.Init();
            this._inputs.Init();
        }
        catch (error) {
            this.problems.push("⚡ Could not load IO driver on this machine. onoff and pigpio libraries works only on Raspberry Pi.");
        }
    }
    async LoadConfiguration() {
        try {
            this._log.Log(`Loading config from "${this._config.ConfigFileDir}"...`); // This probably won't work because log.SetLogLevel is after config load
            await this._config.Init();
            this._log.SetLogLevel(this._config.LogsLevel); // This must be here due to circular dependency :(
            this._log.Trace(`Config loaded:`, this._config.Raw);
        }
        catch (error) {
            this._log.Error('Config load problem:', error.message);
            this.problems.push(`⚡ Could not load configuration: ${error}`);
        }
    }
};
Main = __decorate([
    inversify_1.injectable(),
    __param(1, inversify_1.inject(Types_1.Types.IConfig)),
    __param(2, inversify_1.inject(Types_1.Types.ILogger)),
    __metadata("design:paramtypes", [EnvValidator_1.EnvValidator, Object, Object, Host_1.Host,
        DigitalInputs_1.DigitalInputs,
        PwmOutputs_1.Pwms,
        DigitalOutputs_1.DigitalOutputs])
], Main);
exports.Main = Main;
//# sourceMappingURL=Main.js.map