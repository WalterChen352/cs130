import { StyleSheet, Dimensions, Platform } from 'react-native';
import { Colors, Borders, Shadows } from './Common.styles';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const NavigatorStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'lightblue',
    height: 80,
    paddingBottom: Platform.OS === 'android' ? 0 : 20,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  createButton: {
    backgroundColor: 'lightblue',
    width: 56,
    height: 56,
    borderRadius: Borders.RADIUS_ROUND,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    left: SCREEN_WIDTH / 2 - 28,
    top: -28,
    ...Shadows.BUTTON,
    borderWidth: Borders.WIDTH_THICK,
    borderColor: Colors.WHITE,
  },
});