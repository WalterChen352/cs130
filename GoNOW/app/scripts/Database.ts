import * as SQLite from 'expo-sqlite';

export const DB_NAME = 'gonow.db';

export const openDatabase = async (): Promise<SQLite.SQLiteDatabase> => {
    return await SQLite.openDatabaseAsync(DB_NAME);
};

export const initDatabase = async (): Promise<Boolean> => {
    //console.log('> Start initialize DB');
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

        // Add your tables to create here

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

        await DB.execAsync(`
            PRAGMA journal_mode = WAL;
            CREATE TABLE IF NOT EXISTS profile (
              id INTEGER PRIMARY KEY,
              address TEXT,
              lat REAL,
              lon REAL
            );
        `);

        try {
            await DB.execAsync(`
              PRAGMA journal_mode = WAL;
              INSERT INTO profile (id, address, lat, lon) VALUES (1, '', 0, 0);
            `);
        }
        catch {
            console.log(''); //ignore second attempt of insert record
        }

    }
    catch (error) {
        console.error('Error initializing the DB: ', error);
    }
};

export const dropDatabase = async (): Promise<Boolean> => {

    try {
        const DB = await openDatabase();

        await DB.execAsync(`
            PRAGMA journal_mode = WAL;
            DROP TABLE IF EXISTS events;
        `);

        // Add your tables to drop here

        await DB.execAsync(`
            PRAGMA journal_mode = WAL;
            DROP TABLE IF EXISTS workflows;
        `);

        await DB.execAsync(`
            PRAGMA journal_mode = WAL;
            DROP TABLE IF EXISTS profile;
        `);

    }
    catch (error) {
        console.error('Error dropping the DB: ', error);
    }
};

export const resetDatabase = async (): Promise<Boolean> => {
    try {
        await dropDatabase();
        await initDatabase();
    }
    catch (error) {
        console.error('Error resetting the DB: ', error);
    }
};