import { inject, injectable } from "inversify";
import { Types } from "../../IoC/Types";
import { IFileSystem } from "../RemoteFs/RemoteFs";
import { Output } from "../../Output";
import { IStartupArgs } from "../Environment/IStartupArgs";

export interface RawConfig
{
    port: number;
    logsLevel: number;
    outputs: Output[];
}

export interface IConfig
{
    LogsLevel: number;
    Port: number;
    Outputs: Output[];
    ConfigFileName: string;
    Init(): Promise<void>;
}

@injectable()
export class Config implements IConfig
{
    private configFileName = "config.json";

    constructor(
        @inject(Types.IStartupArgs) private _args: IStartupArgs,
        @inject(Types.IFileSystem) private _fs: IFileSystem)
    { }

    private config!: RawConfig;

    public get Port(): number
    {
        return this._args.Args.port || this.config.port || 8000;
    }

    public get Outputs(): Output[]
    {
        return this.config.outputs;
    }

    public get LogsLevel(): number // || operator cannot be used here because it treats 0 as no value
    {
        if (this._args.Args.logsLevel !== undefined)
            return +this._args.Args.logsLevel;

        if (this.config.logsLevel !== undefined)
            return this.config.logsLevel;
        
        return 1;
    }

    public get ConfigFileName(): string
    {
        return this.configFileName;
    }

    public async Init(): Promise<void>
    {
        try 
        {
            const configAsString = await this._fs.ReadFile("/home/pi/RaspberryPi.RemoteIO/" + this.configFileName);
            this.config = JSON.parse(configAsString);
        } 
        catch (error)
        {
            throw new Error('COULD NOT LOAD CONFIG.');
        }
    }
}