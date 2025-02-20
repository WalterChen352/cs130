import { SchedulingStyle } from './SchedulingStyle';
import { Time } from './Time';

export class Workflow {
    id: number;
    name: string;
    color: string;
    pushNotifications: boolean;
    timeStart: Time;
    timeEnd: Time;
    daysOfWeek: boolean[]; // bit mask
    schedulingStyle: SchedulingStyle;

    constructor(id: number, name: string, color: string,
                pushNotifications: boolean,
                timeStart: Time, timeEnd: Time, daysOfWeekMask: boolean[],
                schedulingStyle: SchedulingStyle) {
        
        this.id = id;
        this.name = name;
        this.color = color;
        this.pushNotifications = pushNotifications;
        this.timeStart = timeStart;
        this.timeEnd = timeEnd;
        this.daysOfWeek = daysOfWeekMask;
        this.schedulingStyle = schedulingStyle;
    }
}