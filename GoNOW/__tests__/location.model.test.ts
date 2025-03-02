import {Coordinates, Location} from '../app/models/Location';

describe('Model Coordinates', () => {
  test('should create a Coordinates instance', () => {
    const coords = new Coordinates(33, 44);
    expect(coords).toBeInstanceOf(Coordinates);
    expect(coords.latitude).toBe(33);
    expect(coords.longitude).toBe(44);
  });

  test('should create a Coordinates instance negative and real', () => {
    const coords = new Coordinates(33, -44.044);
    expect(coords).toBeInstanceOf(Coordinates);
    expect(coords.latitude).toBe(33);
    expect(coords.longitude).toBe(-44.044);
  });

  test('should return correct string representation from toString()', () => {
    const coords = new Coordinates(33, 44);
    expect(coords.toString()).toBe('33;44');
  });

  test('should return correct string real representation from toString()', () => {
    const coords = new Coordinates(33.033, 44.044);
    expect(coords.toString()).toBe('33.033;44.044');
  });

  test('should return correct string negative representation from toString()', () => {
    const coords = new Coordinates(-33.033, -44.044);
    expect(coords.toString()).toBe('-33.033;-44.044');
  });
});

describe('Model Location', () => {
  test('should create a Location instance', () => {
    const coords = new Coordinates(33.033, -44.044);
    const location = new Location(coords, '7400 Boelter Hall, Los Angeles, CA 90095');
    
    expect(location).toBeInstanceOf(Location);
    expect(location.coordinates).toBe(coords);
    expect(location.address).toBe('7400 Boelter Hall, Los Angeles, CA 90095');
  });

  test('should return correct string representation from toString()', () => {
    const coords = new Coordinates(33.033, -44.044);
    const location = new Location(coords, '7400 Boelter Hall, Los Angeles, CA 90095');
    
    expect(location.toString()).toBe('[33.033;-44.044] 7400 Boelter Hall, Los Angeles, CA 90095');
  });
});