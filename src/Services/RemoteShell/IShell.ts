import { ExecOutput } from "./ExecOutput";


export interface IShell
{
    ExecAsync(cmd: string): Promise<ExecOutput>;
}
