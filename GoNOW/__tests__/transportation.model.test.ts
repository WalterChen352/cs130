import { TransportationMode } from '../app/models/TransportationMode';

describe('Transportation Mode Scripts', () => {
  test('should create a TransportationMode instance', () => {
    const mode = new TransportationMode(1, 'Walk', "walking");
    expect(mode).toBeInstanceOf(TransportationMode);
    expect(mode.id).toBe(1);
    expect(mode.name).toBe('Walk');
    expect(mode.google).toBe('walking');
  });
});