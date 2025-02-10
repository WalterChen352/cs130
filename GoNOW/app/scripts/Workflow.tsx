import { openDatabase } from "./Database";
import { SchedulingStyle, FindSchedulingStyleById } from "../models/SchedulingStyle";
import { Time } from "../models/Time";
import { Workflow } from "../models/Workflow";

export const getWorkflows = async () => {

    console.log('> Get workflow list');

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
            //console.log(row);
            let workflowTemp = new Workflow(
                row['id'], row['name'], row['color'],
                row['pushNotifications'],
                new Time(row['timeStart']), new Time(row['timeEnd']),
                daysOfWeek, FindSchedulingStyleById(Number(row['schedulingStyle']))
            );

            //console.log("> Read: ", workflowTemp);
            workflows.push(workflowTemp);
        }

        return workflows;
    }
    catch (error) {
        console.error('Error getting Workflow', error);
        return [];
    }
}

export const clearWorkflow = async () => { // TODO clear by ID

    console.log('> Clear workflows table');

    try {
        const DB = await openDatabase();
        await DB.execAsync(`
            PRAGMA journal_mode = WAL;
            DELETE FROM workflows;
        `);

        console.log('> Workflows table cleaned successfuly.');
    }
    catch (error) {
        console.error('Error cleaning Workflow', error);
        return [];
    }
}

export const addWorkflow = async (workflow: Workflow) => {

    //console.log('> Add workflow: ', workflow);
    console.log('> Add workflow');
    let daysOfWeekMask: number = 0;
    workflow.DaysOfWeek.forEach((d,i) => {
        if (d)
            daysOfWeekMask = daysOfWeekMask | (1 << i);
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

        console.log('> Workflow added successfuly.');

    }
    catch (error) {
        console.error('Error adding workflow: ', error);
    }
}

export const updateWorkflow = async (workflow: Workflow) => {

    //console.log('> Update workflow: ', workflow);
    console.log('> Update workflow');
    let daysOfWeekMask: number = 0;
    workflow.DaysOfWeek.forEach((d,i) => {
        if (d)
            daysOfWeekMask = daysOfWeekMask | (1 << i);
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

        console.log('> Workflow updated successfuly.');

    }
    catch (error) {
        console.error('Error updating workflow: ', error);
    }
}

export const deleteWorkflow = async (workflow: Workflow) => {

    //console.log('> Delete workflow: ', workflow);
    console.log('> Delete workflow');
    try {
        const DB = await openDatabase();
        
        await DB.runAsync(`
            PRAGMA journal_mode = WAL;
            DELETE FROM workflows
            WHERE id = ?;
            `, [ workflow.Id ]
        );

        console.log('> Workflow deleted successfuly.');

    }
    catch (error) {
        console.error('Error deleting workflow: ', error);
    }
}