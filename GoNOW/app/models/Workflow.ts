import { SchedulingStyle } from './SchedulingStyle';
import { Time } from './Time';

/**
 * Represents a workflow with scheduling details, notifications, and style.
 */
export class Workflow {

    /** Unique id for the workflow. */
    id: number;

    /** Name of the workflow. */
    name: string;

    /** Color associated with the workflow in #RRGGBB format. */
    color: string;

    /** Whether push notifications are enabled for the workflow. */
    pushNotifications: boolean;

    /** Start time of the workflow. */
    timeStart: Time;

    /** End time of the workflow. */
    timeEnd: Time;

    /**
     * A bitmask representing the days of week then the workflow is active.
     * Each element in the array corresponds to a day of the week (Sunday to Saturday).
     * `true` indicates the workflow is active on that day, `false` indicates it is not.
     */
    daysOfWeek: boolean[];

    /** The scheduling style of the workflow representing how it should be scheduled in autoscheduling mode. */
    schedulingStyle: SchedulingStyle;

    /**
     * Creates an instance of the Workflow class.
     * @param id - The unique id for the workflow.
     * @param name - The name of the workflow.
     * @param color - The color associated with the workflow.
     * @param pushNotifications - The flag indicating whether push notifications are enabled for the workflow.
     * @param timeStart - The start time of the workflow.
     * @param timeEnd - The end time of the workflow.
     * @param daysOfWeekMask - The bitmask array representing the days of the week the workflow is active.
     * @param schedulingStyle - The scheduling style for the workflow.
     */
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