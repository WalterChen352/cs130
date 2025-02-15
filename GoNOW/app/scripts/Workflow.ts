import { openDatabase } from "../scripts/Database";
import { getSchedulingStyle } from "../scripts/SchedulingStyle";
import { Time, DaysOfWeekNames } from "../models/Time";
import { Workflow } from "../models/Workflow";

export const getWorkflows = async () => {
    try {
        const DB = await openDatabase();
        const rows = await DB.getAllAsync(`
            SELECT *
            FROM workflows
            ORDER BY timeStart;
        `);

        let workflows = [];
        
        for (let i=0; i < rows.length; i++) {
            const row = rows[i];
            let daysOfWeek = new Array(7).fill(false);
            for (let d=0; d<7; d++) {
                daysOfWeek[d] = ((row['daysOfWeek'] & (1 << d)) !==0);
            }

            const schedulingStyle = await getSchedulingStyle(Number(row["schedulingStyle"]));
            const timeStart = Number(row["timeStart"]);
            const timeEnd = Number(row["timeEnd"]);
            let workflowTemp = new Workflow(
                row['id'],
                row['name'],
                row['color'],
                (Number(row['pushNotifications']) === 1),
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
}

export const clearWorkflows = async () => {
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
}

export const addWorkflow = async (workflow: Workflow) => {
    let daysOfWeekMask: number = 0;
    workflow.DaysOfWeek.forEach((d,i) => {
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
                workflow.Name,
                workflow.Color,
                workflow.PushNotifications,
                workflow.TimeStart.toInt(),
                workflow.TimeEnd.toInt(),
                daysOfWeekMask,
                workflow.SchedulingStyle.Id
            ]
        );
    }
    catch (error) {
        console.error('Error adding workflow: ', error);
    }
}

export const updateWorkflow = async (workflow: Workflow) => {
    let daysOfWeekMask: number = 0;
    workflow.DaysOfWeek.forEach((d,i) => {
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
                workflow.Name,
                workflow.Color,
                workflow.PushNotifications,
                workflow.TimeStart.toInt(),
                workflow.TimeEnd.toInt(),
                daysOfWeekMask,
                workflow.SchedulingStyle.Id,
                workflow.Id
            ]
        );
    }
    catch (error) {
        console.error('Error updating workflow: ', error);
    }
}

export const deleteWorkflow = async (workflow: Workflow) => {
    try {
        const DB = await openDatabase();
        await DB.runAsync(`
            PRAGMA journal_mode = WAL;
            DELETE FROM workflows
            WHERE id = ?;
            `, [ workflow.Id ]
        );
    }
    catch (error) {
        console.error('Error deleting workflow: ', error);
    }
}

export const validateWorkflow = async (workflow : Workflow) => {
    const errors = [];
    if (!workflow.Name) {
        errors.push("The Worklow Name field is required.");
    }
    if (workflow.TimeStart.toInt() > workflow.TimeEnd.toInt()) {
        errors.push("The Start Time of workflow must be earlier than the End Time. Overnight workflow is not supported.");
    }
    if (workflow.DaysOfWeek.every(d => d === false)) {
        errors.push("Select at least one day of the week.");
    }

    const workflows = await getWorkflows();
    workflows.filter(w => w.Id !== workflow.Id).forEach(w => {
        for( let d = 0; d < 7; d++) {
            if (w.DaysOfWeek[d] && workflow.DaysOfWeek[d]) {
                if (w.TimeEnd.toInt() > workflow.TimeStart.toInt()
                    && w.TimeEnd.toInt() <= workflow.TimeEnd.toInt()
                    || workflow.TimeEnd.toInt() > w.TimeStart.toInt()
                    && workflow.TimeEnd.toInt() <= w.TimeEnd.toInt()
                ) {
                    errors.push(`Workflow time overlaps with another workflow "${w.Name}" on ${DaysOfWeekNames[d]}`);
                }
            }
        }
    });
  
    if (errors.length > 0) {
        throw new Error(errors.join("\n"));
    }
};