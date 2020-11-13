import { inject, injectable } from "inversify";
import { Gpio } from "pigpio";
import { Types } from "./IoC/Types";
import { IConfig } from "./Services/Config/Config";
import { ILogger } from "./Services/Logger/ILogger";

export interface InputConfigEntry
{
    name: string;
    pin: number;
    pull: "none" | "up" | "down";
    edge: "both" | "rising" | "falling";
}

export class InputIO
{
    public readonly Name: string;
    public readonly IO: Gpio;
    private state = (-1);
    // private onStateChangeCallback!: (state: number) => void;

    constructor(entry: InputConfigEntry)
    {
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

        this.IO = new Gpio(entry.pin, {
            mode: Gpio.INPUT,
            pullUpDown: pull,
            edge: edge
        });

        this.IO.on('interrupt', (level) =>
        {
            if (this.state !== level)
            {
                console.log('INTERR', this.state, level);
                this.state = level;

                this.OnStateChange?.(this.state);
            }
        });
    }

    public get State(): number
    {
        return this.state;
    }

    public OnStateChange!: (state: number) => void;
    // {
        // console.log('OnStateChange assign');
        // this.onStateChangeCallback = callback;
    // }
}

@injectable()
export class Inputs
{
    constructor(
        @inject(Types.IConfig) private _config: IConfig,
        @inject(Types.ILogger) private _log: ILogger)
    { }

    private callback!: (inputName: string, inputState: number) => void;

    public async Init(): Promise<void>
    {
        this._config.Inputs.forEach(io =>
        {
            console.log('REG', io);
            const input = new InputIO(io);

            input.OnStateChange = (state) =>
            {
                console.log('inp.onstatCh assign');
                this.callback?.(input.Name, state);
            };
        });
    }

    public OnChange(callback: (inputName: string, inputState: number) => void): void
    {
        this.callback = callback;
    }
}