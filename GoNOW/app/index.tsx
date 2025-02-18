import Navigator from './screens/Navigator';
import { useEffect, JSX } from 'react';
import {initializeDatabase} from './scripts/database';

export default function Index(): JSX.Element {
  
useEffect(() => {
  const appInit = async (): Promise<void> => {
      try {
          await initializeDatabase(); // Ensure DB is initialized before adding events
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