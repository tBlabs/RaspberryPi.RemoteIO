import 'reflect-metadata';
import { ILogger } from './ILogger';
import { injectable, inject } from 'inversify';
import { Types } from '../../IoC/Types';
import { ILoggerOutput } from "./ILoggerOutput";

@injectable()
export class Logger implements ILogger
{
    public LogEnable: boolean = true;
    public TraceEnable: boolean = true;

    constructor(@inject(Types.ILoggerOutput) private _output: ILoggerOutput)
    { }

    public Log(...params: any[]): string
    {
        if (this.LogEnable)
        {
            const str = params.map(this.ObjectToString).join(' ');
            this._output.Print(str);

            return str;
        }
        else return '';
    }

    public Trace(...params: any[]): string
    {
        if (this.TraceEnable)
        {
            return this.Log('  ', ...params);
        }
        else return '';
    }
    
    public Error(...params: any[]): void
    {
        const str = params.map(this.ObjectToString).join(' ');
        this._output.Print(str);
    }

    private ObjectToString(obj: any): string
    {
        if (obj?.constructor === String)
        {
            return obj.replace(/\n/g, '\\n')
                .replace(/\r/g, '\\r')
                .replace(/\t/g, '\\t');
            // return obj.replace(/\n/g, '<NL>')
            //     .replace(/\r/g, '<CR>')
            //     .replace(/\t/g, '<TAB>');
        }
        else
            if (obj === undefined)
            {
                return 'undefined';
            }
            else if (obj === null)
            {
                return 'null';
            }
            else if (obj instanceof Object)
            {
                return JSON.stringify(obj)
                    .replace(/{"/g, "{ ")
                    .replace(/}/g, " }")
                    .replace(/,"/g, ", ")
                    .replace(/":/g, ": ");
            }
            else
            {
                return obj;
            }
    }
}