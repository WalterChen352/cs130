import debounce from 'lodash/debounce';
import React, { useState, useEffect, useCallback } from 'react';
import { View, TextInput, FlatList, Modal, Text, TouchableOpacity } from 'react-native';
import MapView, { Marker, MarkerDragStartEndEvent } from "react-native-maps";
import Ionicons from 'react-native-vector-icons/Ionicons';

import ButtonDelete from '../components/ButtonDelete';
import ButtonSave from '../components/ButtonSave';
import { Coordinates, Location } from '../models/Location';
import { WEB_USER_AGENT } from '../scripts/Config';
import { getAddressByCoordinates } from '../scripts/Geo';
import { AddressPickerStyles } from '../styles/AddressPicker.styles';

/**
 * Represents the result of a place search returned by Nominatim.
 */
interface NominatimResult {

  /** Unique id of the place. */
  place_id: number;

  /** Display name of the place. */
  display_name: string;

  /** Latitude of the place. */
  lat: string;
  /** Longitude of the place. */
  lon: string;
}

/**
 * Props for the AddressPicker component.
 */
interface AddressPickerProps {

  /** Initial address to display in the address input field. */
  initialAddress?: string;

  /** Initial coordinates for the address. */
  initialCoordinates?: Coordinates;

  /** Callback function that is called when a location is selected. */
  onSelect?: (location: Location) => void;

  /** The placeholder text for the address input field. */
  placeHolder?: string;

  /** The test ID for the component, for using in testing. */
  testID?: string;
}

/**
 * Component for selecting an address and corresponding coordinates.
 * Allows users to search for places and select one from a list of results.
 * 
 * @param initialAddress - The initial address to display in the input field (optional).
 * @param initialCoordinates - The initial coordinates associated with the address (optional).
 * @param onSelect - The callback function that is called when a location is selected (optional).
 * @param placeHolder - The placeholder text for the address input field (optional).
 * @param testID - The test ID for the component (optional).
 * 
 * @returns - The view with a text input for the address and a list of search results.
 */
const AddressPicker: React.FC<AddressPickerProps> = ({
  initialAddress = '',
  initialCoordinates = null,
  onSelect,
  placeHolder = 'Type an address',
  testID = "address-picker",
}) => {
  const [address, setAddress] = useState(initialAddress);
  const [coordinates, setCoordinates] = useState<Coordinates | null>(initialCoordinates);
  const [results, setResults] = useState<NominatimResult[]>([]);
  const [mapOpened, setMapOpened] = useState<boolean>(false);
  const [mapAddress, setMapAddress] = useState(initialAddress);
  const [mapCoordinates, setMapCoordinates] = useState<Coordinates | null>(initialCoordinates);

  useEffect(() => {
    if (initialAddress !== address) {
      setAddress(initialAddress);
    }
    if (initialCoordinates && initialCoordinates !== coordinates) {
      setCoordinates(initialCoordinates);
    }
  }, [initialAddress, initialCoordinates]);

  /**
   * Searches for places using the Nominatim API based on the given query.
   * This method does not return any value.
   *
   * @async
   * @param {string} query - The query string to search for places.
   * @returns {Promise<void>} - A promise that resolves when the search completed successfully.
   */
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
            'User-Agent': WEB_USER_AGENT
          }
        }
      );
      const data: NominatimResult[] = await response.json() as NominatimResult[];
      setResults(data);
    } catch (error) {
      console.error('Nominatim search error:', error);
    }
  };

  /**
   * Debounced version of the search method to avoid extra API calls.
   *
   * @param text - The search query entered by the user.
   */
  const debouncedSearch = useCallback(
    debounce((text: string) => searchPlaces(text), 1000) as (text: string) => void,
    []
  );

  /**
   * Handles change in the address input field and triggers the debounced search.
   * This method does not return any value.
   *
   * @param {string} text - The text entered in the address input field.
   */
  const handleTextChange = (text: string): void => {
    setAddress(text);
    debouncedSearch(text);
  };

  /**
   * Handles selection of a place from the search results.
   * This method does not return any value.
   *
   * @param {NominatimResult} item - The selected search result.
   */
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

  /** Open map for select location on the map. */
  const openMap = (): void => {
    setResults([]);
    setMapCoordinates(coordinates);
    setMapOpened(true)
  }

  /**
   * After moving the marker, handler receives the marker coordinates and
   * the address for these coordinates.
   *
   * @async
   * @param {MarkerDragStartEndEvent} event - The Google event of the marker dropped on the map.
   * @returns {Promise<void>} - A promise that resolves when the method
   * complete successfully.
   */
  const handleMarkerDragEnd = async (event: MarkerDragStartEndEvent): Promise<void> => {
    const coords = new Coordinates(
      event.nativeEvent.coordinate.latitude,
      event.nativeEvent.coordinate.longitude
    );
    setMapCoordinates(coords);
    const tmpAddress = await getAddressByCoordinates(coords);
    setMapAddress(tmpAddress);
  }

  /** Save coordinates selected on map and return by onselect . */
  const handleSaveMap = (): void => {
    setCoordinates(mapCoordinates);
    setAddress(mapAddress);
    setMapOpened(false);
    if (onSelect && mapCoordinates) {
      onSelect(new Location(mapCoordinates, mapAddress));
    }
  }

  return (
    <View style={AddressPickerStyles.container}>
      <TextInput
        style={AddressPickerStyles.textInput}
        placeholder={placeHolder}
        value={address}
        onChangeText={handleTextChange}
        testID={testID}
      />
      <TouchableOpacity
        onPress={openMap}
        style={AddressPickerStyles.iconButton}
        testID="map-btn"
      >
        <Ionicons name="location-outline" size={20} color="#555" />
      </TouchableOpacity>

      {results.length > 0 && (
        <FlatList
          style={AddressPickerStyles.listView}
          scrollEnabled={false}
          data={results}
          keyExtractor={(item) => item.place_id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={AddressPickerStyles.resultItem}
              onPress={() => { handleSelectPlace(item); }}
            >
              <Text style={AddressPickerStyles.description}>{item.display_name}</Text>
            </TouchableOpacity>
          )}
        />
      )}
      <Modal
        visible={mapOpened}
        onRequestClose={() => { setMapOpened(false); }}
        animationType="slide"
        transparent={false}
      >
        <View style={AddressPickerStyles.mapContainer}>
          
          <MapView
            style={AddressPickerStyles.mapView}
            initialRegion={{
              latitude: coordinates?.latitude ?? 0,
              longitude: coordinates?.longitude ?? 0,
              latitudeDelta: 0.005,
              longitudeDelta: 0.005,
            }}
          >
            <Marker
              coordinate={coordinates ?? {latitude: 0, longitude: 0}}
              draggable={true}
              onDragEnd={(event:MarkerDragStartEndEvent) => void handleMarkerDragEnd(event)}
              icon={{ uri: `https://mt.google.com/vt/icon/text=%E2%80%A2&psize=36&color=ffd5f9cf&name=icons/spotlight/spotlight-waypoint-b.png&ax=44&ay=48&scale=4` }}
              testID={`map-marker`}
            />
          </MapView>

          <View style={AddressPickerStyles.addressPanel}>
            <Text style={AddressPickerStyles.addressPanelText}>
              { mapAddress ? mapAddress : 'Drag me' }
            </Text>
          </View>
          <ButtonSave onPress={handleSaveMap} testID="map-btn-save" />
          <ButtonDelete
            onPress={() => { setMapOpened(false); }} 
            testID="map-btn-close"
          />

        </View>
      </Modal>
    </View>
  );
};

export default AddressPicker;