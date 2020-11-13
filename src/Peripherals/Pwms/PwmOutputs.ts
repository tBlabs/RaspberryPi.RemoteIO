import { injectable, inject } from 'inversify';
import { Types } from '../../IoC/Types';
import { IConfig } from '../../Services/Config/Config';
import { ILogger } from '../../Services/Logger/ILogger';
import { PwmIO } from './PwmIO';
import { PwmIoFactory } from "./PwmIoFactory";

@injectable()
export class Pwms
{
    private pwms: PwmIO[] = [];

    constructor(
        private _pwmIoFactory: PwmIoFactory,
        @inject(Types.IConfig) private _config: IConfig,
        @inject(Types.ILogger) private _log: ILogger)
    { }

    public Init(): void
    {
        this._config.Pwms.forEach((io) =>
        {
            // const pwm = new PwmIO(io);
            const pwm = this._pwmIoFactory.Create(io);

            this.pwms.push(pwm);
        });
    }

    public async SetValue(name: string, value: number): Promise<void>
    {
        const io = this.pwms.find(x => x.Name === name);

        if (io === undefined)
        {
            this._log.Error(`IO not found`);

            throw new Error(`IO "${name}" not found.`);
        }

        await io.Set(+value);
    }
}