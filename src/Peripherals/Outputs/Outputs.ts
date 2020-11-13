import { BinaryValue } from 'onoff';
import { inject, injectable } from 'inversify';
import { IDisposable } from '../../IDisposable';
import { IConfig } from '../../Services/Config/Config';
import { Types } from '../../IoC/Types';
import { ILogger } from '../../Services/Logger/ILogger';
import { DigitalOutputIO } from './OutputIO';

@injectable()
export class Outputs implements IDisposable
{
    private outputs: DigitalOutputIO[] = [];

    constructor(
        @inject(Types.IConfig) private _config: IConfig,
        @inject(Types.ILogger) private _log: ILogger)
    { }

    public Init(): void
    {
        this._config.Outputs.forEach((o) =>
        {
            const output = new DigitalOutputIO(o);

            this.outputs.push(output);
        });
    }

    public async SetValue(name: string, value: number): Promise<void>
    {
        this._log.Trace(`Setting output "${name}" to value ${value}...`);

        const io = this.outputs.find(x => x.Name === name);

        if (io === undefined)
        {
            this._log.Trace(`IO not found`);

            throw new Error(`IO "${name}" not found.`);
        }
        else
        {
            await io.Set(+value as BinaryValue);

            this._log.Trace(`"${name}" set to ${value}.`);
        }
    }

    public async GetValue(name: string): Promise<BinaryValue | undefined>
    {
        this._log.Trace(`Reading output "${name}" value...`);

        const io = this.outputs.find(x => x.Name === name);

        if (io === undefined)
        {
            this._log.Trace(`IO not found`);

            throw new Error(`IO "${name}" not found.`);
        }
        else
        {
            const value = await io.Get();

            this._log.Trace(`"${name}" value is ${value}.`);

            return value;
        }
    }

    public Dispose(): void
    {
        this.outputs.forEach((o: DigitalOutputIO) =>
        {
            o.Dispose();
        });
    }
}