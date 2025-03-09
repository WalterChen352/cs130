import React, { useState, useEffect, useRef } from 'react';
import * as Notifications from 'expo-notifications';
import { S_PER_MIN } from '../scripts/Polling';

const NotificationDisplay: React.FC = () => {
  const [notification, setNotification] = useState<Notifications.Notification>();
  const notificationListener = useRef<Notifications.EventSubscription>();
  const responseListener = useRef<Notifications.EventSubscription>();

  useEffect(() => {
    notificationListener.current = Notifications.addNotificationReceivedListener((notif) => {
      console.log('Notification received:', notif);
      setNotification(notif);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      console.log('User responded to notification:', response);
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
};

export async function scheduleLocalNotification(title: string, body: string, min_in_future: number) {
  console.log(`Scheduling notification: ${title}, ${body}, in ${min_in_future.toString()} minutes`);
  await Notifications.scheduleNotificationAsync({
    content: {
      title: title,
      body: body,
      data: { customData: 'some data' },
    },
    trigger: {
      seconds: min_in_future * S_PER_MIN,
      channelId: 'GoNOW Notifications',
    },
  });
  console.log('Notification scheduled');
}

export default NotificationDisplay;