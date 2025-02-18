import { SchedulingStyle } from './SchedulingStyle';
import { Time } from './Time';

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
                timeStart: Time, timeEnd: Time, daysOfWeekMask: boolean[],
                schedulingStyle: SchedulingStyle) {
        
        this.Id = id;
        this.Name = name;
        this.Color = color;
        this.PushNotifications = pushNotifications;
        this.TimeStart = timeStart;
        this.TimeEnd = timeEnd;
        this.DaysOfWeek = daysOfWeekMask;
        this.SchedulingStyle = schedulingStyle;
    }
}