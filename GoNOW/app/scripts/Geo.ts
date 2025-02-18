import* as ExpoLocation from 'expo-location';
import { Platform } from 'react-native';
import {Coordinates, Location} from '../models/Location';

export const getMyLocation = async (): Promise<Location | null> => {
  try {
    const { status } = await ExpoLocation.requestForegroundPermissionsAsync();
    if (status === 'granted') {
      const { coords } = await ExpoLocation.getCurrentPositionAsync({});
      const { latitude, longitude } = coords;
      let location = new Location(new Coordinates(latitude, longitude), '');
      const reverseGeocode = await ExpoLocation.reverseGeocodeAsync({
        latitude,
        longitude,
      });
      if (reverseGeocode.length > 0) {
        location.Address = Platform.select({
          ios: `${reverseGeocode[0].streetNumber} ${reverseGeocode[0].street}, ${reverseGeocode[0].city}, ${reverseGeocode[0].region} ${reverseGeocode[0].postalCode}, ${reverseGeocode[0].country}`,
          android: reverseGeocode[0].formattedAddress || '',
          default: ''
        });
      }
      return location;
    } else {
      console.log('Permission to access location was denied');
    }
  } catch (error) {
    console.log('Error fetching location:', error);
  }
  return null;
};