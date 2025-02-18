import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, TextInput, FlatList, Text, TouchableOpacity } from 'react-native';
import debounce from 'lodash/debounce';
import { Coordinates, Location } from '../models/Location';

interface NominatimResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
}

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
  const [results, setResults] = useState<NominatimResult[]>([]);

  useEffect(() => {
    if (initialAddress !== address) {
      setAddress(initialAddress);
    }
    if (initialCoordinates && initialCoordinates !== coordinates) {
      setCoordinates(initialCoordinates);
    }
  }, [initialAddress, initialCoordinates]);

  const searchPlaces = async (query: string): Promise<void> => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query
        )}&limit=5`,
        {
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'GoNOW/1.0'
          }
        }
      );
      const data: NominatimResult[] = await response.json();
      setResults(data);
    } catch (error) {
      console.error('Nominatim search error:', error);
    }
  };

  const debouncedSearch = useCallback(
    debounce((text: string) => searchPlaces(text), 1000),
    []
  );

  const handleTextChange = (text: string): void => {
    setAddress(text);
    debouncedSearch(text);
  };

  const handleSelectPlace = (item: NominatimResult): void => {
    const lat = parseFloat(item.lat);
    const lng = parseFloat(item.lon);
    setAddress(item.display_name);
    setCoordinates(new Coordinates(lat, lng));
    setResults([]);
    if (onSelect) {
      onSelect(new Location(new Coordinates(lat, lng), item.display_name));
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.textInput}
        placeholder={placeHolder}
        value={address}
        onChangeText={handleTextChange}
      />
      {results.length > 0 && (
        <FlatList
          style={styles.listView}
          data={results}
          keyExtractor={(item) => item.place_id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.resultItem}
              onPress={() => handleSelectPlace(item)}
            >
              <Text style={styles.description}>{item.display_name}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
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
  resultItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  description: {
    fontWeight: 'bold',
  },
});

export default AddressPicker;