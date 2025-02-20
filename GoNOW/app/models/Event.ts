/**
 * Represents an event with details such as name, description, time, location, and transportation mode.
 */
export class Event {
    /** The unique identifier for the event. */
    id: number;

    /** The name of the event. */
    name: string;

    /** A description of the event. */
    description: string;

    /** The start time of the event in string format. */
    startTime: string;

    /** The end time of the event in string format. */
    endTime: string;

    /** The latitude coordinate of the event's location. */
    latitude: number;

    /** The longitude coordinate of the event's location. */
    longitude: number;

    /** The mode of transportation to the event. */
    transportationMode: string;

    /** The workflow associated with the event (optional). */
    workflow?: string;

    /**
     * Creates an instance of the Event class.
     * 
     * @param name - The name of the event.
     * @param description - A description of the event.
     * @param startTime - The start time of the event in string format.
     * @param endTime - The end time of the event in string format.
     * @param latitude - The latitude coordinate of the event's location.
     * @param longitude - The longitude coordinate of the event's location.
     * @param transportationMode - The mode of transportation to the event.
     * @param workflow - The workflow associated with the event (optional).
     */
    constructor(name: string, description: string, startTime: string, endTime: string, latitude: number, longitude: number, transportationMode: string, workflow: string) {
        this.id = 0;
        this.name = name;
        this.description = description;
        this.startTime = startTime;
        this.endTime = endTime;
        this.latitude = latitude;
        this.longitude = longitude;
        this.transportationMode = transportationMode;
        this.workflow = workflow;
    }
}