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
    hours: number,
    minutes: number
}

const APP_SCHEDLING_STYLES:SchedulingStyle[]=[
    {id: 0, name: 'As soon as possible'}, {id:1, name: 'Limit one per day'}
  ] 
  
  export const SS_ASAP=APP_SCHEDLING_STYLES[0];
  export const SS_MAX_ONE=APP_SCHEDLING_STYLES[1];
  
  export default APP_SCHEDLING_STYLES;
