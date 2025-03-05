import * as wfDB from '../app/scripts/Workflow';
import { getWorkflows, clearWorkflows, addWorkflow, validateWorkflow } from '../app/scripts/Workflow';
import { openDatabase } from '../app/scripts/Database';
import { Workflow } from '../app/models/Workflow';
import { Time } from '../app/models/Time';
import { SchedulingStyle, SS_ASAP } from '../app/models/SchedulingStyle';

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

const mockWorkflows: Workflow[] = [
  new Workflow(
    1,
    'School',
    '#d3eef9',
    false,
    new Time(9, 0),
    new Time(10, 0),
    [false, true, true, false, true, false, false],
    SS_ASAP
  ),
  new Workflow(
    2,
    'Errand',
    '#d3eef9',
    true,
    new Time(11, 0),
    new Time(17, 0),
    [true, false, false, false, false, false, true],
    SS_ASAP
  ),
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
      new Workflow(0, '', '', false, new Time(0, 0), new Time(0, 0), [], SS_ASAP),
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