import { inject, injectable } from 'inversify';
import * as express from 'express';
import * as cors from 'cors';
import { Types } from './IoC/Types';
import { ILogger } from './Services/Logger/ILogger';
import { Express } from 'express-serve-static-core';
import { Server } from 'http';
import { IConfig } from './Services/Config/Config';

@injectable()
export class Host
{
    private expressServer: Express;
    private server!: Server;

    constructor(
        @inject(Types.ILogger) private _log: ILogger,
        @inject(Types.IConfig) private _config: IConfig
        )
    {
        this.expressServer = express();
        this.expressServer.use(cors());

        this.expressServer.get('/ping', (req, res) => res.send('pong'));
    }
    public Start(): void
    {
        this.server = this.expressServer.listen(this._config.Port, () => this._log.Log(`Raspberry Pi Remote IO server started @ ${this._config.Port}`));
    }

    public Dispose()
    {
        this.server.close(() => this._log.Log('Server closed.'));
    }

    public OnCommand(url, callback: (urlParams) => void)
    {
        this.expressServer.get(url, (req, res) =>
        {
            try
            {
                callback(req.params);

                res.sendStatus(200);
            }
            catch (error)
            {
                res.sendStatus(500);
            }
        });
    }

    public OnQuery(url, callback: (req, res) => void)
    {
        this.expressServer.get(url, (req, res) =>
        {
            try
            {
                callback(req, res);
            }
            catch (error)
            {
                res.sendStatus(500);
            }
        });
    }
}
