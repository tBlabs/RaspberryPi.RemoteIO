import { Gpio, BinaryValue } from 'onoff';
import { OutputConfigEntry } from './OutputConfigEntry';
import { IDisposable } from '../../IDisposable';

export class DigitalOutputIO implements IDisposable
{
    public readonly Name!: string;
    public readonly IO!: Gpio;

    constructor(entry: OutputConfigEntry)
    {
        try
        {
            console.log(`Registering "${entry.name}"...`);

            this.Name = entry.name;

            this.IO = new Gpio(entry.pin, 'out');
            console.log("Registered.");
        }
        catch (error)
        {
            console.log(`Registering error:`, error.message);
        }
    }

    public async Set(value: BinaryValue): Promise<void>
    {
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
