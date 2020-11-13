import { Gpio } from 'pigpio';
import { PwmConfigEntry } from './PwmConfigEntry';


export class PwmIO
{
    public readonly Name: string;
    public readonly IO: Gpio;

    constructor(entry: PwmConfigEntry)
    {
        console.log(`Registering "${entry.name}"...`);

        this.Name = entry.name;

        try
        {
            this.IO = new Gpio(entry.pin, { mode: Gpio.OUTPUT });
            console.log("Registered.");
        }
        catch (error)
        {
            console.log(`Registering error:`, error.message);
        }
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
