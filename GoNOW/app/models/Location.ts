/**
 * Represents geographic coordinates with latitude and longitude.
 */
export type Coordinates ={

  /** The latitude component of the coordinates. */
  latitude: number;

  /** The longitude component of the coordinates. */
  longitude: number;

  /**
   * Creates an instance of the Coordinates class.
   * @param lat - The latitude component of the coordinates.
   * @param log - The longitude component of the coordinates.
   */

}

/**
 * Represents a location with geographic coordinates and an address.
 */
export type Location = {
  
  /** The geographic coordinates (latitude and longitude) of the location. */
  coordinates: Coordinates;

  /** The address associated with the location. */
  address: string;

  /**
   * Creates an instance of the Location class.
   * @param coords - The geographic coordinates (latitude and longitude) of the location.
   * @param address - The address associated with the location.
   */
}

export default Coordinates;