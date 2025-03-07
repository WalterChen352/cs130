export interface SchedulingStyle {
    id: number
    name: string
}

export interface Event {
    id: number;
    name: string;
    description: string;
    startTime: string;
    endTime: string;
    coordinates: Coordinates
    transportationMode: string;
    workflow: number|null;
}

export interface Workflow {
    id: number,
    name: string
    color: string;
    pushNotifications: boolean;
    timeStart: Time;
    timeEnd: Time
    daysOfWeek: boolean[],
    schedulingStyle: SchedulingStyle
}

export interface Coordinates {
    longitude: number,
    latitude: number
}

export interface Time {
    Hours: number,
    Minutes: number
}