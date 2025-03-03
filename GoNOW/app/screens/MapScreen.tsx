import polyline from "polyline";
import React, { JSX, useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import MapView, { Marker, Polyline , Region } from "react-native-maps";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useFocusEffect } from '@react-navigation/native';

import ButtonSave from '../components/ButtonSave';
import { Leg } from '../models/Geo';
import { Coordinates } from '../models/Location';
import { TransportationMode } from '../models/TransportationMode';
import { getMyLocation, getRoute, approxDistanceFeets } from '../scripts/Geo';
import { IMapEvent, MapEventAdapter } from '../scripts/Map';
import { getLocation } from '../scripts/Profile';
import { getTransportationModeByGisName, getTransportationMode } from '../scripts/TransportationMode';
import { MapScreenStyles as styles } from '../styles/MapScreen.styles';

/**
 * `MapScreen` component that displays a with nearest events 
 * and device location.
 *
 * @returns {JSX.Element} - The rendered `MapScreen` component.
 */
const MapScreen = (): JSX.Element => {

  const mapRegionDefault: Region = {
    latitude: 34.0689027,
    longitude: -118.4456223,
    latitudeDelta: 0.5,
    longitudeDelta: 0.5
  };

  const [deviceLocation, setDeviceLocation] = useState<Coordinates | null>(null);
  const [events, setEvents] = useState<IMapEvent[]>([]);
  const [homeLocation, setHomeLocation] = useState<Coordinates | null>(null);
  const [mapRoute, setMapRoute] = useState<MapRoute | null>(null);
  
  const mapRef = useRef(null);

  /**
   * Loads location of current device.
   *
   * @async
   * @returns {Promise<void>} - A promise that resolves when `device location` state is updated.
   */
  const loadDeviceLocation = async (): Promise<void> => {
    const loc = await getMyLocation();
    setDeviceLocation(loc !== null ? loc.coordinates : new Coordinates(0, 0));

  }

  /**
   * Loads home location.
   *
   * @async
   * @returns {Promise<void>} - A promise that resolves when `home location` state is updated.
   */
  const loadHomeLocation = async (): Promise<void> => {
    const loc = await getLocation();
    setHomeLocation(loc !== null ? loc.coordinates : new Coordinates(0, 0));
  }

  /**
   * Loads list of events for current date.
   *
   * @async
   * @returns {Promise<void>} - A promise that resolves when `events` state is updated.
   */
  const loadEvents = async (): Promise<void> => {
    let mapEvents = await MapEventAdapter();
    //console.log("MAP SCREEN. load events: ", mapEvents);
    const now = new Date();
    mapEvents = mapEvents.filter(e => e.startTime > now);
    if (mapRoute !== null 
        && mapEvents.filter(e => e.id === mapRoute.event?.id).length === 0) {
      setMapRoute(null); // hide route if is opened and not actual
    }
    //console.log(">>> loadEvents", JSON.stringify(mapEvents));
    setEvents(mapEvents);
  };

  useEffect(() => {
    void loadEvents();
    void loadHomeLocation();
    void loadDeviceLocation();
  }, []);

  useFocusEffect(
    useCallback(() => {
      void loadEvents();
      void loadHomeLocation();
      void loadDeviceLocation();
    }, [])
  );

  /**
   * Represents a part of route. Contains start and end points, 
   * travel mode, description, and in between route coordinates.
   *
   * @interface MapStep
   * @typedef {MapStep}
   */
  interface MapStep {
    /**
     * Starting point of this step in the route.
     *
     * @type {Coordinates}
     */
    startPoint: Coordinates;

    /**
     * Ending point of this step in the route.
     *
     * @type {Coordinates}
     */
    endPoint: Coordinates;

    /**
     * Transportation mode used for this step in the route.
     *
     * @type {TransportationMode}
     */
    travelMode: TransportationMode;

    /**
     * Brief name describing this step in the route.
     *
     * @type {string}
     */
    title: string;

    /**
     * Detailed description of this step in the route.
     *
     * @type {string}
     */
    description: string;

    /**
     * List of coordinates representing the path taken in this step.
     *
     * @type {Coordinates[]}
     */
    points: Coordinates[];
  }

  /**
   * Represents a state for route on the map. Contains general metadata
   * about the entire route and a set of route steps (parts).
   *
   * @interface MapRoute
   * @typedef {MapRoute}
   */
  interface MapRoute {
    /**
     * Target Event.
     *
     * @type {?IMapEvent}
     */
    event?: IMapEvent;

    /**
     * Name of starting point of the route.
     *
     * @type {string}
     */
    departureName: string;

    /**
     * Name of ending point of the route.
     *
     * @type {string}
     */
    destinationName: string;

    /**
     * Human-readable distance of the route (e.g., "10 km", "5 miles").
     *
     * @type {string}
     */
    distanceText: string;

    /**
     * Numerical distance value of the route in meters.
     *
     * @type {number}
     */
    distanceValue: number;

    /**
     * Human-readable estimated duration to complete the route (e.g., "15 min").
     *
     * @type {string}
     */
    durationText: string;

    /**
     * Numerical duration value in seconds.
     *
     * @type {number}
     */
    durationValue: number;

    /**
     * Estimated time left (in seconds) before reaching the destination.
     *
     * @type {number}
     */
    leftTime: number;

    /**
     * Transportation mode used for the route.
     *
     * @type {TransportationMode}
     */
    transportationMode: TransportationMode;

    /**
     * List of steps of the route.
     *
     * @type {MapStep[]}
     */
    steps: MapStep[];
  }

  /**
   * Builds a route as a list of steps to the specified event location.
   *
   * @async
   * @param {IMapEvent} event - The event for which the route needs to be built.
   * @returns {Promise<void>} - A promise that resolves when the route is set.
   */
  const buildRoute = async (event: IMapEvent): Promise<void> => {
    if (deviceLocation === null) {
      console.error("Error device location. Routing skipped.");
      return;
    }
    const departure: Coordinates = deviceLocation;
    const destination: Coordinates = event.coordinates;

    // If the event is within a short distance (under 300 feet),
    // no need to request GIS api. Jump in 5 min.
    if (approxDistanceFeets(departure, destination) < 300) {
      const jumpRoute: MapRoute = {
        event: event,
        departureName: 'Your location',
        destinationName: `${event.name}, Scheduled time: ${event.startTime.toLocaleTimeString().replace(/:\d\d\s/,' ')}`,
        distanceText: `${approxDistanceFeets(departure, destination).toString()} ft.`,
        distanceValue: Math.round(approxDistanceFeets(departure, destination) * 0.3048),
        durationText: '5 mins',
        durationValue: 300,
        leftTime: Math.round((event.startTime.getTime() - (new Date()).getTime()) / 1000) - 300,
        transportationMode: getTransportationMode(0),
        steps: [{
          startPoint: departure,
          endPoint: destination,
          travelMode: getTransportationMode(0),
          title: '',
          description: '',
          points: [departure, destination]
        }]
      };
      setMapRoute(jumpRoute);
      return;
    }

    const routesResult = await getRoute(departure, destination, event.transportationMode);
    if (routesResult && Array.isArray(routesResult) && routesResult.length > 0) {
      if (Array.isArray(routesResult[0].legs) && routesResult[0].legs.length > 0) {
        const leg: Leg = routesResult[0].legs[0];
        const mapSteps: MapStep[] = [];
        const tmpRoute: MapRoute = {
          event: event,
          departureName: 'Your location',
          destinationName: `${event.name}, Scheduled time: ${event.startTime.toLocaleTimeString().replace(/:\d\d\s/,' ')}`,
          distanceText: leg.distance.text,
          distanceValue: leg.distance.value,
          durationText: leg.duration.text,
          durationValue: leg.duration.value,
          leftTime: Math.round((event.startTime.getTime() - (new Date()).getTime()) / 1000) - leg.duration.value,
          transportationMode: event.transportationMode,
          steps: mapSteps
        };
        leg.steps.forEach(step => {
          const tmpPoints: Coordinates[] = [];
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
          const decodedPoints = polyline.decode(step.polyline.points) as number[][];
          decodedPoints.forEach((dp:number[]) => {
            tmpPoints.push(new Coordinates(dp[0], dp[1]));
          });
          const tmpStep: MapStep = {
            startPoint: new Coordinates(step.start_location.lat, step.start_location.lng),
            endPoint: new Coordinates(step.end_location.lat, step.end_location.lng),
            travelMode: getTransportationModeByGisName(step.travel_mode ?? ""),
            title: `${step.distance.text}, ${step.duration.text}`,
            description: step.html_instructions.replace(/<[^>]*>/g, ''), // cut all html tags
            points: tmpPoints
          }
          tmpRoute.steps.push(tmpStep);
        });
        setMapRoute(tmpRoute);
      } else {
        setMapRoute(null);
      }
    } else {
      console.log("WARNING MapScreen: Route is empty");
    }
  }

  /**
   * Collection of Google Maps marker icon URLs for various locations on the map.
   * Source: https://stackoverflow.com/questions/17746740/google-map-icons-with-visualrefresh
   *
   * @type {{ default: string; myLocation: string; homeLocation: string; routePointDefault: string; }}
   * @property {string} default - The default marker icon for general locations.
   * @property {string} myLocation - The marker icon for the user's current location.
   * @property {string} homeLocation - The marker icon for the user's home location.
   * @property {string} routePointDefault - The marker icon used for step points on the route.
   */
  const mapIcons = {
    default: `https://mt.google.com/vt/icon/text=%E2%80%A2&psize=36&color=ffd5f9cf&name=icons/spotlight/spotlight-waypoint-b.png&ax=44&ay=48&scale=4`,
    myLocation: 'https://mt.google.com/vt/icon/text=I&psize=16&color=ff330000&name=icons/spotlight/spotlight-waypoint-b.png&ax=44&ay=48&scale=4',
    homeLocation: 'https://mt.google.com/vt/icon/name=icons/spotlight/home_L_8x.png&scale=4',
    routePointDefault: 'https://mt.google.com/vt/icon/name=icons/spotlight/directions_transfer_icon_10px.png&scale=3',
  }

  // Marker doc: https://github.com/react-native-maps/react-native-maps/blob/master/docs/marker.md
  // pinColor sets color of the map marker.
  // BUT for Android, the set of available colors is limited with red as default for all others.
  // See https://github.com/react-native-maps/react-native-maps/issues/887
  // Also for Android, there is an issue with nested elements (36x36 points max).
  // See https://github.com/react-native-maps/react-native-maps/issues/4803
  
  /**
   * Generate link to event icon, use color from event workflow.
   *
   * @param {IMapEvent} event - The event to create icon link for the map.
   * @param {number} index - The index of event (show as text on the icon).
   * @returns {string} - The icon URI for given event.
   */
  const getEventIcon = (event: IMapEvent, index: number):string => {
    const iconColor = event.workflow?.color.replace('#','') ?? 'f9675c';
    const iconText = (index + 1).toString();
    const iconTextSize = index < 10 ? 16 : 14;
    const iconTextColor = '333333';
    const iconSize = 4;
    const uri = `https://mt.google.com/vt/icon/text=${iconText}`
              + `&psize=${iconTextSize.toString()}`
              + `&color=ff${iconTextColor}`
              + `&highlight=${iconColor}`
              + `&scale=${iconSize.toString()}`
              //+ `&ax=44`
              + `&ay=48`
              + `&name=icons/spotlight/spotlight-waypoint-b.png`;
    //console.log(uri);
    return uri;
  }
  
  return (
    <View style={styles.container}>
      <MapView style={styles.map} region={mapRegionDefault} ref={mapRef} testID='map'>
        
        {deviceLocation !== null &&
          <Marker
            coordinate={{
              latitude: deviceLocation.latitude,
              longitude: deviceLocation.longitude
            }}
            title="You are here"
            icon={{ uri: mapIcons.myLocation }}
            testID={`marker-device`}
          />
        }
        {homeLocation !== null &&
          <Marker
            coordinate={{
              latitude: homeLocation.latitude,
              longitude:  homeLocation.longitude,
            }}
            title="Your home location"
            icon={{ uri: mapIcons.homeLocation }}
            testID={`marker-home`}
          />
        }
        {events.filter(event => event.coordinates.latitude !==0 
          && event.coordinates.longitude !== 0).map((event, index) =>
          <Marker
            key={`marker-${event.id.toString()}`}
            coordinate={{
              latitude: event.coordinates.latitude,
              longitude: event.coordinates.longitude,
            }}
            onPress={() => (void buildRoute(event))}
            title={event.name || "Noname"}
            description={
                event.startTime.toLocaleTimeString().replace(/:\d\d\s/,' ')
              + ` - `
              + event.endTime.toLocaleTimeString().replace(/:\d\d\s/,' ')
            }
            icon={{ uri: getEventIcon(event, index) }}
            testID={`marker-event-${event.id.toString()}`}
          />
        )}

        {mapRoute !== null /* Render route steps on the map. */
          ? mapRoute.steps.map((step: MapStep, ind:number) => (
            <React.Fragment key={ind}>
              <Marker
                coordinate={step.startPoint}
                title={step.title}
                icon={{ uri: mapIcons.routePointDefault }}
                anchor={{ x: 0.2, y: 0.5 }}
                description={step.description}
              />
              <Polyline
                coordinates={step.points}
                strokeColor={step.travelMode.color}
                strokeWidth={4}
              />
            </React.Fragment>
          ))
          : null
        }

      </MapView>

      {mapRoute !== null && /* Panel with route info. */
        <React.Fragment>
          <View style={styles.routePanel}>
            <TouchableOpacity style={styles.routeClose} onPress={() => { setMapRoute(null); }} >
              <Ionicons name='close' size={24} color='#bbb' testID="btn-close-icon" />
            </TouchableOpacity>
            <Text style={styles.routeText}>From: {mapRoute.departureName}</Text>
            <Text style={styles.routeText}>To: {mapRoute.destinationName}</Text>
            <Text style={styles.routeText}>Travel time: {mapRoute.durationText}</Text>
            <Text style={[{ color: mapRoute.leftTime >= 0 ? '' : 'red'}, styles.routeText]}>
              Left time before departure: {
                (mapRoute.leftTime >= 0 ? '' : '-')
                + String(Math.trunc(Math.abs(mapRoute.leftTime) / 3600)).padStart(2, '0')
                + `:`
                + String(Math.trunc((Math.abs(mapRoute.leftTime) % 3600) / 60)).padStart(2, '0')
              }
            </Text>
            <Text style={styles.routeText}>Distance: {mapRoute.distanceText}</Text>
            <Text style={styles.routeText}>Transport: {mapRoute.transportationMode.name}</Text>
          </View>
        </React.Fragment>
      }

      {/* Return to current map location. */}
      <ButtonSave
        icon="locate"
        bgColor="lightblue"
        onPress={() => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call
          mapRef.current?.animateToRegion(mapRegionDefault, 1000);
        }}
        testID="map-btn-center"
      />

    </View>
  );
};

export default MapScreen;