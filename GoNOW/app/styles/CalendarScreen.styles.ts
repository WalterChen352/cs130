import { StyleSheet } from 'react-native';

const HOUR_HEIGHT = 20; // Height for each hour in pixels
const START_HOUR = 0; // 12 AM
const END_HOUR = 24; // 12 AM next day

export const CalendarStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    header: {
        flexDirection: 'row',
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
        minHeight: 20, 
    },
    eventText: {
        fontSize: 11,
        color: '#1f2937',
    },
});

