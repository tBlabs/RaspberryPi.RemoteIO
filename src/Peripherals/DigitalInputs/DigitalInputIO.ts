import { Gpio } from "pigpio";
import { ILogger } from "../../Services/Logger/ILogger";
import { DigitalInputConfigEntry } from "./DigitalInputConfigEntry";

export class DigitalInputIO
{
    public readonly Name!: string;
    public readonly IO!: Gpio;
    private state = (-1);

    constructor(_log: ILogger, entry: DigitalInputConfigEntry)
    {
        try
        {
            _log.Log(`Registering "${entry.name}"...`);

            this.Name = entry.name;
            let pull = Gpio.PUD_OFF;
            let edge = Gpio.EITHER_EDGE;

            switch (entry.pull)
            {
                case "none": pull = Gpio.PUD_OFF; break;
                case "up": pull = Gpio.PUD_UP; break;
                case "down": pull = Gpio.PUD_DOWN; break;
                default: throw new Error(`Invalid pull value`);
            }
            
            switch (entry.edge)
            {
                case "both": edge = Gpio.EITHER_EDGE; break;
                case "rising": edge = Gpio.RISING_EDGE; break;
                case "falling": edge = Gpio.FALLING_EDGE; break;
                default: throw new Error(`Invalid edge value`);
            }

            this.IO = new Gpio(entry.pin, {
                mode: Gpio.INPUT,
                pullUpDown: pull,
                edge: edge
            });

            this.IO.on('interrupt', (level) =>
            {
                if (this.state !== level)
                {
                    this.state = level;

                    this.OnStateChange?.(this.state);
                }
            });

            _log.Log("Registered.");
        }
        catch (error)
        {
            _log.Error("Registering error:", error.message);
        }
    }

    public OnStateChange!: (state: number) => void;
}
