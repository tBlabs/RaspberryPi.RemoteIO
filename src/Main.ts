import { inject, injectable } from 'inversify';
import { IConfig } from "./Services/Config/IConfig";
import { Host } from './Host';
import { DigitalOutputs } from './Peripherals/DigitalOutputs/DigitalOutputs';
import { Types } from './IoC/Types';
import { ILogger } from './Services/Logger/ILogger';
import { HelpBuilder } from './Utils/HelpBuilder/HelpBuilder';
import { Pwms } from './Peripherals/Pwms/PwmOutputs';
import { DigitalInputs } from './Peripherals/DigitalInputs/DigitalInputs';
import { DelayAsync } from './Utils/DelayAsync';
import { StopWatch } from './Utils/StopWatch';

@injectable()
export class Main
{
    constructor(
        @inject(Types.IConfig) private _config: IConfig,
        @inject(Types.ILogger) private _log: ILogger,
        private _server: Host,
        private _inputs: DigitalInputs,
        private _pwms: Pwms,
        private _outputs: DigitalOutputs)
    { }

    private problems: string[] = [];

    public async Start(): Promise<void>
    {
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

    private RegisterSigInt()
    {
        process.on('SIGINT', () =>
        {
            this._log.Error('SIGINT detected. Closing server...');

            this._server.Dispose();
        });
    }

    private EngageHeartbeat()
    {
        let i = 0;
        setInterval(() =>
        {
            this._server.SendToAllClients('heartbeat', i);
            i++;
        }, 10 * 1000);
    }

    private RegisterHelpHandler()
    {
        this._server.OnQuery('/', (req, res) =>
        {
            const help = new HelpBuilder("RaspberryPi.RemoteIO", "Raspberry Pi IO driver via Http & Socket")
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

    private RegisterDigitalInputsHandlers()
    {
        this._server.OnQuery('/get/input/:name/value', (req, res) =>
        {
            res.send(this._inputs.GetValue(req.params.name)?.toString() || "");
        });

        this._inputs.OnChange((name, value) =>
        {
            this._server.SendToAllClients('input-change', name, value);
        });
    }

    private RegisterAnalogOutputsHandlers()
    {
        this._server.OnCommand('/set/pwm/:name/:value', params =>
        {
            this._pwms.SetValue(params.name, +params.value);
        });
    }

    private RegisterDigitalOutputsHandlers()
    {
        this._server.OnCommand('/set/output/:name/:value',  (params) =>
        {
            const durationTimer = new StopWatch(true);
            this._outputs.SetValue(params.name, +params.value);
            this._log.Trace('Operation took', durationTimer.ElapsedMs);
        });

        this._server.OnQuery('/get/output/:name/value', async (req, res) => 
        {
            res.send(this._outputs.GetValue(req.params.name)?.toString() || "");
        });
    }

    private InitIo()
    {
        try
        {
            this._outputs.Init();
            this._pwms.Init();
            this._inputs.Init();
        }
        catch (error)
        {
            this.problems.push("⚡ Could not load IO driver on this machine. onoff and pigpio libraries works only on Raspberry Pi.");
        }
    }

    private async LoadConfiguration(): Promise<void>
    {
        try
        {
            this._log.Log(`Loading config from "${this._config.ConfigFileDir}"...`); // This probably won't work because log.SetLogLevel is after config load

            await this._config.Init();

            this._log.SetLogLevel(this._config.LogsLevel); // This must be here due to circular dependency :(

            this._log.Trace(`Config loaded:`, this._config.Raw);
        }
        catch (error)
        {
            this._log.Error('Could not load config', error.message);
            this.problems.push(`⚡ Could not load configuration: ${error}`);
        }
    }
}
