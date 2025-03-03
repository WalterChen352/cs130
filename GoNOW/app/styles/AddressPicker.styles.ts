import { StyleSheet } from 'react-native';

export const AddressPickerStyles = StyleSheet.create({
  addressPanel: {
    position: 'absolute',
    top: 20,
    left: '5%',
    right: '5%',
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 1)',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 5,
    opacity: .8,
  },
  addressPanelText: {
    textAlign: 'center',
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
  textInput: {
    paddingVertical: 8,
    paddingRight: 40,
    borderRadius: 5,
    flex: 1,
  },
  iconButton: {
    position: "absolute",
    right: 5,
    padding: 8,
  },
  listView: {
    position: 'absolute',
    top: 45,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderRadius: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    maxHeight: 200,
  },
  mapContainer: {
    flex: 1,
    left: 0,
    right: 0,
    zIndex: 2,
  },
  mapView: {
    flex: 1,
  },
  resultItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  description: {
    fontWeight: 'bold',
  },
});