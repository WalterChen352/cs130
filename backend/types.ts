export type SchedulingStyle={
    id: number
    name: string
}

export type Event={
    id: number;
    name: string;
    description: string;
    startTime: string
    endTime: string
    location: Location
    transportationMode: string;
    workflow?: number
}

export type Workflow={
    id: number,
    name: string
    color: string;
    pushNotifications: boolean;
    timeStart: Time;
    timeEnd: Time
    daysOfWeek: boolean[],
    schedulingStyle: SchedulingStyle|null
}

export type Location={
    longitude: number,
    latitude: number
}

export type Time={
    Hours: number,
    Minutes: number
}