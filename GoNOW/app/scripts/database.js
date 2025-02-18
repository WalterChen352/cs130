import * as SQLite from 'expo-sqlite';

export const initializeDatabase = async () => {

  try {
    const DB = await SQLite.openDatabaseAsync('userEvents.db');
    await DB.execAsync(`PRAGMA journal_mode = WAL;
        CREATE TABLE IF NOT EXISTS events (
         id INTEGER PRIMARY KEY AUTOINCREMENT,
         name TEXT,
         description TEXT,
         startTime TEXT,
         endTime TEXT,
         latitude REAL,
         longitude REAL,
         transportationMode TEXT);
    `);
        

    console.log('Table initialized successfully!');

  }

    catch (error) {

      console.error('Error creating the table: ', error);
    }
};

export const getDailyEvents = async()=>{
    console.log('getting events');
    try{
        const DB = await SQLite.openDatabaseAsync('userEvents.db');
        console.log('db opened for daily events');
        const result = await DB.getAllAsync(` SELECT * FROM events 
  WHERE date(startTime) = date('now', 'localtime')
  ORDER BY startTime;`);
        //const result = await DB.getAllAsync("SELECT * FROM events");
        console.log(result);
        console.log('done txn');
        return result;
    }
    catch (error) {
        console.error('error getting daily events', error);
        return [];
    }
};

export const clearEvents = async()=>{ //just for clearing local storage
  console.log('dropping events table');
  try{
      const DB = await SQLite.openDatabaseSync('userEvents.db');
      await DB.execAsync(`PRAGMA journal_mode = WAL;
        DROP TABLE events;
        `);
      console.log('dropped table');
  }
  catch (error) {
    console.error(' error dropping table', error);
  }
};

export const getWeeklyEvents = async(date)=>{
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
        return result;
  }
  catch(error){
    console.error('error getting weekly evenets', error);
  }
};

export const addEvent = async (name, description, startTime, endTime, latitude, longitude, transportationMode) => {
  try {
      const DB = await SQLite.openDatabaseAsync('userEvents.db');
      console.log('db', DB);
      await DB.runAsync(`INSERT INTO events 
              (name, description, startTime, endTime, latitude, longitude, transportationMode) 
              VALUES (?, ?, ?, ?, ?, ?, ?);`, [name, description, startTime, endTime, latitude, longitude, transportationMode]);
      getEventByName('Test', DB);
  } catch (error) {
      console.error('Error in addEvent function:', error);
  }
};
//debugging function
const getEventByName = async (eventName, DB) => {
  try {
    const results = await DB.getAllAsync(
      'SELECT * FROM events WHERE name = ?;',
      [eventName]
    );

    if (results.length > 0) {
      console.log('Event Found:', JSON.stringify(results, null, 2));
    } else {
      console.log('No event found with that name.');
    }
  } catch (error) {
    console.error('Error fetching event:', error);
  }
};
