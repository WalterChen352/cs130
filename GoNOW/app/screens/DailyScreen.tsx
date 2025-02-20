import React, { useState, useCallback, JSX, useMemo } from 'react';
import { Text, View, FlatList, TouchableOpacity, Alert } from 'react-native';
import { getDailyEvents, deleteEvent } from '../scripts/Event';
import { styles } from '../styles/DailyScreen.styles';
import { Event } from '../models/Event';
import { TabParamList } from './Navigator';
import { RouteProp, useFocusEffect, useNavigation, NavigationProp } from '@react-navigation/native';

interface DailyScreenProps {
  route: RouteProp<TabParamList, 'Daily'>;
}

const DailyScreen = ({ route }: DailyScreenProps): JSX.Element => {
  const navigation = useNavigation<NavigationProp<TabParamList>>();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  const eventDate = useMemo(() => {
    return new Date(route.params?.eventDate ?? Date.now()); // eslint-disable-line @typescript-eslint/no-unnecessary-condition
  }, [route.params?.eventDate]); // eslint-disable-line @typescript-eslint/no-unnecessary-condition

  const highlightedEventId = route.params?.eventId; // eslint-disable-line @typescript-eslint/no-unnecessary-condition

  const loadEvents = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      const dailyEvents = await getDailyEvents(eventDate);
      setEvents(dailyEvents);
    } catch (error) {
      console.error('Failed to get daily events.', error);
    } finally {
      setLoading(false);
    }
  }, [eventDate]);

  useFocusEffect(
    useCallback(() => {
      void loadEvents();
    }, [loadEvents])
  );

  const LocalTimeStringOptions: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit'
  };

  const handleEdit = (event: Event) => {
    navigation.navigate('CreateTask', { mode: 'edit', eventData: event });
  };

  const handleDelete = (eventId: number) => {
    Alert.alert(
      'Delete Event',
      'Are you sure you want to delete this event?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            void (async () => {
              try {
                // Update local state immediately
                setEvents(currentEvents => currentEvents.filter(event => event.id !== eventId));
                // Then perform the deletion in the background
                await deleteEvent(eventId);
              } catch (error) {
                console.error('Failed to delete event', error);
                Alert.alert('Error', 'Failed to delete event. Please try again.');
                // Reload events if deletion failed to restore the correct state
                void loadEvents();
              }
            })();
          }
        }
      ]
    );
  };

  const displayEvent = ({ item }: { item: Event }): JSX.Element => {
    const isHighlighted = item.id === highlightedEventId;

    return (
      <View style={[
        styles.eventCard,
        isHighlighted && styles.highlightedEventCard
      ]}>
        <Text style={styles.eventTitle}>{item.name}</Text>
        <Text style={styles.eventDescription}>{item.description}</Text>
        <Text style={styles.eventTime}>
          Time: {new Date(item.startTime).toLocaleTimeString([], LocalTimeStringOptions)} - {new Date(item.endTime).toLocaleTimeString([], LocalTimeStringOptions)}
        </Text>
        
        {isHighlighted && (
          <View style={styles.eventActions}>
            <TouchableOpacity 
              style={styles.editButton}
              onPress={() => { handleEdit(item); }}
            >
              <Text style={styles.buttonText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.deleteButton}
              onPress={() => { handleDelete(item.id); }}
            >
              <Text style={styles.buttonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  if (loading) {
    return <Text style={styles.loading}>Loading events!</Text>;
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