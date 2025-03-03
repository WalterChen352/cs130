import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import CreateTaskScreen from '../app/screens/CreateTaskScreen';
import { getLocation } from '../app/scripts/Profile';
import { getMyLocation } from '../app/scripts/Geo';
import { RouteProp } from '@react-navigation/native';
import { TabParamList } from '../app/screens/Navigator';
import { addEvent } from '../app/scripts/Event';

jest.mock('../app/scripts/Profile', () => ({
  getLocation: jest.fn()
}));

jest.mock('../app/scripts/Geo', () => ({
  getMyLocation: jest.fn()
}));

jest.mock('../app/scripts/Event', () => ({
  addEvent: jest.fn(),
  updateEvent: jest.fn()
}));

// Create mock routes
const createMockRoute: RouteProp<TabParamList, 'CreateTask'> = {
  key: 'create-task-key',
  name: 'CreateTask',
  params: {
    mode: undefined,
    eventData: undefined
  }
};

const editMockRoute: RouteProp<TabParamList, 'CreateTask'> = {
  key: 'edit-task-key',
  name: 'CreateTask',
  params: {
    mode: 'edit',
    eventData: {
      id: 1,
      name: "Test Event",
      description: "Test Description",
      startTime: "2022-12-12 12:00:00",
      endTime: "2022-12-12 13:00:00",
      latitude: 33,
      longitude: -117,
      transportationMode: "car",
      workflow: null
    }
  }
};

describe('CreateTaskScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup default mock returns
    (getLocation as jest.Mock).mockResolvedValue({
      address: "123 Test St",
      coordinates: {
        latitude: 34.0522,
        longitude: -118.2437
      }
    });

    (getMyLocation as jest.Mock).mockResolvedValue({
      address: null,
      coordinates: {
        latitude: 34.0522,
        longitude: -118.2437
      }
    });
  });

  it('renders correctly with initial layout for create mode', async () => {
    render(<CreateTaskScreen route={createMockRoute} />);

    await waitFor(() => {
      expect(screen.getByTestId('Title')).toBeOnTheScreen();
      expect(screen.getByTestId('Description')).toBeOnTheScreen();
      expect(screen.getByText('Select start time')).toBeOnTheScreen();
      expect(screen.getByText('Select end time')).toBeOnTheScreen();
      expect(screen.getByText('Select transportation mode')).toBeOnTheScreen();
      expect(screen.getByText('Select workflow')).toBeOnTheScreen();
      expect(screen.getByText("Create Task")).toBeOnTheScreen();
    });
  });

  it('fetches location when not in edit mode', async () => {
    render(<CreateTaskScreen route={createMockRoute} />);

    await waitFor(() => {
      expect(getLocation).toHaveBeenCalled();
      expect(screen.getByTestId('Title')).toBeOnTheScreen();
    });
  });

  it('populates form fields in edit mode', async () => {
    render(<CreateTaskScreen route={editMockRoute} />);

    await waitFor(() => {
      expect(screen.getByTestId('Title')).toHaveProp('value', 'Test Event');
      expect(screen.getByTestId('Description')).toHaveProp('value', 'Test Description');
      expect(screen.getByText("Update Task")).toBeOnTheScreen();
    });
  });

  it('does not fetch location in edit mode', async () => {
    render(<CreateTaskScreen route={editMockRoute} />);

    await waitFor(() => {
      expect(getLocation).not.toHaveBeenCalled();
      expect(getMyLocation).not.toHaveBeenCalled();
    });
  });

  //TODO:: needs to set a valid name and start and end time first
  // it('updates event when update task button is pressed', async () => {
  //   render(<CreateTaskScreen route={editMockRoute} />);

  //   await waitFor(() => {
  //     fireEvent.press(screen.getByText("Update Task"));
  //     expect(updateEvent).toHaveBeenCalled();
      
  //   });
  // });

  it('does not add event when create task button is pressed with invalid input', async () => {
    render(<CreateTaskScreen route={createMockRoute} />);

    await waitFor(() => {
      fireEvent.press(screen.getByText("Create Task"));
      expect(addEvent).not.toHaveBeenCalled();
    });
  });
});