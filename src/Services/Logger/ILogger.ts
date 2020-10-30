export interface ILogger
{
    LogEnable: boolean;
    TraceEnable: boolean;
    Log(...params): void;
    Trace(...params): void;
    Error(...params): void;
}