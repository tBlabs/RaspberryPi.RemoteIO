import { injectable } from 'inversify';
import { Config } from './Services/Config/Config';
import { HelpBuilder } from './HelpBuilder';
import { Server } from './Server';
import { Outputs } from './Outputs';
import { Gpio, BinaryValue } from 'onoff';

@injectable()
export class Main
{
    constructor(
        private _config: Config,
        private _server: Server,
        private _outputs: Outputs)
    { }

    public async Start(): Promise<void>
    {
        let led1 = new Gpio(17, 'out');
        let led2 = new Gpio(18, 'out');

        setInterval(()=>{

            led1.writeSync(led1.readSync() ^ 1);
            led2.writeSync(led2.readSync() ^ 1);
        }, 500);
        await this._config.Init();
        await this._outputs.Init();

        this._server.OnQuery('/', (req, res) =>
        {
            const help = new HelpBuilder("Raspberry.RemoteIO", "Raspberry Pi driver via Http")
                .Glossary("Raspberry", "Raspberry Pi Zero board")
                .Config("port", this._config.Port.toString(), "8000", "1234", this._config.ConfigFileName)
                .Config("outputs", JSON.stringify(this._config.Outputs), "empty", `[{ "name": "Led", "pin": 4 }]`, this._config.ConfigFileName)
                .Api('/set/output/:name/:value', `Set specified Output IO to given value (0 or 1)`)
                .Api('/get/output/:name/value', `Returns Output current value`);

            res.send(help.ToString());
        });

        this._server.OnCommand('/set/output/:name/:value', params => this._outputs.SetValue(params.name, params.value));
        this._server.OnQuery('/get/output/:name/value', (req, res) => res.send(this._outputs.GetValue(req.params.name)?.toString() || ""));


        this._server.Start(this._config.Port);

        process.on('SIGINT', () =>
        {
            console.log('SIGINT detected. Disposing IO...');

            this._outputs.Dispose();
        });
    }
}
