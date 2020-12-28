import { BinaryValue } from 'onoff';
import { inject, injectable } from 'inversify';
import { IDisposable } from '../../IDisposable';
import { IConfig } from "../../Services/Config/IConfig";
import { Types } from '../../IoC/Types';
import { ILogger } from '../../Services/Logger/ILogger';
import { DigitalOutputIO } from './DigitalOutputIO';
import { DigitalOutputFactory } from './DigitalOutputFactory';

@injectable()
export class DigitalOutputs
{
    private outputs: DigitalOutputIO[] = [];

    constructor(
        private _digitalOutputFactory: DigitalOutputFactory,
        @inject(Types.IConfig) private _config: IConfig,
        @inject(Types.ILogger) private _log: ILogger)
    { }

    public Init(): void
    {
        this._config.Outputs.forEach((io) =>
        {
            const output = this._digitalOutputFactory.Create(io);

            this.outputs.push(output);
        });
    }

    public SetValue(name: string, value: number): void
    {
        this._log.Trace(`Setting output "${name}" to value ${value}...`);

        const io = this.outputs.find(x => x.Name === name);

        if (io === undefined)
        {
            this._log.Trace(`IO not found`);

            throw new Error(`IO "${name}" not found.`);
        }
        else
        {
            if (!this._config.SimulationMode)
                io.Set(+value as BinaryValue);

            this._log.Trace(`"${name}" set to ${value}.`);
        }
    }

    public GetValue(name: string): BinaryValue | undefined
    {
        this._log.Trace(`Reading output "${name}" value...`);

        const io = this.outputs.find(x => x.Name === name);

        if (io === undefined)
        {
            this._log.Trace(`IO not found`);

            throw new Error(`IO "${name}" not found.`);
        }
        else
        {
            let value: 0 | 1 | undefined = undefined;

            if (!this._config.SimulationMode)
            {
                value = io.Get();

                this._log.Trace(`"${name}" value is ${value}.`);
            }
            else this._log.Trace(`Simulation mode.`);

            return value;
        }
    }
}
