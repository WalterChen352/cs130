import { StyleSheet } from 'react-native';
import { Colors, Borders, Spacing, FontSizes } from './Common.styles';

export const TimeSelectorStyles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginHorizontal: Spacing.PADDING_MEDIUM,
  },
  label: {
    fontSize: FontSizes.SMALL,
    marginBottom: 4,
  },
  button: {
    backgroundColor: Colors.DEFAULT_BLUE,
    paddingHorizontal: Spacing.BUTTON_SPACING,
    paddingVertical: Spacing.PADDING_MEDIUM,
    borderRadius: Borders.RADIUS_MEDIUM,
    minWidth: 100,
    alignItems: 'center',
  },
  text: {
    color: Colors.WHITE,
    fontWeight: 'bold',
    fontSize: FontSizes.REGULAR,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: Colors.WHITE,
    borderRadius: Borders.RADIUS_MEDIUM,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.PADDING_LARGE,
    borderBottomWidth: Borders.WIDTH,
    borderBottomColor: Colors.BORDER,
  },
  modalTitle: {
    fontSize: FontSizes.REGULAR,
    fontWeight: 'bold',
    color: Colors.TEXT,
  },
  cancelButton: {
    fontSize: FontSizes.REGULAR
  },
  confirmButton: {
    fontSize: FontSizes.REGULAR,
    color: Colors.DEFAULT_BLUE,
  },
  pickerContainer: {
    padding: Spacing.BUTTON_SPACING,
    alignItems: 'center',
  },
  picker: {
    width: 200,
  }
});

export default TimeSelectorStyles;