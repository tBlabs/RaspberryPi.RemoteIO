import { OutputConfigEntry } from "../../Peripherals/DigitalOutputs/DigitalOutputConfigEntry";
import { PwmConfigEntry } from "../../Peripherals/Pwms/PwmConfigEntry";
import { DigitalInputConfigEntry } from "../../Peripherals/DigitalInputs/DigitalInputConfigEntry";

export interface IConfig
{
    SimulationMode: any;
    Raw: string;
    LogsLevel: number;
    Port: number;
    Inputs: DigitalInputConfigEntry[];
    Outputs: OutputConfigEntry[];
    Pwms: PwmConfigEntry[];
    ConfigFileDir: string;
    Init(): Promise<void>;
}
