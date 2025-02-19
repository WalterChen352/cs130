import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import CreateTaskScreen from '../app/screens/CreateTaskScreen';
import { addEvent } from '../app/scripts/Database';

jest.mock('../app/scripts/database', () => ({
  addEvent: jest.fn(),
}));

describe('CreateTaskScreen', () => {
  it('renders all input fields correctly', () => {
    const { getByTestId } = render(<CreateTaskScreen />);
    
    // Check if all input fields are rendered
    expect(getByTestId('Title')).toBeTruthy();
    expect(getByTestId('Transportation Mode')).toBeTruthy();
    expect(getByTestId('Description')).toBeTruthy();
    expect(getByTestId('Save Task')).toBeTruthy();
  });

  it('handles title input correctly', () => {
    const { getByPlaceholderText } = render(<CreateTaskScreen />);
    const titleInput = getByPlaceholderText('Title');

    fireEvent.changeText(titleInput, 'New Task Title');
    expect(titleInput.props.value).toBe('New Task Title');
  });

  // TODO:: seems to not accurately test whether or not the pressable is pressable
  it('calls addEvent on save', async () => {
    const { getByTestId, getByText } = render(<CreateTaskScreen />);

    fireEvent.changeText(getByTestId('Title'), 'Test Event');
    fireEvent.changeText(getByTestId('Description'), 'Test Description');
    fireEvent.press(getByTestId('Save Task'));

    await waitFor(() => {
      expect(addEvent).toHaveBeenCalled();
    });
  });
});
