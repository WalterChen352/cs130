import { openDatabase } from '../scripts/Database';
import { Time, DaysOfWeekNames } from '../models/Time';
import { Workflow } from '../models/Workflow';
import  { SS_ASAP } from '../models/SchedulingStyle';
import APP_SCHEDLING_STYLES from '../models/SchedulingStyle';
import { getUID } from '../scripts/Profile';

const headers = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
  'access-token': process.env.EXPO_PUBLIC_ACCESS_TOKEN ?? '',
  'uid': String(getUID())
}

/**
 * DB record representing a workflow.
 *
 * @interface row
 * @typedef {row}
 * 
 */
interface row {
  /**
   * Unique id for the workflow.
   *
   * @type {number}
   */
  id: number,
  
  /**
   * Name of the workflow.
   *
   * @type {string}
   */
  name: string,
  
  /**
   * Color of the workflow in #RRGGBB format.
   *
   * @type {string}
   */
  color: string,
  
  /**
   * Boolean representation whether push notifications are enabled for the workflow.
   *
   * @type {boolean}
   */
  pushNotifications: boolean,
  
  /**
   * Start time of the workflow in the format = hours * 60 + minutes.
   *
   * @type {number}
   */
  timeStart: number,
  /**
   * End time of the workflow in the format = hours * 60 + minutes.
   *
   * @type {number}
   */
  timeEnd: number,
  
  /**
   * A bit mask representing the days of week when the workflow is active.
   * Each bit position corresponds to a day of the week: Su Mo Tu We Th Fr Sa.
   * `1` indicates the workflow is active on that day, `0` indicates it is not.
   *
   * @type {number}
   */
  daysOfWeek: number,
  
  /**
   * Id of Scheduling style representing how it should be scheduled in autoscheduling mode.
   *
   * @type {number}
   */
  schedulingStyleId: number
}

/**
 * Returns the list of workflows from DB.
 *
 * @async
 * @returns {Promise<Workflow[]>} - A promise that resolves to a list of `Workflow` objects.
 */
export const getWorkflows = async (): Promise<Workflow[]> => {
  try {
    const DB = await openDatabase();
    const query = await DB.getAllAsync(`
      SELECT *
      FROM workflows
      ORDER BY timeStart;
    `); 
    const rows = query as row[];
    const workflows = [];
    console.log('workflow results', rows)
    for (const row of rows) {
      const daysOfWeek = new Array<boolean>(7).fill(false);
      for (let d=0; d<7; d++) {
        daysOfWeek[d] = ((row.daysOfWeek & (1 << d)) !==0);
      }
      const schedulingStyle = APP_SCHEDLING_STYLES[Number(row.schedulingStyleId)];
      const timeStart = Number(row.timeStart);
      const timeEnd = Number(row.timeEnd);
      const workflowTemp:Workflow = {
        id: row.id,
        name: row.name,
        color: row.color,
        pushNotifications: (Number(row.pushNotifications)===1),
        timeStart: new Time(Math.floor(timeStart / 60), timeStart % 60),
        timeEnd: new Time(Math.floor(timeEnd / 60), timeEnd % 60),
        daysOfWeek:daysOfWeek,
        schedulingStyle: schedulingStyle
      }; 
      workflows.push(workflowTemp);
    } 
    return workflows;
  }
  catch (error) {
    console.error('Error getting Workflow', error);
    return [];
  }
};

/**
 * Clears table of workflows in DB.
 * This method does not return any value.
 *
 * @async
 * @returns {Promise<void>} - A promise that resolves when the table is cleared.
 */
export const clearWorkflows = async (): Promise<void> => {
  try {
    const DB = await openDatabase();
    await DB.execAsync(`
      PRAGMA journal_mode = WAL;
      DELETE FROM workflows;
    `);
  }
  catch (error) {
    console.error('Error cleaning Workflow', error);
  }
};

/**
 * Adds a workflows to the table `workflows` in DB.
 * This method does not return any value.
 *
 * @async
 * @param {Workflow} workflow - The `Workflow` object
 * @returns {Promise<void>} - A promise that resolves when the record is added to the table in DB.
 */
export const addWorkflow = async (workflow: Workflow): Promise<void> => {
  let daysOfWeekMask = 0;
  workflow.daysOfWeek.forEach((d,i) => {
    if (d) daysOfWeekMask = daysOfWeekMask | (1 << i);
  });

  try {
    const DB = await openDatabase();
    await DB.runAsync(`
      --PRAGMA journal_mode = WAL;
      INSERT INTO workflows (
        name,
        color,
        pushNotifications,
        timeStart,
        timeEnd,
        daysOfWeek,
        schedulingStyleId
      ) VALUES (?, ?, ?, ?, ?, ?, ?);
       `, [
        workflow.name,
        workflow.color,
        workflow.pushNotifications,
        workflow.timeStart.toInt(),
        workflow.timeEnd.toInt(),
        daysOfWeekMask,
        workflow.schedulingStyle.id
      ]
    );
    await fetch("https://gonow-5ry2jtelsq-wn.a.run.app/createWorkflow", {
      method: 'GET',
      headers: headers
    });
  }
  catch (error) {
    console.error('Error adding workflow: ', error);
  }
};


/**
 * Updates a workflows in the table `workflows` in DB.
 * This method does not return any value.
 *
 * @async
 * @param {Workflow} workflow - The `Workflow` object
 * @returns {Promise<void>} - A promise that resolves when the record is updated in the table in DB.
 */
export const updateWorkflow = async (workflow: Workflow): Promise<void> => {
  let daysOfWeekMask = 0;
  workflow.daysOfWeek.forEach((d,i) => {
    if (d) daysOfWeekMask = daysOfWeekMask | (1 << i);
  });

  try {
    const DB = await openDatabase();
    await DB.runAsync(`
      --PRAGMA journal_mode = WAL;
      UPDATE workflows
      SET
        name = ?,
        color = ?,
        pushNotifications = ?,
        timeStart = ?,
        timeEnd = ?,
        daysOfWeek = ?,
        schedulingStyleId = ?
      WHERE id = ?;
      `, [
        workflow.name,
        workflow.color,
        workflow.pushNotifications,
        workflow.timeStart.toInt(),
        workflow.timeEnd.toInt(),
        daysOfWeekMask,
        workflow.schedulingStyle.id,
        workflow.id
      ]
    );  }
  catch (error) {
    console.error('Error updating workflow: ', error);
  }
};

/**
 * Deletes a workflow from the table `workflows` in DB.
 *
 * @async
 * @param {Workflow} workflow - The `Workflow` object
 * @returns {Promise<void>} - A promise that resolves when the record is deleted from the table in DB.
 */
export const deleteWorkflow = async (workflow: Workflow): Promise<void> => {
  try {
    const DB = await openDatabase();
    console.log('DB opened for workflow deletion', DB);
    
    await DB.runAsync('DELETE FROM workflows WHERE id = ?;', [workflow.id]);
    console.log('Deleted workflow with id:', workflow.id);
  } catch (error) {
    console.error('Error deleting workflow: ', error);
  }
  // Adding the explicit Promise.resolve() like in the working function
  return Promise.resolve();
};

/**
 * Checks if the values of new or changed workflow's patameters are valid.
 * Checks if the values of new or changed workflow do not conflict with other workflows.
 * This method does not return any value.
 *
 * @async
 * @param {Workflow} workflow - The `Workflow` object
 * @returns {Promise<void>} - A promise that resolves when the record is deleted from the table in DB.
 */
export const validateWorkflow = async (workflow : Workflow): Promise<void> => {
  const errors = [];
  if (!workflow.name) {
    errors.push('The Worklow Name field is required.');
  }
  if (workflow.timeStart.toInt() > workflow.timeEnd.toInt()) {
    errors.push('The Start Time of workflow must be earlier than the End Time. Overnight workflow is not supported.');
  }
  if (workflow.daysOfWeek.every(d => !d)) {
    errors.push('Select at least one day of the week.');
  }
  const workflows = await getWorkflows();
  workflows.filter(w => w.id !== workflow.id).forEach(w => {
    for( let d = 0; d < 7; d++) {
      if (w.daysOfWeek[d] && workflow.daysOfWeek[d]) {
        if (w.timeEnd.toInt() > workflow.timeStart.toInt()
          && w.timeEnd.toInt() <= workflow.timeEnd.toInt()
          || workflow.timeEnd.toInt() > w.timeStart.toInt()
          && workflow.timeEnd.toInt() <= w.timeEnd.toInt()
        ) {
          errors.push(`Workflow time overlaps with another workflow "${w.name}" on ${DaysOfWeekNames[d]}`);
        }
      }
    }
  });

  if (errors.length > 0) {
    throw new Error(errors.join('\n'));
  }
};

export const filterWfId=(workflows: Workflow[], id:number): Workflow=>{
  for (const w of workflows){
    if (w.id===id)
      return w
  }
  console.error('workflow not found. May have been called with improper arguments:', workflows, id);
  return {
    id: 0,
    name: 'ERROR',
    color: '',
    pushNotifications: false,
    timeStart: new Time(0,0),
    timeEnd: new Time(0,0),
    daysOfWeek: [],
    schedulingStyle: SS_ASAP
  }
}
//IMPORTANT DISTINCTION FROM filterWfId: NULL RETURN VALUE IF NOTHING IS FOUND
export const tryFilterWfId=(workflows: Workflow[], id:number): Workflow|null=>{ 
  for (const w of workflows){
    if (w.id===id)
      return w
  }
  console.log('workflow not found. May have been called with improper arguments:', workflows, id);
  return null;
}

/**
 * Returns a Workflow with certain name.
 *
 * @async
 * @param {string} name - The name of `TransportationMode` object.
 * @returns {Promise<Workflow | null>} - The `TransportationMode` object with given name.
 */
export const getWorkflowByName = async (name: string):Promise<Workflow | null> => {
  name = name.toLowerCase();
  for (const workflow of await getWorkflows()){
    if(workflow.name.toLowerCase() === name)
      return workflow;
  }
  return null; // default value
};

/**
 * Returns a Workflow with certain id.
 *
 * @async
 * @param {number} id - The id of `TransportationMode` object.
 * @returns {Promise<Workflow | null>} - The `TransportationMode` object with given id.
 */
export const getWorkflowById = async (id:number):Promise<Workflow | null> => {
  try {
    const DB = await openDatabase();
    const query = await DB.getFirstAsync(`
      SELECT *
      FROM workflows
      WHERE id = ?;
    `, [id]
    );
    
    const row = query as row | null;
    if (!row) {
      console.log('Workflow id not found.');
      return null;
    }
    const daysOfWeek = new Array<boolean>(7).fill(false);
    for (let d=0; d<7; d++) {
      daysOfWeek[d] = ((row.daysOfWeek & (1 << d)) !==0);
    }
    const schedulingStyle = APP_SCHEDLING_STYLES[Number(row.schedulingStyleId)];
    const timeStart = Number(row.timeStart);
    const timeEnd = Number(row.timeEnd);
    
    const workflowTemp:Workflow ={
      id:id,
      name:row.name,
      color:row.color,
      pushNotifications:(Number(row.pushNotifications) === 1),
      timeStart:new Time(Math.floor(timeStart / 60), timeStart % 60),
      timeEnd:new Time(Math.floor(timeEnd / 60), timeEnd % 60),
      daysOfWeek: daysOfWeek,
      schedulingStyle: schedulingStyle
    };
    return workflowTemp;
  }
  catch (error) {
    console.log('Error getting workflow by id: ', error);
  }
  
  return null; // default value
};
