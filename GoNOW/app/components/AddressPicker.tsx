import React, { useRef, useState, useEffect } from 'react';
import 'react-native-get-random-values';
import { StyleSheet, View } from 'react-native';
//import * as ExpoLocation from 'expo-location';
import { GooglePlacesAutocomplete, GooglePlaceData, GooglePlaceDetail } from 'react-native-google-places-autocomplete';

import { GOOGLE_API_KEY } from '../scripts/Config';
import { Coordinates, Location } from '../models/Location';

interface AddressPickerProps {
  initialAddress?: string;
  initialCoordinates?: Coordinates;
  onSelect?: (location: Location) => void;
  placeHolder?: string;
}

const AddressPicker: React.FC<AddressPickerProps> = ({
    initialAddress = '',
    initialCoordinates = null,
    onSelect,
    placeHolder = 'Type an address',
  }) => {
  const [address, setAddress] = useState(initialAddress);
  const [coordinates, setCoordinates] = useState<Coordinates | null>(initialCoordinates);
  const googlePlacesRef = useRef<GooglePlacesAutocomplete>(null);

  useEffect(() => {
    if (initialAddress !== address) {
      setAddress(initialAddress);
      googlePlacesRef.current.setAddressText(initialAddress);
    }
    if (initialCoordinates && initialCoordinates !== coordinates) {
      setCoordinates(initialCoordinates);
    }
  }, [initialAddress, initialCoordinates]);

  const handlePlaceSelect = (data: GooglePlaceData , details: GooglePlaceDetail): void => {
    const { geometry } = details;
    const { lat, lng } = geometry.location;

    console.log('AddressPicker: ', geometry, { lat, lng });

    setAddress(data.description);
    setCoordinates(new Coordinates( lat, lng ));

    if (onSelect) {
      onSelect(
        new Location( new Coordinates(lat, lng), data.description)
      );
    }
  };

  return (
    <View style={styles.container}>
      <GooglePlacesAutocomplete
        ref={googlePlacesRef}
        placeholder={placeHolder}
        fetchDetails={true}
        onPress={handlePlaceSelect}
        onFail={error => console.log(error)}
        onNotFound={() => console.log('no results')}
        query={{ key: GOOGLE_API_KEY }}
        styles={styles}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  textInput:{
    borderWidth: 1,
    borderColor: '#ccc',
  },
  description: {
    fontWeight: 'bold',
  },
  predefinedPlacesDescription: {
    color: '#1faadb',
  },
  listView: {
    color: 'black',
    zIndex: 1000,
    position: 'absolute',
    top: 45,
    borderRadius: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5, // for Android
  },
  poweredContainer: {
    display: 'none',
  },
});

export default AddressPicker;