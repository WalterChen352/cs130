import { getLocation, updateLocation } from '../app/scripts/Profile';
import { Location, Coordinates } from '../app/models/Location';
import { openDatabase } from '../app/scripts/Database';

jest.mock('../app/scripts/Database', () => ({
  openDatabase: jest.fn(),
}));

const locationToDb = (location: Location) => ({
  id: 1,
  address: location.Address,
  lat: location.Coordinates.Latitude,
  lon: location.Coordinates.Longitude,
});

const mockLocation = new Location(
  new Coordinates(33.033, -44.044),
  '7400 Boelter Hall, Los Angeles, CA 90095'
);
const mockLocationDb = locationToDb(mockLocation);

describe('Profile Database', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('method getLocation should return location object from the database', async () => {
    const mockDb = {
      getAllAsync: jest.fn().mockResolvedValue([mockLocationDb]), // ✅ Simplest fix
    };

    (openDatabase as jest.Mock).mockResolvedValue(mockDb);

    const location = await getLocation();

    expect(location).not.toBeNull();

    if (location) {
      expect(location.Address).toBe(mockLocation.Address);
      expect(location.Coordinates.Latitude).toBe(mockLocation.Coordinates.Latitude);
      expect(location.Coordinates.Longitude).toBe(mockLocation.Coordinates.Longitude);
    }
  });

  test('method updateLocation should update profile location into the database', async () => {
    const mockDb = {
      runAsync: jest.fn().mockResolvedValue(undefined), // ✅ Simplest fix
    };

    (openDatabase as jest.Mock).mockResolvedValue(mockDb);

    await updateLocation(mockLocation);

    expect(mockDb.runAsync).toHaveBeenCalledWith(
      expect.stringContaining('UPDATE profile'),
      expect.arrayContaining([
        mockLocationDb.address,
        mockLocationDb.lat,
        mockLocationDb.lon,
      ])
    );
  });
});
