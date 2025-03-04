import { StyleSheet } from 'react-native';
import { Colors, Borders, Spacing, FontSizes } from './Common.styles';

const HOUR_HEIGHT = 20; // Height for each hour in pixels
const START_HOUR = 0; // 12 AM
const END_HOUR = 24; // 12 AM next day

export const CalendarStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.BACKGROUND,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: Spacing.PADDING_LARGE,
  },
  headerText: {
    fontSize: FontSizes.HEADER,
    fontWeight: 'bold',
    color: Colors.TEXT,
  },
  calendarContainer: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    borderBottomWidth: Borders.WIDTH,
    borderBottomColor: Colors.BORDER,
    backgroundColor: Colors.BACKGROUND,
  },
  timeColumn: {
    width: 50,
    borderRightWidth: Borders.WIDTH,
    borderRightColor: Colors.BORDER,
  },
  timeHeaderText: {
    fontSize: FontSizes.SMALL,
    textAlign: 'center',
    padding: Spacing.PADDING_SMALL,
  },
  dayHeader: {
    flex: 1,
    alignItems: 'center',
    padding: Spacing.PADDING_SMALL,
  },
  dayText: {
    fontSize: FontSizes.SMALL,
    fontWeight: '500',
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
    fontSize: FontSizes.SMALL,
    textAlign: 'center',
  },
  dayColumn: {
    flex: 1,
    borderRightWidth: Borders.WIDTH,
    borderRightColor: Colors.BORDER,
  },
  gridLine: {
    height: HOUR_HEIGHT,
    borderBottomWidth: Borders.WIDTH,
    borderBottomColor: Colors.BORDER
  },
  event: {
    position: 'absolute',
    left: 2,
    right: 2,
    borderRadius: Borders.RADIUS_SMALL,
    padding: 4,
    overflow: 'hidden',
    minHeight: 20,
  },
  eventText: {
    fontSize: 11, // Keeping this size as it's smaller than FontSizes.SMALL
    color: Colors.TEXT,
  },
});