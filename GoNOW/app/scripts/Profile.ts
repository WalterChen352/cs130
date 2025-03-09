import { openDatabase } from './Database';
import { Location} from '../models/Location';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Check if we have a UID header
 */
export const getUID = async (): Promise<number | null> => {
  try {
    const uid = await AsyncStorage.getItem('uid');
    if(uid !==null)
      return Number(uid);
    else
      return null;
  } catch (error) {
    console.error('AsyncStorage error:', error);
    return null;
  }
};

export const setUID = async (uid: number): Promise<void> => {
  try {
    await AsyncStorage.setItem('uid', uid.toString());
  } catch (error) {
    console.error('AsyncStorage error:', error);
  }
};


/**
 * Returns home geolocation of the user from DB.
 * Returns null if DB is not initialized.
 *
 * @async
 * @returns {Promise<Location | null>} - A promise that resolves to `Location` object or null.
 */
export const getLocation = async (): Promise<Location | null> => {
  //console.log("> Profile getLocation");
  try{
    const DB = await openDatabase();
    const rows = await DB.getAllAsync(`
      SELECT *
      FROM profile
      WHERE id = 1
      LIMIT 1;
    `);
    if (rows.length > 0) {
      const row = rows[0] as {lat: number, lon: number, address: string};
      return {
        coordinates:
        {latitude:Number(row.lat), longitude:Number(row.lon)} ,
        address: row.address};
    }
    return null;
  }
  catch (error) {
      console.error('Error getting proflie Location', error);
      return null;
  }
};

/**
 * Updates home geolocation of the user in DB if the record of location exists.
 * This method does not return any value.
 *
 * @async
 * @param {Location} location - The `Location` object
 * @returns {Promise<void>} - A promise that resolves when the geolocation is updated.
 */
export const updateLocation = async (location : Location): Promise<void> => {
  //console.log("> Profile updateLocation");
  try {
    const DB = await openDatabase();
    await DB.runAsync(`
      UPDATE profile
      SET 
        address = ?,
        lat = ?,
        lon = ?
      WHERE id = 1;
    `, [
      location.address,
      location.coordinates.latitude,
      location.coordinates.longitude
    ]
    );
  } catch (error) {
    console.error('Error updating proflie Location:', error);
  }
};