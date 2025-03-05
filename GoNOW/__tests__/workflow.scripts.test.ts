import * as wfDB from '../app/scripts/Workflow';
import { getWorkflows, clearWorkflows, addWorkflow, validateWorkflow } from '../app/scripts/Workflow';
import { openDatabase } from '../app/scripts/Database';
import { Workflow } from '../app/models/Workflow';
import {  Time } from '../app/models/Time';
import {  SS_ASAP, SS_MAX_ONE } from '../app/models/SchedulingStyle';

jest.mock('../app/scripts/Database', () => ({
  openDatabase: jest.fn(() => Promise.resolve({ getAllAsync: jest.fn(), runAsync: jest.fn(), execAsync: jest.fn() })),
}));


interface WorkflowDbFormat {
  id: number;
  name: string;
  color: string;
  pushNotifications: boolean;
  timeStart: number;
  timeEnd: number;
  daysOfWeek: number;
  schedulingStyleId: number;
}

const toDbFormat = (workflow: Workflow): WorkflowDbFormat => {
  let daysOfWeekMask = 0;
  workflow.daysOfWeek.forEach((d, i) => {
    if (d) daysOfWeekMask |= 1 << i;
  });

  return {
    id: workflow.id,
    name: workflow.name,
    color: workflow.color,
    pushNotifications: workflow.pushNotifications,
    timeStart: workflow.timeStart.toInt(),
    timeEnd: workflow.timeEnd.toInt(),
    daysOfWeek: daysOfWeekMask,
    schedulingStyleId: workflow.schedulingStyle.id,
  };
};

const mockWorkflows:Workflow[] = [
  {
    id:1,
    name:'School',
    color:'#d5f9cf',
    pushNotifications:false,
    timeStart:new Time(9, 0),
    timeEnd:new Time(10, 0),
    daysOfWeek:[false, true, true, false, true, false, false],
    schedulingStyle:SS_ASAP
  },
  {
    id:2,
    name:'Errand',
    color:'#d3eef9',
    pushNotifications:true,
    timeStart:new Time(11, 0),
    timeEnd:new Time(17, 0),
    daysOfWeek:[true, false, false, false, false, false, true],
    schedulingStyle:SS_MAX_ONE
  }
];

const mockWorkflowsDb = mockWorkflows.map(toDbFormat);

describe('Workflow Database', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('method getWorkflows should return list workflows from the database', async () => {
    const mockDb = { getAllAsync: jest.fn().mockResolvedValue(mockWorkflowsDb) };
    (openDatabase as jest.Mock).mockResolvedValue(mockDb);
    const workflows: Workflow[] = await getWorkflows();
    expect(workflows).toHaveLength(mockWorkflows.length);
    mockWorkflows.forEach((wf, i) => {
      expect(workflows[i]?.id).toBe(wf.id);
      expect(workflows[i]?.name).toBe(wf.name);
      expect(workflows[i]?.color).toBe(wf.color);
      expect(workflows[i]?.pushNotifications).toBe(wf.pushNotifications);
      expect(workflows[i]?.timeStart.hours).toBe(wf.timeStart.hours);
      expect(workflows[i]?.timeStart.minutes).toBe(wf.timeStart.minutes);
      expect(workflows[i]?.timeEnd.hours).toBe(wf.timeEnd.hours);
      expect(workflows[i]?.timeEnd.minutes).toBe(wf.timeEnd.minutes);
      expect(workflows[i]?.schedulingStyle.name).toBe(wf.schedulingStyle.name);
      expect(workflows[i]?.daysOfWeek).toEqual(wf.daysOfWeek);
    });
  });

  test('method clearWorkflows should delete all workflows from the database', async () => {
    const mockDb = { execAsync: jest.fn().mockResolvedValue(undefined) };
    (openDatabase as jest.Mock).mockResolvedValue(mockDb);
    await clearWorkflows();
    expect(mockDb.execAsync).toHaveBeenCalledWith(`
      PRAGMA journal_mode = WAL;
      DELETE FROM workflows;
    `);
  });

  test('method addWorkflow should insert a new workflow into the database', async () => {
    const mockDb = { runAsync: jest.fn().mockResolvedValue(undefined) };
    (openDatabase as jest.Mock).mockResolvedValue(mockDb);
    await addWorkflow(mockWorkflows[0]);
    expect(mockDb.runAsync).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO workflow'),
      expect.arrayContaining([
        mockWorkflowsDb[0].name,
        mockWorkflowsDb[0].color,
        mockWorkflowsDb[0].pushNotifications,
        mockWorkflowsDb[0].timeStart,
        mockWorkflowsDb[0].timeEnd,
        mockWorkflowsDb[0].daysOfWeek,
        mockWorkflowsDb[0].schedulingStyleId
      ])
    );
  });

  test('method validateWorkflow should throw an error [Start > End]', async () => {
    const workflow: Workflow = Object.assign(
      {id: 0,
        name: '',
        color: '',
        pushNotifications: false,
        timeStart: new Time(0,0),
        timeEnd: new Time(0,0),
        daysOfWeek: [], 
        schedulingStyle: SS_MAX_ONE
      },
      SS_ASAP
    );
    workflow.timeStart = new Time(11, 0);
    workflow.timeEnd = new Time(10, 0);

    (openDatabase as jest.Mock).mockResolvedValue({ getAllAsync: jest.fn().mockResolvedValue(mockWorkflows) });
    const getWorkflowsMock = jest.spyOn(wfDB, 'getWorkflows').mockResolvedValue(mockWorkflows);
    await expect(validateWorkflow(workflow)).rejects.toThrow(
      'The Start Time of workflow must be earlier than the End Time. Overnight workflow is not supported.'
    );
    getWorkflowsMock.mockRestore();
  });
});