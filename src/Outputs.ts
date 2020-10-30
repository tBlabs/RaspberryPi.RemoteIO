import { Gpio, BinaryValue } from 'onoff';
import { injectable } from 'inversify';
import { Output } from './Output';
import { IDisposable } from './IDisposable';
import { Config } from './Services/Config/Config';

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

    constructor(private _config: Config)
    { }

    public Init(): void
    {
        this._config.Outputs.forEach((o) =>
        {
            const output = new OutputIO(o);

            this.outputs.push(output);
        });
    }

    public SetValue(name: string, value: BinaryValue): void
    {
       this.outputs.find(x => x.Name === name)?.Set(value);
    }

    public GetValue(name): BinaryValue
    {
        return this.outputs.find(x => x.Name === name)?.Get() as BinaryValue;
    }
    
    public Dispose(): void
    {
        this.outputs.forEach((o: OutputIO) =>
        {
            o.Dispose();
        });
    }
}