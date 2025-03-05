import { TransportationMode } from '../models/TransportationMode';

/**
 * List of `TransportationMode` objects: Walk/Bus/Bike/Car
 *
 * @type {TransportationMode[]}
 */
export const listTransportationModes: TransportationMode[] = [
  // Google Map Names are outlined here https://developers.google.com/maps/documentation/routes/reference/rest/v2/RouteTravelMode
  new TransportationMode(0, '', '', '#666666', ''),           // no need Transportation
  new TransportationMode(1, 'Walk', "walking", '#9034c9', 'WALK'),
  new TransportationMode(2, 'Transit',  "transit",'#ed7d31', 'TRANSIT'),
  new TransportationMode(3, 'Bike', "bicycling", '#88c934', 'BICYCLE'),
  new TransportationMode(4, 'Car',  "driving", '#0089FF', 'DRIVE'),
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

/**
 * Returns a `TransportationMode` object with certain display name.
 *
 * @param {string} name - The display name of `TransportationMode` object.
 * @returns {TransportationMode} - The `TransportationMode` object with given name.
 */
export const getTransportationModeByName = (name: string):TransportationMode => {
  for (const transportationMode of listTransportationModes){
    if(transportationMode.name === name)
      return transportationMode;
  }
  return listTransportationModes[0]; // default value
};

/**
 * Returns a `TransportationMode` object with certain GIS api name.
 *
 * @param {string} apiName - The GIS api name of the travel mode.
 * @returns {TransportationMode} - The `TransportationMode` object with given name.
 */
export const getTransportationModeByGisName = (apiName: string):TransportationMode => {
  const name = apiName.toLowerCase();
  for (const transportationMode of listTransportationModes){
    if(transportationMode.apiName === name)
      return transportationMode;
  }
  return listTransportationModes[0]; // default value
};