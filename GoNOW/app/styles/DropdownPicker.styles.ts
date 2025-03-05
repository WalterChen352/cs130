import { StyleSheet } from 'react-native';
import { Colors, Borders, Spacing, FontSizes } from './Common.styles';

const DropdownPickerStyles = StyleSheet.create({
  container: {
    position: 'relative',
    width: '100%',
    zIndex: 1000, // Ensure dropdown appears above other elements
  },
  dropdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.WHITE,
    borderWidth: Borders.WIDTH,
    borderColor: Colors.BORDER,
    borderRadius: Borders.RADIUS_MEDIUM,
    padding: Spacing.PADDING_LARGE,
    height: 50,
  },
  selectedText: {
    fontSize: FontSizes.REGULAR,
    color: Colors.DARK_GRAY
  },
  placeholderText: {
    color: Colors.BORDER
  },
  arrow: {
    fontSize: FontSizes.SMALL,
    color: Colors.DEFAULT_BLUE,
  },
  dropdownListContainer: {
    position: 'absolute',
    top: 55,
    width: '100%',
    maxHeight: 200,
    backgroundColor: Colors.WHITE,
    borderWidth: Borders.WIDTH,
    borderColor: Colors.BORDER,
    borderRadius: Borders.RADIUS_MEDIUM,
    overflow: 'hidden',
    elevation: 0,
    zIndex: 1000,
  },
  scrollView: {
    width: '100%',
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  dropdownItem: {
    padding: Spacing.PADDING_LARGE,
    borderBottomWidth: Borders.WIDTH,
    borderBottomColor: Colors.BORDER,
  },
  dropdownItemText: {
    fontSize: FontSizes.REGULAR,
    color: Colors.DARK_GRAY,
  },
  selectedItemText: {
    color: Colors.DEFAULT_BLUE,
    fontWeight: '500',
  }
});

export default DropdownPickerStyles;