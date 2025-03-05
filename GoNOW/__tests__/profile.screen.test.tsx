import React from 'react';
import { act, render, fireEvent, waitFor } from '@testing-library/react-native';
import { useNavigation } from '@react-navigation/native';

import { getWorkflows} from '../app/scripts/Workflow';
import { Workflow } from '../app/models/Workflow';
import { Time } from '../app/models/Time';
import APP_SCHEDLING_STYLES,{ SchedulingStyle, SS_ASAP, SS_MAX_ONE } from '../app/models/SchedulingStyle';

import ProfileScreen from '../app/screens/ProfileScreen';
import { View } from 'react-native';
import { IoniconsProps } from '../__mocks__/ionicons';

jest.mock('react-native-vector-icons/Ionicons', () => {
  return function MockIonicons(props: IoniconsProps) {
    return <mock-ionicon {...props} />;
  };
});

jest.mock('../app/scripts/Workflow', () => ({
  getWorkflows: jest.fn(),
}));

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
  useFocusEffect: jest.fn(),
}));

jest.mock('../app/components/AddressPicker', () => {
  return () => <MockAddressPicker />;
});

const MockAddressPicker = () => <View />; 

jest.mock('../app/scripts/Geo', () => {
  return {
    getMyLocation: jest.fn().mockResolvedValue({
      coordinates: { latitude: 33, longitude: 44 },
      address: 'Los Angeles, CA 90095',
    }),
  };
});

jest.mock('../app/scripts/Profile', () => {
  return {
    getLocation: jest.fn().mockResolvedValue({
      coordinates: { latitude: 33, longitude: 44 },
      address: 'Los Angeles, CA 90095',
    }),
    updateLocation: jest.fn(),
  };
});

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

describe('Profile Screen', () => {
  const mockNavigation = { navigate: jest.fn() };

  beforeEach(() => {
    jest.clearAllMocks();
    (useNavigation as jest.Mock).mockReturnValue(mockNavigation);
  });

  test('should render the titles on profile screen', async () => {
    const { getByTestId } = render(<ProfileScreen />);
    
    await waitFor(() => {
      expect(getByTestId('workflow-title')).toHaveTextContent('Workflows');
      expect(getByTestId('home-location-title')).toHaveTextContent('Home Location');
    });
  });
  
  test('should load and render workloads list on profile screen', async () => {
    (getWorkflows as jest.Mock).mockResolvedValue(mockWorkflows);
    const { findByTestId } = render(<ProfileScreen />);

    await waitFor(async () => {
      for (const w of mockWorkflows) {
        const workflowElement = await findByTestId(`workflow-${String(w.id)}`);
        const headerElement = await findByTestId(`workflow-header-${String(w.id)}`);
        const timeElement = await findByTestId(`workflow-text-${String(w.id)}`);
        const styleElement = await findByTestId(`workflow-scheduling-style-${String(w.id)}`);

        expect(workflowElement).toBeTruthy();
        expect(headerElement).toHaveTextContent(new RegExp(w.name, 'i'));
        // Update test to check for time values instead of "Schedule" text
        const startTimeStr = w.timeStart.toString();
        const endTimeStr = w.timeEnd.toString();
        expect(timeElement).toHaveTextContent(new RegExp(`${startTimeStr}.*${endTimeStr}`, 'i'));
        expect(styleElement).toHaveTextContent(new RegExp(w.schedulingStyle.name, 'i'));
      }
    });
  });

  test('should navigate to Workflow create screen when press Create Workload button', async () => {
    const { getByTestId } = render(<ProfileScreen />);
    
    await act(async () => {
      fireEvent.press(getByTestId('workflow-btn-add'));
      return Promise.resolve();
    });

    expect(mockNavigation.navigate).toHaveBeenCalledWith('Workflow', expect.any(Object));
  });
});