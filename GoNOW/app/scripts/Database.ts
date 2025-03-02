import * as SQLite from 'expo-sqlite';

/**
 * Constant name of the DB.
 *
 * @type {"gonow.db"}
 */
export const DB_NAME = 'gonow.db';

/**
 * Opens DB for work with DB if DB exists.
 * Creates DB for work with DB if DB doesn't exists.
 *
 * @async
 * @returns {Promise<SQLite.SQLiteDatabase>} - A promise that resolves to `SQLiteDatabase` object.
 */
export const openDatabase = async (): Promise<SQLite.SQLiteDatabase> => {
  return await SQLite.openDatabaseAsync(DB_NAME, {
    useNewConnection: true  // https://github.com/expo/expo/issues/28176#issuecomment-2062361077
  });
};

/**
 * Initializes DB with all the tables with predefined records.
 * This function does not return any value.
 *
 * @async
 * @returns {Promise<void>} - A promise that resolves when the DB is initialized and all tables are created.
 */
export const initDatabase = async (): Promise<void> => {
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
                transportationMode TEXT,
                workflow INTEGER
            );
        `);

        await DB.execAsync(`
          PRAGMA journal_mode = WAL;
          CREATE TABLE IF NOT EXISTS workflows (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT UNIQUE NOT NULL,
            color TEXT,
            pushNotifications BOOLEAN,
            timeStart INTEGER,
            timeEnd INTEGER,
            daysOfWeek INTEGER,
            schedulingStyleId INTEGER
          );
        `);

        // Add your tables to create here

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

/**
 * Drops DB completely.
 *
 * @async
 * @returns {Promise<void>} - A promise that resolves when the DB is dropped.
 */
export const dropDatabase = async (): Promise<void> => {
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

/**
 * Reset DB to intial empty state with predefined records.
 * This method does not return any value.
 *
 * @async
 * @returns {Promise<void>} - A promise that resolves when the DB is reset to initial state.
 */
export const resetDatabase = async (): Promise<void> => {
  try {
    await dropDatabase();
    await initDatabase();
  }
  catch (error) {
    console.error('Error resetting the DB: ', error);
  }
};
