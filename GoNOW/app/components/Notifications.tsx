import { useState, useEffect, useRef } from "react";
import { Platform } from "react-native";
import * as Notifications from "expo-notifications";
import { S_PER_MIN } from "../scripts/Polling";

Notifications.setNotificationHandler({
  handleNotification: async () => ({  //eslint-disable-line
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const NotificationDisplay: React.FC = () => {
  const [notification, setNotification] = useState<Notifications.Notification | undefined>(undefined);  //eslint-disable-line
  const [channels, setChannels] = useState<Notifications.NotificationChannel[]>([]);  //eslint-disable-line

  const notificationListener = useRef<Notifications.EventSubscription>();
  const responseListener = useRef<Notifications.EventSubscription>();

  useEffect(() => {
    if (Platform.OS === 'android') {
      Notifications.getNotificationChannelsAsync().then(value => { setChannels(value ?? []); });  //eslint-disable-line
    }

    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      console.log(response);
    });

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(notificationListener.current);
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, []);
  
  return null;
}

export async function scheduleLocalNotification(title: string, body: string, s_in_future: number) {
  console.log(`Scheduling notification: ${title}, ${body}, in ${(s_in_future*S_PER_MIN).toString()} minutes`);
  await Notifications.scheduleNotificationAsync({
    content: {
      title: title,
      body: body,
      data: { customData: "some data" },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: s_in_future,
    },
  });
}

export async function requestNotificationPermission() {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== "granted") { //eslint-disable-line
    alert("Permission to receive notifications is required!");
  }
}

export default NotificationDisplay;
