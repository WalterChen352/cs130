import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  Platform, 
  Animated, 
  LayoutAnimation, 
  UIManager
} from 'react-native';
import DropdownPickerStyles from '../styles/DropdownPicker.styles';

import * as Haptics from 'expo-haptics';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface DropdownItem {
  label: string;
  value: string | number;
}

interface DropdownPickerProps {
  selectedValue?: string | number;
  onValueChange: (value: string | number) => void;
  items: DropdownItem[];
  testID?: string;
  placeholder?: string;
  style?: object;
}

/**
 * A dropdown picker that expands in place rather than
 * opening pop-up like default picker.
 */
const DropdownPicker: React.FC<DropdownPickerProps> = ({ 
  selectedValue, 
  onValueChange, 
  items, 
  testID,
  placeholder = "Select an option",
  style = {} 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const rotateAnim = useRef(new Animated.Value(0)).current;
  
  const selectedItem = items.find(item => item.value === selectedValue);
  const selectedLabel = selectedItem ? selectedItem.label : placeholder;

  const toggleDropdown = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsOpen(!isOpen);
    
    Animated.timing(rotateAnim, {
      toValue: isOpen ? 0 : 1,
      duration: 200,
      useNativeDriver: true
    }).start();
  };

  const selectItem = (value: string | number) => {
    onValueChange(value);
    void Haptics.notificationAsync(
      Haptics.NotificationFeedbackType.Success
    )
    toggleDropdown();
  };

  // Calculate rotation for the dropdown arrow
  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg']
  });

  return (
    <View style={[DropdownPickerStyles.container, style]} testID={testID}>
      {/* Dropdown Header */}
      <TouchableOpacity 
        style={DropdownPickerStyles.dropdownHeader} 
        onPress={toggleDropdown}
        activeOpacity={0.7}
      >
        <Text style={[
          DropdownPickerStyles.selectedText, 
          selectedItem ? null : DropdownPickerStyles.placeholderText
        ]}>
          {selectedLabel}
        </Text>
        <Animated.Text style={[DropdownPickerStyles.arrow, { transform: [{ rotate: rotation }] }]}>
          ▼
        </Animated.Text>
      </TouchableOpacity>
      
      {/* Dropdown Items List */}
      {isOpen && (
        <View style={DropdownPickerStyles.dropdownListContainer}>
          <ScrollView
            nestedScrollEnabled={true}
            showsVerticalScrollIndicator={true}
            style={DropdownPickerStyles.scrollView}
            contentContainerStyle={DropdownPickerStyles.scrollViewContent}
          >
            {items.map((item) => (
              <TouchableOpacity
                key={String(item.value)}
                style={[
                    DropdownPickerStyles.dropdownItem,
                  selectedValue === item.value && DropdownPickerStyles.selectedItem
                ]}
                onPress={() => { selectItem(item.value); }}
                testID={testID ? `${testID}-${String(item.value)}` : undefined}
              >
                <Text style={[
                  DropdownPickerStyles.dropdownItemText,
                  selectedValue === item.value && DropdownPickerStyles.selectedItemText
                ]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

export default DropdownPicker;