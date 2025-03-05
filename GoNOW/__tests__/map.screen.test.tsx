import * as polyline from 'polyline';
import { act, render, waitFor, fireEvent } from '@testing-library/react-native';

import Route from '../app/models/Geo';
import { Location } from '../app/models/Location';
import { SS_ASAP, SS_MAX_ONE } from '../app/models/SchedulingStyle';
import { Time } from '../app/models/Time';
import { Workflow } from '../app/models/Workflow';
import MapScreen from '../app/screens/MapScreen';
import { getMyLocation, getRoute } from '../app/scripts/Geo';
import { MapEventAdapter, IMapEvent } from '../app/scripts/Map';
import { getLocation } from '../app/scripts/Profile';
import { getTransportationMode } from '../app/scripts/TransportationMode';

// Mocking external dependencies
jest.mock('../app/components/ButtonSave');
jest.mock('../app/scripts/Geo');
jest.mock('../app/scripts/Map');
jest.mock('../app/scripts/Profile');
jest.mock('../app/scripts/TransportationMode');
jest.mock('polyline');

jest.mock('../app/scripts/Geo', () => ({
  getMyLocation: jest.fn() as jest.Mock<Promise<Location>>,
  getRoute: jest.fn() as jest.Mock<Promise<Route[] | null>>,
  approxDistanceFeets: jest.fn() as jest.Mock<number>,
}));

jest.mock('../app/scripts/Event', () => ({
  getDailyEvents: jest.fn() as jest.Mock<Promise<Event[]>>
}));

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
  useFocusEffect: jest.fn(),
}));

const mockWorkflows:Workflow[] = [
  {
    id:1,
    name:'School',
    color:'#d5f9cf',
    pushNotifications:false,
    timeStart:new Time(9, 0),
    timeEnd:new Time(10, 0),
    daysOfWeek:[false, true, true, false, true, false, false],
    schedulingStyle:SS_ASAP
  },
  {
    id:2,
    name:'Errand',
    color:'#d3eef9',
    pushNotifications:true,
    timeStart:new Time(11, 0),
    timeEnd:new Time(17, 0),
    daysOfWeek:[true, false, false, false, false, false, true],
    schedulingStyle:SS_MAX_ONE
  }
];

const mockIMapEvents: IMapEvent[] = [
  {
    id: 1,
    name: 'Meeting',
    description: 'Business meeting',
    startTime: new Date(new Date().getTime() + 1 * 60 * 60 * 1000),
    endTime: new Date(new Date().getTime() + 2 * 60 * 60 * 1000),
    coordinates: {latitude: 34.0522, longitude:-118.2437},
    transportationMode: getTransportationMode(0),
    workflow: mockWorkflows[0]
  },
  {
    id: 2,
    name: 'Party',
    description: 'Birthday party',
    startTime: new Date(new Date().getTime() + 3 * 60 * 60 * 1000),
    endTime: new Date(new Date().getTime() + 4 * 60 * 60 * 1000),
    coordinates: {latitude:34.0522, longitude:-118.2437},
    transportationMode: getTransportationMode(0),
    workflow: mockWorkflows[1]
  }
];

describe('Map Screen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    //{coordinates:{ latitude: xxx: longitud: xxx}, address: "Kerckhoff"}
    (getMyLocation as jest.Mock).mockResolvedValue({coordinates:{latitude:34.0689027, longitude:-118.4456223}, address:"Kerckhoff Hall"});
    (getLocation as jest.Mock).mockResolvedValue({coordinates:{latitude:34.0689027, longitude:-118.4456223}, address:"Kerckhoff Hall"});
    (MapEventAdapter as jest.Mock).mockResolvedValue(mockIMapEvents);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    (polyline.decode as jest.Mock).mockReturnValue([[34.0709027, -118.4466223], [34.0719027, -118.4476223]]);
  });

  it('should render the map with loading state', async () => {
      const { getByTestId, unmount } = render(<MapScreen />);
      await waitFor(() => {
        expect(getByTestId('map')).toBeTruthy();
      });
      unmount();
  });

  it('should load and display events markers', async () => {
    const { getByTestId, unmount } = render(<MapScreen />);
    await waitFor(() => {
      expect(getByTestId('marker-event-1')).toBeTruthy();
      expect(getByTestId('marker-event-2')).toBeTruthy();
    });
    unmount();
  });

  it('should display device location on map', async () => {
    const { getByTestId, unmount } = render(<MapScreen />);
    await waitFor(() => {
      expect(getByTestId('marker-device')).toBeTruthy();
    });
    unmount();
  });

  it('should display home location on map', async () => {
    const { getByTestId, unmount } = render(<MapScreen />);
    await waitFor(() => {
      expect(getByTestId('marker-home')).toBeTruthy();
    });
    unmount();
  });

  it('should build route when event marker is pressed', async () => {
    const { getByTestId, unmount } = render(<MapScreen />);
    await waitFor(() => {
      const eventMarker = getByTestId('marker-event-1');
      act(() => {
        fireEvent.press(eventMarker);
      });
      expect(getRoute).toHaveBeenCalled();
    });
    unmount();
  });

});