import { getLocation, updateLocation } from '../app/scripts/Profile';
import { Location } from '../app/models/Location';
import { openDatabase } from '../app/scripts/Database';

jest.mock('../app/scripts/Database', () => ({
  openDatabase: jest.fn(),
}));

const locationToDb = (location: Location) => ({
  id: 1,
  address: location.address,
  lat: location.coordinates.latitude,
  lon: location.coordinates.longitude,
});

const mockLocation =
  {coordinates: {latitude:33.033, longitude:-44.044},
  address:'7400 Boelter Hall, Los Angeles, CA 90095'
  };
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
      expect(location.address).toBe(mockLocation.address);
      expect(location.coordinates.latitude).toBe(mockLocation.coordinates.latitude);
      expect(location.coordinates.longitude).toBe(mockLocation.coordinates.longitude);
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
