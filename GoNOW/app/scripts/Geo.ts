import * as ExpoLocation from 'expo-location';
import { Platform } from 'react-native';

import Route from '../models/Geo';
import { Coordinates, Location } from '../models/Location';
import { GOOGLE_API_KEY } from '../scripts/Config';
import TransportationMode from '../models/TransportationMode';

/**
 * Returns current geolocation of the user.
 * Returns null if the user denied access to the phone geolocation.
 *
 * @async
 * @returns {Promise<Location | null>} - A promise that resolves to `Location` object or null.
 */
export const getMyLocation = async (): Promise<Location | null> => {
  try {
    const { status } = await ExpoLocation.requestForegroundPermissionsAsync();
    if (status === ExpoLocation.PermissionStatus.GRANTED) {
      const { coords } = await ExpoLocation.getCurrentPositionAsync({});
      const { latitude, longitude } = coords;
      const coordinates = new Coordinates(latitude, longitude)
      const location = new Location(
        coordinates,
        await getAddressByCoordinates(coordinates)
      );
      return location;
    } else {
      console.log('Permission to access location was denied');
    }
  } catch (error) {
    console.log('Error fetching location:', error);
  }
  return null;
};

/**
 * Get address by given coordinates.
 *
 * @async
 * @param {Coordinates} coordinates - The coordinates given to define address.
 * @returns {Promise<string>} - The address on given coordinates.
 */
export const getAddressByCoordinates = async (coordinates: Coordinates): Promise<string> => {
  try {
    const reverseGeocode = await ExpoLocation.reverseGeocodeAsync(coordinates);
    if (reverseGeocode.length > 0) {
      const address = Platform.select({
        ios: `${String(reverseGeocode[0].streetNumber)} ${String(reverseGeocode[0].street)}, ${String(reverseGeocode[0].city)}, ${String(reverseGeocode[0].region)} ${String(reverseGeocode[0].postalCode)}, ${String(reverseGeocode[0].country)}`,
        android: String(reverseGeocode[0].formattedAddress) || '',
        default: ''
      });
      return address;
    }
  } catch (error) {
    console.log('Error fetching location:', error);
  }
  return '';
};

/**
 * Generic cache for storing and retrieving data of any type T.
 * Is used for storing location data in order to optimize API queries
 * and reduce redundant computations.
 *
 * @class Cache
 * @typedef {Cache}
 * @template T - The type of values stored in the cache.
 */
class Cache<T> {

  /**
   * Internal storage for cached data, indexed by string keys.
   *
   * @private
   * @type {Record<string, T>}
   */
  private cache: Record<string, T> = {};

  /**
   * Retrieves a cached value by a specified key.
   *
   * @param {string} key - The cache key associated with the value.
   * @returns {T} - The cached value if found by the key, otherwise `undefined`.
   */
  get(key: string): T {
    return this.cache[key];
  }

  /**
   * Stores a value in the cache under a specified key.
   *
   * @param {string} key - The specified key under which the value will be stored.
   * @param {T} value - The value that will be cached.
   */
  set(key: string, value: T): void {
    this.cache[key] = value;
  }

  /**
   * Removes an entry from cache by a specified key.
   *
   * @param {string} key - The key of the entry to remove from the cache.
   */
  delete(key: string): void {
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    delete this.cache[key];
  }

  /**
   * Checks whether a specified key exists in the cache.
   *
   * @param {string} key - The key to check for existence.
   * @returns {boolean} `true` if the key exists in the cache, otherwise `false`.
   */
  has(key: string): boolean {
    return key in this.cache;
  }

  /** Clears all entries in the cache. */
  clear(): void {
    this.cache = {};
  }
}

/**
 * Storage for cached routes.
 *
 * @type {Cache<{}>}
 */
const routeCache = new Cache<Route[]>(); // Singleton

/**
 * Approximates the distance between two geographical coordinates in feet.
 * For small distances only (up to few miles.)
 * 
 * @param {Coordinates} x - The first coordinate (latitude and longitude).
 * @param {Coordinates} y - The second coordinate (latitude and longitude).
 * @returns {number} - The approximate distance between the two points in feet.
 */
export const approxDistanceFeets = (x: Coordinates, y: Coordinates): number => {
  // The function uses a simple planar projection (no Earth's curvature used).
  const toRadians = (degrees: number) => degrees * (Math.PI / 180);
  // https://www.usgs.gov/faqs/how-much-distance-does-a-degree-minute-and-second-cover-your-maps
  const oneDegToFeet = 364000;

  const deltaLat = (y.latitude - x.latitude) * oneDegToFeet;
  // Longitude value is corrected to compensate the compression effect near poles.
  const deltaLon = (y.longitude - x.longitude) * oneDegToFeet * Math.cos(toRadians(x.latitude));

  return Math.sqrt(deltaLat ** 2 + deltaLon ** 2);
}

/**
 * Retrieves a route between two geografical coordinates
 * with the specified transportation mode.
 *
 * @async
 * @param {Coordinates} departure - The starting Coordinates of the route.
 * @param {Coordinates} destination - The ending Coordinates of the route.
 * @param {TransportationMode} transportationMode - The TransportationMode that api has (e.g., walking, driving, biking).
 * @returns {Promise<Route[] | null>} - A promise that resolves to an array of possible routes,
 * or `null` if no route is found.
 * @throws Error if request to GIS api was unsuccessful.
 */
export const getRoute = async (
  departure: Coordinates,
  destination: Coordinates,
  transportationMode: TransportationMode
): Promise<Route[] | null> => {
  // https://www.usgs.gov/faqs/how-much-distance-does-a-degree-minute-and-second-cover-your-maps
  const keySensitivity = 4; // 0.0001° ~ 36 feet.
  const cacheKey: string = 
      `${departure.latitude.toFixed(keySensitivity).toString()};`
    + `${departure.longitude.toFixed(keySensitivity).toString()};`
    + `${destination.latitude.toFixed(keySensitivity).toString()};`
    + `${destination.longitude.toFixed(keySensitivity).toString()};`
    + transportationMode.apiName;
  if (routeCache.has(cacheKey)) {
    return routeCache.get(cacheKey);
  }
  if (GOOGLE_API_KEY === '') {
    console.error("ERROR Map.getRoute failed: GOOGLE_API_KEY not set.");
    return null;
  }
  const params: string [] = [
    `?origin=${departure.latitude.toString()},${departure.longitude.toString()}`,
    `&destination=${destination.latitude.toString()},${destination.longitude.toString()}`,
    `&mode=${transportationMode.apiName}`,
    `&key=${GOOGLE_API_KEY}`
  ];
  const url = `https://maps.googleapis.com/maps/api/directions/json${params.join('')}`;

  console.log("-------------------------------------------------------------------------------------");
  console.log("ROUTE REUEST: ", url);
  console.log("-------------------------------------------------------------------------------------");

  try {
    const response = await fetch(url);
    const data = (await response.json()) as { 
      routes: Route[], status: string, error_message?: string };
    if (data.status === 'OK') {
      routeCache.set(cacheKey, data.routes);
      return data.routes;
    } else {
      throw new Error(data.error_message ?? 'Could not build route');
    }
  } catch (error) {
    console.error("ERROR Map.getRoute: ", error);
  }
  return null;
};