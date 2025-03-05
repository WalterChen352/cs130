import { cleanup, render, waitFor } from "@testing-library/react-native";
import DailyScreen from "../app/screens/DailyScreen";
import { RouteProp } from "@react-navigation/native";
import { TabParamList } from "../app/screens/Navigator";
import { SchedulingStyle, SS_ASAP } from '../app/models/SchedulingStyle';
import { Time } from '../app/models/Time';
import { Event } from '../app/models/Event';
import { Workflow } from '../app/models/Workflow';
import { Colors } from '../app/styles/Common.styles';
import { NavigationContainer } from '@react-navigation/native';


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
    {latitude:0, longitude:0},
    'Driving',
    1
  ),
  new Event(
    'Event2',
    'desc2',
    startTime2.toLocaleString(),
    endTime2.toLocaleString(),
    {latitude:0, longitude:0},
    'Driving',
    null
  )
];

const mockWorkflows:Workflow[] = [
  {
    id:1,
    name:'Test Workflow',
    color:'#388dff',
    pushNotifications:true,
    timeStart:new Time(8, 30),
    timeEnd:new Time(17, 0),
    daysOfWeek:[true, false, true, false, true, false, true],
   schedulingStyle: SS_ASAP
  }
];

// Mock the Event and Workflow scripts
jest.mock('../app/scripts/Event', () => ({
  getDailyEvents: jest.fn(() => Promise.resolve(mockEvents)),
  deleteEvent: jest.fn(),
}));

jest.mock('../app/scripts/Workflow', () => ({
  getWorkflows: jest.fn(() => Promise.resolve(mockWorkflows)),
  tryFilterWfId: jest.fn((workflows: Workflow[], id: number) => {
    return workflows.find(wf => wf.id === id);
  }),
}));

describe('DailyScreen', () => {
  const route = {
    key: 'daily-screen',
    name: 'Daily',
    params: {
      eventDate: new Date(Date.now()).toLocaleString()
    }
  } as RouteProp<TabParamList, 'Daily'>;

  beforeEach(() => {
    jest.clearAllMocks();
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
      expect(getByTestId(mockEvents[1].name)).toHaveStyle({ backgroundColor: Colors.LIGHT_BLUE });
    });
  });

  test('it renders a workflow color correctly', async () => {
    const { getByTestId } = renderWithNavigation(<DailyScreen route={route} />);
    await waitFor(() => {
      expect(getByTestId(mockEvents[0].name)).toHaveStyle({ backgroundColor: mockWorkflows[0].color });
    });
  });
});