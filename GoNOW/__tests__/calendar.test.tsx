import React from 'react';
import { render, waitFor, cleanup, fireEvent,  act } from '@testing-library/react-native';
import CalendarScreen from '../app/screens/CalendarScreen';
import { ReactTestInstance } from 'react-test-renderer';
import { IoniconsProps } from '../__mocks__/ionicons';
import { SchedulingStyle, SS_ASAP } from '../app/models/SchedulingStyle';
import { Time } from '../app/models/Time';
import { Event } from '../app/models/Event';
import { Workflow } from '../app/models/Workflow';
import { Colors } from '../app/styles/Common.styles'

jest.mock('react-native-vector-icons/Ionicons', () => {
  return function MockIonicons(props: IoniconsProps) {
    return <mock-ionicon {...props} />;
  };
});


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

const mockWorkflows = [
  new Workflow(
    1,
    'Test Workflow',
    Colors.DARK_GRAY,
    true,
    new Time(8, 30),
    new Time(17, 0),
    [true, false, true, false, true, false, true],
    SS_ASAP
  )
];

jest.mock('../app/scripts/Workflow', () => ({
  getWorkflows: jest.fn(() => Promise.resolve(mockWorkflows)),
  tryFilterWfId: jest.fn((workflows: Workflow[], id: number) => {
    return workflows.find((wf) => wf.id === id);
  })
}));

jest.mock('../app/scripts/Event', () => ({
  getWeeklyEvents: jest.fn(() => Promise.resolve(mockEvents))
}));

const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate
  }),
  useFocusEffect: jest.fn(),
}));

interface GestureHandlerProps {
  children: React.ReactNode;
}

jest.mock('react-native-gesture-handler', () => ({
  GestureDetector: ({ children }: GestureHandlerProps): React.ReactNode => children,
  Gesture: {
    Exclusive: jest.fn(),
    Fling: () => ({
      direction: () => ({
        onEnd: () => ({
          runOnJS: jest.fn()
        })
      })
    })
  },
  Directions: {
    LEFT: 1,
    RIGHT: 2
  }
}));

describe('CalendarScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('renders correctly with initial layout', async () => {
    const { getByText } = render(<CalendarScreen />);
    await waitFor(() => {
      expect(getByText('Time')).toBeOnTheScreen();
      expect(getByText('Su')).toBeOnTheScreen();
      expect(getByText('M')).toBeOnTheScreen();
      expect(getByText('12AM')).toBeOnTheScreen();
      expect(getByText('12PM')).toBeOnTheScreen();
    });
  });

  it('Gets the current week correct', async () => {
    const { getByTestId } = render(<CalendarScreen />);
    await waitFor(() => {
      const weekHeader = getByTestId('WeekHeader');
      expect(weekHeader).toBeOnTheScreen();
    });
  });

  test('it renders a workflow event with correct color', async () => {
    const { getByTestId } = render(<CalendarScreen />);
    await waitFor(() => {
      const event1 = getByTestId('Event1');
      expect(event1).toHaveStyle({ backgroundColor: mockWorkflows[0].color });
    });
  });

  test('it renders a default event with correct color', async () => {
    const { getByTestId } = render(<CalendarScreen />);
    await waitFor(() => {
      const event2 = getByTestId('Event2');
      expect(event2).toHaveStyle({ backgroundColor: Colors.LIGHT_BLUE });
    });
  });

  it('navigates to daily view when event is pressed', async () => {
    const { getByTestId } = render(<CalendarScreen />);
    
    let event: ReactTestInstance;
    await waitFor(() => {
      const foundEvent = getByTestId('Event1');
      expect(foundEvent).toBeTruthy();
      event = foundEvent;
    });

    act(() => {
      fireEvent.press(event);
    });
    
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('Daily', {
        eventDate: new Date(mockEvents[0].startTime).toISOString(),
        eventId: mockEvents[0].id
      });
    });
  });
});