import TabNavigator from './screens/Navigator';
import { useEffect } from 'react';
import {initializeDatabase, getDailyEvents} from './scripts/database';

export default function Index() {
  useEffect(() => {
    initializeDatabase();
    getDailyEvents();
  }, []);
  return (
    <TabNavigator></TabNavigator>
  );
}
