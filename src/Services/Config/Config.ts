import { inject, injectable } from "inversify";
import { Types } from "../../IoC/Types";
import { IFileSystem } from "../RemoteFs/IFileSystem";
import { OutputConfigEntry } from "../../Peripherals/DigitalOutputs/DigitalOutputConfigEntry";
import { IStartupArgs } from "../Environment/IStartupArgs";
import { PwmConfigEntry } from "../../Peripherals/Pwms/PwmConfigEntry";
import { DigitalInputConfigEntry } from "../../Peripherals/DigitalInputs/DigitalInputConfigEntry";
import { IConfig } from "./IConfig";
import { RawConfig } from "./RawConfig";

@injectable()
export class Config implements IConfig
{
    private CONFIG_FILE_DIR = "/home/pi/RaspberryPi.RemoteIO/config.json";

    constructor(
        @inject(Types.IStartupArgs) private _args: IStartupArgs,
        @inject(Types.IFileSystem) private _fs: IFileSystem)
    { }

    public async Init(): Promise<void>
    {
        try 
        {
            this.configAsString = await this._fs.ReadFile(this.CONFIG_FILE_DIR);
            this.config = JSON.parse(this.configAsString);
        }
        catch (error)
        {
            throw new Error(`Could not load config file (from ${this.CONFIG_FILE_DIR}). Was remote shell active (@ ${process.env.REMOTE_SHELL}) at the moment of app start? (this question is valid only in remote mode)`);
        }
    }

    public get Raw(): string
    {
        return this.configAsString;
    }

    private configAsString: string = "(not loaded yet)";
    private config!: RawConfig;

    public get Port(): number
    {
        return this._args.Args.port || this.config?.port || 8000;
    }

    public get Inputs(): DigitalInputConfigEntry[]
    {
        return this.config?.inputs || [];
    }

    public get Outputs(): OutputConfigEntry[]
    {
        return this.config?.outputs || [];
    }

    public get Pwms(): PwmConfigEntry[]
    {
        return this.config?.pwms || [];
    }

    public get LogsLevel(): number // || operator cannot be used here because it treats 0 as no value
    {
        if (this._args.Args.logsLevel !== undefined)
            return +this._args.Args.logsLevel;

        if (this.config?.logsLevel !== undefined)
            return this.config.logsLevel;

        return 1;
    }

    public get ConfigFileDir(): string
    {
        return this.CONFIG_FILE_DIR;
    }
}
