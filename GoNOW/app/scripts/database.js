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
         INSERT INTO events (name, description, startTime, endTime, latitude, longitude, transportationMode) VALUES ('Study1', 'Descr1', '2025-02-05 16:00:00', '2025-02-05 16:30:00', 0, 0, 'walking');
         INSERT INTO events (name, description, startTime, endTime, latitude, longitude, transportationMode) VALUES ('Study2', 'Descr2', '2025-02-05 12:00:00', '2025-02-05 12:30:00', 0, 0, 'walking');
         INSERT INTO events (name, description, startTime, endTime, latitude, longitude, transportationMode) VALUES ('Study3', 'Descr3', '2025-03-05 16:00:00', '2025-03-05 16:30:00', 0, 0, 'walking');
    `);
        

    console.log('Table initialized successfully!');

  }

    catch (error) {

      console.error('Error creating the table: ', error);
    }
}

export const getDailyEvents = async()=>{
    console.log('getting events');
    try{
        const DB = await SQLite.openDatabaseAsync('userEvents.db');
        const readOnly=true;
        console.log('db opened for daily events');
        const result = await DB.getAllAsync("SELECT * FROM events");
        console.log(result);
        console.log('done txn');
    }
    catch{
        console.error('error getting daily events', error);
    }
}
