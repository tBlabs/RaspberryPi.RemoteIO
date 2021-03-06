// These two imports must go first!
import 'reflect-metadata';
import { Types } from './Types';
import { Container } from 'inversify';
import { IEnvironment } from '../Services/Environment/IEnvironment';
import { Environment } from '../Services/Environment/Environment';
import { IRunMode } from '../Services/RunMode/IRunMode';
import { RunMode } from '../Services/RunMode/RunMode';
import { ILogger } from '../Services/Logger/ILogger';
import { Logger } from '../Services/Logger/Logger';
import { Main } from '../Main';
import { Host } from "../Host";
import { IStartupArgs } from '../Services/Environment/IStartupArgs';
import { StartupArgs } from '../Services/Environment/StartupArgs';
import { IDateTimeProvider, DateTimeProvider } from '../Services/DateTimeProvider/DateTimeProvider';
import { Config } from '../Services/Config/Config';
import { IConfig } from "../Services/Config/IConfig";
import { Repeater } from '../Services/Repeater/Repeater';
import { ConsoleOutput } from '../Services/Logger/ConsoleOutput';
import { ILoggerOutput } from "../Services/Logger/ILoggerOutput";
import { IShell } from '../Services/RemoteShell/IShell';
import { RemoteShell } from '../Services/RemoteShell/RemoteShell';
import { RemoteFs } from '../Services/RemoteFs/RemoteFs';
import { IFileSystem } from "../Services/RemoteFs/IFileSystem";
import { DigitalOutputs } from '../Peripherals/DigitalOutputs/DigitalOutputs';
import { FileSystem } from '../Services/RemoteFs/FileSystem';
import { Pwms } from '../Peripherals/Pwms/PwmOutputs';
import { DigitalInputs } from '../Peripherals/DigitalInputs/DigitalInputs';
import { PwmIoFactory } from "../Peripherals/Pwms/PwmIoFactory";
import { DigitalInputIoFactory } from '../Peripherals/DigitalInputs/DigitalInputIoFactory';
import { DigitalOutputFactory } from '../Peripherals/DigitalOutputs/DigitalOutputFactory';
import { EnvValidator } from '../Services/Environment/EnvValidator';

const IoC = new Container();

try
{
    IoC.bind<EnvValidator>(EnvValidator).toSelf().inTransientScope().whenTargetIsDefault();
    IoC.bind<IEnvironment>(Types.IEnvironment).to(Environment).inSingletonScope().whenTargetIsDefault();
    IoC.bind<IRunMode>(Types.IRunMode).to(RunMode).inSingletonScope().whenTargetIsDefault();
    IoC.bind<ILogger>(Types.ILogger).to(Logger).inSingletonScope().whenTargetIsDefault();
    IoC.bind<IShell>(Types.IShell).to(RemoteShell).inTransientScope().whenTargetIsDefault();
    IoC.bind<ILoggerOutput>(Types.ILoggerOutput).to(ConsoleOutput).inTransientScope().whenTargetIsDefault();
    IoC.bind<IStartupArgs>(Types.IStartupArgs).to(StartupArgs).inSingletonScope().whenTargetIsDefault();
    IoC.bind<IDateTimeProvider>(Types.IDateTimeProvider).to(DateTimeProvider).inTransientScope().whenTargetIsDefault();
    IoC.bind<Main>(Main).toSelf().inSingletonScope().whenTargetIsDefault();
    IoC.bind<Repeater>(Repeater).toSelf().inTransientScope().whenTargetIsDefault();
    IoC.bind<IConfig>(Types.IConfig).to(Config).inSingletonScope().whenTargetIsDefault();
    IoC.bind<Host>(Host).toSelf().inSingletonScope().whenTargetIsDefault();
    IoC.bind<DigitalInputIoFactory>(DigitalInputIoFactory).toSelf().inSingletonScope().whenTargetIsDefault();
    IoC.bind<DigitalInputs>(DigitalInputs).toSelf().inSingletonScope().whenTargetIsDefault();
    IoC.bind<DigitalOutputFactory>(DigitalOutputFactory).toSelf().inSingletonScope().whenTargetIsDefault();
    IoC.bind<DigitalOutputs>(DigitalOutputs).toSelf().inSingletonScope().whenTargetIsDefault();
    IoC.bind<PwmIoFactory>(PwmIoFactory).toSelf().inSingletonScope().whenTargetIsDefault();
    IoC.bind<Pwms>(Pwms).toSelf().inSingletonScope().whenTargetIsDefault();

    if (process.env.REMOTE_SHELL)
    {
        console.log('[REMOTE MODE: Using RemoteShell]');
        IoC.bind<IFileSystem>(Types.IFileSystem).to(RemoteFs).inTransientScope().whenTargetIsDefault();
    }
    else  
    { 
        // console.log('Using internal Shell');
        IoC.bind<IFileSystem>(Types.IFileSystem).to(FileSystem).inTransientScope().whenTargetIsDefault();
    }
}
catch (ex)
{
    console.log('IoC exception:', ex);
}

export { IoC };
