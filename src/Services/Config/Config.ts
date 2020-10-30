import { inject, injectable } from "inversify";
import * as fs from 'fs';
import * as path from 'path';
import { Types } from "../../IoC/Types";
import { IShell } from "../RemoteShell/IShell";
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

    public async Init(): Promise<void>
    {
        const configAsString = await this._fs.ReadFile("/home/pi/RemoteIO/config.json");
        this.config = JSON.parse(configAsString);
    }
}