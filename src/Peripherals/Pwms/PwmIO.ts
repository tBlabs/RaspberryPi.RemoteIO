import { Gpio } from 'pigpio';
import { ILogger } from '../../Services/Logger/ILogger';
import { PwmConfigEntry } from './PwmConfigEntry';

export class PwmIO
{
    public readonly Name: string;
    public readonly IO!: Gpio;

    constructor(private _log: ILogger, entry: PwmConfigEntry)
    {
        _log.Log(`Registering "${entry.name}"...`);

        this.Name = entry.name;

        try
        {
            this.IO = new Gpio(entry.pin, { mode: Gpio.OUTPUT });

            _log.Log("Registered.");
        }
        catch (error)
        {
            _log.Error(`Registering error: ${error.message}. Is app running at Raspberry Pi?`);
        }
    }

    public Set(dutyCycle: number): void
    {
        try
        {
            this._log.Trace(`Setting pwm "${name}" duty value to ${dutyCycle}...`);

            if (dutyCycle < 0 || dutyCycle > 255)
            {
                throw new Error(`Duty cycle out of range (0-255). ${dutyCycle} was given.`);
            }

            this.IO.pwmWrite(dutyCycle);

            this._log.Trace(`"${name}" set to ${dutyCycle}.`);
        }
        catch (error)
        {
            this._log.Error('PWM duty cycle write problem:', error);
        }
    }
}
