import * as SQLite from 'expo-sqlite';
import { Event } from '../models/Event';

export const getDailyEvents = async(eventDate?: Date): Promise<Event[]> => {
  console.log('getting events for date:', eventDate);
  try {
    const DB = await SQLite.openDatabaseAsync('userEvents.db');
    console.log('db opened for daily events');
    
    const dateToUse = eventDate ?? new Date();
    
    const startOfDay = new Date(dateToUse);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(dateToUse);
    endOfDay.setHours(23, 59, 59, 999);

    const result = await DB.getAllAsync(`
      SELECT * FROM events 
      WHERE datetime(startTime) >= datetime(?)
      AND datetime(startTime) < datetime(?)
      ORDER BY startTime;
    `, [startOfDay.toISOString(), endOfDay.toISOString()]);

    console.log('Query result:', result);
    console.log('done txn');
    
    const events = result as Event[];
    return events;
  } catch (error) {
    console.error('error getting daily events', error);
    return [];
  }
};

export const clearEvents = async():Promise<void>=>{ //just for clearing local storage
  console.log('dropping events table');
  try{
      const DB = SQLite.openDatabaseSync('userEvents.db');
      await DB.execAsync(`PRAGMA journal_mode = WAL;
        DROP TABLE events;
        `);
      console.log('dropped table');
  }
  catch (error) {
    console.error(' error dropping table', error);
  }
  return new Promise(()=>{return;});
};

export const getWeeklyEvents = async(date:Date):Promise<Event[]>=>{
  console.log('getting weekly events for ', date);
  const startDate= new Date(date);
  const endDate = new Date(date);
  endDate.setDate(endDate.getDate()+7);
  console.log('searching for events between ', startDate.toISOString(), endDate.toISOString());
  try{
    const DB = await SQLite.openDatabaseAsync('userEvents.db');
    const result = await DB.getAllAsync(` SELECT * FROM events 
    WHERE startTime >= datetime(?) AND startTime < datetime(?) 
    ORDER BY startTime;
`, [startDate.toISOString(),endDate.toISOString()]);
        //const result = await DB.getAllAsync("SELECT * FROM events");
        console.log(result);
        const events = result as Event[];
        return events;
  }
  catch(error){
    console.error('error getting weekly evenets', error);
  }
  return [];
};

export const addEvent = async (e: Event):Promise<void> => {
  try {
      const DB = await SQLite.openDatabaseAsync('userEvents.db');
      console.log('db', DB);
      await DB.runAsync(`INSERT INTO events 
              (name, description, startTime, endTime, latitude, longitude, transportationMode) 
              VALUES (?, ?, ?, ?, ?, ?, ?);`, [e.name, e.description, e.startTime, e.endTime, e.latitude, e.longitude, e.transportationMode]);
  } catch (error) {
      console.error('Error in addEvent function:', error);
  }
  return new Promise(()=>{return;});
};