import React, { useState, JSX } from 'react';
import { ScrollView, View, Text, TextInput, Button, Switch, Pressable } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { addEvent } from '../scripts/Event';
import { styles } from '../styles/CreateTaskScreen.styles';
import {Event} from '../models/Event';

const CreateTaskScreen = (): JSX.Element => {
  const [title, setTitle] = useState<string>('');
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [autoSchedule, setAutoSchedule] = useState<boolean>(false);
  const [transportationMode, setTransportationMode] = useState<string>('');
  const [longitude, setLongitude] = useState<string>('');
  const [latitude, setLatitude] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [showStartDatePicker, setShowStartDatePicker] = useState<boolean>(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState<boolean>(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState<boolean>(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState<boolean>(false);

  const dropdownOptions = [
    { label: 'Walk', value: 'walk' },
    { label: 'Public Transit', value: 'transit' },
    { label: 'Bike', value: 'bike' },
    { label: 'Car', value: 'car' },
  ];

  return (
    <ScrollView>
      <Text style={styles.title}>Add a task</Text>

      <TextInput
        style={styles.input}
        testID='Title'
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
      />

      <Text style={styles.label}>Select start time</Text>
      <View style={styles.row}>
        <Button title={startDate.toDateString()} onPress={() => { setShowStartDatePicker(true); }} />
        <Button title={startDate.toLocaleTimeString()} onPress={() => { setShowStartTimePicker(true); }} />
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
        <Button title={endDate.toDateString()} onPress={() => { setShowEndDatePicker(true); }} />
        <Button title={endDate.toLocaleTimeString()} onPress={() => { setShowEndTimePicker(true); }} />
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
        testID='Transportation Mode'
        placeholder="Select Transportation Mode"
        searchPlaceholder="Search..."
        value={transportationMode}
        onChange={(item:{ value: string }) => {
          setTransportationMode(item.value);
        }}
      />
      
      <View style={styles.row}>
        <Switch value={autoSchedule} onValueChange={setAutoSchedule} />
        <Text style={styles.label}>Autoschedule?</Text>
      </View>

      <Text style={styles.label}>Enter latitude</Text>
      <TextInput
        style={styles.input}
        value={latitude}
        onChangeText={setLatitude}
      />

      <Text style={styles.label}>Enter longitude</Text>
      <TextInput
        style={styles.input}
        value={longitude}
        onChangeText={setLongitude}
      />

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Description"
        testID='Description'
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <Pressable 
        style={styles.container} 
        testID='Save Task'
        onPress={() => {
            void (async () => {
              // TODO PLACEHOLDER VALUES
              const longitude = 0;
              const latitude = 0;
              const workflow = '';
              // END PLACEHOLDER
              const e = new Event(
                title,
                description,
                formatDate(startDate),
                formatDate(endDate),
                longitude,
                latitude,
                transportationMode,
                workflow
              );
              await addEvent(e);
            })();
          }}
      >
        <Text>Save Task</Text>
      </Pressable>
    </ScrollView>
  );
};

const formatDate = (date: Date): string => {
  const datePart = date.toLocaleDateString('en-CA');
  const timePart = date.toLocaleTimeString('en-GB');
  return `${datePart} ${timePart}`;
};

export default CreateTaskScreen;
