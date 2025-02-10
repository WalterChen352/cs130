import { SchedulingStyle, FindSchedulingStyleById } from "./SchedulingStyle";
import { Time } from "./Time";

export class Workflow {
    Id: number;
    Name: string;
    Color: string;
    PushNotifications: boolean;
    TimeStart: Time;
    TimeEnd: Time;
    DaysOfWeek: boolean[]; // bit mask
    SchedulingStyle: SchedulingStyle;

    constructor(id: number, name: string, color: string,
                pushNotifications: boolean,
                timeStartInMinutes: Time, timeEndInMinutes: Time,
                daysOfWeekMask: boolean[], schedulingStyle: SchedulingStyle) {
        
        this.Id = id;
        this.Name = name;
        this.Color = color;
        this.PushNotifications = pushNotifications;
        this.TimeStart = timeStartInMinutes;
        this.TimeEnd = timeEndInMinutes;
        this.DaysOfWeek = daysOfWeekMask;
        this.SchedulingStyle = schedulingStyle;
    }
}

export const NewWorkflow = () => {
    return new Workflow(0, "", "#d5f9cf",
                    false, new Time(9*60), new Time(10*60),
                    new Array(7).fill(false), FindSchedulingStyleById(0)
    );
}