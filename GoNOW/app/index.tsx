import Navigator from './screens/Navigator';
import { useEffect, JSX } from 'react';
import {initializeDatabase, getDailyEvents, clearEvents } from './scripts/database';

export default function Index(): JSX.Element {
  
useEffect(() => {
  const setupDatabase = async (): Promise<void> => {
      try {
          await initializeDatabase(); // Ensure DB is initialized before adding events
          console.log('Database initialized.');

          const events = await getDailyEvents(); // Fetch events after adding

          console.log('Daily events:', events);
          await clearEvents(); // Clear events after fetching
          console.log('Events cleared.');

      } catch (error) {
          console.error('Error in database setup:', error);
      }
  };
  setupDatabase();
}, []);
  return (
    <Navigator/>
  );
}
