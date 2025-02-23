import React from 'react';
import { render, screen, fireEvent, waitFor} from '@testing-library/react-native';
import CalendarScreen from '../app/screens/CalendarScreen';
import { IoniconsProps } from '../__mocks__/ionicons';
import { SchedulingStyle } from '../app/models/SchedulingStyle';
import {Time} from '../app/models/Time';
import {Event} from '../app/models/Event';
import {Workflow} from '../app/models/Workflow';
import { DEFAULT_COLOR } from '../app/styles/Event.style';
jest.mock('react-native-vector-icons/Ionicons', () => {
  return function MockIonicons(props: IoniconsProps) {
    return <mock-ionicon {...props} />;
  };
});

const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate
  }),
  useFocusEffect: jest.fn(),
}));


const mockSchedulingStyles = [
  new SchedulingStyle(0, 'Schedule close together'),
  new SchedulingStyle(1, 'Schedule with max buffer'),
  new SchedulingStyle(2, 'Schedule with middle buffer'),
  new SchedulingStyle(3, 'Schedule with random buffer')
];

const startTime1 = new Date(Date.now()).setTime(10).toLocaleString();
const endTime1 = new Date(startTime1).setTime(11).toLocaleString();
const startTime2 = new Date(Date.now()).setTime(11).toLocaleString();
const endTime2 = new Date(startTime1).setTime(12).toLocaleString();

const mockEvents = [
  new Event('Event1', 'description1',startTime1, endTime1, 0, 0, 'Driving', 'Test Workflow'),
  new Event('Event2', 'desc2', startTime2, endTime2, 0, 0, 'Driving', null)
]

const mockWorkflows= [
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

jest.mock('../app/scripts/Workflow', () => ({
    getWorkflows: jest.fn(() => Promise.resolve(mockWorkflows)),
    filterWfName: jest.fn((workflows:Workflow[], name:string)=>{
      return workflows.find((wf) => wf.name === name);
    })
}));

jest.mock('../app/scripts/Event',()=>({
  getWeeklyEvents: jest.fn(()=> Promise.resolve(mockEvents))
}));

// Mock dependencies
jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn()
}));
jest.mock('expo-font');

describe('CalendarScreen', () => {
  beforeEach(() => {
      jest.clearAllMocks();
    });
  it('renders correctly with initial layout',async  () => {
    const{getByText} =render(<CalendarScreen />);
    await waitFor(()=>{
      expect(getByText('Time')).toBeOnTheScreen();
      expect(getByText('Su')).toBeOnTheScreen();
      expect(getByText('M')).toBeOnTheScreen();
      
      // Check if time labels are rendered
      expect(getByText('12AM')).toBeOnTheScreen();
      expect(getByText('12PM')).toBeOnTheScreen();
    });
   
    
  });

  it('Gets the current week correct', async()=>{
    const {getByTestId} = render(<CalendarScreen/>);
    await waitFor(()=>{
      const weekHeader = getByTestId('WeekHeader');
      expect(weekHeader).toBeOnTheScreen();
    });
    
  });
  
  test('it renders a workflow event with correct color',()=>{
    const {getByTestId}=render(<CalendarScreen/>);
    void waitFor( ()=>{
      const event1 =getByTestId('Event1');
      expect(event1).toHaveStyle({backgroundColor: mockWorkflows[0].color});
    })
  });

  test('it renders a default event with correct color', ()=>{
    const {getByTestId}=render(<CalendarScreen/>);
    void waitFor(()=>{
      const event1 = getByTestId('Event2');
      expect(event1).toHaveStyle({backgroundColor: DEFAULT_COLOR});
    })
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

});