import React, { useState } from 'react';
import { ScrollView, View, Text, TextInput, Button, Switch, StyleSheet, Pressable } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import DateTimePicker from '@react-native-community/datetimepicker';
import { addEvent } from '../scripts/database';
import { styles } from "./screen_styles/CreateTaskScreen.styles"

const CreateTaskScreen = () => {
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [autoSchedule, setAutoSchedule] = useState(false);
  const [transportationMode, setTransportationMode] = useState('');
  const [longitude, setLongitude] = useState('');
  const [latitude, setLatitude] = useState('');
  const [description, setDescription] = useState('');
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  
  const dropdownOptions = [
    { label: 'Walk', value: 'walk' },
    { label: 'Public Transit', value: 'transit' },
    { label: 'Bike', value: 'bike' },
    { label: 'Car', value: 'car' },
  ];


  return (
    <ScrollView>
      <Text style={styles.title}>Add a task</Text>

      {/*Task Title*/}
      <TextInput
        style={styles.input}
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
      />

      {/*Task Start Date and Time*/}
      <Text style={styles.label}>Select start time</Text>
      <View style={styles.row}>
        <Button title={startDate.toDateString()} onPress={() => setShowStartDatePicker(true)} />
        <Button title={startDate.toLocaleTimeString()} onPress={() => setShowStartTimePicker(true)} />
      </View>

      {showStartDatePicker && (
        <DateTimePicker
          value={startDate}
          mode="date"
          display="default"
          onChange={(event, selectedStartDate) => {
            setShowStartDatePicker(false);
            if (selectedStartDate) setStartDate(selectedStartDate);
          }}
        />
      )}

      {showStartTimePicker && (
        <DateTimePicker
          value={startDate}
          mode="time"
          display="default"
          onChange={(event, selectedStartTime) => {
            setShowStartTimePicker(false);
            if (selectedStartTime) setStartDate(selectedStartTime);
          }}
        />
      )}

      {/*Task End Date and Time*/}
      <Text style={styles.label}>Select end time</Text>
      <View style={styles.row}>
        <Button title={endDate.toDateString()} onPress={() => setShowEndDatePicker(true)} />
        <Button title={endDate.toLocaleTimeString()} onPress={() => setShowEndTimePicker(true)} />
      </View>

      {showEndDatePicker && (
        <DateTimePicker
          value={endDate}
          mode="date"
          display="default"
          onChange={(event, selectedEndDate) => {
            setShowEndDatePicker(false);
            if (selectedEndDate) setEndDate(selectedEndDate);
          }}
        />
      )}

      {showEndTimePicker && (
        <DateTimePicker
          value={endDate}
          mode="time"
          display="default"
          onChange={(event, selectedEndTime) => {
            setShowEndTimePicker(false);
            if (selectedEndTime) setEndDate(selectedEndTime);
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
            placeholder="Select item"
            searchPlaceholder="Search..."
            value={transportationMode}
            onChange={item => {
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
        placeholder="Task / event description here"
        value={description}
        onChangeText={setDescription}
        multiline
      />

      
      <Pressable style={styles.container} onPress={async () => await addEvent(title, description, formatDate(startDate), formatDate(endDate), transportationMode)}>
        <Text>Save Task</Text>
      </Pressable>
    </ScrollView>
    
  );
};

{/*date formatting helper function*/}
const formatDate = (date: Date) => {
  const datePart = date.toLocaleDateString("en-CA"); // "YYYY-MM-DD" (Canada format)
  const timePart = date.toLocaleTimeString("en-GB"); // "HH:mm:ss" (24-hour format)

  return `${datePart} ${timePart}`;
};

export default CreateTaskScreen;
