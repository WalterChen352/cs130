import { TransportationMode } from '../models/TransportationMode';

/**
 * List of `TransportationMode` objects: Walk/Bus/Bike/Car
 *
 * @type {TransportationMode[]}
 */
export const listTransportationModes: TransportationMode[] = [
  new TransportationMode(0, '', ''),           // no need Transportation
  new TransportationMode(1, 'Walk', "walking"),
  new TransportationMode(2, 'Bus',  "transit"),
  new TransportationMode(3, 'Bike', "bicycling"),
  new TransportationMode(4, 'Car',  "driving"),
];

/**
 * Returns the list of Transportation Modes.
 *
 * @returns {TransportationMode[]} - The list of `TransportationMode` objects.
 */
export const getTransportationModes = ():TransportationMode[] => {
  return listTransportationModes;
};

/**
 * Returns a Transportation Mode by given id.
 *
 * @param {number} id - The id of `TransportationMode` object.
 * @returns {TransportationMode} - The `TransportationMode` object with given id.
 */
export const getTransportationMode = (id: number):TransportationMode => {
  for (const transportationMode of listTransportationModes){
      if(transportationMode.id === id)
          return transportationMode;
  }
  return listTransportationModes[0]; // default value
};