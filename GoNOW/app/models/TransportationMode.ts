
/**
 * Represents the transportation mode with an identifier
 * and a name and customization for GIS.
 *
 * @export
 * @class TransportationMode
 * @typedef {TransportationMode}
 */
export class TransportationMode {
  
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
  constructor(id: number, name: string, apiName: string, color = '#0089FF', googleMapsName: string) {
    this.id = id;
    this.name = name;
    this.apiName = apiName;
    this.color = color;
    this.googleMapsName=googleMapsName;
  }
}

export default TransportationMode;
