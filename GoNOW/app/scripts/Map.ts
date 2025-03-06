import { Event } from '../models/Event';
import { Coordinates } from '../models/Location';
import { TransportationMode } from '../models/TransportationMode';
import { Workflow } from '../models/Workflow';
import { getDailyEvents } from '../scripts/Event';
import { getTransportationMode, getTransportationModeByName } from '../scripts/TransportationMode';
import { getWorkflowById } from '../scripts/Workflow';

/**
 * Represents an event on the map as a point with details
 * such as time, location, and status.
 *
 * @export
 * @interface IMapEvent
 * @typedef {IMapEvent}
 */
export interface IMapEvent {
  /**
   * Unique identifier for the event.
   *
   * @type {number}
   */
  id: number;

  /**
   * Name of the event.
   *
   * @type {string}
   */
  name: string;

  /**
   * Description providing additional details about the event.
   *
   * @type {string}
   */
  description: string;

  /**
   * Start time of the event.
   *
   * @type {Date}
   */
  startTime: Date;

  /**
   * End time of the event.
   *
   * @type {Date}
   */
  endTime: Date;

  /**
   * Coordinates of the event location.
   *
   * @type {Coordinates}
   */
  coordinates: Coordinates;

  /**
   * Transportation mode associated with the event.
   *
   * @type {TransportationMode}
   */
  transportationMode: TransportationMode;

  /**
   * Workflow associated with the event, or `null` if not defined.
   *
   * @type {(Workflow | null)}
   */
  workflow: Workflow | null;
}

/**
 * Converts an `Event` object into an `IMapEvent` object.
 * 
 * @async
 * @param {Event} event - The event object to be converted.
 * @returns {Promise<IMapEvent>} - A promise that resolves to an `IMapEvent` object.
 */
const convertToMapEvent = async (event: Event): Promise<IMapEvent> => {
  const coords: Coordinates = event.coordinates;
  const transportationMode: TransportationMode =
    event.transportationMode !== '' && !isNaN(Number(event.transportationMode))
    ? getTransportationMode(parseInt(event.transportationMode))
    : getTransportationModeByName(event.transportationMode);
  const workflow: Workflow | null = 
    event.workflow !== null
    ? await getWorkflowById(event.workflow)
    : null;

  const mapEvent: IMapEvent = {
    id: event.id,
    name: event.name,
    description: event.description,
    startTime: new Date(event.startTime),
    endTime: new Date(event.endTime),
    coordinates: coords,
    transportationMode: transportationMode,
    workflow: workflow
  };
  return mapEvent;
};

/**
 * Adapter gets Today Events and converts them to IMapEvents
 * in order to render them on the Map screen.
 *
 * @async
 * @returns {Promise<IMapEvent[]>} - A list of IMapEvent ojects.
 */
export const MapEventAdapter = async (): Promise<IMapEvent[]> => {
  const events: Event[] = await getDailyEvents();
  const mapEvents: IMapEvent[] = await Promise.all(events.map(convertToMapEvent));
  return mapEvents;
}