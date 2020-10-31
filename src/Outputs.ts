import { Gpio, BinaryValue } from 'onoff';
import { inject, injectable } from 'inversify';
import { Output } from './Output';
import { IDisposable } from './IDisposable';
import { Config } from './Services/Config/Config';
import { Types } from './IoC/Types';
import { ILogger } from './Services/Logger/ILogger';

export class OutputIO implements IDisposable
{
    public readonly Name: string;
    public readonly IO: Gpio;

    constructor(output: Output)
    {
        this.Name = output.name;
        this.IO = new Gpio(output.pin, 'out');
    }

    public Set(value: BinaryValue): void
    {
        this.IO.writeSync(value);
    }

    public Get(): BinaryValue
    {
        return this.IO.readSync();
    }

    public Dispose(): void
    {
        this.IO.unexport();
    }
}

@injectable()
export class Outputs implements IDisposable
{
    private outputs: OutputIO[] = [];

    constructor(
        private _config: Config,
        @inject(Types.ILogger) private _log: ILogger)
    { }

    public Init(): void
    {
        this._config.Outputs.forEach((o) =>
        {
            const output = new OutputIO(o);

            this.outputs.push(output);
        });
    }

    public SetValue(name: string, value: number): void
    {
        this._log.Trace(`Setting output "${name}" to value ${value}...`);
        
        const io = this.outputs.find(x => x.Name === name);
        
        if (io === undefined)
        {
            this._log.Trace(`IO not found`);
        }
        else
        {
            io.Set(+value as BinaryValue);
            this._log.Trace(`"${name}" set to ${value}.`);
        }
    }
    
    public GetValue(name): BinaryValue | undefined
    {
        this._log.Trace(`Reading output "${name}" value...`);

        const io = this.outputs.find(x => x.Name === name);
        
        if (io === undefined)
        {
            this._log.Trace(`IO not found`);
            return undefined;
        }
        else
        {
            const value = io.Get();
            this._log.Trace(`"${name}" value is ${value}.`);
            return value;
        }
    }

    public Dispose(): void
    {
        this.outputs.forEach((o: OutputIO) =>
        {
            o.Dispose();
        });
    }
}