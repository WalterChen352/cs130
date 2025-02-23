/**
 * Represents geographic coordinates with latitude and longitude.
 */
export class Coordinates {

  /** The latitude component of the coordinates. */
  Latitude: number;

  /** The longitude component of the coordinates. */
  Longitude: number;

  /**
   * Creates an instance of the Coordinates class.
   * @param lat - The latitude component of the coordinates.
   * @param log - The longitude component of the coordinates.
   */
  constructor(lat: number, log: number) {
    this.Latitude = lat;
    this.Longitude = log;
  }

  /**
   * Converts the coordinates to a string in the format `Latitude;Longitude`.
   * @returns The coordinates as a string in `Latitude;Longitude` format.
   */
  toString(): string {
    return `${String(this.Latitude)};${String(this.Longitude)}`;
  }
}

/**
 * Represents a location with geographic coordinates and an address.
 */
export class Location {
  
  /** The geographic coordinates (latitude and longitude) of the location. */
  Coordinates: Coordinates;

  /** The address associated with the location. */
  Address: string;

  /**
   * Creates an instance of the Location class.
   * @param coords - The geographic coordinates (latitude and longitude) of the location.
   * @param address - The address associated with the location.
   */
  constructor(coords: Coordinates, address: string) {
    this.Coordinates = coords;
    this.Address = address;
  }

  /**
   * Converts the location to a string in the format `[Latitude;Longitude] Address`.
   * @returns - The location as a string combining the coordinates and address.
   */
  toString(): string {
    return `[${String(this.Coordinates.Latitude)};${String(this.Coordinates.Longitude)}] ${String(this.Address)}`;
  }
}

export default Coordinates;