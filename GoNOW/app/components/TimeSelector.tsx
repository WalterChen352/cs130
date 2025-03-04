import React, { useState } from 'react';
import { 
  TouchableOpacity, 
  Text, 
  View, 
  Platform, 
  Modal, 
  SafeAreaView,
  StyleProp,
  ViewStyle
} from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import TimeSelectorStyles from '../styles/TimeSelector.styles';

interface TimeSelectorProps {
  value: Date | null;
  onChange: (date: Date) => void;
  label?: string;
  testID?: string;
  style?: StyleProp<ViewStyle>;
}

/**
 * A time selector with a modal popup for both iOS and Android
 * so that it is more intuitive for IOS users (one click and not two).
 */
const TimeSelector: React.FC<TimeSelectorProps> = ({ 
  value,
  onChange,
  label = "", 
  testID = "time-selector",
  style
}) => {
  const [showModal, setShowModal] = useState(false);
  const [tempTime, setTempTime] = useState<Date | null>(value);
  const [showAndroidPicker, setShowAndroidPicker] = useState(false);
  
  const formatTime = (date: Date | null): string => {
    if (!date) return "--:--";
    return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  };
  
  const handlePress = (): void => {
    setTempTime(value);
    
    if (Platform.OS === 'android') {
      setShowAndroidPicker(true);
    } else {
      setShowModal(true);
    }
  };
  
  const handleTimeChange = (event: DateTimePickerEvent, selectedTime?: Date): void => {
    setShowAndroidPicker(false);
    
    if (event.type !== 'dismissed' && selectedTime) {
      if (Platform.OS === 'android') {
        onChange(selectedTime);
      } else {
        setTempTime(selectedTime);
      }
    }
  };
  
  const handleCancel = (): void => {
    setShowModal(false);
  };
  
  const handleConfirm = (): void => {
    if (tempTime) {
      onChange(tempTime);
    }
    setShowModal(false);
  };
  
  return (
    <View style={[TimeSelectorStyles.container, style]}>
      {label ? <Text style={TimeSelectorStyles.label}>{label}</Text> : null}
      <TouchableOpacity
        style={TimeSelectorStyles.button}
        onPress={handlePress}
        testID={testID}
        activeOpacity={0.7}
      >
        <Text style={TimeSelectorStyles.text}>{formatTime(value)}</Text>
      </TouchableOpacity>
      
      {Platform.OS === 'ios' && (
        <Modal
          transparent={true}
          visible={showModal}
          animationType="fade"
          onRequestClose={handleCancel}
        >
          <View style={TimeSelectorStyles.modalOverlay}>
            <View style={TimeSelectorStyles.modalContent}>
              <View style={TimeSelectorStyles.modalHeader}>
                <TouchableOpacity onPress={handleCancel}>
                  <Text style={TimeSelectorStyles.cancelButton}>Cancel</Text>
                </TouchableOpacity>
                <Text style={TimeSelectorStyles.modalTitle}>{label || "Select Time"}</Text>
                <TouchableOpacity onPress={handleConfirm}>
                  <Text style={TimeSelectorStyles.confirmButton}>OK</Text>
                </TouchableOpacity>
              </View>
              
              <SafeAreaView style={TimeSelectorStyles.pickerContainer}>
                <DateTimePicker
                  value={tempTime ?? new Date()}
                  mode="time"
                  is24Hour={true}
                  display="spinner"
                  onChange={handleTimeChange}
                  style={TimeSelectorStyles.picker}
                />
              </SafeAreaView>
            </View>
          </View>
        </Modal>
      )}
      
      {showAndroidPicker && Platform.OS === 'android' && (
        <DateTimePicker
          value={value ?? new Date()}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={handleTimeChange}
        />
      )}
    </View>
  );
};

export default TimeSelector;