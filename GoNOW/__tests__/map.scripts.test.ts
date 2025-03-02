import { Coordinates } from '../app/models/Location';
import SchedulingStyle from '../app/models/SchedulingStyle';
import { Time } from '../app/models/Time';
import TransportationMode from '../app/models/TransportationMode';
import { Workflow } from '../app/models/Workflow';
import { getDailyEvents } from '../app/scripts/Event';
import { MapEventAdapter } from '../app/scripts/Map';
import { getTransportationMode, getTransportationModeByName } from '../app/scripts/TransportationMode';
import { getWorkflowById } from '../app/scripts/Workflow';

jest.mock('../app/scripts/Event', () => ({
  getDailyEvents: jest.fn() as jest.Mock<Promise<Event[]>>
}));

jest.mock('../app/scripts/TransportationMode', () => ({
  getTransportationMode: jest.fn() as jest.Mock<TransportationMode>,
  getTransportationModeByName: jest.fn() as jest.Mock<TransportationMode>
}));

jest.mock('../app/scripts/Workflow', () => ({
  getWorkflowById: jest.fn() as jest.Mock<Promise<Workflow | null>>
}));

describe('MapEventAdapter', () => {
  it('should correctly convert Event to IMapEvent format', async () => {
    const mockEvents = [
      {
        id: 1,
        name: 'Meeting',
        description: 'Business meeting',
        startTime: '2025-02-23T10:00:00Z',
        endTime: '2025-02-23T11:00:00Z',
        latitude: 34.0522,
        longitude: -118.2437,
        transportationMode: 'Car',
        workflow: 'Work'
      }
    ];
    const mockTransportationMode = new TransportationMode(1, 'Car', 'car', '#fff');
    const mockWorkflow = new Workflow(
      1,
      'Work',
      '#fc0',
      true,
      new Time(1, 11),
      new Time(2, 22),
      [false, true, true, false, true, false, false],
      new SchedulingStyle(1, 'Cool')
    );

    (getDailyEvents as jest.Mock).mockResolvedValue(mockEvents);
    (getTransportationModeByName as jest.Mock).mockReturnValue(mockTransportationMode); // by name only
    (getWorkflowById as jest.Mock).mockResolvedValue(mockWorkflow);

    const result = await MapEventAdapter();

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      id: 1,
      name: 'Meeting',
      description: 'Business meeting',
      startTime: new Date('2025-02-23T10:00:00Z'),
      endTime: new Date('2025-02-23T11:00:00Z'),
      coordinates: new Coordinates(34.0522, -118.2437),
      transportationMode: mockTransportationMode,
      workflow: mockWorkflow
    });
  });

  it('should handle events without workflow', async () => {
    const mockEvents = [
      {
        id: 2,
        name: 'Gym',
        description: 'Workout session',
        startTime: '2025-02-23T07:00:00Z',
        endTime: '2025-02-23T08:00:00Z',
        latitude: 34.0522,
        longitude: -118.2437,
        transportationMode: '1',
        workflow: null
      }
    ];
    const mockTransportationMode = new TransportationMode(1, 'Bike', 'bike', '#fff');

    (getDailyEvents as jest.Mock).mockResolvedValue(mockEvents);
    (getTransportationMode as jest.Mock).mockReturnValue(mockTransportationMode); // by id only
    (getWorkflowById as jest.Mock).mockResolvedValue(null);

    const result = await MapEventAdapter();

    expect(result).toHaveLength(1);
    expect(result[0].workflow).toBeNull();
  });
});