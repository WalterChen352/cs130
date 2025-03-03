import React from 'react';
import { act, render, fireEvent, waitFor } from '@testing-library/react-native';
import AddressPicker from '../app/components/AddressPicker';
import { Coordinates, Location } from '../app/models/Location';
import { IoniconsProps } from '../__mocks__/ionicons'

jest.mock('lodash/debounce', () => {
  return jest.fn((fn: (...args: unknown[]) => void) => fn);
});

jest.mock('react-native-vector-icons/Ionicons', () => {
  return function MockIonicons(props: IoniconsProps) {
    return <mock-ionicon {...props} />;
  };
});

jest.mock('../app/scripts/Geo', () => ({
  getAddressByCoordinates: jest.fn(() => Promise.resolve('Kerckhoff Hall')),
}));

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    status: 200,
    headers: new Headers(),
    redirected: false,
    statusText: 'OK',
    type: 'basic',
    url: 'http://example.com',
    json: () =>
      Promise.resolve([
        {
          place_id: 1,
          display_name: '7400 Boelter Hall, Los Angeles, CA 90095',
          lat: '34.0689604',
          lon: '-118.4449446',
        },
      ]),
    text: () => Promise.resolve(''),
    blob: () => Promise.resolve(new Blob()),
    arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
    formData: () => Promise.resolve(new FormData()),
    clone: () => ({
      /* Mock clone method */
    }),
  } as Response)
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

  test('should handles click on place selection from search results and opens the map', async () => {
    const onSelectMock = jest.fn();
    const { getByTestId } = render(
      <AddressPicker onSelect={onSelectMock} />
    );
    act(() => { fireEvent.press(getByTestId('map-btn')); });
    await waitFor(() => { expect(getByTestId('map-btn-save')).toBeTruthy() });
  });

  test('shold handle dradNdrop marker on map and save its coordinates', async () => {
    const onSelectMock = jest.fn();
    const initialCoordinates = new Coordinates(34.0522, -118.2437);
    const { getByTestId } = render(
      <AddressPicker initialCoordinates={initialCoordinates} onSelect={onSelectMock} />
    );
    fireEvent.press(getByTestId('map-btn'));
    const mockEvent = {
      nativeEvent: { coordinate: { latitude: 34.0689604, longitude: -118.4463165 } },
    };
    // Drag marker
    act(() => { fireEvent(getByTestId('map-marker'), 'onDragEnd', mockEvent); });
    await waitFor(() => { expect(getByTestId('map-btn-save')).toBeTruthy(); });
    // Click Save
    act(() => { fireEvent.press(getByTestId('map-btn-save')); });
    await waitFor(() => {
      expect(onSelectMock).toHaveBeenCalledWith(
        new Location(new Coordinates(34.0689604, -118.4463165), 'Kerckhoff Hall')
      );
    });
  });

});