import { inject, injectable } from 'inversify';
import { Config, IConfig } from './Services/Config/Config';
import { HelpBuilder } from './HelpBuilder';
import { Host } from './Server';
import { Outputs } from './Outputs';
import { Types } from './IoC/Types';
import { ILogger } from './Services/Logger/ILogger';

@injectable()
export class Main
{
    constructor(
        @inject(Types.IConfig) private _config: IConfig,
        @inject(Types.ILogger) private _log: ILogger,
        private _server: Host,
        private _outputs: Outputs)
    { }

    private problems: string[] = []; // TODO: to trzeba przekuć w jakąś klasę...

    public async Start(): Promise<void>
    {  
        try
        {
            await this._config.Init();
        }
        catch (error) // TODO: może warto wsadzić to w metodę?
        {
            this.problems.push("⚡ Could not load configuration from config.json file.");
        }
        
        this._log.SetLogLevel(this._config.LogsLevel); // This must be here due to circular dependency :(
  
        try
        {
            await this._outputs.Init();
        }
        catch (error)
        { 
            this.problems.push("⚡ Could not load IO driver on this machine. Node onoff lib works only on Raspberry Pi.");
        }

        this._server.OnQuery('/', (req, res) =>
        {
            const help = new HelpBuilder("RaspberryPi.RemoteIO", "Raspberry Pi driver via Http")
                .Warning(this.problems)
                .Config("REMOTE_SHELL", process.env.REMOTE_SHELL, "empty", "REMOTE_SHELL=http://192.168.43.229:3000", 'Environment variable process.env (".env" file)')
                .Config("port", this._config.Port.toString(), "8000", "1234", this._config.ConfigFileName)
                .Config("outputs", JSON.stringify(this._config.Outputs), "empty", `[{ "name": "Led", "pin": 4 }]`, this._config.ConfigFileName)
                .Config("logsLevel", this._config.LogsLevel.toString(), "1", `0 / 1 / 2`, `--logsLevel param or in ${this._config.ConfigFileName}`)
                .Api('/set/output/:name/:value', `Set specified Output IO to given value (0 or 1)`)
                .Api('/get/output/:name/value', `Returns Output current value`)
                .Requirement('Active "Remote Shell" utility', 'Is necessary to download config file. (fs module may be used instead /IFileSystem/).')
                .Requirement('Config file "config.json"', 'Is necessary to start the app. Defines server port and IO configuration.');

            res.send(help.ToString());
        });

        this._server.OnCommand('/set/output/:name/:value', params => 
        {
            this._outputs.SetValue(params.name, +params.value);
        });
        this._server.OnQuery('/get/output/:name/value', (req, res) => res.send(this._outputs.GetValue(req.params.name)?.toString() || ""));


        this._server.Start();

        process.on('SIGINT', () =>
        {
            console.log('SIGINT detected. Closing server & disposing IO...');

            this._server.Dispose();
            this._outputs.Dispose();
        });
    }
}
