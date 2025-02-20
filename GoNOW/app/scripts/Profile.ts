import { openDatabase } from './Database';
import { Location, Coordinates } from '../models/Location';

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
      return new Location(
        new Coordinates( Number(row.lat), Number(row.lon)), row.address);
    }
    return null;
  }
  catch (error) {
      console.error('Error getting proflie Location', error);
      return null;
  }
};

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
      location.Address,
      location.Coordinates.Latitude,
      location.Coordinates.Longitude
    ]
    );
  } catch (error) {
    console.error('Error updating proflie Location:', error);
  }
};