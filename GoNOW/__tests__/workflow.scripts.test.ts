import * as wfDB from '../app/scripts/Workflow';
import { getWorkflows, clearWorkflows, addWorkflow, validateWorkflow } from '../app/scripts/Workflow';
import { openDatabase } from '../app/scripts/Database';
import { Workflow } from '../app/models/Workflow';
import { Time } from '../app/models/Time';
import { SchedulingStyle } from '../app/models/SchedulingStyle';

jest.mock('../app/scripts/Database', () => ({
  openDatabase: jest.fn(() => Promise.resolve({ getAllAsync: jest.fn(), runAsync: jest.fn(), execAsync: jest.fn() })),
}));

const mockSchedulingStyles: SchedulingStyle[] = [
  new SchedulingStyle(0, 'Schedule close together'),
  new SchedulingStyle(1, 'Schedule with max buffer'),
  new SchedulingStyle(2, 'Schedule with middle buffer'),
  new SchedulingStyle(3, 'Schedule with random buffer')
];

interface WorkflowDbFormat {
  id: number;
  name: string;
  color: string;
  pushNotifications: boolean;
  timeStart: number;
  timeEnd: number;
  daysOfWeek: number;
  schedulingStyle: number;
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
    schedulingStyle: workflow.schedulingStyle.Id,
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
    mockSchedulingStyles[0]
  ),
  new Workflow(
    2,
    'Errand',
    '#d3eef9',
    true,
    new Time(11, 0),
    new Time(17, 0),
    [true, false, false, false, false, false, true],
    mockSchedulingStyles[1]
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
      expect(workflows[i]?.timeStart.Hours).toBe(wf.timeStart.Hours);
      expect(workflows[i]?.timeStart.Minutes).toBe(wf.timeStart.Minutes);
      expect(workflows[i]?.timeEnd.Hours).toBe(wf.timeEnd.Hours);
      expect(workflows[i]?.timeEnd.Minutes).toBe(wf.timeEnd.Minutes);
      expect(workflows[i]?.schedulingStyle.Name).toBe(wf.schedulingStyle.Name);
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
        mockWorkflowsDb[0].schedulingStyle
      ])
    );
  });

  test('method validateWorkflow should throw an error [Start > End]', async () => {
    const workflow: Workflow = Object.assign(
      new Workflow(0, '', '', false, new Time(0, 0), new Time(0, 0), [], mockSchedulingStyles[0]),
      mockWorkflows[0]
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