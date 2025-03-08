import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';

import { poll, POLLING_INTERVAL_MIN, S_PER_MIN } from './Polling';

const BACKGROUND_FETCH_TASK = 'background-fetch';

// 1. Define the task by providing a name and the function that should be executed
// Note: This needs to be called in the global scope (e.g outside of your React components)
TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () : Promise<BackgroundFetch.BackgroundFetchResult> => {  
  const now = Date.now();
  
  console.log(`Got background fetch call at date: ${new Date(now).toISOString()}`);

  void poll();

  // Be sure to return the successful result type!
  return BackgroundFetch.BackgroundFetchResult.NewData;
});

// 2. Register the task at some point in your app by providing the same name,
// and some configuration options for how the background fetch should behave
// Note: This does NOT need to be in the global scope and CAN be used in your React components!
export async function registerBackgroundFetchAsync(): Promise<void> {
  try {
    await BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
      minimumInterval: S_PER_MIN * POLLING_INTERVAL_MIN, 
      stopOnTerminate: false, // android only
      startOnBoot: true, // android only
    });
    console.log("Background fetch registered successfully");
  } catch (error) {
    console.error("Failed to register background fetch:", error);
  }
}

// 3. (Optional) Unregister tasks by specifying the task name
// This will cancel any future background fetch calls that match the given name
// Note: This does NOT need to be in the global scope and CAN be used in your React components!
export async function unregisterBackgroundFetchAsync() : Promise<void> {
  return BackgroundFetch.unregisterTaskAsync(BACKGROUND_FETCH_TASK);
}