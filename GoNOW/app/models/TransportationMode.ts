
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
   * Name of the transportation mode.
   *
   * @type {string}
   */
  name: string;
  
  /**
   * Name of the transportation mode for goole map
   *
   * @type {string}
   */
  google: string;

  
  /**
   * Creates an instance of TransportationMode class.
   *
   * @constructor
   * @param {number} id - The unique id for the Transportation mode.
   * @param {string} name - The name of the Transportation mode
   * @param {string} google - The google API prameter name for the Transportation mode.
   */
  constructor(id: number, name: string, google: string) {
    this.id = id;
    this.name = name;
    this.google = google;
  }
}

export default TransportationMode;