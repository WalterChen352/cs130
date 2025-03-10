import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, TextInput, Switch, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { RouteProp } from '@react-navigation/native';

// Component imports
import AddressPicker from '../components/AddressPicker';
import DropdownPicker from '../components/DropdownPicker';
import TimeSelector from '../components/TimeSelector';
import ButtonSave from '../components/ButtonSave';
import DateSelector from '../components/DateSelector';
import DurationPicker from '../components/DurationPicker';

// Model imports
import { Workflow } from '../models/Workflow';
import Coordinates, { Location } from '../models/Location';
import { Event } from '../models/Event';

// Script imports
import { addEvent, updateEvent, validateEvent, addRecurringEvent } from '../scripts/Event';
import { getMyLocation } from '../scripts/Geo';
import { getLocation } from '../scripts/Profile';
import { getWorkflows, tryFilterWfId } from '../scripts/Workflow';
import APP_TRANSPORTATION_MODES from '../models/TransportationMode';

import { TabParamList } from './Navigator';
import { formatDate } from '../scripts/Date';

//styles imports
import { styles } from '../styles/CreateTaskScreen.styles';
import { switchColors } from '../styles/Common.styles';
// Navigation imports
import { NavigationProp, useNavigation, useFocusEffect } from '@react-navigation/native';

//Haptics
import * as Haptics from 'expo-haptics';


interface CreateTaskScreenProps {
  route: RouteProp<TabParamList, 'CreateTask'>;
}

/**
 * React component for creating a new task.
 * Allows users to input task details such as title, time, location, transportation mode, and description.
 * 
 * @returns {JSX.Element} The CreateTaskScreen component.
 */
const CreateTaskScreen = ({ route }: CreateTaskScreenProps): React.JSX.Element => {

  const navigation = useNavigation<NavigationProp<TabParamList>>();
  const isEditMode = route.params?.mode === 'edit' && route.params?.eventData; // eslint-disable-line @typescript-eslint/no-unnecessary-condition
  const eventData = route.params?.eventData as Event | undefined; // eslint-disable-line @typescript-eslint/no-unnecessary-condition

  const [title, setTitle] = useState<string>('');
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [autoSchedule, setAutoSchedule] = useState<boolean>(false);
  const [transportationMode, setTransportationMode] = useState<string>('');
  const [workflow, setWorkflow] = useState<Workflow | null>(null);
  const [location, setLocation] = useState<Location | null>(null);
  const [coordinates, setCoordinates] = useState<Coordinates>({latitude: 0, longitude: 0});
  const [description, setDescription] = useState<string>('');
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [duration, setDuration] = useState(0);
  const [submittingEvent, setSubmittingEvent]= useState(false);

  // New state variables for recurring tasks
  const [isRecurring, setIsRecurring] = useState<boolean>(false);
  const [recurringTimes, setRecurringTimes] = useState<number>(1);
  const [recurringInterval, setRecurringInterval] = useState<string>('day');

  /** Dropdown options for transportation modes */
  const transportModeOptions = APP_TRANSPORTATION_MODES.filter(tm => tm.id > 0).map(tm => ({
    label: tm.name,
    value: tm.googleMapsName
  }));

  /** Dropdown options for workflows */
  const workflowOptions = useMemo(() => 
    workflows.map((wf) => ({
      label: wf.name,
      value: wf.id.toString()
    }))
  , [workflows]);

  /** Dropdown options for recurring intervals */
  const recurringIntervalOptions = [
    { label: 'Once a day', value: 'day', key: 'interval-day' },
    { label: 'Once a week', value: 'week', key: 'interval-week' },
    { label: 'Once a month', value: 'month', key: 'interval-month' },
    { label: 'Once a year', value: 'year', key: 'interval-year' },
  ];

  /**
   * Sets the destination coordinates based on the selected location.
   * 
   * @param {Location} location - The selected location object.
   */
  const setDestCoords = (location: Location): void => {
    setCoordinates(location.coordinates);
  };
  /**
   * Handles the change of the start date
   * 
   * @param {Date} newDate - The new date selected
   */
  const handleStartDateChange = (newDate: Date) => {
    const updatedStartDate = new Date(newDate);
    updatedStartDate.setHours(startDate.getHours(), startDate.getMinutes());
    setStartDate(updatedStartDate);
    
    // Update end date to match start date (keep end time)
    const updatedEndDate = new Date(newDate);
    updatedEndDate.setHours(endDate.getHours(), endDate.getMinutes());
    setEndDate(updatedEndDate);
  };

  /**
   * Handles the change of the start time
   * 
   * @param {Date} newTime - The new time selected
   */
  const handleStartTimeChange = (newTime: Date) => {
    const newStartDate = new Date(startDate);
    newStartDate.setHours(newTime.getHours(), newTime.getMinutes());
    setStartDate(newStartDate);
  };

  /**
   * Handles the change of the end time
   * 
   * @param {Date} newTime - The new time selected
   */
  const handleEndTimeChange = (newTime: Date) => {
    const newEndDate = new Date(endDate);
    newEndDate.setHours(newTime.getHours(), newTime.getMinutes());
    setEndDate(newEndDate);
  };

  //**
  // handles change of autoschedule switch
  //  */

  // Populate form with event data if in edit mode
  useEffect(() => {
    if (isEditMode && eventData) {
      setTitle(eventData.name);
      setDescription(eventData.description);
      setStartDate(new Date(eventData.startTime));
      setEndDate(new Date(eventData.endTime));
      setCoordinates(eventData.coordinates)
      setTransportationMode(eventData.transportationMode);
      if (eventData.workflow) {
        const workflowObj = tryFilterWfId(workflows, eventData.workflow);
        if (workflowObj) {
          setWorkflow(workflowObj);
        }
      }
    }
  }, [isEditMode, eventData, workflows]);

  // Fetch workflows every time the screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      const fetchWorkflows = async (): Promise<void> => {
        setWorkflows(await getWorkflows());
      };
      void fetchWorkflows();
      
      return () => {
        // Optional cleanup if needed
      };
    }, [])
  );

  // Fetch location if not in edit mode
  useEffect(() => {
    const fetchLocation = async (): Promise<void> => {
      if (!isEditMode) {
        const location = await getLocation();
        if (
          location === null ||
          (!location.address &&
            location.coordinates.latitude === 0 &&
            location.coordinates.longitude === 0)
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
  }, [isEditMode]);

  // Update destination coordinates when location changes
  useEffect(() => {
    if (location) {
      setDestCoords(location);
    }
  }, [location]);

  /**
   * Creates or updates the event based on form data
   */
  const saveEvent = async (): Promise<void> => {
    try {
      setSubmittingEvent(true);
      const e:Event = {
        id:0,
        name: title,
        description: description,
        startTime:formatDate(startDate),
        endTime: formatDate(endDate),
        coordinates:coordinates,
        transportationMode:transportationMode,
        workflow: workflow?.id ?? null,
      };

      validateEvent(e, autoSchedule);
      
      if (isEditMode && eventData) {
        e.id = eventData.id;
        await updateEvent(e);
        Alert.alert('Success', 'Task updated successfully');
      } else {
        if (isRecurring) {
          await addRecurringEvent(e, recurringTimes, recurringInterval, autoSchedule, duration);
        } else {
          await addEvent(e, autoSchedule, duration);
        }
        Alert.alert('Success', 'Task created successfully');
      }
      void Haptics.notificationAsync(
        Haptics.NotificationFeedbackType.Success
      )
      resetForm();
      navigation.navigate('Daily', { date: e.startTime });
      
    } catch (error) {
      void Haptics.notificationAsync(
        Haptics.NotificationFeedbackType.Error
      )
      Alert.alert('Validation Error', error instanceof Error ? error.message : 'Unknown error');
    }
    setSubmittingEvent(false);
  };

  /**
   * Resets the form to its initial state
   */
  const resetForm = () => {
    setTitle('');
    setDescription('');
    setStartDate(new Date());
    setEndDate(new Date());
    setTransportationMode('');
    setWorkflow(null);
    setCoordinates({longitude:0, latitude:0})
    setAutoSchedule(false);
    setIsRecurring(false);
    setRecurringTimes(1);
    setRecurringInterval('day');
  };

  return (
    <View style={[styles.container, {opacity: submittingEvent ? 0.5 : 1 }]} pointerEvents={submittingEvent ? 'none' : 'auto'}>
      <ScrollView style={styles.scrollContainer}>
        <Text style={styles.title}>{isEditMode ? 'Edit Task' : 'Add a Task'}</Text>
    
        <TextInput
          style={styles.input}
          testID="Title"
          placeholder="Title"
          value={title}
          onChangeText={setTitle}
        />
    
        <View style={[styles.dateContainer, {opacity: autoSchedule ? 0.5 : 1 }]} pointerEvents={autoSchedule ? 'none' : 'auto'}>
          <DateSelector
            value={startDate}
            onChange={handleStartDateChange}
            testID="Date-Selector"
          />
        </View>
        
        {/* Recurring section - moved up here */}
        <View style={styles.switchRow}>
          <Switch 
            trackColor={switchColors.trackColor}
            value={isRecurring} 
            onValueChange={setIsRecurring}
            testID="Recurring"
          />
          <Text style={styles.switchLabel}>Recurring?</Text>
        </View>

        {isRecurring && (
          <View>
            <TextInput
              style={styles.input}
              placeholder="total times"
              keyboardType="numeric"
              value={recurringTimes === 1 ? "" : recurringTimes.toString()}
              onChangeText={(text) => {
                // Only update if text is a valid number or empty
                const num = text === '' ? 1 : parseInt(text);
                if (!isNaN(num)) {
                  setRecurringTimes(num);
                }
              }}
            />
            <View style={styles.dropdownSection1}>
              <DropdownPicker
                selectedValue={recurringInterval}
                onValueChange={(value) => { setRecurringInterval(value.toString()); }}
                items={recurringIntervalOptions}
                testID="Recurring-Interval"
                placeholder="Select Interval"
              />
            </View>
          </View>
        )}
    
        <View style={[styles.timeRow, {opacity: autoSchedule ? 0.5 : 1 }]} pointerEvents={autoSchedule ? 'none' : 'auto'}>
          <TimeSelector
            value={startDate}
            onChange={handleStartTimeChange}
            label="Start"
            testID="Start-Time-Selector"
          />
          
          <TimeSelector
            value={endDate}
            onChange={handleEndTimeChange}
            label="End"
            testID="End-Time-Selector"
          />
        </View>
        <View>
          {autoSchedule?<DurationPicker setDuration={setDuration}/>
          :<></>}
        </View>
    
        <View style={styles.dropdownSection2}>
          <DropdownPicker
            selectedValue={transportationMode}
            onValueChange={(value) => { setTransportationMode(value.toString()); }}
            items={transportModeOptions}
            testID="Transportation-Mode"
            placeholder="Transportation Mode"
          />
        </View>
    
        {isEditMode?<></>:<View style={styles.switchRow}>
          <Switch 
            trackColor={switchColors.trackColor}
            value={autoSchedule} 
            onValueChange={setAutoSchedule}
            testID="Autoschedule"
          />
          <Text style={styles.switchLabel}>Autoschedule</Text>
        </View>}
    
        <View style={styles.dropdownSection3}>
          <DropdownPicker
            selectedValue={workflow?.id.toString()}
            onValueChange={(value) => {
              const selectedWorkflow = tryFilterWfId(workflows, parseInt(value.toString()));
              setWorkflow(selectedWorkflow);
            }}
            items={workflowOptions}
            testID="Workflow-Picker"
            placeholder="Select Workflow"
          />
        </View>
    
        <View style={styles.locationSection}>
          <AddressPicker
            initialAddress={location?.address}
            initialCoordinates={location?.coordinates}
            onSelect={setDestCoords}
            placeHolder="Enter address"
          />
        </View>
    
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Description"
          testID="Description"
          value={description}
          onChangeText={setDescription}
          multiline
        />

        <ActivityIndicator animating={submittingEvent} size="large"></ActivityIndicator>
        <View style={styles.footer} />
        
      </ScrollView>
  
      <ButtonSave
        onPress={() => { void saveEvent(); }}
        testID="Save-Task"
      />
      
    </View>

  );
};

export default CreateTaskScreen;
