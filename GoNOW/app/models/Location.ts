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
export class Location {
  
  /** The geographic coordinates (latitude and longitude) of the location. */
  coordinates: Coordinates;

  /** The address associated with the location. */
  address: string;

  /**
   * Creates an instance of the Location class.
   * @param coords - The geographic coordinates (latitude and longitude) of the location.
   * @param address - The address associated with the location.
   */
  constructor(coords: Coordinates, address: string) {
    this.coordinates = coords;
    this.address = address;
  }

  /**
   * Converts the location to a string in the format `[Latitude;Longitude] Address`.
   * @returns - The location as a string combining the coordinates and address.
   */
  toString(): string {
    return `[${String(this.coordinates.latitude)};${String(this.coordinates.longitude)}] ${String(this.address)}`;
  }
}

export default Coordinates;