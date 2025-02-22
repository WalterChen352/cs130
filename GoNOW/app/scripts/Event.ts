import * as SQLite from 'expo-sqlite';
import { Event } from '../models/Event';
import { DB_NAME } from './Database';

export const getDailyEvents = async():Promise<Event[]>=>{
    console.log('getting events');
    try{
        const DB = await SQLite.openDatabaseAsync(DB_NAME);
        console.log('db opened for daily events');
        const result = await DB.getAllAsync(` SELECT * FROM events 
  WHERE date(startTime) = date('now', 'localtime')
  ORDER BY startTime;`);
        //const result = await DB.getAllAsync("SELECT * FROM events");
        console.log(result);
        console.log('done txn');
        const events = result as Event[];
        return events;
    }
    catch (error) {
        console.error('error getting daily events', error);
        return [];
    }
};

export const clearEvents = async():Promise<void>=>{ //just for clearing local storage
  console.log('dropping events table');
  try{
      const DB = SQLite.openDatabaseSync(DB_NAME);
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
    const DB = await SQLite.openDatabaseAsync(DB_NAME);
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
      const DB = await SQLite.openDatabaseAsync(DB_NAME);
      console.log('db', DB);
      await DB.runAsync(`INSERT INTO events 
              (name, description, startTime, endTime, latitude, longitude, transportationMode, workflow) 
              VALUES (?, ?, ?, ?, ?, ?, ?,?);`, [e.name, e.description, e.startTime, e.endTime, e.latitude, e.longitude, e.transportationMode, e.workflow]);
  } catch (error) {
      console.error('Error in addEvent function:', error);
  }
  return new Promise(()=>{return;});
};