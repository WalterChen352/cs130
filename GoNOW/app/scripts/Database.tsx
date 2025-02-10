import * as SQLite from 'expo-sqlite';

export const DB_NAME = "gonow.db";

export const openDatabase = async () => {
    return await SQLite.openDatabaseAsync(DB_NAME);
}
export const initDatabase = async () => {
    console.log('> Start initialize DB');
    try {
    
        const DB = await openDatabase();
        await DB.execAsync(`
            PRAGMA journal_mode = WAL;
            CREATE TABLE IF NOT EXISTS events (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT,
                description TEXT,
                startTime TEXT,
                endTime TEXT,
                latitude REAL,
                longitude REAL,
                transportationMode TEXT
            );
        `);

        await DB.execAsync(`
            PRAGMA journal_mode = WAL;
            CREATE TABLE IF NOT EXISTS workflows (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT,
                color TEXT,
                pushNotifications BOOLEAN,
                timeStart INTEGER,
                timeEnd INTEGER,
                daysOfWeek INTEGER,
                schedulingStyle INTEGER
            );
        `);

    console.log('> DB initialized successfully!');

  }

  catch (error) {
      console.error('Error initializing the DB: ', error);
  }
}

export const dropDatabase = async () => {
    console.log('> Start drop DB');
    try {
        
        const DB = await openDatabase();
        await DB.execAsync(`
            PRAGMA journal_mode = WAL;
            DROP TABLE IF EXISTS events;
        `);
        await DB.execAsync(`
            PRAGMA journal_mode = WAL;
            DROP TABLE IF EXISTS workflows;
        `);

        console.log('> DB dropped successfully!');

    }
    catch (error) {
        console.error('Error dropping the DB: ', error);
    }
}

export const resetDatabase = async () => {
    console.log('> Start reset DB');
    try {
        await dropDatabase();
        await initDatabase();
        console.log('> DB reset successfully!');
    }
    catch (error) {
        console.error('Error resetting the DB: ', error);
    }
}