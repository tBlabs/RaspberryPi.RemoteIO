import { inject, injectable } from "inversify";
import { Types } from "../../IoC/Types";
import { IFileSystem } from "../RemoteFs/RemoteFs";
import { Output } from "../../Output";

export interface RawConfig
{
    port: number;
    outputs: Output[];
}

@injectable()
export class Config
{
    private configFileName = "config.json"
    ;
    constructor(@inject(Types.IFileSystem) private _fs: IFileSystem)
    { }

    private config!: RawConfig;

    public get Port(): number
    {
        return this.config.port;
    }

    public get Outputs(): Output[]
    {
        return this.config.outputs;
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
            console.log(this.config);
        } 
        catch (error)
        {
            throw new Error('COULD NOT LOAD CONFIG. APP HALTED.');
        }
    }
}