import { Gpio } from 'pigpio';
import { PwmConfigEntry } from './PwmConfigEntry';


export class PwmIO
{
    public readonly Name: string;
    public readonly IO: Gpio;

    constructor(entry: PwmConfigEntry)
    {
        this.Name = entry.name;
        this.IO = new Gpio(entry.pin, { mode: Gpio.OUTPUT });
    }

    public async Set(dutyCycle: number): Promise<void>
    {
        return new Promise((resolve) =>
        {
            this.IO.pwmWrite(dutyCycle);

            resolve();
        });
    }
}
