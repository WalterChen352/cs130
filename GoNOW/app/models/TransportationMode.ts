
/**
 * Represents the transportation mode with an identifier
 * and a name and customization for GIS.
 *
 * @export
 * @class TransportationMode
 * @typedef {TransportationMode}
 */
export interface TransportationMode {
  
  /**
   * Unique id of the transportation mode.
   *
   * @type {number}
   */
  id: number;
  
  /**
   * Name of the transportation mode in 'TransportationMode' class.
   *
   * @type {string}
   */
  name: string;
  
  /**
   * Name of the transportation mode for GIS
   *
   * @type {string}
   */
  apiName: string;

  /**
   * Route color.
   *
   * @type {string}
   */
  color: string;

   /**
   * Google maps transportation mode defined https://developers.google.com/maps/documentation/routes/reference/rest/v2/RouteTravelMode.
   *
   * @type {string}
   */
   googleMapsName: string;
  
  /**
   * Creates an instance of TransportationMode class.
   *
   * @constructor
   * @param {number} id - The unique id for the Transportation mode.
   * @param {string} name - The name of the Transportation mode
   * @param {string} apiName - The GIS API prameter name for the Transportation mode.
   * @param {string} [color='#0089FF'] - The color of the Transportation mode.
   */
}

const APP_TRANSPORTATION_MODES: TransportationMode[] = [
  // Google Map Names are outlined here https://developers.google.com/maps/documentation/routes/reference/rest/v2/RouteTravelMode
  {
    id: 0,
    name:'' ,
    apiName: '',
    color: '#666666',
    googleMapsName: ''
  } ,     // for cases when TransportationMode is not specified
  {
    id: 1,
    name: 'Walk',
    apiName: 'walking',
    color: '#9034c9',
    googleMapsName: 'WALK'
  } ,
  {
    id: 2,
    name: 'Transit',
    apiName: 'transit',
    color: '#ed7d31' ,
    googleMapsName: 'TRANSIT'
  } ,
  {
    id: 3,
    name: 'Bike',
    apiName: 'bicycling',
    color: '#88c934',
    googleMapsName: 'BICYCLE'
  } ,
  {
    id: 4 ,
    name: 'Car',
    apiName: 'driving',
    color: '#0089FF',
    googleMapsName: 'DRIVE'
  } 
];

export default APP_TRANSPORTATION_MODES;
