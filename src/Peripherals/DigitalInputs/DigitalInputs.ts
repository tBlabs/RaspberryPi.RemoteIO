import { inject, injectable } from "inversify";
import { Types } from "../../IoC/Types";
import { IConfig } from "../../Services/Config/IConfig";
import { ILogger } from "../../Services/Logger/ILogger";
import { DigitalInputIO } from "./DigitalInputIO";
import { DigitalInputIoFactory } from "./DigitalInputIoFactory";

@injectable()
export class DigitalInputs
{
    constructor(
        private _digitalInputFactory: DigitalInputIoFactory,
        @inject(Types.IConfig) private _config: IConfig,
        @inject(Types.ILogger) private _log: ILogger)
    { }

    private inputs: DigitalInputIo[] = [];
    private callback!: (inputName: string, inputState: number) => void;

    public async Init(): Promise<void>
    {
        this._config.Inputs.forEach(io =>
        {
            const input: DigitalInputIO = this._digitalInputFactory.Create(io);

            this.inputs.push(input);

            input.OnStateChange = (state) =>
            {
                this.callback?.(input.Name, state);
            };
        });
    }

    public GetValue(name: string): 0 | 1
    {
        this._log.Trace(`Reading output "${name}" value...`);

        const io = this.inputs.find(x => x.Name === name);

        if (io === undefined)
        {
            this._log.Trace(`IO not found`);

            throw new Error(`IO "${name}" not found.`);
        }
        else
        {
            const value = io.Get();

            this._log.Trace(`"${name}" value is ${value}.`);

            return value;
        }
    }

    public OnChange(callback: (inputName: string, inputState: number) => void): void
    {
        this.callback = callback;
    }
}
