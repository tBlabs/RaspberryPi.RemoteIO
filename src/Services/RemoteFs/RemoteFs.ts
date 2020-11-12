import { injectable, inject } from 'inversify';
import { Types } from '../../IoC/Types';
import { ILogger } from '../Logger/ILogger';
import { IShell } from '../RemoteShell/IShell';
import { IFileSystem } from './IFileSystem';

@injectable()
export class RemoteFs implements IFileSystem
{
    constructor(
        @inject(Types.IShell) private _shell: IShell) { }

    public async WriteFile(fileName: string, data: string): Promise<void>
    {
        const cmd = `echo ${data.replace(/"/g, "\\\"")} > ${fileName}`;

        const result = await this._shell.ExecAsync(cmd);

        if (!result.IsSuccess)
            throw new Error(`Could not save: ${result.Message}`);
    }

    public async ReadFile(fileName: string): Promise<string>
    {
        const cmd = `cat ${fileName}`;

        const result = await this._shell.ExecAsync(cmd);

        if (!result.IsSuccess)
            throw new Error(`Could not read "${fileName}". File not exists? Message: ${result.Message}`);

        return result.StdOut;
    }
}
