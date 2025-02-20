import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import AddressPicker from '../app/components/AddressPicker';
import { Coordinates, Location } from '../app/models/Location';

jest.mock('lodash/debounce', () => {
  return jest.fn((fn: (...args: unknown[]) => void) => fn);
});

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () =>
      Promise.resolve([
        {
          place_id: 1,
          display_name: '7400 Boelter Hall, Los Angeles, CA 90095',
          lat: '34.0689604',
          lon: '-118.4449446',
        },
      ]),
  })
);

describe('AddressPicker', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should render placeholder text', () => {
    const { getByPlaceholderText } = render(<AddressPicker placeHolder="Where's the Money, Lebowski?" />);
    expect(getByPlaceholderText('Where\'s the Money, Lebowski?')).toBeTruthy();
  });

  test('renders correctly and handles text input', async () => {
    const onSelectMock = jest.fn();
    const { getByTestId, getByText } = render(
      <AddressPicker onSelect={onSelectMock} />
    );
    const input = getByTestId('address-picker');
    fireEvent.changeText(input, 'Test');
    await waitFor(() => { expect(fetch).toHaveBeenCalledTimes(1); });
    const locationItem = await waitFor(() => getByText('7400 Boelter Hall, Los Angeles, CA 90095'));
    fireEvent.press(locationItem);

    expect(onSelectMock).toHaveBeenCalledWith(
      expect.objectContaining(new Location(new Coordinates(34.0689604, -118.4449446), '7400 Boelter Hall, Los Angeles, CA 90095'))
    );
  });

});