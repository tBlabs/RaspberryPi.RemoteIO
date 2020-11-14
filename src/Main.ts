import { inject, injectable } from 'inversify';
import { IConfig } from "./Services/Config/IConfig";
import { Host } from './Host';
import { DigitalOutputs } from './Peripherals/DigitalOutputs/DigitalOutputs';
import { Types } from './IoC/Types';
import { ILogger } from './Services/Logger/ILogger';
import { HelpBuilder } from './Utils/HelpBuilder/HelpBuilder';
import { Pwms } from './Peripherals/Pwms/PwmOutputs';
import { DigitalInputs } from './Peripherals/DigitalInputs/DigitalInputs';

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
//         this._log.LogEnable = true;
//         this._log.TraceEnable = true;
//         // this._log.Log('TTTTT', new Error("adf").name)
//         try {
//             throw new Error("dupa")
//         } catch (error) {
//             this._log.Log('EEEEEEEEE', error)
//         }
// return
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

    private RegisterDigitalInputsHandlers()
    {
        this._inputs.OnChange((name, value) =>
        {
            this._server.SendToAllClients('input-change', name, value);
        });
    }

    private RegisterHelpHandler()
    {
        this._server.OnQuery('/', (req, res) =>
        {
            const help = new HelpBuilder("RaspberryPi.RemoteIO", "Raspberry Pi driver via Http")
                .Warning(this.problems)
                .Config("USE_REMOTE_SHELL", process.env.USE_REMOTE_SHELL ? "true" : "false", "empty", "USE_REMOTE_SHELL={empty or anything}", 'Environment variable process.env (".env" file)')
                .Config("REMOTE_SHELL", process.env.REMOTE_SHELL, "empty", "REMOTE_SHELL=http://192.168.43.229:3000", 'Environment variable process.env (".env" file)')
                .Config("port", this._config.Port.toString(), "8000", "1234 (number value)", this._config.ConfigFileDir)
                .Config("inputs", JSON.stringify(this._config.Inputs), "empty", `[{ "name": "Button1", "pin": 2, "pull": "none", "edge": "both" }]`, this._config.ConfigFileDir)
                .Config("outputs", JSON.stringify(this._config.Outputs), "empty", `[{ "name": "Led", "pin": 4 }]`, this._config.ConfigFileDir)
                .Config("pwm", JSON.stringify(this._config.Pwms), "empty", `[{ "name": "Led", "pin": 4 }]`, this._config.ConfigFileDir)
                .Config("logsLevel", this._config.LogsLevel.toString(), "1", `0 - off / 1 - logs / 2 - trace`, `--logsLevel param or in ${this._config.ConfigFileDir}`)
                .Api('/set/output/:name/:value', `Set specified Output IO to given value (0 or 1)`)
                .Api('/get/output/:name/value', `Returns Output current value`)
                .Api('/set/pwm/:name/:value', `Set specified PWM IO to given value (from 0 to 255)`)
                .Requirement('Active "Remote Shell" utility', 'Is necessary to download config file. (fs module may be used instead /IFileSystem/).')
                .Requirement(`Config file "config.json" in "${this._config.ConfigFileDir}"`, 'Is necessary to start the app. Defines server port and IO configuration.');

            res.send(help.ToString());
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
        this._server.OnCommand('/set/output/:name/:value', async (params) =>
        {
            await this._outputs.SetValue(params.name, +params.value);
        });
        this._server.OnQuery('/get/output/:name/value', async (req, res) =>
        {
            res.send(await this._outputs.GetValue(req.params.name)?.toString() || "");
        });
    }

    private async InitIo()
    {
        try
        {
            await this._outputs.Init();
            await this._pwms.Init();
            await this._inputs.Init();
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
            this._log.Log(`Loading config...`); // This probably won't work because log.SetLogLevel is after config load

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
