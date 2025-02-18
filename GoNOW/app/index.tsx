import Navigator from './screens/Navigator';
import { useEffect, JSX } from 'react';
import {initializeDatabase} from './scripts/database.js';
import { initDatabase } from './scripts/Database.ts';

export default function Index(): JSX.Element {
  
useEffect(() => {
  const appInit = async (): Promise<void> => {
      try {
          await initializeDatabase(); // Ensure DB is initialized before adding events
          await initDatabase();
      } catch (error) {
          console.error('Error in initializing app:', error);
      }
  };
  appInit();
}, []);
  return (
    <Navigator/>
  );
}