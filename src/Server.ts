import { injectable } from 'inversify';
import * as express from 'express';
import * as cors from 'cors';

@injectable()
export class Server
{
    private server;

    constructor()
    {
        this.server = express();
        this.server.use(cors());

        this.server.get('/ping', (req, res) => res.send('pong'));
    }

    public Start(port: number): void
    {
        this.server.listen(port, () => console.log(`Raspberry Pi Remote IO server started @ ${port}`));
    }

    public OnCommand(url, callback: (urlParams) => void)
    {
        this.server.get(url, (req, res) =>
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
        this.server.get(url, (req, res) =>
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
