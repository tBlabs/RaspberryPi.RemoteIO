import { injectable, inject } from "inversify";
import { Types } from "../../IoC/Types";
import { ILogger } from "../../Services/Logger/ILogger";
import { DigitalInputConfigEntry } from "./DigitalInputConfigEntry";
import { DigitalInputIO } from "./DigitalInputIO";



@injectable()
export class DigitalInputIoFactory
{
    constructor(@inject(Types.ILogger) private _log: ILogger) { }

    public Create(entry: DigitalInputConfigEntry): DigitalInputIO
    {
        const io = new DigitalInputIO(this._log, entry);

        return io;
    }
}
