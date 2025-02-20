import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import CalendarScreen from '../app/screens/CalendarScreen';
import { getWeeklyEvents } from '../app/scripts/Event';

const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate
  }),
  useFocusEffect: jest.fn(),
}));

jest.mock('react-native-vector-icons', () => ({
  Ionicons: jest.fn(() => null),
}));

jest.mock('../app/scripts/Event', () => ({
  getWeeklyEvents: jest.fn()
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


const mockEvents = [
  {
    id: 1,
    name: "Test Event 1",
    description: "Test Description",
    startTime: "2025-02-19 10:00:00",
    endTime: "2025-02-19 11:00:00",
    latitude: 33,
    longitude: -117,
    transportationMode: "car",
    workflow: null
  },
  {
    id: 2,
    name: "Test Event 2",
    description: "Test Description",
    startTime: "2025-02-19 14:00:00",
    endTime: "2025-02-19 15:00:00",
    latitude: 33,
    longitude: -117,
    transportationMode: "car",
    workflow: null
  }
];

describe('CalendarScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (getWeeklyEvents as jest.Mock).mockResolvedValue(mockEvents);
  });

  it('renders the basic calendar layout', async () => {
    render(
        <CalendarScreen />
    );

    await waitFor(() => {
      // Check if basic structure is rendered
      expect(screen.getByText('Time')).toBeOnTheScreen();
      expect(screen.getByText('Su')).toBeOnTheScreen();
      expect(screen.getByText('M')).toBeOnTheScreen();
      
      // Check if time labels are rendered
      expect(screen.getByText('12AM')).toBeOnTheScreen();
      expect(screen.getByText('12PM')).toBeOnTheScreen();

      expect(screen.getByTestId('WeekHeader')).toBeOnTheScreen();
      expect(screen.getByTestId('back-button')).toBeOnTheScreen();
      expect(screen.getByTestId('forward-button')).toBeOnTheScreen();
    });
  });

  it('displays events after fetching', async () => {
    render(
        <CalendarScreen />
    );

    await waitFor(() => {
      expect(getWeeklyEvents).toHaveBeenCalled();
    });
    
    await waitFor(() => {
      const events = screen.getAllByTestId('calendar-event');
      expect(events).toHaveLength(2);
      expect(screen.getByText('Test Event 1')).toBeOnTheScreen();
      expect(screen.getByText('Test Event 2')).toBeOnTheScreen();
    });
  });

  it('navigates to daily view when event is pressed', async () => {
    render(
        <CalendarScreen />
    );

    await waitFor(() => {
      const events = screen.getAllByTestId('calendar-event');
      fireEvent.press(events[0]);
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('Daily', expect.objectContaining({
        eventId: 1
      }));
    });
  });

  it('updates week range when navigation buttons are pressed', async () => {
    render(
        <CalendarScreen />
    );

    const initialWeekHeader = await waitFor(() => screen.getByTestId('WeekHeader'));
    const initialText: string = initialWeekHeader.props.children as string;

    await waitFor(() => {
      const forwardButton = screen.getByTestId('forward-button');
      fireEvent.press(forwardButton);
    });

    await waitFor(() => {
      const newWeekHeader = screen.getByTestId('WeekHeader');
      expect(newWeekHeader.props.children).not.toBe(initialText);
    });

    await waitFor(() => {
      const backButton = screen.getByTestId('back-button');
      fireEvent.press(backButton);
    });

    await waitFor(() => {
      const finalWeekHeader = screen.getByTestId('WeekHeader');
      expect(finalWeekHeader.props.children).toBe(initialText);
    });
  });
});