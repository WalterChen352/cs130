import { StyleSheet } from 'react-native';
import { Colors, Borders, Spacing, FontSizes, Shadows } from './Common.styles';

/**
 * Styles for the Profile Screen components.
 */
export const ProfileScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.PADDING_LARGE,
    backgroundColor: Colors.BACKGROUND
  },
  title: {
    fontSize: FontSizes.HEADER,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: Spacing.PADDING_LARGE,
    color: Colors.TEXT
  },
  center: {
    alignItems: 'center',
    textAlign: 'center',
  },
  emphasis: {
    fontWeight: 'bold',
  },
  workflow: {
    marginBottom: Spacing.PADDING_LARGE,
    borderRadius: Borders.RADIUS_MEDIUM,
    ...Shadows.BUTTON,
    overflow: 'hidden',
  },
  workflowTouchable: {
    padding: Spacing.PADDING_LARGE,
    width: '100%',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.PADDING_SMALL,
    paddingBottom: Spacing.PADDING_SMALL,
    borderBottomWidth: Borders.WIDTH,
    borderBottomColor: 'rgba(0,0,0,0.06)',
  },
  header: {
    fontSize: FontSizes.SUBHEADER,
    fontWeight: '600',
    color: Colors.TEXT,
    flex: 1,
  },
  notificationIcon: {
    opacity: 0.8,
  },
  infoGrid: {
    marginTop: Spacing.PADDING_SMALL,
  },
  infoItem: {
    paddingVertical: 3,
    paddingHorizontal: 0,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: Spacing.PADDING_MEDIUM,
  },
  infoLabel: {
    fontSize: FontSizes.SMALL,
    color: Colors.DARK_GRAY,
    marginRight: 4,
  },
  infoValue: {
    fontSize: FontSizes.SMALL,
    color: Colors.TEXT,
    fontWeight: '500',
  },
  addLink: {
    marginTop: Spacing.PADDING_LARGE + Spacing.PADDING_MEDIUM,
    textAlign: 'center',
    color: Colors.DEFAULT_BLUE,
    fontSize: FontSizes.REGULAR,
    padding: Spacing.PADDING_SMALL,
  },
  workflowList: {
    marginBottom: Spacing.PADDING_LARGE + Spacing.PADDING_LARGE + Spacing.PADDING_MEDIUM,
  },
  emptyContainer: {
    textAlign: 'center',
  },
  emptyText: {
    color: Colors.DARK_GRAY,
  },
  block: {
    paddingVertical: Spacing.PADDING_LARGE
  },
  locationPicker: {
    height: 60,
    paddingBottom: Spacing.PADDING_MEDIUM,
    borderBottomWidth: Borders.WIDTH,
    borderBottomColor: Colors.BORDER,
    marginBottom: Spacing.PADDING_LARGE,
    zIndex: 100
  },
  footer: {
    paddingBottom: Spacing.PADDING_LARGE
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 3,
    marginRight: Spacing.PADDING_LARGE,
  },
  daysContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 3,
  },
  styleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 3,
    marginTop: 0,
  },
  iconText: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});