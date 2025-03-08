import { useState, useEffect, useRef } from "react";
import { Platform } from "react-native";
import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const NotificationDisplay: React.FC = () => {
  const [notification, setNotification] = useState<Notifications.Notification | undefined>(undefined);
  const [channels, setChannels] = useState<Notifications.NotificationChannel[]>([]);

  const notificationListener = useRef<Notifications.EventSubscription>();
  const responseListener = useRef<Notifications.EventSubscription>();

  useEffect(() => {
    requestNotificationPermission();

    if (Platform.OS === 'android') {
      Notifications.getNotificationChannelsAsync().then(value => setChannels(value ?? []));
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

  async function requestNotificationPermission() {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== "granted") {
      alert("Permission to receive notifications is required!");
    }
  }

  async function scheduleLocalNotification() {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Local Notification",
        body: "This is a test local notification!",
        data: { customData: "some data" },
      },
      trigger: {
        seconds: 2,
        channelId: 'new_emails',
      },
    });
  }

  return null;
}
