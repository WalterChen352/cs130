import * as wfDB from "../app/scripts/Workflow";
import { getWorkflows, clearWorkflows, addWorkflow, updateWorkflow, deleteWorkflow, validateWorkflow } from "../app/scripts/Workflow";
import { openDatabase } from "../app/scripts/Database";
import { Workflow } from "../app/models/Workflow";
import { Time } from "../app/models/Time";
import { SchedulingStyle } from "../app/models/SchedulingStyle";
import { getSchedulingStyle } from "../app/scripts/SchedulingStyle";

jest.mock("../app/scripts/Database", () => ({
  openDatabase: jest.fn(),
}));

const mockSchedulingStyles = [
  new SchedulingStyle(0, "Schedule close together"),
  new SchedulingStyle(1, "Schedule with max buffer"),
  new SchedulingStyle(2, "Schedule with middle buffer"),
  new SchedulingStyle(3, "Schedule with random buffer")
];

const mockWorkflow = new Workflow(
  1,
  "Test Workflow",
  "#388dff",
  true,
  new Time(8, 30),
  new Time(17, 0),
  [true, false, true, false, true, false, true],
  mockSchedulingStyles[3],
);

const toDbFormat = (workflow) => {
  let daysOfWeekMask = 0;
  workflow.DaysOfWeek.forEach((d,i) => {
    if (d) daysOfWeekMask = daysOfWeekMask | (1 << i);
  });

  return {
    id: workflow.Id,
    name: workflow.Name,
    color: workflow.Color,
    pushNotifications: workflow.PushNotifications,
    timeStart: workflow.TimeStart.toInt(),
    timeEnd: workflow.TimeEnd.toInt(),
    daysOfWeek: daysOfWeekMask,
    schedulingStyle: workflow.SchedulingStyle.Id,
  }
}

const mockWorkflows = [
  new Workflow(
    1,
    "School",
    "#d3eef9",
    false,
    new Time(9, 0),
    new Time(10, 0),
    [false, true, true, false, true, false, false],
    mockSchedulingStyles[0]
  ),
  new Workflow(
    2,
    "Errand",
    "#d3eef9",
    true,
    new Time(11, 0),
    new Time(17, 0),
    [true, false, false, false, false, false, true],
    mockSchedulingStyles[1]
  ),
];

const mockWorkflowsDb = []
mockWorkflows.forEach(w => {
  mockWorkflowsDb.push(toDbFormat(w))
});

describe("Workflow Database", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("method getWorkflows should return list workflows from the database", async () => {
    const mockDb = {
      getAllAsync: jest.fn().mockResolvedValue(mockWorkflowsDb),
    };
    openDatabase.mockResolvedValue(mockDb);
    const workflows = await getWorkflows();
    expect(workflows).toHaveLength(mockWorkflows.length);
    for(let i = 0; i < mockWorkflows.length; i++) {
      expect(workflows[i].Id).toBe(mockWorkflows[i].Id);
      expect(workflows[i].Name).toBe(mockWorkflows[i].Name);
      expect(workflows[i].Color).toBe(mockWorkflows[i].Color);
      expect(workflows[i].PushNotifications).toBe(mockWorkflows[i].PushNotifications);
      expect(workflows[i].TimeStart.Hours).toBe(mockWorkflows[i].TimeStart.Hours);
      expect(workflows[i].TimeStart.Minutes).toBe(mockWorkflows[i].TimeStart.Minutes);
      expect(workflows[i].TimeEnd.Hours).toBe(mockWorkflows[i].TimeEnd.Hours);
      expect(workflows[i].TimeEnd.Minutes).toBe(mockWorkflows[i].TimeEnd.Minutes);
      expect(workflows[i].SchedulingStyle.Name).toBe(mockWorkflows[i].SchedulingStyle.Name);
      expect(workflows[i].DaysOfWeek).toEqual(mockWorkflows[i].DaysOfWeek);
    }
    
  });

  test("method clearWorkflows should delete all workflows from the database", async () => {
    const mockDb = {
      execAsync: jest.fn().mockResolvedValue(undefined),
    };
    openDatabase.mockResolvedValue(mockDb);
    await clearWorkflows();
    expect(mockDb.execAsync).toHaveBeenCalledWith(`
      PRAGMA journal_mode = WAL;
      DELETE FROM workflows;
    `);
  });

  test("method addWorkflow should insert a new workflow into the database", async () => {
    const mockDb = {
      runAsync: jest.fn().mockResolvedValue(undefined),
    };
    openDatabase.mockResolvedValue(mockDb);
    await addWorkflow(mockWorkflows[0]);
    expect(mockDb.runAsync).toHaveBeenCalledWith(
      expect.stringContaining("INSERT INTO workflow"),
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

  test("method updateWorkflow should update an existing workflow in the database", async () => {
    const mockDb = {
      runAsync: jest.fn().mockResolvedValue(undefined),
    };
    openDatabase.mockResolvedValue(mockDb);
    await updateWorkflow(mockWorkflows[0]);
    expect(mockDb.runAsync).toHaveBeenCalledWith(
      expect.stringContaining("UPDATE workflow"),
      expect.arrayContaining([
        mockWorkflowsDb[0].name,
        mockWorkflowsDb[0].color,
        mockWorkflowsDb[0].pushNotifications,
        mockWorkflowsDb[0].timeStart,
        mockWorkflowsDb[0].timeEnd,
        mockWorkflowsDb[0].daysOfWeek,
        mockWorkflowsDb[0].schedulingStyle,
        mockWorkflowsDb[0].id
      ])
    );
  });

  test("method deleteWorkflow should remove a workflow from the database", async () => {
    const mockDb = {
      runAsync: jest.fn().mockResolvedValue(undefined),
    };
    openDatabase.mockResolvedValue(mockDb);
    await deleteWorkflow(mockWorkflows[0]);
    expect(mockDb.runAsync).toHaveBeenCalledWith(
      expect.stringContaining("DELETE FROM workflow"),
      expect.arrayContaining([mockWorkflowsDb[0].id])
    );
  });

  test("method validateWorkflow should not throw an error", async () => {
    const mockDb = {
      getAllAsync: jest.fn().mockResolvedValue(mockWorkflows),
    };
    const workflow = {...mockWorkflows[0]};

    openDatabase.mockResolvedValue(mockDb);
    const getWorkflowsMock = jest.spyOn(wfDB, "getWorkflows").mockResolvedValue(mockWorkflows);
    await expect(validateWorkflow(workflow)).resolves.not.toThrow();
    getWorkflowsMock.mockRestore();
  });

  test("method validateWorkflow should throw an error [Name is required]", async () => {
    const mockDb = {
      getAllAsync: jest.fn().mockResolvedValue(mockWorkflows),
    };
    const workflow = {...mockWorkflows[0]};
    workflow.Name = "";

    openDatabase.mockResolvedValue(mockDb);
    const getWorkflowsMock = jest.spyOn(wfDB, "getWorkflows").mockResolvedValue(mockWorkflows);
    await expect(validateWorkflow(workflow)).rejects.toThrow(
      "The Worklow Name field is required."
    );
    getWorkflowsMock.mockRestore();
  });

  test("method validateWorkflow should throw an error [Start > End]", async () => {
    const mockDb = {
      getAllAsync: jest.fn().mockResolvedValue(mockWorkflows),
    };
    const workflow = {...mockWorkflows[0]};
    workflow.TimeStart = new Time(11, 0);
    workflow.TimeEnd = new Time(10, 0);

    openDatabase.mockResolvedValue(mockDb);
    const getWorkflowsMock = jest.spyOn(wfDB, "getWorkflows").mockResolvedValue(mockWorkflows);
    await expect(validateWorkflow(workflow)).rejects.toThrow(
      "The Start Time of workflow must be earlier than the End Time. Overnight workflow is not supported."
    );
    getWorkflowsMock.mockRestore();
  });

  test("method validateWorkflow should throw an error [Days of week is required]", async () => {
    const mockDb = {
      getAllAsync: jest.fn().mockResolvedValue(mockWorkflows),
    };
    const workflow = {...mockWorkflows[0]};
    workflow.DaysOfWeek = new Array(7).fill(false);

    openDatabase.mockResolvedValue(mockDb);
    const getWorkflowsMock = jest.spyOn(wfDB, "getWorkflows").mockResolvedValue(mockWorkflows);
    await expect(validateWorkflow(workflow)).rejects.toThrow(
      "Select at least one day of the week."
    );
    getWorkflowsMock.mockRestore();
  });

  test("method validateWorkflow should throw an multi errors", async () => {
    const mockDb = {
      getAllAsync: jest.fn().mockResolvedValue(mockWorkflows),
    };
    const workflow = {...mockWorkflows[0]};
    workflow.Name = "";
    workflow.TimeStart = new Time(11, 0);
    workflow.TimeEnd = new Time(10, 0);
    workflow.DaysOfWeek = new Array(7).fill(false);

    openDatabase.mockResolvedValue(mockDb);
    const getWorkflowsMock = jest.spyOn(wfDB, "getWorkflows").mockResolvedValue(mockWorkflows);
    await expect(validateWorkflow(workflow)).rejects.toThrow(
      "The Worklow Name field is required.\n" +
      "The Start Time of workflow must be earlier than the End Time. Overnight workflow is not supported.\n" +
      "Select at least one day of the week."
    );
    getWorkflowsMock.mockRestore();
  });

});

