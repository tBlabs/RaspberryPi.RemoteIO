import { inject, injectable } from 'inversify';
import { Types } from '../../IoC/Types';
import { ILogger } from '../Logger/ILogger';
import { EnvValidatorBase } from './EnvValidatorBase';

@injectable()
export class EnvValidator extends EnvValidatorBase
{
    constructor(@inject(Types.ILogger) _log: ILogger)
    {
        super(_log);
    }

    public Validate(): boolean
    {
        const isEnvValid = super.MustBeDir('CONFIG_FILE_DIR')
            && super.MayBeUrl('REMOTE_SHELL');

        if (!isEnvValid)
            this._log.Error(`Can not start the application without correct value.`);

        return isEnvValid;
    }
}
