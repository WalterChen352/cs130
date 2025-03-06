import APP_TRANSPORTATION_MODES ,{ TransportationMode } from '../models/TransportationMode';

/**
 * List of `TransportationMode` objects: Walk/Bus/Bike/Car
 *
 * @type {TransportationMode[]}
 */

/**
 * Returns the list of Transportation Modes.
 *
 * @returns {TransportationMode[]} - The list of `TransportationMode` objects.
 */

/**
 * Returns a Transportation Mode by given id.
 *
 * @param {number} id - The id of `TransportationMode` object.
 * @returns {TransportationMode} - The `TransportationMode` object with given id.
 */
export const getTransportationMode = (id: number):TransportationMode => {
  for (const transportationMode of APP_TRANSPORTATION_MODES){
      if(transportationMode.id === id)
          return transportationMode;
  }
  return APP_TRANSPORTATION_MODES[0]; // default value
};

/**
 * Returns a `TransportationMode` object with certain display name.
 *
 * @param {string} name - The display name of `TransportationMode` object.
 * @returns {TransportationMode} - The `TransportationMode` object with given name.
 */
 export const getTransportationModeByName = (name: string):TransportationMode => {
  for (const transportationMode of APP_TRANSPORTATION_MODES){
    if(transportationMode.name === name)
      return transportationMode;
  }
  return APP_TRANSPORTATION_MODES[0]; // default value
};

/**
 * Returns a `TransportationMode` object with certain GIS api name.
 *
 * @param {string} apiName - The GIS api name of the travel mode.
 * @returns {TransportationMode} - The `TransportationMode` object with given name.
 */
export const getTransportationModeByGisName = (apiName: string):TransportationMode => {
  const name = apiName.toLowerCase();
  for (const transportationMode of APP_TRANSPORTATION_MODES){
    if(transportationMode.apiName === name)
      return transportationMode;
  }
  return APP_TRANSPORTATION_MODES[0]; // default value
};