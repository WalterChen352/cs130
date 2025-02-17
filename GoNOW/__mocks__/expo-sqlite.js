export const openDatabaseAsync = jest.fn(async () => ({
    execAsync: jest.fn(async () => Promise.resolve()),
    getAllAsync: jest.fn(async () => Promise.resolve([])),
    runAsync: jest.fn(async () => Promise.resolve()),
  }));
  
  export const openDatabaseSync = jest.fn(() => ({
    execAsync: jest.fn(async () => Promise.resolve()),
  }));
