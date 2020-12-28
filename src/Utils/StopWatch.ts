export class StopWatch
{
    private startMoment: number = 0;
    private canWork: boolean = false;

    constructor(private startRightNow: boolean)
    {
        if (startRightNow) this.Start();
    }

    private get CurrentTimestamp(): number
    {
        return +new Date();
    }

    public Start(): void
    {
        this.startMoment = this.CurrentTimestamp;
        this.canWork = true;
    }

    public Stop(): number
    {
        return this.CurrentTimestamp - this.startMoment;
    }

    public get ElapsedMs(): number
    {
        return this.CurrentTimestamp - this.startMoment;
    }

    public HasElapsed(ms: number): boolean
    {
        if (((this.canWork) && (this.CurrentTimestamp - this.startMoment) > ms))
        {
            this.canWork = false;
            return true;
        }

        return false;
    }
}