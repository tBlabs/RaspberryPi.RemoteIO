import { inject, injectable } from 'inversify';
import * as express from 'express';
import * as cors from 'cors';
import { Types } from './IoC/Types';
import { ILogger } from './Services/Logger/ILogger';
import { Express } from 'express-serve-static-core';
import { Server } from 'http';
import { IConfig } from "./Services/Config/IConfig";
import * as SocketIoHost from 'socket.io';
import * as http from 'http';
import { Clients } from './Clients';

@injectable()
export class Host
{
    httpServer: Server;
    public SendToAllClients(eventName: string, ...args: any): void
    {
        this.clients.SendToAll(eventName, ...args);
    }

    private expressServer: Express;
    private server!: Server;
    private clients = new Clients();

    constructor(
        @inject(Types.ILogger) private _log: ILogger,
        @inject(Types.IConfig) private _config: IConfig)
    {
        this.expressServer = express();
        this.expressServer.use(cors());

        this.expressServer.use((req, res, next)=>{

            if (req.headers.requestid)
            {
                // console.log('REQ ID', req.headers.requestid);
                res.setHeader("requestid", req.headers.requestid);
            }

            next();
        });

        this.httpServer = http.createServer(this.expressServer);
        const socketHost = SocketIoHost(this.httpServer);

        socketHost.on('error', (e) => this._log.Log(`SOCKET ERROR ${e}`));

        socketHost.on('connection', (socket) =>
        {
            _log.Log(`New socket client connection ${socket.id}`);

            this.clients.Add(socket);
        });

        this.expressServer.get('/ping', (req, res) => res.send('pong'));
    }

    public async OnCommand(url, callback: (urlParams) => Promise<void>): Promise<void>
    {
        this.expressServer.all(url, async (req, res) =>
        {
            try
            {
                await callback(req.params);

                res.sendStatus(200);
            }
            catch (error)
            {
                res.sendStatus(500);
            }
        });
    }

    public async OnQuery(url, callback: (req, res) => Promise<void>): Promise<void>
    {
        this.expressServer.get(url, async (req, res) =>
        {
            try
            {
                await callback(req, res);
            }
            catch (error)
            {
                res.sendStatus(500);
            }
        });
    }

    public Start(): void
    {
        this.server = this.httpServer.listen(this._config.Port, () => this._log.Log(`Raspberry Pi Remote IO server started @ ${this._config.Port}`));
    }

    public Dispose()
    {
        this.server.close(() =>
        {
            this._log.Log('Server closed.');
            this.httpServer.close(() =>
            {
                this._log.Log('Http server closed. Exiting app...');
                process.exit();
            });
        });
    }
}
