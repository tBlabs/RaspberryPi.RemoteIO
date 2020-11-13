import { injectable, inject } from 'inversify';
import { Types } from '../../IoC/Types';
import { IConfig } from '../../Services/Config/Config';
import { ILogger } from '../../Services/Logger/ILogger';
import { PwmIO } from './PwmIO';

@injectable()
export class Pwms
{
    private pwms: PwmIO[] = [];

    constructor(
        @inject(Types.IConfig) private _config: IConfig,
        @inject(Types.ILogger) private _log: ILogger)
    { }

    public Init(): void
    {
        this._config.Pwms.forEach((io) =>
        {
            const pwm = new PwmIO(io);

            this.pwms.push(pwm);
        });
    }

    public async SetValue(name: string, value: number): Promise<void>
    {
        this._log.Trace(`Setting pwm "${name}" duty value to ${value}...`);

        const io = this.pwms.find(x => x.Name === name);

        if (io === undefined)
        {
            this._log.Trace(`IO not found`);

            throw new Error(`IO "${name}" not found.`);
        }
        else
        {
            await io.Set(+value);

            this._log.Trace(`"${name}" set to ${value}.`);
        }
    }
}