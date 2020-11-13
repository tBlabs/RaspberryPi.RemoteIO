import { OutputConfigEntry as DigitalOutputConfigEntry } from './DigitalOutputConfigEntry';
import { Gpio } from 'pigpio';
import { ILogger } from '../../Services/Logger/ILogger';

export class DigitalOutputIO// implements IDisposable
{
    public readonly Name!: string;
    public readonly IO!: Gpio;

    constructor(_log: ILogger, entry: DigitalOutputConfigEntry)
    {
        try
        {
            _log.Log(`Registering "${entry.name}"...`);

            this.Name = entry.name;

            // this.IO = new Gpio(entry.pin, 'out');
            this.IO = new Gpio(entry.pin, { mode: Gpio.OUTPUT });
            
            _log.Log("Registered.");
        }
        catch (error)
        {
            _log.Log(`Registering error:`, error.message);
        }
    }

    // public async Set(value: BinaryValue): Promise<void>
    // {
    //     return new Promise((resolve, reject) =>
    //     {
    //         this.IO.write(value, (err) =>
    //         {
    //             if (err)
    //                 reject(err);

    //             resolve();
    //         });
    //     });
    // }
    public  Set(value: 0 | 1): void
    {
        this.IO.digitalWrite(value);
    }

    public Get(): 0 | 1
    {
        return this.IO.digitalRead() as 0 | 1;
    }

    // public async Get(): Promise<BinaryValue>
    // {
    //     return new Promise((resolve, reject) =>
    //     {
    //         this.IO.read((err, value) =>
    //         {
    //             if (err)
    //                 reject(err);

    //             resolve(value);
    //         });
    //     });
    // }

    // public Dispose(): void
    // {
    //     this.IO.unexport();
    // }
}
