export interface SchedulingStyle {
    id: number
    name: string
}

export interface Event {
    id: number;
    name: string;
    description: string;
    startTime: string
    endTime: string
    location: Location
    transportationMode: string;
    workflow?: number
}

export interface Workflow {
    id: number,
    name: string
    color: string;
    pushNotifications: boolean;
    timeStart: Time;
    timeEnd: Time
    daysOfWeek: boolean[],
    schedulingStyle: SchedulingStyle|null
}

export interface Location {
    longitude: number,
    latitude: number
}

export interface Time {
    Hours: number,
    Minutes: number
}