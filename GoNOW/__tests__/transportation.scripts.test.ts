import { TransportationMode } from '../app/models/TransportationMode';
import { getTransportationMode, getTransportationModes } from '../app/scripts/TransportationMode';

describe('Transportation Mode Scripts', () => {
  test('getSchedulingStyles should return the full list of transportation modes', () => {
    expect(getTransportationModes()).toHaveLength(5);
  });

  test('getTransportationMode should return the correct transportation mode by id', () => {
    expect(getTransportationMode(0).id).toEqual(0);

    expect(getTransportationMode(1).id).toEqual(1);
    expect(getTransportationMode(1).name).toEqual('Walk');
    expect(getTransportationMode(1).apiName).toEqual('walking');

    expect(getTransportationMode(2).id).toEqual(2);
    expect(getTransportationMode(2).name).toEqual('Bus');
    expect(getTransportationMode(2).apiName).toEqual('transit');

    expect(getTransportationMode(3).id).toEqual(3);
    expect(getTransportationMode(3).name).toEqual('Bike');
    expect(getTransportationMode(3).apiName).toEqual('bicycling');

    expect(getTransportationMode(4).id).toEqual(4);
    expect(getTransportationMode(4).name).toEqual('Car');
    expect(getTransportationMode(4).apiName).toEqual('driving');
  });

  test('getTransportationMode should return default transportation mode when id is not found', () => 
  {
    const defaultColor = '#666666';
    expect(getTransportationMode(99)).toEqual(new TransportationMode(0, '', '', defaultColor));
    expect(getTransportationMode(-1)).toEqual(new TransportationMode(0, '', '', defaultColor));
  });
});
