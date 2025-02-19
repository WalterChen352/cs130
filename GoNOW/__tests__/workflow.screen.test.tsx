import React from 'react';
import { Alert, View, ViewProps } from 'react-native';
import { act, render, fireEvent, waitFor } from '@testing-library/react-native';
import { useNavigation } from '@react-navigation/native';

import { SchedulingStyle } from '../app/models/SchedulingStyle';
import { Time } from '../app/models/Time';
import WorkflowScreen from '../app/screens/WorkflowScreen';
import { getSchedulingStyles } from '../app/scripts/SchedulingStyle';
import { addWorkflow, updateWorkflow, deleteWorkflow, validateWorkflow } from '../app/scripts/Workflow';
import { IoniconsProps } from '../__mocks__/ionicons';

jest.mock('react-native-vector-icons/Ionicons', () => {
  return function MockIonicons(props: IoniconsProps) {
    return <mock-ionicon {...props} />;
  };
});

jest.mock('../app/scripts/Workflow', () => ({
  addWorkflow: jest.fn(),
  updateWorkflow: jest.fn(),
  deleteWorkflow: jest.fn(),
  validateWorkflow: jest.fn(),
}));

jest.mock('../app/scripts/SchedulingStyle', () => ({
  getSchedulingStyles: jest.fn(),
  getSchedulingStyle: jest.fn(),
}));

jest.mock('react-native-reanimated', () => {
  const actualReanimated = jest.requireActual<typeof import('react-native-reanimated')>('react-native-reanimated');
  
  return {
    ...actualReanimated,
    default: jest.fn(),
  };
});

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
  useFocusEffect: jest.fn(),
}));

jest.mock('react-native/Libraries/Alert/Alert', () => ({
  alert: jest.fn(),
}));

// Define proper types for the Picker props
interface PickerProps extends ViewProps {
  children: React.ReactNode;
  selectedValue?: string | number;
  onValueChange?: (value: string | number) => void;
}

interface PickerItemProps extends ViewProps {
  label: string;
  value: string | number;
  children?: React.ReactNode;
}

function MockPicker({ children, ...props }: PickerProps): React.ReactElement {
  return React.createElement(View, props, children);
}

MockPicker.Item = function MockPickerItem(props: PickerItemProps): React.ReactElement {
  return React.createElement(View, props, props.children);
};

jest.mock('@react-native-picker/picker', () => ({
  __esModule: true,
  Picker: MockPicker,
}));

const mockSchedulingStyles = [
  new SchedulingStyle(0, 'Schedule close together'),
  new SchedulingStyle(1, 'Schedule with max buffer'),
  new SchedulingStyle(2, 'Schedule with middle buffer'),
  new SchedulingStyle(3, 'Schedule with random buffer')
];

const mockWorkflow = {
  id: 1,
  name: 'Test Workflow',
  color: '#388dff',
  pushNotifications: true,
  timeStart: new Time(8, 30),
  timeEnd: new Time(17, 0),
  daysOfWeek: [true, false, true, false, true, false, true],
  schedulingStyle: mockSchedulingStyles[3],
};

describe('Workflow Screen', () => {
  const mockNavigation = { navigate: jest.fn() };

  beforeEach(() => {
    jest.clearAllMocks();
    (useNavigation as jest.Mock).mockReturnValue(mockNavigation);
    (getSchedulingStyles as jest.Mock).mockReturnValue(mockSchedulingStyles);
  });

  test('should render the updating screen for existing workflow', async () => {
    const route = { params: { workflow: mockWorkflow }};
    const {getByTestId, queryByTestId, unmount} = render(<WorkflowScreen route={route} />);

    await waitFor(() => {
      expect(getByTestId('workflow-title')).toHaveTextContent('Update the workflow');
      expect(getByTestId('workflow-name')).toHaveProp('value', mockWorkflow.name);
      expect(getByTestId('workflow-push-notifications')).toHaveProp('value', mockWorkflow.pushNotifications);
      expect(getByTestId('workflow-time-start')).toHaveTextContent(mockWorkflow.timeStart.toString());
      expect(getByTestId('workflow-time-end')).toHaveTextContent(mockWorkflow.timeEnd.toString());

      expect(queryByTestId('workflow-btn-save')).toBeTruthy();
      expect(queryByTestId('workflow-btn-delete')).toBeTruthy();
    });

    unmount();
  });

  test('should render the creating screen for new workflow', async () => {
    const newMockWorkflow = {
      id: 0,
      name: '',
      color: '#d5f9cf',
      pushNotifications: true,
      timeStart: new Time(9, 5),
      timeEnd: new Time(10, 11),
      daysOfWeek: new Array(7).fill(false),
      schedulingStyle: mockSchedulingStyles[0],
    };

    const route = { params: { workflow: newMockWorkflow }};
    const {getByTestId, queryByTestId, unmount} = render(<WorkflowScreen route={route} />);

    await waitFor(() => {
      expect(getByTestId('workflow-title')).toHaveTextContent('Add a workflow');
      expect(getByTestId('workflow-name')).toHaveProp('value', newMockWorkflow.name);
      expect(getByTestId('workflow-push-notifications')).toHaveProp('value', newMockWorkflow.pushNotifications);
      expect(getByTestId('workflow-time-start')).toHaveTextContent(newMockWorkflow.timeStart.toString());
      expect(getByTestId('workflow-time-end')).toHaveTextContent(newMockWorkflow.timeEnd.toString());

      expect(queryByTestId('workflow-btn-save')).toBeTruthy();
      expect(queryByTestId('workflow-btn-delete')).toBeNull();
    });

    unmount();
  });

  test('should update the workflow name', async () => {
    const route = { params: { workflow: mockWorkflow }};
    const {getByTestId, unmount} = render(<WorkflowScreen route={route} />);

    const el = getByTestId('workflow-name');
    await act(async () => {
      fireEvent.changeText(el, 'Updated Workflow Name');
      return Promise.resolve();
    });
    expect(el).toHaveProp('value', 'Updated Workflow Name');

    unmount();
  });

  test('should toggle push notifications', async () => {
    const route = { params: { workflow: mockWorkflow }};
    const {getByTestId, unmount} = render(<WorkflowScreen route={route} />);

    const el = getByTestId('workflow-push-notifications');
    await act(async () => {
      fireEvent(el, 'valueChange', false);
      return Promise.resolve();
    });
    expect(el).toHaveProp('value', false);

    await act(async () => {
      fireEvent(el, 'valueChange', true);
      return Promise.resolve();
    });
    expect(el).toHaveProp('value', true);

    unmount();
  });

  test('should handle save workflow', async () => {
    (validateWorkflow as jest.Mock).mockResolvedValueOnce(undefined);

    const route = { params: { workflow: mockWorkflow }};
    const {getByTestId, unmount} = render(<WorkflowScreen route={route} />);

    const saveButton = getByTestId('workflow-btn-save');
    await act(async () => {
      fireEvent.press(saveButton);
      return Promise.resolve();
    });

    expect(updateWorkflow).toHaveBeenCalled();
    expect(mockNavigation.navigate).toHaveBeenCalledWith('Profile');

    unmount();
  });

  test('should handle add workflow', async () => {
    (validateWorkflow as jest.Mock).mockResolvedValueOnce(undefined);

    const newMockWorkflow = {
      id: 0,
      name: '',
      color: '#d5f9cf',
      pushNotifications: true,
      timeStart: new Time(9, 5),
      timeEnd: new Time(10, 11),
      daysOfWeek: new Array(7).fill(false),
      schedulingStyle: mockSchedulingStyles[0],
    };
    
    const route = { params: { workflow: newMockWorkflow }};
    const {getByTestId, unmount} = render(<WorkflowScreen route={route} />);

    await act(async () => {
      fireEvent.changeText(getByTestId('workflow-name'), 'New workflow name');
      return Promise.resolve();
    });

    await act(async () => {
      fireEvent.press(getByTestId('workflow-day-of-week-0'));
      return Promise.resolve();
    });

    const saveButton = getByTestId('workflow-btn-save');
    await act(async () => {
      fireEvent.press(saveButton);
      return Promise.resolve();
    });

    expect(addWorkflow).toHaveBeenCalled();
    expect(mockNavigation.navigate).toHaveBeenCalledWith('Profile');

    unmount();
  });

  test('should delete workflow on confirmation', async () => {
    (validateWorkflow as jest.Mock).mockResolvedValueOnce(undefined);

    const route = { params: { workflow: mockWorkflow }};
    const {getByTestId, unmount} = render(<WorkflowScreen route={route} />);

    await act(async () => {
      fireEvent.press(getByTestId('workflow-btn-delete'));
      return Promise.resolve();
    });

    expect(Alert.alert).toHaveBeenCalledWith(
      'Confirm',
      `Remove workflow ${mockWorkflow.name}?`,
      expect.any(Array),
      { cancelable: false }
    );
    
    const alertMockCalls = (Alert.alert as jest.Mock).mock.calls as [string, string, { text: string; onPress: () => void }[], { cancelable: boolean }][];
    const alertArgs = alertMockCalls[0]?.[2] ?? [];
    const okButton = alertArgs.find((button) => button.text === 'OK');
    
    if (okButton) {
      act(() => {
        okButton.onPress();
      });
    }

    await waitFor(() => {
      expect(deleteWorkflow).toHaveBeenCalled();
      expect(mockNavigation.navigate).toHaveBeenCalledWith('Profile');
    });

    unmount();
  });
});