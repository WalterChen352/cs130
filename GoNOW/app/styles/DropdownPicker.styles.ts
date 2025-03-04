import { StyleSheet } from 'react-native';

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
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 10,
    padding: 15,
    height: 50,
  },
  selectedText: {
    fontSize: 16,
    color: '#333',
  },
  placeholderText: {
    color: '#999',
  },
  arrow: {
    fontSize: 14,
    color: '#007AFF',
  },
  dropdownListContainer: {
    position: 'absolute',
    top: 55,
    width: '100%',
    maxHeight: 200,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 10,
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
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  selectedItem: {
    backgroundColor: '#F0F8FF',
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#333',
  },
  selectedItemText: {
    color: '#007AFF',
    fontWeight: '500',
  }
});

export default DropdownPickerStyles;