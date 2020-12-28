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
    constructor(
        @inject(Types.IStartupArgs) private _args: IStartupArgs,
        @inject(Types.IFileSystem) private _fs: IFileSystem)
    { }
    public get SimulationMode(): boolean
    {
        return this._args.Args.simulation || false;
    }

    public async Init(): Promise<void>
    {
        try 
        {
            if (this.ConfigFileDir === "") 
                throw new Error(`Config file dir not defined. Should be in .env file under key CONFIG_FILE_DIR.`)

            this.configAsString = await this._fs.ReadFile(this.ConfigFileDir);
            this.config = JSON.parse(this.configAsString);
        }
        catch (error)
        {
            throw new Error(`Could not load config file (from ${this.ConfigFileDir}). In remote mode check if remote shell (@ ${process.env.REMOTE_SHELL}) was active at the moment of app start?`);
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
        return process.env.CONFIG_FILE_DIR || "";
    }
}
