import React from 'react';
import { act, render, fireEvent, waitFor } from '@testing-library/react-native';
import { useNavigation } from '@react-navigation/native';

import { getWorkflows} from '../app/scripts/Workflow';
import { Workflow } from '../app/models/Workflow';
import { SchedulingStyle } from '../app/models/SchedulingStyle';
import { Time } from '../app/models/Time';
import ProfileScreen from '../app/screens/ProfileScreen';
import { View } from 'react-native';

jest.mock('react-native-vector-icons', () => ({
  Ionicons: jest.fn(() => null),
}));

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

const MockAddressPicker = (props) => <View {...props} />;

jest.mock('../app/scripts/Geo', () => {
  return {
    getMyLocation: jest.fn().mockResolvedValue({
      Coordinates: { Latitude: 33, Longitude: 44 },
      Address: 'Los Angeles, CA 90095',
    }),
  };
});

jest.mock('../app/scripts/Profile', () => {
  return {
    getLocation: jest.fn().mockResolvedValue({
      Coordinates: { Latitude: 33, Longitude: 44 },
      Address: 'Los Angeles, CA 90095',
    }),
    updateLocation: jest.fn(),
  };
});

const mockSchedulingStyles = [
  new SchedulingStyle(0, 'Schedule close together'),
  new SchedulingStyle(1, 'Schedule with max buffer'),
  new SchedulingStyle(2, 'Schedule with mmiddle buffer'),
  new SchedulingStyle(3, 'Schedule with random buffer')
];

const mockWorkflows = [
  new Workflow(
    1,
    'School',
    '#d5f9cf',
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

describe('Profile Screen', () => {
  const mockNavigation = { navigate: jest.fn() };

  beforeEach(() => {
    jest.clearAllMocks();
    (useNavigation as jest.Mock).mockReturnValue(mockNavigation);
  });

  test('should render the titles on profile screen', async () => {
    const {getByTestId, unmount} = render(<ProfileScreen />);
    await waitFor(() => {
      expect(getByTestId('workflow-title')).toHaveTextContent('Workflows');
      expect(getByTestId('home-location-title')).toHaveTextContent('Home Location');
    });
    unmount();
  });

  test('should load and render workloads list on profile screen', async () => {
    (getWorkflows as jest.Mock).mockResolvedValue(mockWorkflows);
    const {findByTestId, unmount} = render(<ProfileScreen />);
    await waitFor(() => {
      for (let i = 0; i < {mockWorkflows}.length; i++){
        const w = mockWorkflows[i];
        expect(findByTestId(`workflow-${String(w.Id)}`)).toBeTruthy();
        expect(findByTestId(`workflow-header-${String(w.Id)}`)).toHaveTextContent(new RegExp(w.Name, 'i'));
        expect(findByTestId(`workflow-text-${String(w.Id)}`)).toHaveTextContent(/Schedule/);
        expect(findByTestId(`workflow-text-${String(w.Id)}`)).toHaveTextContent(new RegExp(w.TimeStart.toString(), 'i'));
        expect(findByTestId(`workflow-text-${String(w.Id)}`)).toHaveTextContent(new RegExp(w.TimeEnd.toString(), 'i'));
        expect(findByTestId(`workflow-scheduling-style-${String(w.Id)}`)).toHaveTextContent(new RegExp(w.SchedulingStyle.Name, 'i'));
      }
    });
    await waitFor(() => {
      unmount();
    });
  });

  test('should navigate to Workflow create screen when press Create Workload button', async () => {
    const {getByTestId, unmount} = render(<ProfileScreen />);
    await act(async () => {
      fireEvent.press(getByTestId('workflow-btn-add'));
      return Promise.resolve();
    });
    await waitFor(() => {
      expect(mockNavigation.navigate).toHaveBeenCalledWith('Workflow', expect.any(Object));
    });
    await waitFor(() => {
      unmount();
    });
  });

});
