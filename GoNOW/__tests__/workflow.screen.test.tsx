import React from 'react';
import { Alert } from 'react-native';
import { act, render, fireEvent, waitFor } from '@testing-library/react-native';
import { useNavigation } from '@react-navigation/native';

import { SchedulingStyle } from '../app/models/SchedulingStyle';
import { Time } from '../app/models/Time';
import WorkflowScreen from '../app/screens/WorkflowScreen';
import { getSchedulingStyles } from '../app/scripts/SchedulingStyle';
import { addWorkflow, updateWorkflow, deleteWorkflow, validateWorkflow } from '../app/scripts/Workflow';

jest.mock('@expo/vector-icons', () => ({
  Ionicons: 'Ionicons'
}));

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

const mockSchedulingStyles = [
  new SchedulingStyle(0, 'Schedule close together'),
  new SchedulingStyle(1, 'Schedule with max buffer'),
  new SchedulingStyle(2, 'Schedule with mmiddle buffer'),
  new SchedulingStyle(3, 'Schedule with random buffer')
];

const mockWorkflow = {
  Id: 1,
  Name: 'Test Workflow',
  Color: '#388dff',
  PushNotifications: true,
  TimeStart: new Time(8, 30),
  TimeEnd: new Time(17, 0),
  DaysOfWeek: [true, false, true, false, true, false, true],
  SchedulingStyle: mockSchedulingStyles[3],
};

describe('Workflow Screen', () => {
  const mockNavigation = { navigate: jest.fn() };

  beforeEach(() => {
    jest.clearAllMocks();
    (useNavigation as jest.Mock).mockReturnValue(mockNavigation);
    (getSchedulingStyles as jest.Mock).mockResolvedValue(mockSchedulingStyles);
  });

  //afterEach(cleanup);

  test('should render the updating screen for existing workflow', async () => {

    // Rendering the component
    const route = { params: { workflow: mockWorkflow }};
    const {getByTestId, queryByTestId, unmount} = render(<WorkflowScreen route={route} />);

    await waitFor(() => {

      expect(getByTestId('workflow-title')).toHaveTextContent('Update the workflow');
      expect(getByTestId('workflow-name')).toHaveProp('value', mockWorkflow.Name);
      expect(getByTestId('workflow-push-notifications')).toHaveProp('value', mockWorkflow.PushNotifications);
      expect(getByTestId('workflow-time-start')).toHaveTextContent(mockWorkflow.TimeStart.toString());
      expect(getByTestId('workflow-time-end')).toHaveTextContent(mockWorkflow.TimeEnd.toString());

      const schedulingStyleElement = getByTestId('workflow-scheduling-style');
      const props = schedulingStyleElement.props as { selectedIndex: number; items: { id: number; value: string }[] };
      const schedulingStyleValue = props.items[props.selectedIndex]?.value;
      expect(schedulingStyleValue).toEqual(mockWorkflow.SchedulingStyle.Id);

      expect(queryByTestId('workflow-btn-save')).toBeTruthy();    // Visible
      expect(queryByTestId('workflow-btn-delete')).toBeTruthy();  // Visible
    });

    await waitFor(() => {
      unmount();
    });
  });

  test('should render the creating screen for new workflow', async () => {
    const mockWorkflow = {
      Id: 0,
      Name: '',
      Color: '#d5f9cf',
      PushNotifications: true,
      TimeStart: new Time(9, 5),
      TimeEnd: new Time(10, 11),
      DaysOfWeek: new Array(7).fill(false),
      SchedulingStyle: mockSchedulingStyles[0],
    };

    // Rendering the component
    const route = { params: { workflow: mockWorkflow }};
    const {getByTestId, queryByTestId, unmount} = render(<WorkflowScreen route={route} />);

    await waitFor(() => {

      expect(getByTestId('workflow-title')).toHaveTextContent('Add a workflow');
      expect(getByTestId('workflow-name')).toHaveProp('value', mockWorkflow.Name);
      expect(getByTestId('workflow-push-notifications')).toHaveProp('value', mockWorkflow.PushNotifications);
      expect(getByTestId('workflow-time-start')).toHaveTextContent(mockWorkflow.TimeStart.toString());
      expect(getByTestId('workflow-time-end')).toHaveTextContent(mockWorkflow.TimeEnd.toString());

      const schedulingStyleElement = getByTestId('workflow-scheduling-style');
      const props = schedulingStyleElement.props as { 
        selectedIndex: number; 
        items: { id: number; value: string }[]; 
      };
      const schedulingStyleIndex = props.selectedIndex;
      const schedulingStyleValue = props.items[schedulingStyleIndex]?.value;
      expect(schedulingStyleValue).toEqual(mockWorkflow.SchedulingStyle.Id);

      expect(queryByTestId('workflow-btn-save')).toBeTruthy();    // Visible
      expect(queryByTestId('workflow-btn-delete')).toBeNull();    // Invisible
    });

    await waitFor(() => {
      unmount();
    });
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

    await waitFor(() => {
      unmount();
    });
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

    await waitFor(() => {
      unmount();
    });
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

    await waitFor(() => {
      expect(mockNavigation.navigate).toHaveBeenCalledWith('Profile');
    });

    await waitFor(() => {
      unmount();
    });
  });

  test('should handle add workflow', async () => {
    (validateWorkflow as jest.Mock).mockResolvedValueOnce(undefined);

    const mockWorkflow = {
      Id: 0,
      Name: '',
      Color: '#d5f9cf',
      PushNotifications: true,
      TimeStart: new Time(9, 5),
      TimeEnd: new Time(10, 11),
      DaysOfWeek: new Array(7).fill(false),
      SchedulingStyle: mockSchedulingStyles[0],
    };
    const route = { params: { workflow: mockWorkflow }};
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

    await waitFor(() => {
      expect(mockNavigation.navigate).toHaveBeenCalledWith('Profile');
    });

    await waitFor(() => {
      unmount();
    });
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
      `Remove workflow ${mockWorkflow.Name}?`,
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
    });
    
    await waitFor(() => {
      expect(mockNavigation.navigate).toHaveBeenCalledWith('Profile');
    });

    await waitFor(() => {
      unmount();
    });

  });

});
