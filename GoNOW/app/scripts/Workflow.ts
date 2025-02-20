import { openDatabase } from '../scripts/Database';
import { getSchedulingStyle } from '../scripts/SchedulingStyle';
import { Time, DaysOfWeekNames } from '../models/Time';
import { Workflow } from '../models/Workflow';

interface row {
  id: number,
  name: string,
  color: string,
  pushNotifications: boolean,
  timeStart: number,
  timeEnd: number,
  daysOfWeek: number,
  schedulingStyle: number
}

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
    
    for (const row of rows) {
      const daysOfWeek = new Array<boolean>(7).fill(false);
      for (let d=0; d<7; d++) {
        daysOfWeek[d] = ((row.daysOfWeek & (1 << d)) !==0);
      }
      const schedulingStyle = getSchedulingStyle(Number(row.schedulingStyle));
      const timeStart = Number(row.timeStart);
      const timeEnd = Number(row.timeEnd);
      const workflowTemp = new Workflow(
        row.id,
        row.name,
        row.color,
        (Number(row.pushNotifications) === 1),
        new Time(Math.floor(timeStart / 60), timeStart % 60),
        new Time(Math.floor(timeEnd / 60), timeEnd % 60),
        daysOfWeek,
        schedulingStyle
      ); 
      workflows.push(workflowTemp);
    } 
    return workflows;
  }
  catch (error) {
    console.error('Error getting Workflow', error);
    return [];
  }
};

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
        schedulingStyle
      ) VALUES (?, ?, ?, ?, ?, ?, ?);
       `, [
        workflow.name,
        workflow.color,
        workflow.pushNotifications,
        workflow.timeStart.toInt(),
        workflow.timeEnd.toInt(),
        daysOfWeekMask,
        workflow.schedulingStyle.Id
      ]
    );
  }
  catch (error) {
    console.error('Error adding workflow: ', error);
  }
};

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
        schedulingStyle = ?
      WHERE id = ?;
      `, [
        workflow.name,
        workflow.color,
        workflow.pushNotifications,
        workflow.timeStart.toInt(),
        workflow.timeEnd.toInt(),
        daysOfWeekMask,
        workflow.schedulingStyle.Id,
        workflow.id
      ]
    );  }
  catch (error) {
    console.error('Error updating workflow: ', error);
  }
};

export const deleteWorkflow = async (workflow: Workflow): Promise<void> => {
  try {
    const DB = await openDatabase();
    await DB.runAsync(`
      PRAGMA journal_mode = WAL;
      DELETE FROM workflows
      WHERE id = ?;
      `, [ workflow.id ]
    );
  }
  catch (error) {
    console.error('Error deleting workflow: ', error);
  }
};

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