import * as SQLite from 'expo-sqlite';
import { Event } from '../models/Event';
import { DB_NAME } from './Database';
import { formatDate } from './Date';
import Coordinates from '../models/Location';
import { getWorkflowById } from './Workflow';
import { Workflow } from '../models/Workflow';


interface rowData {
    id: number;
    name: string;
    description: string;
    startTime: string;
    endTime: string;
    coordinates: string
    transportationMode: string;
    workflow: number|null;
}

const url="https://gonow-5ry2jtelsq-wn.a.run.app/api/autoschedule"

const headers = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
  'access-token': process.env.EXPO_PUBLIC_ACCESS_TOKEN ?? ''
}

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
    
    const result: rowData[] = await DB.getAllAsync(`
      SELECT * FROM events
      WHERE datetime(startTime) >= datetime(?)
      AND datetime(startTime) < datetime(?)
      ORDER BY startTime;
    `, [startStr, endStr]);
    
    console.log('Query result:', result);
    console.log('done txn');
    
    const events:Event[] = result.map((row:rowData)=>({
      id:row.id,
      name:row.name,
      description:row.description,
      startTime:row.startTime,
      endTime:row.endTime,
      coordinates: JSON.parse(row.coordinates) as Coordinates,
      transportationMode:row.transportationMode,
      workflow:row.workflow
    }));
    return events;
  } catch (error) {
    console.error('error getting daily events', error);
    return [];
  }
};

export const addRecurringEvent = async (e: Event, times: number, interval: string, auto_schedule:boolean, duration:number
): Promise<void> => {
  // add event times times, incrementing the event time by interval each time
  // e.g. if times = 5 and interval = 'day', add event once for current event time,
  // then add 1 day to event time and add event again, and so on until times = 0

  //NOTE: disabled null assertion because wf is checked for null before calling
  //init variables for autoscheduling recurring
  const wfStartTime:Date=new Date(Date.now())
  let daysAhead= 0;
  switch(interval){
    case 'day':
      daysAhead=1;
      break;
    case 'week':
      daysAhead=7;
      break;
    case 'month':
      daysAhead=30;
      break;
    case 'year':
      daysAhead=365;
      break;
    default:
        throw new Error('Invalid interval for recurring event');
  }
  if(auto_schedule&&e.workflow===null)
    throw new Error('tried to autoschedule event without a workflow')
  //eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const wf =await getWorkflowById(e.workflow!);
    
  while (times > 0) {
    if(!auto_schedule){

    const startTime = new Date(e.startTime);
    await addEvent(e, false, null);
    switch (interval) {
      case 'day':
        startTime.setDate(startTime.getDate() + 1);
        break;
      case 'week':
        startTime.setDate(startTime.getDate() + 7);
        break;
      case 'month':
        startTime.setMonth(startTime.getMonth() + 1);
        break;
      case 'year':
        startTime.setFullYear(startTime.getFullYear() + 1);
        break;
      default:
        throw new Error('Invalid interval for recurring event');
    }
    e.startTime = startTime.toISOString();
  }
  else{
    console.log(`recurring autoschedule call with ${String(wfStartTime)} and ${String(daysAhead)} days ahead`)
    //eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const autoScheduledEvent =await autoSchedule(e,wf!, duration, wfStartTime, daysAhead)
    //modify wfStartTime,
    wfStartTime.setDate(wfStartTime.getDate()+daysAhead)
    if(autoScheduledEvent!==null)
      await addEvent(autoScheduledEvent, false, null)
  }
  times--;
};
}

export const getWeeklyEvents= async(date: Date): Promise<Event[]>=>{
  console.log('getting weekly events for ', date);
  const results = await getFutureEvents(date, 7);
  return results;
}

export const getFutureEvents = async(date: Date, daysAhead: number): Promise<Event[]> => {
  const startDate = new Date(date);
  const endDate = new Date(date);
  endDate.setDate(endDate.getDate() + daysAhead);
  
  const startStr = formatDateForSQLite(startDate);
  const endStr = formatDateForSQLite(endDate);
  
  console.log('searching for events between ', startStr, endStr);
  
  try {
    const DB = await SQLite.openDatabaseAsync(DB_NAME);
    const result:rowData[] = await DB.getAllAsync(`
      SELECT * FROM events
      WHERE startTime >= datetime(?) AND startTime < datetime(?)
      ORDER BY startTime;
    `, [startStr, endStr]);
    
    console.log(result);
    const events:Event[] = result.map((row:rowData)=>({
      id:row.id,
      name:row.name,
      description:row.description,
      startTime:row.startTime,
      endTime:row.endTime,
      coordinates: JSON.parse(row.coordinates) as Coordinates,
      transportationMode:row.transportationMode,
      workflow:row.workflow
    }));
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
  
  const year = String(date.getFullYear());
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

const autoSchedule = async(e:Event, wf:Workflow, duration: number, startSearch:Date, daysAhead:number):Promise<Event|null>=>{
    startSearch=getNextMidnight()
    //query all events coming up in days ahead
        const events:Event[] =await getFutureEvents(startSearch, daysAhead)
        if(wf.timeEnd.toInt()-wf.timeStart.toInt()<duration){
          throw new Error('tried to schedule event lasting longer than the workflow bounds')
        }
        const datedEvents = events.map(e=>{
          const newStart= new Date(e.startTime).toISOString()
          e.startTime=newStart
          const newEnd = new Date(e.endTime).toISOString()
          e.endTime=newEnd
          
          return e
        })
        console.log('dated events', datedEvents)
        const body={
          events:datedEvents,
          workflow: wf,
          coordinates: e.coordinates,
          duration: duration,
          timeZone: "America/Los_Angeles", //placeholder
          name: e.name,
          description: e.description,
          transportation: e.transportationMode,
          startSearch: startSearch,
          daysAhead: daysAhead
        }
        console.log('autoschedule body', body)
        const response = await fetch(url, {
          method: 'POST',
          headers: headers,
          body: JSON.stringify(body)
        })
        if(response.ok){
        const result :string= await response.json() as string;
        console.log('autoscheduledeventt', result)
        const event:Event = JSON.parse(result) as Event;
        event.startTime=formatDateForSQLite(new Date(event.startTime))
        event.endTime=formatDateForSQLite(new Date(event.endTime))
        return event
        }
        else{
          return null
        }
      }



export const addEvent = async (e: Event, auto_schedule:boolean, duration: number|null): Promise<void> => {
  try {
    
    //autoschedule first
    if(auto_schedule){
      if (duration===null)
        throw new Error('tried to call autoschedule without a duration')
      if(e.workflow==null)
        throw new Error('tried to autoschedule event without a workflow')
      const wf =await getWorkflowById(e.workflow);
      //eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const autoscheduledEvent= await autoSchedule(e, wf!, duration, new Date(Date.now()),14 );
      if(autoscheduledEvent===null){
        console.error('unable to autoschedule event')
        return;
      }
      else{
        e=autoscheduledEvent;
      }
    }
    const DB = await SQLite.openDatabaseAsync(DB_NAME);
    // Since workflow is number|null, we don't need to check for undefined
    const query = `INSERT INTO events
      (name, description, startTime, endTime, coordinates, transportationMode, workflow)
      VALUES ( ?, ?, ?, ?, ?, ?, ?);`;
    
    const params = [
      e.name, 
      e.description, 
      e.startTime, 
      e.endTime, 
      JSON.stringify(e.coordinates), 
      e.transportationMode,
      e.workflow // workflow is already either number or null
    ];
    
    await DB.runAsync(query, params);
    await fetch("https://gonow-5ry2jtelsq-wn.a.run.app/createTask", {
      method: 'GET',
      headers: headers
    });
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
          coordinates =?,
          transportationMode = ?,
          workflow = ?
      WHERE id = ?;`;

    const params = [
      e.name, 
      e.description, 
      e.startTime, 
      e.endTime, 
      JSON.stringify(e.coordinates), 
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

export const getNextEvent = async() : Promise<Event|null> => {
  try{
    const DB = await SQLite.openDatabaseAsync(DB_NAME);
    console.log('time', new Date().toLocaleTimeString())
    const results:rowData[] = await DB.getAllAsync(`SELECT * FROM events
    WHERE datetime(startTime) >= datetime(?)
    ORDER BY startTime
    LIMIT 1;`, [formatDate(new Date())]);
    if (results.length === 0) {
      console.log('no events found');
      return null;
    }
    else{
      const result = results[0]; // unwrap the array
      const event:Event = ({
        id:result.id,
        name:result.name,
        description:result.description,
        startTime:result.startTime,
        endTime:result.endTime,
        coordinates: JSON.parse(result.coordinates) as Coordinates,
        transportationMode:result.transportationMode,
        workflow:result.workflow
      });
      return event;
    }
  }
  catch(error){
    console.error('error getting next event', error);
  }
  return null; 
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
  if(auto_schedule){ //if autoschedule we dont care about enforcing any of the time constraints
    const hasWorkflow = event.workflow !== null;
    // Core validation: Either time is set OR (autoschedule is enabled AND workflow is selected)
    if ( !hasWorkflow) {
      errors.push('An autoscheduled task must be assigned to a workflow.');
    }
    
  }
  else{
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
  }
  // Check the core requirement: Either set time OR (autoschedule AND workflow)
  
  
  if (errors.length > 0) {
    throw new Error(errors.join('\n'));
  }
};


function getNextMidnight() {
  const now = new Date();
  const nextMidnight = new Date(now);
  
  // Set the time to midnight of the next day
  nextMidnight.setHours(24, 0, 0, 0);
  
  return nextMidnight;
}