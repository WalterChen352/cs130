import { initializeDatabase, getDailyEvents, clearEvents, getWeeklyEvents, addEvent } from "../app/scripts/database";
import * as SQLite from "expo-sqlite";

jest.mock("expo-sqlite");

describe("Database Functions", () => {
  
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("initializeDatabase should create a table", async () => {
        await initializeDatabase();

        expect(SQLite.openDatabaseAsync).toHaveBeenCalledWith("userEvents.db");
        const dbMock = await SQLite.openDatabaseAsync.mock.results[0].value;
        expect(dbMock.execAsync).toHaveBeenCalledWith(expect.stringContaining("CREATE TABLE IF NOT EXISTS events"));
    });

    test("should retrieve today's events", async () => {
        const mockResult = [{ id: 1, name: "Test Event", startTime: Date.now().toString() }];
        
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

    test("clearEvents should drop the events table", async () => {
        await clearEvents();

        expect(SQLite.openDatabaseSync).toHaveBeenCalledWith("userEvents.db");
        const dbMock = SQLite.openDatabaseSync.mock.results[0].value;
        expect(dbMock.execAsync).toHaveBeenCalledWith(expect.stringContaining("DROP TABLE events"));
    });

});
