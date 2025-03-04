import { StyleSheet } from 'react-native';
import { Colors, Borders, Spacing, Shadows } from './Common.styles';

/**
 * Styles for the `ButtonSave` component.
 */
export const ButtonSaveStyles = StyleSheet.create({
  /**
   * Button TouchableOpacity container.
   */
  btnSave: {
    position: 'absolute',
    bottom: Spacing.BUTTON_SPACING,
    right: Spacing.BUTTON_SPACING,
    width: 60,
    height: 60,
    borderRadius: Borders.RADIUS_ROUND,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: Borders.WIDTH_THICK,
    borderColor: Colors.WHITE,
    backgroundColor: Colors.DEFAULT_BLUE,
    ...Shadows.BUTTON,
  }
});

// Define theme constants separately
export const BUTTON_SAVE_DEFAULTS = {
  ICON_NAME: "checkmark",
  ICON_SIZE: 30,
  ICON_COLOR: Colors.WHITE,
  BG_COLOR: Colors.DEFAULT_BLUE
};