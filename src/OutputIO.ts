import { Gpio, BinaryValue } from 'onoff';
import { Output } from './Output';
import { IDisposable } from './IDisposable';

export class OutputIO implements IDisposable
{
    public readonly Name: string;
    public readonly IO: Gpio;

    constructor(output: Output)
    {
        this.Name = output.name;
        this.IO = new Gpio(output.pin, 'out');
    }

    public async Set(value: BinaryValue): Promise<void>
    {
        // this.IO.writeSync(value);
        return new Promise((resolve, reject) =>
        {
            this.IO.write(value, (err) =>
            {
                if (err)
                    reject(err);

                resolve();
            });
        });
    }

    public async Get(): Promise<BinaryValue>
    {
        // return this.IO.readSync();
        return new Promise((resolve, reject) =>
        {
            this.IO.read((err, value) =>
            {
                if (err)
                    reject(err);

                resolve(value);
            });
        });
    }

    public Dispose(): void
    {
        this.IO.unexport();
    }
}
