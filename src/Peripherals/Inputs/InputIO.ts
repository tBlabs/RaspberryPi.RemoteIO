import { Gpio } from "pigpio";
import { InputConfigEntry } from "./InputConfigEntry";


export class InputIO
{
    public readonly Name: string;
    public readonly IO: Gpio;
    private state = (-1);
    // private onStateChangeCallback!: (state: number) => void;
    constructor(entry: InputConfigEntry)
    {
        // console.log('CTOR');
        this.Name = entry.name;
        let pull = Gpio.PUD_OFF;
        let edge = Gpio.EITHER_EDGE;

        switch (entry.pull)
        {
            case "none": pull = Gpio.PUD_OFF; break;
            case "up": pull = Gpio.PUD_UP; break;
            case "down": pull = Gpio.PUD_DOWN; break;
        }

        switch (entry.edge)
        {
            case "both": edge = Gpio.EITHER_EDGE; break;
            case "rising": edge = Gpio.RISING_EDGE; break;
            case "falling": edge = Gpio.FALLING_EDGE; break;
        }
// console.log('aaa');
try {
    this.IO = new Gpio(entry.pin, {
        mode: Gpio.INPUT,
        pullUpDown: pull,
        edge: edge
    });
} catch (error) {
    console.log(error.message);
}
     

        // console.log('CONSTR');
        this.IO.on('interrupt',  (level) =>
        // let level = 0; setInterval( ()=>
        {
            // level = 1-level;
            // console.log('L', level);
            if (this.state !== level)
            {
                console.log('INTERR', this.state, level);
                this.state = level;

                this.OnStateChange?.(this.state);
            }
        });
        // }, 1000);
    }

    public get State(): number
    {
        return this.state;
    }

    public OnStateChange!: (state: number) => void;
}
