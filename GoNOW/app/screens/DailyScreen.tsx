import React, { useState, useEffect } from 'react';
import { Text, View, FlatList } from 'react-native';
import { getDailyEvents } from "../scripts/database";
import { styles } from './screen_styles/DailyScreen.styles';

interface Event {
  id: number;
  name: string;
  description: string;
  startTime: string;
  endTime: string;
  latitude: number;
  longitude: number;
  transportationMode: string;
}

const DailyScreen = () => {
  // set up
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  const loadEvents = async () => {
    try {
        setLoading(true);
        const dailyEvents = await getDailyEvents();
        setEvents(dailyEvents);
    } catch (error) {
        console.error('Failed to get daily events.', error);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const displayEvent = ({ item }: { item: Event }) => (
    <View style={styles.eventCard}>
      <Text style={styles.eventTitle}>{item.name}</Text>
      <Text style={styles.eventDescription}>{item.description}</Text>
      <Text style={styles.eventTime}>
        Time: {new Date(item.startTime).toLocaleTimeString()} - {new Date(item.endTime).toLocaleTimeString()}
      </Text>
    </View>
  );

  if (loading) {
    return <Text style={styles.loading}>
        Loading events!
    </Text>
  }

  return (
    <View style={styles.container}>
      {events.length > 0 ? (
        <FlatList<Event>
          data={events}
          renderItem={displayEvent}
          keyExtractor={item => item.id.toString()}
        />
      ) : (
        <Text style={styles.noEvents}>No tasks today!</Text>
      )}
    </View>
  );
};

export default DailyScreen;