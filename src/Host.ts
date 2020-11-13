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
        this.httpServer = http.createServer(this.expressServer);
        const socketHost = SocketIoHost(this.httpServer);

        socketHost.on('error', (e) => this._log.Log(`SOCKET ERROR ${ e }`));

        socketHost.on('connection', (socket) =>
        {
            _log.Log(`New socket client connection ${socket.id}`);

            this.clients.Add(socket);
        });

        this.expressServer.get('/ping', (req, res) => res.send('pong'));
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

    public Start(): void
    {
        this.server = this.httpServer.listen(this._config.Port, () => this._log.Log(`Raspberry Pi Remote IO server started @ ${this._config.Port}`));
    }

    public Dispose()
    {
        this.server.close(() => this._log.Log('Server closed.'));
    }
}
