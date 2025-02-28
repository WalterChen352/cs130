import { StyleSheet } from 'react-native';


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
    top: 70,
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
  routeText: {
    fontSize: 16,
    textAlign: 'left',
  },
  routeClose: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#bbb',
    padding: 0,
    zIndex: 2
  },
});

export default MapScreenStyles;