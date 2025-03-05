import {Coordinates, Location} from '../app/models/Location';

describe('Model Coordinates', () => {
  test('should create a Coordinates instance', () => {
    const coords={latitude: 33,longitude:44} as Coordinates;
    expect(coords.latitude).toBe(33);
    expect(coords.longitude).toBe(44);
  });

  test('should create a Coordinates instance negative and real', () => {
    const coords={latitude: 33,longitude:-44.044} as Coordinates;
    expect(coords.latitude).toBe(33);
    expect(coords.longitude).toBe(-44.044);
  });


describe('Model Location', () => {
  test('should create a Location instance', () => {
    const coords={latitude: 33.033,longitude:-44.044} as Coordinates
    const location = new Location(coords, '7400 Boelter Hall, Los Angeles, CA 90095');
    
    expect(location).toBeInstanceOf(Location);
    expect(location.coordinates).toBe(coords);
    expect(location.address).toBe('7400 Boelter Hall, Los Angeles, CA 90095');
  });

  test('should return correct string representation from toString()', () => {
    const coords={latitude: 33.033,longitude:-44.044} as Coordinates
    const location = new Location(coords, '7400 Boelter Hall, Los Angeles, CA 90095');
    
    expect(location.toString()).toBe('[33.033;-44.044] 7400 Boelter Hall, Los Angeles, CA 90095');
  });
});
});