import React, {JSX} from 'react';
import { View, Text, TouchableOpacity, ScrollView} from 'react-native';
import { getWeeklyEvents } from '../scripts/database';
import { useEffect, useState } from 'react';
import {GestureDetector,Gesture,Directions} from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from 'react-native-vector-icons';
import {CalendarStyles} from './screen_styles/CalendarScreen.styles';
import Event from '../interfaces/event.interface';


const HOUR_HEIGHT = 20; // Height for each hour in pixels
const START_HOUR = 0; // 12 AM
const END_HOUR = 24; // 12 AM next day
const TIME_LABELS = Array.from({ length: END_HOUR - START_HOUR }, (_, i) => {
  const hour = (START_HOUR + i) % 12 || 12;
  const ampm = (START_HOUR + i) < 12 ? 'AM' : 'PM';
  return `${hour}${ampm}`;

});

const CalendarScreen = (): JSX.Element=> {
    const navigation = useNavigation();

    const navigateToDaily= ():void => {
      navigation.navigate('Daily');
    };
    const getLastSunday = (d: Date) :Date => {
        var t = new Date(d);
        t.setDate(t.getDate() - t.getDay());
        return t;
    };
    const getWeekRange = (startDate: Date): { start: string; end: string } => {
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
        const fetchEvents = async ():Promise<void> => {
            try {
                const e: Event[] = await getWeeklyEvents(startDate);
                setEvents(e);
                setWeekRange(getWeekRange(startDate));
            } catch(error) {
                console.error('error fetching events', error);
            }
        };
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
    
    const nextWeekPress = (): void=>{
        console.log('button press next week');
        setStartDate(prev => {
            const newDate = new Date(prev); // Copy old date
            newDate.setDate(prev.getDate() + 7);
            console.log('New Start Date:', newDate); // Log after modification
            return newDate;
        });
    };

    const prevWeekPress = (): void=>{
        console.log('button press next week');
        setStartDate(prev => {
            const newDate = new Date(prev); // Copy old date
            newDate.setDate(prev.getDate() - 7);
            console.log('New Start Date:', newDate); // Log after modification
            return newDate;
        });
    };

    const prevWeek= Gesture.Fling().direction(Directions.RIGHT).onEnd(()=>{
        console.log('swiping right');
        setStartDate(prev => {
            const newDate = new Date(prev); // Copy old date
            newDate.setDate(prev.getDate() - 7);
            console.log('New Start Date:', newDate); // Log after modification
            return newDate;
        });
    }).runOnJS(true);
    

    const getEventPosition = (startTime: string, endTime: string) :{top:number; height: number} => {
        const start = new Date(startTime);
        const end = new Date(endTime);
        
        const startMinutes = start.getHours() * 60 + start.getMinutes();
        const endMinutes = end.getHours() * 60 + end.getMinutes();
        
        return {
            top: (startMinutes / 60) * HOUR_HEIGHT,
            height: ((endMinutes - startMinutes) / 60) * HOUR_HEIGHT
        };
    };

    const getEventsForDay = (day: string) :Event[]=> {
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
                    <Ionicons name={'caret-back-outline'} size= {27} />
                </TouchableOpacity>
                <Text style={CalendarStyles.headerText} testID='WeekHeader'>
                    {`${weekRange.start} - ${weekRange.end}`}
                </Text>
                <TouchableOpacity onPress={nextWeekPress}>
                    <Ionicons name={'caret-forward-outline'} size= {27} />
                </TouchableOpacity>
            </View>

            <View style={CalendarStyles.calendarContainer}>
                {/* Day headers */}
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
                        {/* Time axis */}
                        <View style={CalendarStyles.timeColumn}>
                            {TIME_LABELS.map((timeLabel) => (
                                <View key={timeLabel} style={CalendarStyles.timeSlot}>
                                    <Text style={CalendarStyles.timeText}>{timeLabel}</Text>
                                </View>
                            ))}
                        </View>

                        {/* Day columns with events */}
                        {days.map(day => (
                            <View key={`col-${day}`} style={CalendarStyles.dayColumn}>
                                {/* Hour grid lines */}
                                {TIME_LABELS.map((_, index) => (
                                    <View key={`grid-${day}-${index}`} style={CalendarStyles.gridLine} />
                                ))}
                                
                                {/* Events */}
                                {getEventsForDay(day).map((event: Event, index):JSX.Element => {
                                    const position = getEventPosition(event.startTime, event.endTime);
                                    return (
                                        <TouchableOpacity
                                        key={`event-${day}-${index}`}
                                        style={[
                                            CalendarStyles.event,
                                            { top: position.top, height: Math.max(position.height, 20) } // Dynamically setting top and height
                                        ]}
                                        onPress={() => {
                                            console.log('Clicked event:', event);
                                            navigateToDaily();
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