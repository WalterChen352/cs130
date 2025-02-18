import { getDailyEvents } from '../app/scripts/Event';
import * as SQLite from 'expo-sqlite';

jest.mock('expo-sqlite', () => ({
    openDatabaseAsync: jest.fn(),
}));

describe('Event Functions', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('should retrieve today\'s events', async () => {
        const mockResult = [{ id: 1, name: 'Test Event', startTime: Date.now().toString() }];

        const mockDB = {
            getAllAsync: jest.fn().mockResolvedValue(mockResult),
        };

        (SQLite.openDatabaseAsync as jest.Mock).mockResolvedValue(mockDB);

        const events = await getDailyEvents();

        expect(events).toEqual(mockResult);
        expect(mockDB.getAllAsync).toHaveBeenCalled();
    });
});
