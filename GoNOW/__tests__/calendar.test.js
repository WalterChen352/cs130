import React from 'react';
import { render, waitFor, screen } from '@testing-library/react-native';
import CalendarScreen from '../app/screens/CalendarScreen';

// Mock dependencies
jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn()
}));
jest.mock('expo-font');

describe('CalendarScreen', () => {

  it('renders correctly with initial layout', async () => {
    render(<CalendarScreen />);
    await waitFor(()=>{
      screen.getByText('Time');
    });
    // Check if basic structure is rendered
    expect(screen.getByText('Time')).toBeOnTheScreen();
    expect(screen.getByText('Su')).toBeOnTheScreen();
    expect(screen.getByText('M')).toBeOnTheScreen();
    
    // Check if time labels are rendered
    expect(screen.getByText('12AM')).toBeOnTheScreen();
    expect(screen.getByText('12PM')).toBeOnTheScreen();
  });

  it('Gets the current week correct', async()=>{
    render(<CalendarScreen/>);
    await waitFor(()=>{
      screen.getByTestId('WeekHeader');
    });
    const weekHeader = screen.getByTestId('WeekHeader');
    expect(weekHeader).toBeOnTheScreen();
    console.log(weekHeader.innerHTML);
  });
  
});