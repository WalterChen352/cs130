import * as SQLite from 'expo-sqlite';
import { Event } from '../models/Event';
import { DB_NAME } from './Database';

export const getDailyEvents = async(eventDate?: Date): Promise<Event[]> => {
  console.log('getting events for date:', eventDate);
  try {
    const DB = await SQLite.openDatabaseAsync(DB_NAME);
    console.log('db opened for daily events');
    
    const dateToUse = eventDate ?? new Date();
    
    const startOfDay = new Date(dateToUse);
    startOfDay.setHours(0, 0, 0, 0);
    const startStr = formatDateForSQLite(startOfDay);
    
    const endOfDay = new Date(dateToUse);
    endOfDay.setHours(23, 59, 59, 999);
    const endStr = formatDateForSQLite(endOfDay);
    
    const result = await DB.getAllAsync(`
      SELECT * FROM events
      WHERE datetime(startTime) >= datetime(?)
      AND datetime(startTime) < datetime(?)
      ORDER BY startTime;
    `, [startStr, endStr]);
    
    console.log('Query result:', result);
    console.log('done txn');
    
    const events = result as Event[];
    return events;
  } catch (error) {
    console.error('error getting daily events', error);
    return [];
  }
};

export const getWeeklyEvents = async(date: Date): Promise<Event[]> => {
  console.log('getting weekly events for ', date);
  
  const startDate = new Date(date);
  const endDate = new Date(date);
  endDate.setDate(endDate.getDate() + 7);
  
  const startStr = formatDateForSQLite(startDate);
  const endStr = formatDateForSQLite(endDate);
  
  console.log('searching for events between ', startStr, endStr);
  
  try {
    const DB = await SQLite.openDatabaseAsync(DB_NAME);
    const result = await DB.getAllAsync(`
      SELECT * FROM events
      WHERE startTime >= datetime(?) AND startTime < datetime(?)
      ORDER BY startTime;
    `, [startStr, endStr]);
    
    console.log(result);
    const events = result as Event[];
    return events;
  } catch (error) {
    console.error('error getting weekly events', error);
  }
  return [];
};

/**
 * Formats a Date object as YYYY-MM-DD HH:MM:SS string for SQLite
 * Use local time zone to avoid ISO string issues
 */
function formatDateForSQLite(date: Date): string {
  const pad = (num: number) => num.toString().padStart(2, '0');
  
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1); // Months are 0-indexed
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());
  
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

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
  return Promise.resolve();
};



export const addEvent = async (e: Event): Promise<void> => {
  try {
    const DB = await SQLite.openDatabaseAsync(DB_NAME);
    console.log('db', DB);
    
    // Since workflow is number|null, we don't need to check for undefined
    const query = `INSERT INTO events
      (name, description, startTime, endTime, latitude, longitude, transportationMode, workflow)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?);`;
    
    const params = [
      e.name, 
      e.description, 
      e.startTime, 
      e.endTime, 
      e.latitude, 
      e.longitude, 
      e.transportationMode,
      e.workflow // workflow is already either number or null
    ];
    
    await DB.runAsync(query, params);
  } catch (error) {
    console.error('Error in addEvent function:', error);
  }
  return Promise.resolve();
};

export const updateEvent = async (e: Event): Promise<void> => {
  try {
    const DB = await SQLite.openDatabaseAsync(DB_NAME);
    console.log('db opened for update', DB);
    
    const query = `UPDATE events 
      SET name = ?, 
          description = ?, 
          startTime = ?,
          endTime = ?,
          latitude = ?,
          longitude = ?,
          transportationMode = ?,
          workflow = ?
      WHERE id = ?;`;

    const params = [
      e.name, 
      e.description, 
      e.startTime, 
      e.endTime, 
      e.latitude, 
      e.longitude, 
      e.transportationMode,
      e.workflow, // workflow is already either string or null
      e.id
    ];
    
    await DB.runAsync(query, params);
    console.log('Updated event with id:', e.id);
  } catch (error) {
    console.error('Error in updateEvent function:', error);
  }
  return Promise.resolve();
};

export const deleteEvent = async (eventId: number): Promise<void> => {
  try {
    const DB = await SQLite.openDatabaseAsync(DB_NAME);
    console.log('db opened for deletion', DB);
    
    await DB.runAsync('DELETE FROM events WHERE id = ?;', [eventId]);
    console.log('Deleted event with id:', eventId);
  } catch (error) {
    console.error('Error in deleteEvent function:', error);
  }
  return Promise.resolve();
};

/**
 * Checks if the values of new or changed event's parameters are valid.
 * Ensures that the event has either name + autoschedule + workflow or name + time
 * This method does not return any value.
 *
 * @param {Event} event - The `Event` object
 * @param {boolean} auto_schedule - A boolean value to check if the event is to be auto scheduled.
 */
export const validateEvent = (event: Event, auto_schedule: boolean): void => {
  const errors = [];
  
  // Check if event name empty
  if (!event.name) {
    errors.push('The Event Name field is required.');
  }
  
  // Check time consistency
  if (event.startTime && !event.endTime) {
    errors.push('The event has a start time but no end time.');
  }
  
  if (event.endTime && !event.startTime) {
    errors.push('The event has an end time but no start time.');
  }
  
  // Check if event end time is after start time
  if (event.startTime && event.endTime) {
    const startTimeDate = new Date(event.startTime);
    const endTimeDate = new Date(event.endTime);
    if (startTimeDate > endTimeDate) {
      errors.push('The end time of the event must be later than the start time. Overnight events are not supported.');
    }
  }
  
  // Check the core requirement: Either set time OR (autoschedule AND workflow)
  const hasTimeSet = Boolean(event.startTime) && Boolean(event.endTime);
  const hasWorkflow = event.workflow !== -1;
  
  // Core validation: Either time is set OR (autoschedule is enabled AND workflow is selected)
  if (!hasTimeSet && !(auto_schedule && hasWorkflow)) {
    errors.push('You must either set a time for the event OR enable autoschedule and select a workflow.');
  }
  
  // Additional check: If autoschedule is enabled, a workflow must be selected (for clarity)
  if (auto_schedule && !hasWorkflow) {
    errors.push('Please select a workflow when autoschedule is enabled.');
  }
  
  if (errors.length > 0) {
    throw new Error(errors.join('\n'));
  }
};