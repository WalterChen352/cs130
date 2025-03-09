import { JSX, useEffect, useState, Fragment } from 'react';
import { ActivityIndicator, Linking, Text, TouchableOpacity, View } from 'react-native';
import * as TaskManager from 'expo-task-manager';
import { initDatabase } from './scripts/Database';
import { getMyLocation } from './scripts/Geo';
import { getLocation, updateLocation } from './scripts/Profile';
import { IndexStyles as styles } from './styles/Index.styles';
import Navigator from './screens/Navigator';
import { registerBackgroundFetchAsync } from './scripts/BackgroundTasks';
import ForegroundTask from './components/ForegroundTask';
import { getUID, setUID } from './scripts/Profile';

const url='https://gonow-5ry2jtelsq-wn.a.run.app/ping';
const headers={
  'Content-Type':'application/json',
  'Accept':'application/json',
  'access-token': process.env.EXPO_PUBLIC_ACCESS_TOKEN??''
}



export default function Index(): JSX.Element {
  const [status, setStatus] = useState<number>(0); // 0 - loading; 1 - ready; 2 - error



  useEffect(() => {
    const appInit = async (): Promise<void> => {
      try {
        const uid = await getUID();
        if (uid === null) {
          //ping
          const response = await fetch(url, {
            method:'GET',
            headers:headers
          });
          const data = await response.json() as { uid: number };
          console.log(`uid data is ${String(data.uid)}`);
          await setUID(data.uid);
        }
        await initDatabase();

        const location = await getLocation();
        if (location === null
            || !location.address
            && location.coordinates.latitude === 0
            && location.coordinates.longitude === 0
        ) {
            const currentLocation = await getMyLocation();
            if (currentLocation !== null) {
                await updateLocation(currentLocation);
            }
        }
        
        await registerBackgroundFetchAsync();
        const tasks:TaskManager.TaskManagerTask[] = await TaskManager.getRegisteredTasksAsync();
        console.log('Registered tasks:', tasks);
        setStatus(1);
      } catch (error) {
        setStatus(2);
        console.error('Error in initializing app:', error);
      }
    };
    
    // Fix 3: Already using void operator to mark the promise as intentionally ignored
    void appInit();
  }, []);

  return status === 1 // 0 - loading; 1 - ready; 2 - error
    ? (
      <Fragment>
        <Navigator/>
        <ForegroundTask/>
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
            <TouchableOpacity onPress={() => {
              void Linking.openURL('https://walterchen352.github.io/');
            }}>
              <Text style={styles.link}>Get help here</Text>
            </TouchableOpacity>
          </Text>
        </View>
      );
}