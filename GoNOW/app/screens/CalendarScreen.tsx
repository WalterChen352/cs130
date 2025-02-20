import React, {JSX} from 'react';
import { View, Text, TouchableOpacity, ScrollView} from 'react-native';
import { getWeeklyEvents } from '../scripts/Event';
import { useEffect, useState, useCallback } from 'react';
import {GestureDetector, Gesture, Directions} from 'react-native-gesture-handler';
import { useNavigation, NavigationProp, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from 'react-native-vector-icons';
import {CalendarStyles} from '../styles/CalendarScreen.styles';
import {Event} from '../models/Event';
import { TabParamList } from './Navigator';

const HOUR_HEIGHT = 20;
const START_HOUR = 0;
const END_HOUR = 24;
const TIME_LABELS = Array.from({ length: END_HOUR - START_HOUR }, (_, i) => {
  const hour = (START_HOUR + i) % 12 || 12;
  const ampm = (START_HOUR + i) < 12 ? 'AM' : 'PM';
  return `${String(hour)}${String(ampm)}`;
});

const CalendarScreen = (): JSX.Element => {
    const navigation = useNavigation<NavigationProp<TabParamList>>();
    const [events, setEvents] = useState<Event[]>([]);

    const getLastSunday = (d: Date): Date => {
        const t = new Date(d);
        t.setDate(d.getDate() - d.getDay());
        t.setHours(0,0,0,0);
        return t;
    };

    const getWeekRange = (startDate: Date): { start: string; end: string } => {
        const start = new Date(startDate);
        start.setHours(0,0,0,0);
        const end = new Date(start);
        end.setDate(start.getDate() + 6);
        return {
            start: start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            end: end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        };
    };
    
    const [startDate, setStartDate] = useState(getLastSunday(new Date(Date.now())));
    const [weekRange, setWeekRange] = useState(getWeekRange(startDate));

    const fetchEvents = useCallback(async (): Promise<void> => {
        try {
            const e: Event[] = await getWeeklyEvents(startDate);
            setEvents(e);
            setWeekRange(getWeekRange(startDate));
        } catch(error) {
            console.error('error fetching events', error);
        }
    }, [startDate]);

    useFocusEffect(
        useCallback(() => {
            void fetchEvents();
        }, [fetchEvents])
    );

    useEffect(() => {
        void fetchEvents();
    }, [fetchEvents]);

    const navigateToDaily = (eventDate: Date, eventId: number): void => {
      navigation.navigate('Daily', { eventDate: eventDate.toISOString(), eventId: eventId });
    };

    const days = ['Su', 'M', 'T', 'W', 'Th', 'F', 'Sa'];

    const nextWeek = Gesture.Fling().direction(Directions.LEFT).onEnd(() => {
        setStartDate(prev => {
            const newDate = new Date(prev);
            newDate.setDate(prev.getDate() + 7);
            return newDate;
        });
    }).runOnJS(true);
    
    const nextWeekPress = (): void => {
        setStartDate(prev => {
            const newDate = new Date(prev);
            newDate.setDate(prev.getDate() + 7);
            return newDate;
        });
    };

    const prevWeekPress = (): void => {
        setStartDate(prev => {
            const newDate = new Date(prev);
            newDate.setDate(prev.getDate() - 7);
            return newDate;
        });
    };

    const prevWeek = Gesture.Fling().direction(Directions.RIGHT).onEnd(() => {
        setStartDate(prev => {
            const newDate = new Date(prev);
            newDate.setDate(prev.getDate() - 7);
            return newDate;
        });
    }).runOnJS(true);

    const getEventPosition = (startTime: string, endTime: string): {top: number; height: number} => {
        const start = new Date(startTime);
        const end = new Date(endTime);
        
        const startMinutes = start.getHours() * 60 + start.getMinutes();
        const endMinutes = end.getHours() * 60 + end.getMinutes();
        
        return {
            top: (startMinutes / 60) * HOUR_HEIGHT,
            height: ((endMinutes - startMinutes) / 60) * HOUR_HEIGHT
        };
    };

    const getEventsForDay = (day: string): Event[] => {
        return events.filter((event: Event) => {
            const date = new Date(event.startTime);
            const dayOfWeek = date.getDay();
            const dayIndex = days.indexOf(day);
            return dayIndex === dayOfWeek;
        });
    };

    return (
        <GestureDetector gesture={Gesture.Exclusive(prevWeek, nextWeek)}>
        <View style={CalendarStyles.container}>
            <View style={CalendarStyles.header}>
                <TouchableOpacity onPress={prevWeekPress}>
                    <Ionicons name={'caret-back-outline'} size={27} />
                </TouchableOpacity>
                <Text style={CalendarStyles.headerText} testID='WeekHeader'>
                    {`${weekRange.start} - ${weekRange.end}`}
                </Text>
                <TouchableOpacity onPress={nextWeekPress}>
                    <Ionicons name={'caret-forward-outline'} size={27} />
                </TouchableOpacity>
            </View>

            <View style={CalendarStyles.calendarContainer}>
                <View style={CalendarStyles.headerRow}>
                    <View style={CalendarStyles.timeColumn}>
                        <Text style={CalendarStyles.timeHeaderText}>Time</Text>
                    </View>
                    {days.map(day => (
                        <View key={day} style={CalendarStyles.dayHeader}>
                            <Text style={CalendarStyles.dayText}>{day}</Text>
                        </View>
                    ))}
                </View>

                <ScrollView>
                    <View style={CalendarStyles.gridContainer}>
                        <View style={CalendarStyles.timeColumn}>
                            {TIME_LABELS.map((timeLabel) => (
                                <View key={timeLabel} style={CalendarStyles.timeSlot}>
                                    <Text style={CalendarStyles.timeText}>{timeLabel}</Text>
                                </View>
                            ))}
                        </View>

                        {days.map(day => (
                            <View key={`col-${day}`} style={CalendarStyles.dayColumn}>
                                {TIME_LABELS.map((_, index) => (
                                    <View key={`grid-${String(day)}-${String(index)}`} style={CalendarStyles.gridLine} />
                                ))}
                                
                                {getEventsForDay(day).map((event: Event, index): JSX.Element => {
                                    const position = getEventPosition(event.startTime, event.endTime);
                                    return (
                                        <TouchableOpacity
                                            key={`event-${String(day)}-${String(index)}`}
                                            style={[
                                                CalendarStyles.event,
                                                { top: position.top, height: Math.max(position.height, 20) }
                                            ]}
                                            onPress={() => {
                                                const eventDate = new Date(event.startTime);
                                                navigateToDaily(eventDate, event.id);
                                            }}
                                        >
                                            <Text style={CalendarStyles.eventText} numberOfLines={1}>
                                                {event.name || 'Event'}
                                            </Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        ))}
                    </View>
                </ScrollView>
            </View>
        </View>
        </GestureDetector>
    );
};

export default CalendarScreen;