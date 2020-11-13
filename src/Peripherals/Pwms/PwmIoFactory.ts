import { inject, injectable } from 'inversify';
import { Types } from '../../IoC/Types';
import { ILogger } from '../../Services/Logger/ILogger';
import { PwmConfigEntry } from './PwmConfigEntry';
import { PwmIO } from './PwmIO';


@injectable()
export class PwmIoFactory
{
    constructor(@inject(Types.ILogger) private _log: ILogger) { }

    public Create(entry: PwmConfigEntry): PwmIO
    {
        const io = new PwmIO(this._log, entry);

        return io;
    }
}
