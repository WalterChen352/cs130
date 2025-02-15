export class Coordinates {
  Latitude: number;
  Longitude: number;

  constructor(lat: number, log: number) {
    this.Latitude = lat;
    this.Longitude = log;
  }

  toString(): string {
    return `${this.Latitude};${this.Longitude}`;
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
    return `[${this.Coordinates.Latitude};${this.Coordinates.Longitude}] ${this.Address}`;
  }
}

export default Coordinates;