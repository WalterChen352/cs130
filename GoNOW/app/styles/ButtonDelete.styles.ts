import { StyleSheet } from 'react-native';
import { Colors, Borders, Spacing, Shadows } from './Common.styles';

/**
 * Styles for the `ButtonDelete` component.
 */
export const ButtonDeleteStyles = StyleSheet.create({
  /**
   * Button TouchableOpacity container.
   */
  btnDelete: {
    position: 'absolute',
    bottom: Spacing.BUTTON_SPACING,
    left: Spacing.BUTTON_SPACING,
    width: 60,
    height: 60,
    borderRadius: Borders.RADIUS_ROUND,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: Borders.WIDTH_THICK,
    borderColor: Colors.WHITE,
    backgroundColor: '#ffa5a5', // Consider adding this to Colors
    ...Shadows.BUTTON,
  },
});

// Define theme constants separately
export const BUTTON_DELETE_DEFAULTS = {
  ICON_NAME: "close",
  ICON_SIZE: 30,
  ICON_COLOR: Colors.WHITE,
  BG_COLOR: '#ffa5a5'
};