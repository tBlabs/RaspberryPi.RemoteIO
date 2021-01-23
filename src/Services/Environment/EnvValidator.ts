import { inject, injectable } from 'inversify';
import { Types } from '../../IoC/Types';
import { ILogger } from '../Logger/ILogger';

@injectable()
export class EnvValidator
{
    constructor(@inject(Types.ILogger) private _log: ILogger) { }

    public Validate(): boolean
    {
        const isEnvValid = this.MustBeDir('CONFIG_FILE_DIR')
            && this.MayBeUrl('REMOTE_SHELL');

        if (!isEnvValid)
            this._log.Error(`Can not start the application without correct value.`);

        return isEnvValid;
    }

    private MustBeOneOf(paramName: string, options: string[]): boolean
    {
        const variable = process.env[paramName];

        const isValid = (variable !== undefined) && (options.includes(variable));

        if (!isValid)
            this._log.Error(`.env variable "${paramName}" is not valid. Should be ONE OF [${options.join(", ")}] but is "${variable}".`);

        return isValid;
    }

    private MustBeDir(paramName: string): boolean
    {
        const dir = process.env[paramName];

        const isValid = (dir !== undefined) && (dir.trim().length > 0); // TODO: poor validation

        if (!isValid)
            this._log.Error(`.env variable "${paramName}" is not valid. Should be DIRECTORY but is "${dir}".`);

        return isValid;
    }

    private MayBeUrl(paramName: string): boolean
    {
        const url = process.env[paramName];

        if ((url === undefined) || (url === "")) return true;

        const isValid = (url.trim().length > 0); // TODO: poor validation

        if (!isValid)
            this._log.Error(`.env variable "${paramName}" is not valid. Should be URL or EMPTY but is "${url}".`);

        return isValid;
    }
}
