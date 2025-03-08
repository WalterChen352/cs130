import React, {JSX} from 'react';
import { View, Text, TouchableOpacity, ScrollView, DimensionValue} from 'react-native';
import { getWeeklyEvents } from '../scripts/Event';
import { useEffect, useState, useCallback } from 'react';
import {GestureDetector, Gesture, Directions} from 'react-native-gesture-handler';
import { useNavigation, NavigationProp, useFocusEffect } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {CalendarStyles} from '../styles/CalendarScreen.styles';
import {Event} from '../models/Event';
import { Workflow } from '../models/Workflow';
import { TabParamList } from './Navigator';
import { getWorkflows, tryFilterWfId } from '../scripts/Workflow';
import { Colors } from '../styles/Common.styles'
import * as Haptics from 'expo-haptics';

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
    const [workflows, setWorkflows] = useState<Workflow[]>([]);
    const [events, setEvents] = useState<Event[]>([]);
    const [startDate, setStartDate]=useState(getLastSunday(new Date(Date.now())));
    const [weekRange, setWeekRange]= useState(getWeekRange(startDate));

    const fetchEvents = useCallback(async (): Promise<void> => {
        try {
            const e: Event[] = await getWeeklyEvents(startDate);
            setEvents(e);
            setWeekRange(getWeekRange(startDate));
            const w: Workflow[] = await getWorkflows();
            setWorkflows(w);
            console.log('workflows in calendar', workflows);
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

    const nextWeek = Gesture.Fling().direction(Directions.LEFT).onEnd( () => {
        void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setStartDate(prev => {
            const newDate = new Date(prev);
            newDate.setDate(prev.getDate() + 7);
            return newDate;
        });
    }).runOnJS(true);
    
    const nextWeekPress =async (): Promise<void> => {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setStartDate(prev => {
            const newDate = new Date(prev);
            newDate.setDate(prev.getDate() + 7);
            return newDate;
        });
    };

    const prevWeekPress = async(): Promise<void> => {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setStartDate(prev => {
            const newDate = new Date(prev);
            newDate.setDate(prev.getDate() - 7);
            return newDate;
        });
    };

    const prevWeek = Gesture.Fling().direction(Directions.RIGHT).onEnd( () => {
        void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
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

    // Function to check if two events overlap
    const eventsOverlap = (event1: Event, event2: Event): boolean => {
        const start1 = new Date(event1.startTime).getTime();
        const end1 = new Date(event1.endTime).getTime();
        const start2 = new Date(event2.startTime).getTime();
        const end2 = new Date(event2.endTime).getTime();
        
        return (start1 < end2 && start2 < end1);
    };

    // Process events to handle overlaps
    const processEventsWithOverlap = (dayEvents: Event[]): {event: Event, column: number, totalColumns: number}[] => {
        if (dayEvents.length === 0) return [];
        
        // Sort events by start time
        const sortedEvents = [...dayEvents].sort((a, b) => 
            new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
        );

        // Create a processed events array
        const processedEvents: {event: Event, column: number, totalColumns: number}[] = [];
        
        // Create an array of columns, each column will contain non-overlapping events
        const columns: Event[][] = [];
        
        // Process each event
        sortedEvents.forEach(event => {
            // Find the first column where this event doesn't overlap with any existing event
            let columnIndex = 0;
            let placed = false;
            
            while (!placed && columnIndex < columns.length) {
                // Check if the event overlaps with any event in this column
                const overlapsInColumn = columns[columnIndex].some(existingEvent => 
                    eventsOverlap(event, existingEvent)
                );
                
                if (!overlapsInColumn) {
                    // Add to this column if no overlaps
                    columns[columnIndex].push(event);
                    placed = true;
                } else {
                    // Try the next column
                    columnIndex++;
                }
            }
            
            // If no suitable column was found, create a new one
            if (!placed) {
                columns.push([event]);
                columnIndex = columns.length - 1;
            }
            
            // Add the processed event with its column information
            processedEvents.push({
                event,
                column: columnIndex,
                totalColumns: 0 // Will be updated after all events are processed
            });
        });
        
        // Update totalColumns for each event
        processedEvents.forEach(processedEvent => {
            // Find overlapping events for the current event
            const overlappingEvents = sortedEvents.filter(otherEvent =>
                processedEvent.event !== otherEvent && eventsOverlap(processedEvent.event, otherEvent)
            );
            
            // Find the maximum column used by any overlapping event (including this one)
            let maxColumnUsed = processedEvent.column;
            
            overlappingEvents.forEach(overlappingEvent => {
                const overlappingProcessedEvent = processedEvents.find(pe => pe.event === overlappingEvent);
                if (overlappingProcessedEvent && overlappingProcessedEvent.column > maxColumnUsed) {
                    maxColumnUsed = overlappingProcessedEvent.column;
                }
            });
            
            // Set totalColumns based on the maximum column used + 1 (to get count from 0-based index)
            processedEvent.totalColumns = maxColumnUsed + 1;
        });
        
        return processedEvents;
    };

    return (
    <GestureDetector gesture={Gesture.Exclusive(prevWeek, nextWeek)}>
        <View style={CalendarStyles.container}>
        <View style={CalendarStyles.header}>
            <TouchableOpacity onPress={void prevWeekPress} testID="back-button">
            <Ionicons name={'caret-back-outline'} size={27} />
            </TouchableOpacity>
            <Text style={CalendarStyles.headerText} testID="WeekHeader">
            {`${weekRange.start} - ${weekRange.end}`}
            </Text>
            <TouchableOpacity onPress={void nextWeekPress} testID="forward-button">
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
                {days.map(day => {
                    // Get events for this day and process them to handle overlaps
                    const dayEvents = getEventsForDay(day);
                    const processedEvents = processEventsWithOverlap(dayEvents);
                    
                    return (
                        <View key={`col-${day}`} style={CalendarStyles.dayColumn}>
                            {TIME_LABELS.map((_, index) => (
                                <View 
                                    key={`grid-${String(day)}-${String(index)}`} 
                                    style={CalendarStyles.gridLine}
                                />
                            ))}
                            {processedEvents.map((processedEvent, index) => {
                                const { event, column, totalColumns } = processedEvent;
                                const position = getEventPosition(event.startTime, event.endTime);
                                
                                // Calculate width based on how many columns are needed
                                const width = 100 / totalColumns;
                                
                                return (
                                    <TouchableOpacity
                                    key={`event-${day}-${String(index)}`}
                                        testID={event.name}
                                        style={[
                                            CalendarStyles.event,
                                            {
                                                top: position.top, 
                                                height: Math.max(position.height, 20),
                                                width: `${String(width)}%` as DimensionValue,
                                                left: `${String(width * column)}%` as DimensionValue,
                                                backgroundColor: event.workflow ? 
                                                    tryFilterWfId(workflows, event.workflow)?.color : 
                                                    Colors.LIGHT_BLUE
                                            }
                                        ]}
                                        onPress={ () => {
                                            void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                            const eventDate = new Date(event.startTime);
                                            navigateToDaily(eventDate, event.id);
                                        }}
                                    >
                                        <Text 
                                            style={CalendarStyles.eventText} 
                                            numberOfLines={1}
                                        >
                                            {event.name || 'Event'}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    );
                })}
            </View>
            </ScrollView>
        </View>
        </View>
    </GestureDetector>
    );
};

export default CalendarScreen;