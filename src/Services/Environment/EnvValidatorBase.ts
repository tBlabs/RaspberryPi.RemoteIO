import { injectable } from 'inversify';
import { ILogger } from '../Logger/ILogger';

@injectable()
export abstract class EnvValidatorBase
{
    constructor(protected _log: ILogger) { }

    protected abstract Validate(): boolean;

    protected MustBeOneOf(paramName: string, options: string[]): boolean
    {
        const variable = process.env[paramName];

        const isValid = (variable !== undefined) && (options.includes(variable));

        if (!isValid)
            this._log.Error(`.env variable "${paramName}" is not valid. Should be ONE OF [${options.join(", ")}] but is "${variable}".`);

        return isValid;
    }

    protected MustBeDir(paramName: string): boolean
    {
        const dir = process.env[paramName];

        const isValid = (dir !== undefined) && (dir.trim().length > 0); // T ODO: poor validation

        if (!isValid)
            this._log.Error(`.env variable "${paramName}" is not valid. Should be DIRECTORY but is "${dir}".`);

        return isValid;
    }

    protected MustBeUrl(paramName: string): boolean
    {
        const url = process.env[paramName];

        const isValid = (url !== undefined) && (url.trim().length > 0); // T ODO: poor validation

        if (!isValid)
            this._log.Error(`.env variable "${paramName}" is not valid. Should be URL but is "${url}".`);

        return isValid;
    }

    protected MayBeUrl(paramName: string): boolean
    {
        const url = process.env[paramName];

        if ((url === undefined) || (url === ""))
            return true;

        const isValid = (url.trim().length > 0); // TODO: poor validation

        if (!isValid)
            this._log.Error(`.env variable "${paramName}" is not valid. Should be URL or EMPTY but is "${url}".`);

        return isValid;
    }
}
