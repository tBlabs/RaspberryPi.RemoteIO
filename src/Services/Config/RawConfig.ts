import { OutputConfigEntry } from "../../Peripherals/DigitalOutputs/DigitalOutputConfigEntry";
import { PwmConfigEntry } from "../../Peripherals/Pwms/PwmConfigEntry";
import { DigitalInputConfigEntry } from "../../Peripherals/DigitalInputs/DigitalInputConfigEntry";


export interface RawConfig
{
    port: number;
    logsLevel: number;
    inputs: DigitalInputConfigEntry[];
    outputs: OutputConfigEntry[];
    pwms: PwmConfigEntry[];
}
