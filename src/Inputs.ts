import { injectable } from "inversify";
import { Gpio } from "pigpio";

@injectable()
export class Inputs
{
    public async Init()
    {
        const button = new Gpio(23, {
            mode: Gpio.INPUT,
            pullUpDown: Gpio.PUD_DOWN,
            edge: Gpio.EITHER_EDGE
          });
           
          button.on('interrupt', (level) => {
            console.log('LVL', level);
            // led.digitalWrite(level);
          });
    }
    
    public OnChange(callback)
    {

    }
}