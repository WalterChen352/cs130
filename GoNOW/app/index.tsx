import TabNavigator from './screens/Navigator';
import { useEffect } from 'react';
import {initializeDatabase, getDailyEvents, clearEvents} from './scripts/database';

export default function Index() {
  useEffect(() => {
    initializeDatabase();
    //getDailyEvents();
    //clearEvents();
  }, []);
  return (
    <TabNavigator></TabNavigator>
  );
}
