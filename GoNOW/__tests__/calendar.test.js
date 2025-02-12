import React from 'react';
import { render, fireEvent, act, waitFor, screen } from '@testing-library/react-native';
import CalendarScreen from '../app/screens/CalendarScreen';
import { getWeeklyEvents } from '../app/scripts/database';
import { useNavigation } from '@react-navigation/native';

// Mock dependencies
jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn()
}));
jest.mock('expo-font');

describe('CalendarScreen', () => {
  const mockNavigation = {
    navigate: jest.fn()
  };
  const mockEvents = [
    {
      id: '1',
      name: 'Test Event 1',
      startTime: '2025-02-11T10:00:00',
      endTime: '2025-02-11T11:00:00'
    },
    {
      id: '2',
      name: 'Test Event 2',
      startTime: '2025-02-11T14:00:00',
      endTime: '2025-02-11T15:00:00'
    }
  ];

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