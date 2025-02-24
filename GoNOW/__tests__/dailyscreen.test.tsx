import { cleanup, render, waitFor } from "@testing-library/react-native";
import DailyScreen from "../app/screens/DailyScreen";
import { RouteProp } from "@react-navigation/native";
import { TabParamList } from "../app/screens/Navigator";
import { SchedulingStyle } from '../app/models/SchedulingStyle';
import { Time } from '../app/models/Time';
import { Event } from '../app/models/Event';
import { Workflow } from '../app/models/Workflow';
import { DEFAULT_COLOR } from '../app/styles/Event.style';
import { NavigationContainer } from '@react-navigation/native';
import * as EventScripts from '../app/scripts/Event';
import * as WorkflowScripts from '../app/scripts/Workflow';

// Mock the navigation hooks

// Mock the Event and Workflow scripts
jest.mock('../app/scripts/Event', () => ({
  getDailyEvents: jest.fn(),
  deleteEvent: jest.fn(),
}));

jest.mock('../app/scripts/Workflow', () => ({
  getWorkflows: jest.fn(),
  filterWFID: jest.fn(),
}));

const mockSchedulingStyles = [
  new SchedulingStyle(0, 'Schedule close together'),
  new SchedulingStyle(1, 'Schedule with max buffer'),
  new SchedulingStyle(2, 'Schedule with middle buffer'),
  new SchedulingStyle(3, 'Schedule with random buffer')
];

const now = new Date();
const startTime1 = new Date(now);
startTime1.setHours(10, 0, 0);
const endTime1 = new Date(now);
endTime1.setHours(11, 0, 0);
const startTime2 = new Date(now);
startTime2.setHours(11, 0, 0);
const endTime2 = new Date(now);
endTime2.setHours(12, 0, 0);

const mockEvents = [
  new Event(
    'Event1',
    'description1',
    startTime1.toLocaleString(),
    endTime1.toLocaleString(),
    0,
    0,
    'Driving',
    1
  ),
  new Event(
    'Event2',
    'desc2',
    startTime2.toLocaleString(),
    endTime2.toLocaleString(),
    0,
    0,
    'Driving',
    null
  )
];

const mockWorkflows = [
  new Workflow(
    1,
    'Test Workflow',
    '#388dff',
    true,
    new Time(8, 30),
    new Time(17, 0),
    [true, false, true, false, true, false, true],
    mockSchedulingStyles[3]
  )
];

describe('DailyScreen', () => {
  const route = {
    key: 'daily-screen',
    name: 'Daily',
    params: { eventDate: new Date(Date.now()).toLocaleString() }
  } as RouteProp<TabParamList, 'Daily'>;

  beforeEach(() => {
    jest.clearAllMocks();
    // Setup mock return values
    (EventScripts.getDailyEvents as jest.Mock).mockResolvedValue(mockEvents);
    (WorkflowScripts.getWorkflows as jest.Mock).mockResolvedValue(mockWorkflows);
    (WorkflowScripts.filterWFID as jest.Mock).mockImplementation((workflows:Workflow[], id:number) => {
      return workflows.find(w => w.id === id);
    });
  });

  afterEach(() => {
    cleanup();
  });

  const renderWithNavigation = (component: React.ReactElement) => {
    return render(
      <NavigationContainer>
        {component}
      </NavigationContainer>
    );
  };

  test('it renders the default color correctly', async () => {
    const { getByTestId } = renderWithNavigation(<DailyScreen route={route} />);
    await waitFor(() => {
      expect(getByTestId(mockEvents[1].name)).toHaveStyle({ backgroundColor: DEFAULT_COLOR });
    });
  });

  test('it renders a workflow color correctly', async () => {
    const { getByTestId } = renderWithNavigation(<DailyScreen route={route} />);
    await waitFor(() => {
      expect(getByTestId(mockEvents[0].name)).toHaveStyle({ backgroundColor: mockWorkflows[0].color });
    });
  });
});