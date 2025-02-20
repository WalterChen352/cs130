export class Coordinates {
  Latitude: number;
  Longitude: number;

  constructor(lat: number, log: number) {
    this.Latitude = lat;
    this.Longitude = log;
  }

  toString(): string {
    return `${String(this.Latitude)};${String(this.Longitude)}`;
  }
}

export class Location {
  Coordinates: Coordinates;
  Address: string;

  constructor(coords: Coordinates, address: string) {
    this.Coordinates = coords;
    this.Address = address;
  }

  toString(): string {
    return `[${String(this.Coordinates.Latitude)};${String(this.Coordinates.Longitude)}] ${String(this.Address)}`;
  }
}

export default Coordinates;