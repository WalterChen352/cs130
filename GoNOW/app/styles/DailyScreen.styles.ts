import { StyleSheet } from 'react-native';
import { Colors, Borders, Spacing, FontSizes } from './Common.styles';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.PADDING_LARGE,
  },
  title: {
    fontSize: FontSizes.HEADER,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: Spacing.PADDING_LARGE,
  },
  listContainer: {
    paddingBottom: Spacing.BUTTON_SPACING,
  },
  eventCard: {
    padding: Spacing.BUTTON_SPACING,
    marginVertical: Spacing.PADDING_SMALL,
    borderRadius: Borders.RADIUS_MEDIUM,
  },
  eventTitle: {
    fontSize: FontSizes.REGULAR,
    fontWeight: 'bold',
  },
  eventDescription: {
    marginTop: Spacing.PADDING_SMALL,
  },
  eventTime: {
    marginTop: Spacing.PADDING_SMALL,
    color: Colors.DARK_GRAY,
  },
  noEvents: {
    padding: Spacing.BUTTON_SPACING,
    textAlign: 'center',
    fontSize: FontSizes.REGULAR,
    color: Colors.DARK_GRAY,
  },
  loading: {
    padding: 40, 
    textAlign: 'center',
    fontSize: FontSizes.SUBHEADER,
  },
  highlightedEventCard: {
    borderWidth: Borders.WIDTH_THICK / 2, 
    borderColor: Colors.DEFAULT_BLUE,
  },
  eventActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: Spacing.PADDING_MEDIUM,
    gap: Spacing.PADDING_MEDIUM,
  },
  editButton: {
    backgroundColor: Colors.DEFAULT_BLUE,
    padding: Spacing.PADDING_SMALL,
    borderRadius: Borders.RADIUS_SMALL,
  },
  deleteButton: {
    backgroundColor: Colors.RED,
    padding: Spacing.PADDING_SMALL,
    borderRadius: Borders.RADIUS_SMALL,
  },
  buttonText: {
    color: Colors.WHITE,
    fontSize: FontSizes.SMALL,
  }
});