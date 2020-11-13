
export interface InputConfigEntry
{
    name: string;
    pin: number;
    pull: "none" | "up" | "down";
    edge: "both" | "rising" | "falling";
}
