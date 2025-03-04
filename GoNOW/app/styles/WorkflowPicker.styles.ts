import { StyleSheet } from 'react-native';
import { Colors, Borders, Spacing, Shadows } from './Common.styles';

export const WorkflowPickerStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  textInput: {
    borderWidth: Borders.WIDTH,
    borderColor: Colors.BORDER,
    padding: Spacing.PADDING_MEDIUM,
    borderRadius: Borders.RADIUS_SMALL,
  },
  listView: {
    position: 'absolute',
    top: 45,
    left: 0,
    right: 0,
    backgroundColor: Colors.WHITE,
    borderRadius: Borders.RADIUS_SMALL,
    ...Shadows.BUTTON,
    maxHeight: 200,
  },
  resultItem: {
    padding: Spacing.PADDING_LARGE,
    borderBottomWidth: Borders.WIDTH,
    // borderBottomColor: '#eee',
    color: Colors.TEXT,
  },
  description: {
    fontWeight: 'bold',
  },
});