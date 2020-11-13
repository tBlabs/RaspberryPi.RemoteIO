import { inject, injectable } from "inversify";
import { Types } from "../../IoC/Types";
import { IConfig } from "../../Services/Config/Config";
import { ILogger } from "../../Services/Logger/ILogger";
import { DigitalInputIoFactory } from "./DigitalInputIoFactory";

@injectable()
export class DigitalInputs
{
    constructor(
        private _digitalInputFactory: DigitalInputIoFactory,
        @inject(Types.IConfig) private _config: IConfig,
        @inject(Types.ILogger) private _log: ILogger)
    { }

    private callback!: (inputName: string, inputState: number) => void;

    public async Init(): Promise<void>
    {
        this._config.Inputs.forEach(io =>
        {
            const input = this._digitalInputFactory.Create(io);

            input.OnStateChange = (state) =>
            {
                this.callback?.(input.Name, state);
            };
        });
    }

    public OnChange(callback: (inputName: string, inputState: number) => void): void
    {
        this.callback = callback;
    }
}
