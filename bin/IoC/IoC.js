"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// These two imports must go first!
require("reflect-metadata");
const Types_1 = require("./Types");
const inversify_1 = require("inversify");
const Environment_1 = require("../Services/Environment/Environment");
const RunMode_1 = require("../Services/RunMode/RunMode");
const Logger_1 = require("../Services/Logger/Logger");
const Main_1 = require("../Main");
const Host_1 = require("../Host");
const StartupArgs_1 = require("../Services/Environment/StartupArgs");
const DateTimeProvider_1 = require("../Services/DateTimeProvider/DateTimeProvider");
const Config_1 = require("../Services/Config/Config");
const Repeater_1 = require("../Services/Repeater/Repeater");
const ConsoleOutput_1 = require("../Services/Logger/ConsoleOutput");
const RemoteShell_1 = require("../Services/RemoteShell/RemoteShell");
const RemoteFs_1 = require("../Services/RemoteFs/RemoteFs");
const Outputs_1 = require("../Outputs");
const FileSystem_1 = require("../Services/RemoteFs/FileSystem");
const IoC = new inversify_1.Container();
exports.IoC = IoC;
try {
    IoC.bind(Types_1.Types.IEnvironment).to(Environment_1.Environment).inSingletonScope().whenTargetIsDefault();
    IoC.bind(Types_1.Types.IRunMode).to(RunMode_1.RunMode).inSingletonScope().whenTargetIsDefault();
    IoC.bind(Types_1.Types.ILogger).to(Logger_1.Logger).inSingletonScope().whenTargetIsDefault();
    IoC.bind(Types_1.Types.IShell).to(RemoteShell_1.RemoteShell).inTransientScope().whenTargetIsDefault();
    IoC.bind(Types_1.Types.ILoggerOutput).to(ConsoleOutput_1.ConsoleOutput).inTransientScope().whenTargetIsDefault();
    IoC.bind(Types_1.Types.IStartupArgs).to(StartupArgs_1.StartupArgs).inSingletonScope().whenTargetIsDefault();
    IoC.bind(Types_1.Types.IDateTimeProvider).to(DateTimeProvider_1.DateTimeProvider).inTransientScope().whenTargetIsDefault();
    IoC.bind(Main_1.Main).toSelf().inSingletonScope().whenTargetIsDefault();
    IoC.bind(Repeater_1.Repeater).toSelf().inTransientScope().whenTargetIsDefault();
    IoC.bind(Types_1.Types.IConfig).to(Config_1.Config).inSingletonScope().whenTargetIsDefault();
    IoC.bind(Host_1.Host).toSelf().inSingletonScope().whenTargetIsDefault();
    IoC.bind(Outputs_1.Outputs).toSelf().inSingletonScope().whenTargetIsDefault();
    if (process.env.USE_REMOTE_SHELL) {
        // console.log('Using RemoteShell');
        IoC.bind(Types_1.Types.IFileSystem).to(RemoteFs_1.RemoteFs).inTransientScope().whenTargetIsDefault();
    }
    else {
        // console.log('Using internal Shell');
        IoC.bind(Types_1.Types.IFileSystem).to(FileSystem_1.FileSystem).inTransientScope().whenTargetIsDefault();
    }
}
catch (ex) {
    console.log('IoC exception:', ex);
}
//# sourceMappingURL=IoC.js.map