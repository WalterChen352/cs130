import { JSX, useEffect, useState, Fragment } from 'react';
import { ActivityIndicator, Linking, Text, TouchableOpacity, View } from 'react-native';
import * as TaskManager from 'expo-task-manager';

import NotificationDisplay, { scheduleLocalNotification } from './components/Notifications';
import { initDatabase } from './scripts/Database';
import { IndexStyles as styles } from './styles/Index.styles';
import Navigator from './screens/Navigator';
import { registerBackgroundFetchAsync } from './scripts/BackgroundTasks';
import ForegroundTask from './components/ForegroundTask';

export default function Index(): JSX.Element {
  const [status, setStatus] = useState<number>(0); // 0 - loading; 1 - ready; 2 - error

  useEffect(() => {
    const appInit = async (): Promise<void> => {
      try {
        await initDatabase();
        await registerBackgroundFetchAsync();
        const tasks:TaskManager.TaskManagerTask[] = await TaskManager.getRegisteredTasksAsync();
        console.log('Registered tasks:', tasks);
        setStatus(1);
      } catch (error) {
        setStatus(2);
        console.error('Error in initializing app:', error);
      }
    };
    void appInit();
  }, []);

  return status === 1 // 0 - loading; 1 - ready; 2 - error
    ? (
        <Fragment>
          <Navigator/>
          <ForegroundTask/>
          <NotificationDisplay/>
        </Fragment>
      )
    : status === 0
      ? (
          <View style={styles.loading}>
            <ActivityIndicator size="large" />
            <Text>Loading...</Text>
          </View>
        )
      : (
          <View style={styles.loading}>
            <Text>Something went wrong</Text>
            <Text>¯\_(ツ)_/¯</Text>
            <Text> </Text>
            <Text>
              <TouchableOpacity onPress={() =>
                {void Linking.openURL('https://walterchen352.github.io/');}}
              >
                <Text style={styles.link}>Get help here</Text>
              </TouchableOpacity>
            </Text>
          </View>
        )
    ;
}