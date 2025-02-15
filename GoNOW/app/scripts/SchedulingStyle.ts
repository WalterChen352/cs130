import { SchedulingStyle } from "../models/SchedulingStyle";

export const listSchedulingStyles = [
    new SchedulingStyle(0, "Schedule close together"),
    new SchedulingStyle(1, "Schedule with max buffer")
];

export const getSchedulingStyles = async () => {
    return listSchedulingStyles;
}
export const getSchedulingStyle = async (id: number) => {
    for (let i=0; i < listSchedulingStyles.length; i++) {
        if (listSchedulingStyles[i].Id === id)
            return listSchedulingStyles[i];
    }
    return listSchedulingStyles[0]; // default value
}