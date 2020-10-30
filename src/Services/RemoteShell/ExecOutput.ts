
export class ExecOutput
{
    constructor(public code: number, public stdout: string, public stderr: string) { }

    public get IsSuccess(): boolean
    {
        return this.code === 0;
    }

    public get StdOut(): string
    {
        return this.stdout?.trim();
    }

    public get StdErr(): string
    {
        return this.stderr?.trim();
    }

    public get Message(): string
    {
        return this.StdOut.length ? this.StdOut : this.StdErr;
    }
}
