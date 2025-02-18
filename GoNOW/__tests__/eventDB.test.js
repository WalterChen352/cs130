import { getDailyEvents, clearEvents } from '../app/scripts/Event';
import {initDatabase} from '../app/scripts/Database';
import * as SQLite from 'expo-sqlite';

jest.mock('expo-sqlite');

describe('Event Functions', () => {
  
    beforeEach(() => {
        jest.clearAllMocks();
    });


    test('should retrieve today\'s events', async () => {
        const mockResult = [{ id: 1, name: 'Test Event', startTime: Date.now().toString() }];
        
        // Mock the return value of SQLite.openDatabaseAsync
        const mockDB = {
        getAllAsync: jest.fn().mockResolvedValue(mockResult),
        };
        SQLite.openDatabaseAsync.mockResolvedValue(mockDB);  // Return the mock DB object when openDatabaseAsync is called

        // Call the actual function you want to test
        const events = await getDailyEvents();

        // Assert that the returned events are equal to the mock result
        expect(events).toEqual(mockResult);
        
        // Verify that getAllAsync was called
        expect(mockDB.getAllAsync).toHaveBeenCalled();
        });

});
