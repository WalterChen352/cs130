import { StyleSheet } from 'react-native';
import { Colors, Borders, Spacing, FontSizes, Shadows } from './Common.styles';

/**
 * Styles for the Map Screen components.
 */
export const MapScreenStyles = StyleSheet.create({
  container: {
    flex: 1
  },
  map: {
    flex: 1
  },
  routePanel: {
    position: 'absolute',
    top: 20,
    left: '5%',
    right: '5%',
    padding: Spacing.PADDING_MEDIUM,
    backgroundColor: Colors.WHITE,
    borderRadius: Borders.RADIUS_MEDIUM,
    ...Shadows.BUTTON,
    opacity: 0.8,
  },
  routeText: {
    fontSize: FontSizes.REGULAR,
    textAlign: 'left',
  },
  routeClose: {
    position: 'absolute',
    top: Spacing.PADDING_MEDIUM,
    right: Spacing.PADDING_MEDIUM,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: Borders.RADIUS_ROUND,
    borderWidth: Borders.WIDTH_THICK / 2,
    borderColor: Colors.BORDER,
    padding: 0,
    zIndex: 2
  },
});

export default MapScreenStyles;