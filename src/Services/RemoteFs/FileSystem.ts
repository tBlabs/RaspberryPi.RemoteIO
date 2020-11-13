import { injectable } from 'inversify';
import { IFileSystem } from './IFileSystem';
import * as fs from 'fs';

@injectable()
export class FileSystem implements IFileSystem
{
    public async WriteFile(fileDir: string, data: string): Promise<void>
    {
        return new Promise((resolve, reject) =>
        {
            fs.writeFile(fileDir, data, (err) =>
            {
                if (err)
                    reject("Could not save file.");

                resolve();
            });
        });
    }

    public async ReadFile(fileDir: string): Promise<string>
    {
        return new Promise((resolve, reject) =>
        {
            fs.readFile(fileDir, (err, data) =>
            {
                if (err)
                    reject("Could not read file.");

                resolve(data?.toString());
            });
        });
    }
}
