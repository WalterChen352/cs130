import { SchedulingStyle } from '../models/SchedulingStyle';

export const listSchedulingStyles = [
    new SchedulingStyle(0, 'Schedule close together'),
    new SchedulingStyle(1, 'Schedule with max buffer')
];

export const getSchedulingStyles = ():SchedulingStyle[] => {
    return listSchedulingStyles;
};
export const getSchedulingStyle = (id: number):SchedulingStyle => {
    for (const schedulingStyle of listSchedulingStyles){
        if(schedulingStyle.Id=== id)
            return schedulingStyle;
    }
    return listSchedulingStyles[0]; // default value
};