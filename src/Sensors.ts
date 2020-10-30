import { Gpio, BinaryValue } from 'onoff';
import { injectable } from 'inversify';

export interface ISensors
{
    StateAsString: string;
    Sensor1State: number;
    Sensor2State: number;
    SensorAChange(callback);
    SensorBChange(callback);
    Dispose();
}

@injectable()
export class Sensors implements ISensors
{
    private sensorAChangeCallback;
    private sensorBChangeCallback;

    private sensor1 = new Gpio(24, 'in', 'both', { debounceTimeout: 10 });
    private sensor2 = new Gpio(25, 'in', 'both', { debounceTimeout: 10 });

    constructor()
    {
        this.sensor1.watch((err, value: BinaryValue) =>
        {
            if (err) throw err;

            this.sensorAChangeCallback?.(value);
        });

        this.sensor2.watch((err, value: BinaryValue) =>
        {
            if (err) throw err;

            this.sensorBChangeCallback?.(value);
        });
    }
    
    public get StateAsString(): string
    {
        return "A: " + this.sensor1.readSync() ? "1" : "0"
            + "B: " + this.sensor2.readSync() ? "1" : "0";
    }

    public get Sensor1State(): number
    {
        return this.sensor1.readSync();
    }

    public get Sensor2State():  number
    {
        return this.sensor2.readSync();
    }

    public SensorAChange(callback)
    {
        this.sensorAChangeCallback = callback;
    }

    public SensorBChange(callback)
    {
        this.sensorBChangeCallback = callback;
    }

    public Dispose()
    {
        this.sensor1.unexport();
        this.sensor2.unexport();
    }
}