import { injectable } from 'inversify';
import { IFileSystem } from './IFileSystem';
import * as fs from 'fs';

@injectable()
export class FileSystem implements IFileSystem
{
    public async WriteFile(fileName: string, data: string): Promise<void>
    {
        return new Promise((resolve, reject) =>
        {
            fs.writeFile(fileName, data, (err) =>
            {
                if (err)
                    reject("Could not save file.");

                resolve();
            });
        });
    }

    public async ReadFile(fileName: string): Promise<string>
    {
        return new Promise((resolve, reject) =>
        {
            fs.readFile(fileName, (err, data) =>
            {
                if (err)
                    reject("Could not read file.");

                resolve(data?.toString());
            });
        });
    }
}
