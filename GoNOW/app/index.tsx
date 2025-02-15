import { initDatabase } from './scripts/Database';
import Navigator from './screens/Navigator';
import { JSX, useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from "react-native"
import {initializeDatabase, getDailyEvents, clearEvents, addEvent} from './scripts/database';

export default function Index(): JSX.Element {
  const [dbReady, setDbReady] = useState(false);

  useEffect(() => {
    const setupDatabase = async (): Promise<void> => {

      await initDatabase(); // Initialize DB for all tables needed
      setDbReady(true);

      try {
        await initializeDatabase(); // Ensure DB is initialized before adding events
        console.log('Database initialized.');

        await addEvent('Study1', 'Descr1', '2025-02-05 16:00:00', '2025-02-05 16:30:00', 0, 0, 'walking');
        await addEvent('Study2', 'Descr2', '2025-02-05 12:00:00', '2025-02-05 12:30:00', 0, 0, 'walking');
        await addEvent('Study3', 'Descr3', '2025-03-05 16:00:00', '2025-03-05 16:30:00', 0, 0, 'walking');
        // console.log("Events added.");

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

  return dbReady
    ? (<Navigator/>)
    : (<View style={styles.spiner}>
        <ActivityIndicator size="large" />
        <Text>Loading...</Text>
      </View>);
}

const styles = StyleSheet.create({
  spiner: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  }
});