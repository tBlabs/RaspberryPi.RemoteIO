export function DelayAsync(delayInMs: number): Promise<void>
{
    return new Promise((resolve) =>
    {
        return setTimeout(() => resolve(), delayInMs);
    });
}