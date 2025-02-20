import React from 'react';
import { render } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import Navigator from '../app/screens/Navigator';

// Mock all the screen components
jest.mock('../app/screens/MapScreen', () => () => null);
jest.mock('../app/screens/DailyScreen', () => () => null);
jest.mock('../app/screens/CreateTaskScreen', () => () => null);
jest.mock('../app/screens/CalendarScreen', () => () => null);
jest.mock('../app/screens/ProfileScreen', () => () => null);

// Mock the Ionicons component
jest.mock('@expo/vector-icons', () => ({
  Ionicons: 'Ionicons'
}));

describe('TabNavigator', () => {

  it('has correct screen options', () => {
    const { queryByText } = render(
      <NavigationContainer>
        <Navigator />
      </NavigationContainer>
    );

    // CreateTask should not be visible in the tab bar
    expect(queryByText('CreateTask')).toBeNull();
  });

  // Test custom tab bar rendering
  it('renders custom tab bar with correct icons', () => {
    const { getAllByTestId } = render(
      <NavigationContainer>
        <Navigator />
      </NavigationContainer>
    );

    const icons = getAllByTestId('tab-icon');
    expect(icons).toHaveLength(5);
  });
});