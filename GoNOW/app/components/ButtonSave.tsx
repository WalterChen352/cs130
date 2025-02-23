import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { TouchableOpacity } from 'react-native';
import { ButtonSaveStyles } from '../styles/ButtonSave.styles';

interface ButtonSaveProps {
  /**
   * Function triggered when the button is pressed.
   */
  onPress?: () => void | Promise<void>;

  /**
   * Icon name from Ionicons.
   * @default "checkmark"
   */
  icon?: string;

  /**
   * Icon size (also affects button size).
   * @default 30
   */
  size?: number;

  /**
   * Button background color.
   * @default "#388dff"
   */
  bgColor?: string;

  /**
   * Icon color.
   * @default "white"
   */
  color?: string;

  /**
   * testID param.
   * @default "btn-save"
   */
  testID?: string;
}

/**
 * Save button is drawn as a round button in the lower right corner of the screen.
 *
 * @param {ButtonSaveProps} props - The props for the component.
 * @returns {JSX.Element} - The rendered save button element.
 */
const ButtonSave: React.FC<ButtonSaveProps> = ({
  onPress = null,
  icon = "checkmark",
  size = 30,
  color = "white",
  bgColor = "#388dff",
  testID = "btn-save",
}) => {

  /**
   * Handles button press and triggers `onPress` if provided.
   * This method does not return any value.
   *
   * @async
   * @returns {Promise<void>} - A promise that resolves if the button press is handled.
   */
  const handlePress = async (): Promise<void> => {
    if (onPress) {
      await onPress();
    }
  };

  return (
    <TouchableOpacity
      onPress={() => { handlePress().catch(console.error); }}
      testID={testID}
      style={
        [ButtonSaveStyles.btnSave, {
          width: size * 2,
          height: size * 2,
          borderRadius: size,
          borderColor: color,
          backgroundColor: bgColor,
        }]}
    >
      <Ionicons
        name={icon}
        size={size+4}
        color={color}
        testID="btn-save-icon"
      />
    </TouchableOpacity>
  );

};

export default ButtonSave;