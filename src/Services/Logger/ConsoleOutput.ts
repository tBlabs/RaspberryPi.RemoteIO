import 'reflect-metadata';
import { injectable } from "inversify";
import { ILoggerOutput } from './ILoggerOutput';

@injectable()
export class ConsoleOutput implements ILoggerOutput
{
    private timeSinceLastLog: number = -1;

    public Print(str): void
    {
        if (str === '')
        {
            console.log('');
            return ;
        } 
        
        const now = +(new Date());
        const diff = now - (this.timeSinceLastLog==(-1) ? now : this.timeSinceLastLog);
        this.timeSinceLastLog = now;
        
        const s = ("+" + diff.toString()).padStart(6, ' ') + ` | ${ str }`;

        console.log(s);
    }
}