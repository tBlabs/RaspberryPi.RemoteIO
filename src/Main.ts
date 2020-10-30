import { injectable } from 'inversify';
import { Config } from './Services/Config/Config';
import { HelpBuilder } from './HelpBuilder';
import { Server } from './Server';
import { Outputs } from './Outputs';

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
        await this._config.Init();

        this._server.OnQuery('/', (req, res) =>
        {
            const help = new HelpBuilder("Raspberry.RemoteIO")
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

        process.on('SIGINT', () =>
        {
            console.log('SIGINT detected. Disposing IO...');

            this._outputs.Dispose();
        });
    }
}
