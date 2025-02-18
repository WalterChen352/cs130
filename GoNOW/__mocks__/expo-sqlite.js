export const openDatabaseAsync = jest.fn(() => ({
    execAsync: jest.fn(async () =>{ await  Promise.resolve(); }),
    getAllAsync: jest.fn(async () => await Promise.resolve([])),
    runAsync: jest.fn(async () => { await Promise.resolve(); }),
  }));
  
  export const openDatabaseSync = jest.fn(() => ({
    execAsync: jest.fn(async () =>{ await  Promise.resolve(); }),
  }));
