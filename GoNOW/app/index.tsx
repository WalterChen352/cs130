import Navigator from './screens/Navigator';
import { useEffect, JSX } from 'react';
import { initDatabase } from './scripts/Database';

export default function Index(): JSX.Element {
  
useEffect(() => {
  const appInit = async (): Promise<void> => {
      try {
          await initDatabase();
      } catch (error) {
          console.error('Error in initializing app:', error);
      }
  };
  void appInit();
}, []);
  return (
    <Navigator/>
  );
}