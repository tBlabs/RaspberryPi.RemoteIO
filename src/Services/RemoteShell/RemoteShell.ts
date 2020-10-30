import { injectable, inject } from 'inversify';
import 'reflect-metadata';
import { IShell } from './IShell';
import { Types } from '../../IoC/Types';
import { ILogger } from '../logger/ILogger';
import Axios from 'axios';
import { ExecOutput } from './ExecOutput';

@injectable()
export class RemoteShell implements IShell
{
    constructor(@inject(Types.ILogger) private _log: ILogger)
    { }

    public ExecAsync(cmd: string): Promise<ExecOutput>
    {
        return new Promise(async (resolve, reject) =>
        {
            this._log.Trace('Exec:', cmd);

            try 
            {
                const cmdAsBase64 = Buffer.from(cmd).toString('base64');

                const response = await Axios.get(`${process.env.HTTP_TO_CLI}/shell64/${cmdAsBase64}`, { timeout: 5 * 1000 });

                this._log.Trace('Result:', response.data, ' (http status:', response.status, ')');

                resolve(new ExecOutput(0, response.data, ""))
            }
            catch (error) 
            {
                if ((error.code === 'ETIMEDOUT') || error.message?.includes("timeout"))
                {
                    this._log.Error('Remote Shell request timeout. Device is probably offline.');

                    reject(new ExecOutput(+!0, "", "REMOTE SHELL TIMEOUT"));
                    return;
                }

                this._log.Trace('Error result:', error.response?.data, ' (http status: ', error.response?.status, ')');

                resolve(new ExecOutput(error.response?.status, "", error.response?.data));
            }
        });
    }
}