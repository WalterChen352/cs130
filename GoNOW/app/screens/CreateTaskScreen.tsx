//package imports
import React, { useState, useEffect, JSX } from 'react';
import { ScrollView, View, Text, TextInput, Button, Switch, Pressable } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { RouteProp } from '@react-navigation/native';

//component imports
import AddressPicker from '../components/AddressPicker';
import WorkflowPicker from '../components/WorkflowPicker';

//model imports
import { Workflow } from '../models/Workflow';
import { Location } from '../models/Location';
import { Event } from '../models/Event';
import { addEvent, updateEvent } from '../scripts/Event';

//script imports
import { getMyLocation } from '../scripts/Geo';
import { getLocation } from '../scripts/Profile';
import { getWorkflows, filter_workflows_by_id } from '../scripts/Workflow';

//style imports
import { styles } from '../styles/CreateTaskScreen.styles';

//misc imports TODO::
import { TabParamList } from './Navigator';

interface EventData {
  id: number;
  name: string;
  description: string;
  startTime: string;
  endTime: string;
  latitude: number;
  longitude: number;
  transportationMode: string;
  workflow?: string;
}

interface CreateTaskScreenProps {
  route: RouteProp<TabParamList, 'CreateTask'>;
}


/**
 * React component for creating a new task.
 * Allows users to input task details such as title, time, location, transportation mode, and description.
 * 
 * @returns {JSX.Element} The CreateTaskScreen component.
 */
const CreateTaskScreen = ({ route }: CreateTaskScreenProps): JSX.Element => {
  const isEditMode = route.params?.mode === 'edit' && route.params?.eventData;// eslint-disable-line @typescript-eslint/no-unnecessary-condition
  const eventData = route.params?.eventData as EventData | undefined;// eslint-disable-line @typescript-eslint/no-unnecessary-condition

  const [title, setTitle] = useState<string>('');
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [autoSchedule, setAutoSchedule] = useState<boolean>(false);
  const [transportationMode, setTransportationMode] = useState<string>('');
  const [workflow, setWorkflow] = useState<Workflow | null>(null);
  const [location, setLocation] = useState<Location | null>(null);
  const [longitude, setLongitude] = useState<number>(0.0);
  const [latitude, setLatitude] = useState<number>(0.0);
  const [description, setDescription] = useState<string>('');
  const [showStartDatePicker, setShowStartDatePicker] = useState<boolean>(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState<boolean>(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState<boolean>(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState<boolean>(false);
  const [workflows, setWorkflows] = useState<Workflow[]>([]);

  /** Dropdown options for transportation modes */
  const dropdownOptions = [
    { label: 'Walk', value: 'walk' },
    { label: 'Public Transit', value: 'transit' },
    { label: 'Bike', value: 'bike' },
    { label: 'Car', value: 'car' },
  ];

  /**
   * Sets the destination coordinates based on the selected location.
   * 
   * @param {Location} location - The selected location object.
   */
  const setDestCoords = (location: Location): void => {
    setLatitude(location.Coordinates.Latitude);
    setLongitude(location.Coordinates.Longitude);
  };

  // Populate form with event data if in edit mode
  useEffect(() => {
    if (isEditMode && eventData) {
      setTitle(eventData.name);
      setDescription(eventData.description);
      setStartDate(new Date(eventData.startTime));
      setEndDate(new Date(eventData.endTime));
      setLatitude(eventData.latitude);
      setLongitude(eventData.longitude);
      setTransportationMode(eventData.transportationMode);
      setWorkflow(filter_workflows_by_id(workflows, eventData.id))
    }
  }, [isEditMode, eventData]);

  // Fetch location if not in edit mode
  /** Fetches the user's location on component mount */
  useEffect(() => {
    const fetchLocation = async (): Promise<void> => {
      if (!isEditMode) {
        const location = await getLocation();
        if (
          location === null ||
          (!location.Address &&
            location.Coordinates.Latitude === 0 &&
            location.Coordinates.Longitude === 0)
        ) {
          const currentLocation = await getMyLocation();
          if (currentLocation !== null) {
            setLocation(currentLocation);
          }
        } else {
          setLocation(location);
        }
      }
    };
    void fetchLocation();

    const fetchWorkflows = async (): Promise<void> => {
      setWorkflows(await getWorkflows());
    }
    void fetchWorkflows();
  }, [isEditMode]);

  /** Updates destination coordinates when location changes */
  useEffect(() => {
    if (location) {
      setDestCoords(location);
    }
    if(location){
      setDestCoords(location)
    }
  }, [location]);

  /*TODO:: replace scrollview with flatlist, or modify addresspicker to not use virtualizedlist*/
  return (
    <ScrollView> 
      <Text style={styles.title}>{isEditMode ? 'Edit task' : 'Add a task'}</Text>

      <TextInput
        style={styles.input}
        testID="Title"
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
      />

      <Text style={styles.label}>Select start time</Text>
      <View style={styles.row}>
        <Button
          title={startDate.toDateString()}
          testID="Start Date"
          onPress={() => {
            setShowStartDatePicker(true);
          }}
        />
        <Button
          title={startDate.toLocaleTimeString()}
          onPress={() => {
            setShowStartTimePicker(true);
          }}
        />
      </View>

      {showStartDatePicker && (
        <DateTimePicker
          value={startDate}
          mode="date"
          display="default"
          onChange={(event: DateTimePickerEvent, selectedDate?: Date) => {
            setShowStartDatePicker(false);
            if (selectedDate) setStartDate(selectedDate);
          }}
        />
      )}

      {showStartTimePicker && (
        <DateTimePicker
          value={startDate}
          mode="time"
          display="default"
          onChange={(event: DateTimePickerEvent, selectedTime?: Date) => {
            setShowStartTimePicker(false);
            if (selectedTime) setStartDate(selectedTime);
          }}
        />
      )}

      <Text style={styles.label}>Select end time</Text>
      <View style={styles.row}>
        <Button
          title={endDate.toDateString()}
          onPress={() => {
            setShowEndDatePicker(true);
          }}
        />
        <Button
          title={endDate.toLocaleTimeString()}
          onPress={() => {
            setShowEndTimePicker(true);
          }}
        />
      </View>

      {showEndDatePicker && (
        <DateTimePicker
          value={endDate}
          mode="date"
          display="default"
          onChange={(event: DateTimePickerEvent, selectedDate?: Date) => {
            setShowEndDatePicker(false);
            if (selectedDate) setEndDate(selectedDate);
          }}
        />
      )}

      {showEndTimePicker && (
        <DateTimePicker
          value={endDate}
          mode="time"
          display="default"
          onChange={(event: DateTimePickerEvent, selectedTime?: Date) => {
            setShowEndTimePicker(false);
            if (selectedTime) setEndDate(selectedTime);
          }}
        />
      )}

      <Text style={styles.label}>Select transportation mode</Text>
      <Dropdown
        style={styles.dropdown}
        data={dropdownOptions}
        search
        maxHeight={300}
        labelField="label"
        valueField="value"
        testID="Transportation Mode"
        placeholder="Select Transportation Mode"
        searchPlaceholder="Search..."
        value={transportationMode}
        onChange={(item: { value: string }) => {
          setTransportationMode(item.value);
        }}
      />

      <View style={styles.row}>
        <Switch value={autoSchedule} onValueChange={setAutoSchedule} />
        <Text style={styles.label}>Autoschedule?</Text>
      </View>

      <Text style={styles.label}>Select workflow</Text>
      <WorkflowPicker
        workflows={workflows}
        onSelect={(id) => {setWorkflow(filter_workflows_by_id(workflows, id))}}  
      />

      <Text style={styles.label}>Enter address</Text>
      <View style={[styles.locationPicker, {}]}>
        <AddressPicker
          initialAddress={location?.Address}
          initialCoordinates={location?.Coordinates}
          onSelect={setDestCoords}
          placeHolder="Address"
        />
      </View>

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Description"
        testID="Description"
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <Pressable
        style={styles.container}
        testID="Save Task"
        onPress={() => {
          void (async () => {
            const e = new Event(
              title,
              description,
              formatDate(startDate),
              formatDate(endDate),
              longitude,
              latitude,
              transportationMode,
              workflow?.id ?? -1, //set workflow.id to -1 if workflow is null
            );
            
            if (isEditMode && eventData) {
              e.id = eventData.id;
              await updateEvent(e);
            } else {
              await addEvent(e);
            }
          })();
        }}
      >
        <Text>{isEditMode ? 'Update Task' : 'Create Task'}</Text>
      </Pressable>
    </ScrollView>
  );
};


/**
   * Formats a date object into a string with date and time.
   * 
   * @param {Date} date - The date to format.
   * @returns {string} The formatted date string.
   */
const formatDate = (date: Date): string => {
  const datePart = date.toLocaleDateString('en-CA');
  const timePart = date.toLocaleTimeString('en-GB');
  return `${datePart} ${timePart}`;
};

export default CreateTaskScreen;