import { OutputConfigEntry as DigitalOutputConfigEntry } from './DigitalOutputConfigEntry';
import { injectable, inject } from 'inversify';
import { Types } from '../../IoC/Types';
import { ILogger } from '../../Services/Logger/ILogger';
import { DigitalOutputIO } from './DigitalOutputIO';


@injectable()
export class DigitalOutputFactory
{
    constructor(@inject(Types.ILogger) private _log: ILogger) { }

    public Create(entry: DigitalOutputConfigEntry): DigitalOutputIO
    {
        const io = new DigitalOutputIO(this._log, entry);

        return io;
    }
}
