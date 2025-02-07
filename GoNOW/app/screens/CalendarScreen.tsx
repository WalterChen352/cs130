import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Button } from 'react-native';
import { getWeeklyEvents } from '../scripts/database';
import { useEffect, useState } from 'react';
import {GestureDetector,Gesture,Directions} from "react-native-gesture-handler";
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from 'react-native-vector-icons';


const HOUR_HEIGHT = 20; // Height for each hour in pixels
const START_HOUR = 0; // 12 AM
const END_HOUR = 24; // 12 AM next day
const TIME_LABELS = Array.from({ length: END_HOUR - START_HOUR }, (_, i) => {
  const hour = (START_HOUR + i) % 12 || 12;
  const ampm = (START_HOUR + i) < 12 ? 'AM' : 'PM';
  return `${hour}${ampm}`;
});

const CalendarScreen = () => {
    const navigation = useNavigation();

    const navigateToDaily= () => {
      navigation.navigate('Daily');
    };
    const getLastSunday = (d: Date) => {
        var t = new Date(d);
        t.setDate(t.getDate() - t.getDay());
        return t;
    };
    const getWeekRange = (startDate: any) => {
        const start = new Date(startDate);
        const end = new Date(start);
        end.setDate(start.getDate() + 6);
        
        return {
            start: start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            end: end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        };
    };
    const [events, setEvents] = useState([]);
    const [startDate, setStartDate]=useState(getLastSunday(new Date(Date.now())));
    const [weekRange, setWeekRange]= useState(getWeekRange(startDate));
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const e: any = await getWeeklyEvents(startDate);
                setEvents(e);
                setWeekRange(getWeekRange(startDate));
            } catch(error) {
                console.error('error fetching events', error);
            }
        }
        fetchEvents();
    }, [startDate]);

    const days = ['Su', 'M', 'T', 'W', 'Th', 'F', 'Sa'];

    
    const nextWeek = Gesture.Fling().direction(Directions.LEFT).onEnd(() => {
        console.log('Swiping left');
        setStartDate(prev => {
            const newDate = new Date(prev); // Copy old date
            newDate.setDate(prev.getDate() + 7);
            console.log('New Start Date:', newDate); // Log after modification
            return newDate;
        });
    }).runOnJS(true);
    
    const nextWeekPress = ()=>{
        console.log('button press next week');
        setStartDate(prev => {
            const newDate = new Date(prev); // Copy old date
            newDate.setDate(prev.getDate() + 7);
            console.log('New Start Date:', newDate); // Log after modification
            return newDate;
        });
    }

    const prevWeekPress = ()=>{
        console.log('button press next week');
        setStartDate(prev => {
            const newDate = new Date(prev); // Copy old date
            newDate.setDate(prev.getDate() - 7);
            console.log('New Start Date:', newDate); // Log after modification
            return newDate;
        });
    }

    const prevWeek= Gesture.Fling().direction(Directions.RIGHT).onEnd(()=>{
        console.log('swiping right');
        setStartDate(prev => {
            const newDate = new Date(prev); // Copy old date
            newDate.setDate(prev.getDate() - 7);
            console.log('New Start Date:', newDate); // Log after modification
            return newDate;
        });
    }).runOnJS(true);
    

    const getEventPosition = (startTime: string, endTime: string) => {
        const start = new Date(startTime);
        const end = new Date(endTime);
        
        const startMinutes = start.getHours() * 60 + start.getMinutes();
        const endMinutes = end.getHours() * 60 + end.getMinutes();
        
        return {
            top: (startMinutes / 60) * HOUR_HEIGHT,
            height: ((endMinutes - startMinutes) / 60) * HOUR_HEIGHT
        };
    };

    const getEventsForDay = (day: string) => {
        return events.filter((event: any) => {
            const date = new Date(event.startTime);
            const dayOfWeek = date.getDay();
            const dayIndex = days.indexOf(day);
            return dayIndex === dayOfWeek;
        });
    };

    return (
        <GestureDetector gesture={Gesture.Exclusive(prevWeek, nextWeek)}>
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={prevWeekPress}>
                    <Ionicons name={'caret-back-outline'} size= {27} />
                </TouchableOpacity>
                <Text style={styles.headerText}>
                    {`${weekRange.start} - ${weekRange.end}`}
                </Text>
                <TouchableOpacity onPress={nextWeekPress}>
                    <Ionicons name={'caret-forward-outline'} size= {27} />
                </TouchableOpacity>
            </View>

            <View style={styles.calendarContainer}>
                {/* Day headers */}
                <View style={styles.headerRow}>
                    <View style={styles.timeColumn}>
                        <Text style={styles.timeHeaderText}>Time</Text>
                    </View>
                    {days.map(day => (
                        <View key={day} style={styles.dayHeader}>
                            <Text style={styles.dayText}>{day}</Text>
                        </View>
                    ))}
                </View>

                <ScrollView>
                    <View style={styles.gridContainer}>
                        {/* Time axis */}
                        <View style={styles.timeColumn}>
                            {TIME_LABELS.map((timeLabel, index) => (
                                <View key={timeLabel} style={styles.timeSlot}>
                                    <Text style={styles.timeText}>{timeLabel}</Text>
                                </View>
                            ))}
                        </View>

                        {/* Day columns with events */}
                        {days.map(day => (
                            <View key={`col-${day}`} style={styles.dayColumn}>
                                {/* Hour grid lines */}
                                {TIME_LABELS.map((_, index) => (
                                    <View key={`grid-${day}-${index}`} style={styles.gridLine} />
                                ))}
                                
                                {/* Events */}
                                {getEventsForDay(day).map((event: any, index) => {
                                    const position = getEventPosition(event.startTime, event.endTime);
                                    return (
                                        <TouchableOpacity
                                            key={`event-${day}-${index}`}
                                            style={[
                                                styles.event,
                                                {
                                                    position: 'absolute',
                                                    top: position.top,
                                                    height: Math.max(position.height, 20), // Minimum height of 20px
                                                    backgroundColor: 'lightblue'
                                                }
                                            ]}
                                            onPress={() => {
                                                console.log('Clicked event:', event);
                                                navigateToDaily();
                                            }}
                                        >
                                            <Text style={styles.eventText} numberOfLines={1}>
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    header: {
        flexDirection:'row',
        justifyContent: 'center',
        padding: 16,
    },
    headerText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1f2937',
    },
    calendarContainer: {
        flex: 1,
    },
    headerRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
        backgroundColor: 'white',
    },
    timeColumn: {
        width: 50,
        borderRightWidth: 1,
        borderRightColor: '#e5e7eb',
    },
    timeHeaderText: {
        fontSize: 12,
        textAlign: 'center',
        padding: 8,
        color: '#4b5563',
    },
    dayHeader: {
        flex: 1,
        alignItems: 'center',
        padding: 8,
    },
    dayText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#4b5563',
    },
    gridContainer: {
        flexDirection: 'row',
        height: HOUR_HEIGHT * (END_HOUR - START_HOUR),
    },
    timeSlot: {
        height: HOUR_HEIGHT,
        justifyContent: 'flex-start',
        paddingTop: 4,
    },
    timeText: {
        fontSize: 12,
        color: '#6b7280',
        textAlign: 'center',
    },
    dayColumn: {
        flex: 1,
        borderRightWidth: 1,
        borderRightColor: '#e5e7eb',
    },
    gridLine: {
        height: HOUR_HEIGHT,
        borderBottomWidth: 1,
        borderBottomColor: '#f3f4f6',
    },
    event: {
        position: 'absolute',
        left: 2,
        right: 2,
        borderRadius: 4,
        padding: 4,
        overflow: 'hidden',
    },
    eventText: {
        fontSize: 11,
        color: '#1f2937',
    },
});

export default CalendarScreen;