import React, { useState, useEffect , JSX} from 'react';
import { Text, View, FlatList } from 'react-native';
import { getDailyEvents } from '../scripts/Event';
import { styles } from '../styles/DailyScreen.styles';
import { Event } from '../interfaces/event.interface';

const DailyScreen = () :JSX.Element=> {
  // set up
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  const loadEvents = async () :Promise<void>=> {
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

  const LocalTimeStringOptions = { hour: '2-digit', minute: '2-digit' };

  const displayEvent = ({ item }: { item: Event }):JSX.Element => (
    <View style={styles.eventCard}>
      <Text style={styles.eventTitle}>{item.name}</Text>
      <Text style={styles.eventDescription}>{item.description}</Text>
      <Text style={styles.eventTime}>
        Time: {new Date(item.startTime).toLocaleTimeString([], LocalTimeStringOptions)} - {new Date(item.endTime).toLocaleTimeString([], LocalTimeStringOptions)}
      </Text>
    </View>
  );

  if (loading) {
    return <Text style={styles.loading}>
        Loading events!
    </Text>;
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