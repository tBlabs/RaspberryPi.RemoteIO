
export interface IFileSystem
{
    WriteFile(fileName: string, data: string): Promise<void>;
    ReadFile(fileName: string): Promise<string>;
}
