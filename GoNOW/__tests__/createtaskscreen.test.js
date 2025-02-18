import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import CreateTaskScreen from '../app/screens/CreateTaskScreen';

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

//   it('handles title input correctly', () => {
//     const { getByPlaceholderText } = render(<CreateTaskScreen />);
//     const titleInput = getByPlaceholderText('Title');

//     fireEvent.changeText(titleInput, 'New Task Title');
//     expect(titleInput.props.value).toBe('New Task Title');
//   });

//   it('handles date pickers correctly', async () => {
//     const { getByText } = render(<CreateTaskScreen />);
//     const startDateButton = getByText(new Date().toDateString());

//     fireEvent.press(startDateButton);

//     // Assume DateTimePicker becomes visible
//     await waitFor(() => {
//       expect(getByText('OK')).toBeTruthy();
//     });
//   });

//   it('handles dropdown selection', () => {
//     const { getByText } = render(<CreateTaskScreen />);
//     const dropdown = getByText('Select item');

//     fireEvent.press(dropdown);
//     fireEvent.press(getByText('Walk'));

//     expect(getByText('Walk')).toBeTruthy();
//   });

//   it('calls addEvent on save', async () => {
//     const { getByPlaceholderText, getByText } = render(<CreateTaskScreen />);

//     fireEvent.changeText(getByPlaceholderText('Title'), 'Test Event');
//     fireEvent.changeText(getByPlaceholderText('Task / event description here'), 'Test Description');
//     fireEvent.press(getByText('Save Task'));

//     await waitFor(() => {
//       expect(addEvent).toHaveBeenCalledWith(
//         'Test Event', 
//         'Test Description', 
//         expect.any(String), 
//         expect.any(String), 
//         ''
//       );
//     });
//   });
});
