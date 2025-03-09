import { JSX, useEffect, useState, Fragment } from 'react';
import { ActivityIndicator, Linking, Text, TouchableOpacity, View, Platform } from 'react-native';
import * as TaskManager from 'expo-task-manager';
import * as Notifications from 'expo-notifications';
import Navigator from './screens/Navigator';
import ForegroundTask from './components/ForegroundTask';
import NotificationDisplay from './components/Notifications';

import { initDatabase } from './scripts/Database';
import { getMyLocation } from './scripts/Geo';
import { getLocation, updateLocation, getUID, setUID } from './scripts/Profile';
import { registerBackgroundFetchAsync } from './scripts/BackgroundTasks';
import { IndexStyles as styles } from './styles/Index.styles';

const url = 'https://gonow-5ry2jtelsq-wn.a.run.app/ping';
const headers = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'access-token': process.env.EXPO_PUBLIC_ACCESS_TOKEN ?? ''
};

export default function Index(): JSX.Element {
  const [status, setStatus] = useState<number>(0); // 0 - loading; 1 - ready; 2 - error

  useEffect(() => {
    const appInit = async (): Promise<void> => {
      try {
        // Fetch UID once if needed
        const uid = await getUID();
        if (uid === null) {
          const response = await fetch(url, { method: 'GET', headers });
          const data = await response.json() as { uid: number };
          console.log('uid data is', String(data.uid));
          await setUID(data.uid);
        }

        // Initialize DB
        await initDatabase();

        // Store location if needed
        const location = await getLocation();
        if (
          location === null ||
          (!location.address &&
            location.coordinates.latitude === 0 &&
            location.coordinates.longitude === 0)
        ) {
          const currentLocation = await getMyLocation();
          if (currentLocation !== null) {
            await updateLocation(currentLocation);
          }
        }

        // Register background tasks
        await registerBackgroundFetchAsync();
        const tasks: TaskManager.TaskManagerTask[] = await TaskManager.getRegisteredTasksAsync();
        console.log('Registered tasks:', tasks);

        // --- Notification Setup Moved Here ---
        Notifications.setNotificationHandler({
          handleNotification: async () => ({
            shouldShowAlert: true,
            shouldPlaySound: false,
            shouldSetBadge: false
          })
        });

        // Request permission (iOS)
        await Notifications.requestPermissionsAsync();

        // Create notification channel (Android)
        if (Platform.OS === 'android') {
          await Notifications.setNotificationChannelAsync('GoNOW Notifications', {
            name: 'GoNOW Notifications',
            importance: Notifications.AndroidImportance.HIGH
          });
        }
        // --------------------------------------

        setStatus(1);
      } catch (error) {
        setStatus(2);
        console.error('Error in initializing app:', error);
      }
    };
    void appInit();
  }, []);

  if (status === 1) {
    return (
      <Fragment>
        <Navigator />
        <ForegroundTask />
        <NotificationDisplay />
      </Fragment>
    );
  } else if (status === 0) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" />
        <Text>Loading...</Text>
      </View>
    );
  } else {
    return (
      <View style={styles.loading}>
        <Text>Something went wrong</Text>
        <Text>¯\_(ツ)_/¯</Text>
        <Text />
        <Text>
          <TouchableOpacity
            onPress={() => {
              void Linking.openURL('https://walterchen352.github.io/');
            }}
          >
            <Text style={styles.link}>Get help here</Text>
          </TouchableOpacity>
        </Text>
      </View>
    );
  }
}