import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

interface DurationPickerProps{
    setDuration: (newDuration:number)=>void
}

const DurationPicker:React.FC<DurationPickerProps> = ({
    setDuration
}) => {
  const [selectedHour, setSelectedHour] = useState('00');
  const [selectedMinute, setSelectedMinute] = useState('00');

  // Generate hours (1-12)
  const hours = Array.from({ length: 24 }, (_, i) => {
    const hour = i;
    return hour < 10 ? `0${hour}` : `${hour}`;
  });
  // Generate minutes (00-59)
  const minutes = Array.from({ length: 60 }, (_, i) => {
    return i < 10 ? `0${i}` : `${i}`;
  });

  const handleHourChange=(itemValue:string)=>{
    setDuration(Number(itemValue)*60+ Number(selectedMinute))
    setSelectedHour(itemValue)
  }

  const handleMinuteChange=(itemValue:string)=>{
    setDuration(Number(selectedHour)*60+ Number(itemValue))
    setSelectedMinute(itemValue);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Duration</Text>
      <View style={styles.pickerContainer}>
        {/* Hours Picker */}
        <View style={styles.pickerWrapper}>
          <Text style={styles.label}>Hour(s)</Text>
          <View style={styles.picker}>
            <Picker
              selectedValue={selectedHour}
              onValueChange={(itemValue) => handleHourChange(itemValue)}
              style={{ height: 120 }}
            >
              {hours.map((hour) => (
                <Picker.Item key={`hour-${hour}`} label={hour} value={hour} />
              ))}
            </Picker>
          </View>
        </View>
        
        <Text style={styles.separator}>:</Text>
        
        {/* Minutes Picker */}
        <View style={styles.pickerWrapper}>
          <Text style={styles.label}>Minute(s)</Text>
          <View style={styles.picker}>
            <Picker
              selectedValue={selectedMinute}
              onValueChange={(itemValue) => handleMinuteChange(itemValue)}
              style={{ height: 120 }}
            >
              {minutes.map((minute) => (
                <Picker.Item key={`minute-${minute}`} label={minute} value={minute} />
              ))}
            </Picker>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  pickerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 10,
  },
  pickerWrapper: {
    alignItems: 'center',
    width: 100,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  picker: {
    width: 100,
    height: 150,
    overflow: 'hidden',
  },
  separator: {
    fontSize: 24,
    fontWeight: 'bold',
    marginHorizontal: 10,
  },
  selectedTime: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    alignItems: 'center',
  },
  timeText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default DurationPicker;