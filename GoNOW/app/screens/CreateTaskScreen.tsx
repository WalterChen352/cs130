import React, { useState } from 'react';
import { ScrollView, View, Text, TextInput, Button, Switch, StyleSheet, Pressable } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { addEvent } from '../scripts/database';

const TaskForm = () => {
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [autoSchedule, setAutoSchedule] = useState(false);
  const [transportationMode, setTransportationMode] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

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

      <Text style={styles.label}>Enter transportation mode</Text>
      <TextInput
        style={styles.input}
        placeholder="Car"
        value={transportationMode}
        onChangeText={setTransportationMode}
      />
      
      <View style={styles.row}>
        <Switch value={autoSchedule} onValueChange={setAutoSchedule} />
        <Text style={styles.label}>Autoschedule?</Text>
      </View>

      <Text style={styles.label}>Enter latitude</Text>
      <TextInput
        style={styles.input}
        value={location}
        onChangeText={setLocation}
      />

      <Text style={styles.label}>Enter longitude</Text>
      <TextInput
        style={styles.input}
        value={location}
        onChangeText={setLocation}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 40,
    margin: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 15,
    marginBottom: 10,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
});

{/*date formatting helper function*/}
const formatDate = (date: Date) => {
  const datePart = date.toLocaleDateString("en-CA"); // "YYYY-MM-DD" (Canada format)
  const timePart = date.toLocaleTimeString("en-GB"); // "HH:mm:ss" (24-hour format)

  return `${datePart} ${timePart}`;
};

export default TaskForm;
