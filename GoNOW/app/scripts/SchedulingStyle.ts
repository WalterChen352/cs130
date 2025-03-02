import { SchedulingStyle } from '../models/SchedulingStyle';

/**
 * List of `SchedulingStyle` objects.
 *
 * @type {{}}
 */
export const listSchedulingStyles = [
    new SchedulingStyle(0, 'Schedule close together'),
    new SchedulingStyle(1, 'Schedule with max buffer')
];

/**
 * Returns the list of Scheduling styles.
 *
 * @returns {SchedulingStyle[]} - The list of `SchedulingStyle` objects.
 */
export const getSchedulingStyles = ():SchedulingStyle[] => {
    return listSchedulingStyles;
};

/**
 * Returns a Scheduling style with certain Id.
 *
 * @param {number} id - The Id of `SchedulingStyle` object
 * @returns {SchedulingStyle} - The `SchedulingStyle` object with given Id.
 */
export const getSchedulingStyle = (id: number):SchedulingStyle => {
    for (const schedulingStyle of listSchedulingStyles){
        if(schedulingStyle.Id === id)
            return schedulingStyle;
    }
    return listSchedulingStyles[0]; // default value
};