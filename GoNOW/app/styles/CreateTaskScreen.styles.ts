import { StyleSheet } from 'react-native';
import { Colors, Borders, Spacing, FontSizes, Shadows } from './Common.styles';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.BACKGROUND,
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: Spacing.PADDING_LARGE,
    paddingTop: Spacing.PADDING_LARGE,
  },
  title: {
    fontSize: FontSizes.HEADER,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: Spacing.PADDING_LARGE,
    color: Colors.TEXT,
  },
  input: {
    borderWidth: Borders.WIDTH,
    borderColor: Colors.BORDER,
    borderRadius: Borders.RADIUS_MEDIUM,
    padding: Spacing.PADDING_MEDIUM,
    marginBottom: Spacing.PADDING_MEDIUM,
    backgroundColor: Colors.WHITE,
    fontSize: FontSizes.REGULAR,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.BUTTON_SPACING,
    marginBottom: Spacing.PADDING_MEDIUM,
  },
  dropdownSection1: {
    position: 'relative',
    zIndex: 4000,
    marginBottom: Spacing.PADDING_MEDIUM,
    width: '100%',
  },
  dropdownSection2: {
    position: 'relative',
    zIndex: 3000,
    marginBottom: Spacing.PADDING_MEDIUM,
    width: '100%',
  },
  dropdownSection3: {
    position: 'relative',
    zIndex: 2000,
    marginBottom: Spacing.PADDING_MEDIUM,
    width: '100%',
  },
  locationSection: {
    position: 'relative',
    zIndex: 1000,
    marginBottom: Spacing.PADDING_MEDIUM,
    width: '100%',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.PADDING_MEDIUM,
  },
  switchLabel: {
    marginLeft: Spacing.PADDING_MEDIUM,
    fontSize: FontSizes.REGULAR,
    color: Colors.TEXT,
  },
  footer: {
    paddingBottom: 120, // Keeping as is since it's a specific value
  },
  saveButton: {
    position: 'absolute',
    bottom: Spacing.BUTTON_SPACING,
    right: Spacing.BUTTON_SPACING,
    backgroundColor: Colors.DEFAULT_BLUE,
    borderRadius: Borders.RADIUS_MEDIUM,
    padding: Spacing.PADDING_MEDIUM,
    ...Shadows.BUTTON,
  },
  dateContainer: {
    marginBottom: Spacing.PADDING_MEDIUM,
  },
  dateButton: {
    backgroundColor: Colors.WHITE,
    borderWidth: Borders.WIDTH,
    borderColor: Colors.BORDER,
    borderRadius: Borders.RADIUS_MEDIUM,
    padding: Spacing.PADDING_MEDIUM,
    marginHorizontal: Spacing.BUTTON_SPACING,
  },
  dateButtonText: {
    fontSize: FontSizes.REGULAR,
    color: Colors.TEXT,
    textAlign: 'center',
  },
  dateLabel: {
    fontSize: FontSizes.REGULAR,
    fontWeight: '600',
    color: Colors.TEXT,
    textAlign: 'center',
    marginBottom: Spacing.PADDING_SMALL,
  },
});

