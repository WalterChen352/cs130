import React from 'react';
import { Ionicons } from 'react-native-vector-icons';
import { TouchableOpacity } from 'react-native';
import { ButtonDeleteStyles } from '../styles/ButtonDelete.styles';

interface ButtonDeleteProps {
  /**
   * Function triggered when the button is pressed.
   */
  onPress?: () => void | Promise<void>;

  /**
   * Icon name from Ionicons.
   * @default "close"
   */
  icon?: string;

  /**
   * Icon size (also affects button size).
   * @default 30
   */
  size?: number;

  /**
   * Button background color.
   * @default "#ffa5a5"
   */
  bgColor?: string;

  /**
   * Icon color.
   * @default "white"
   */
  color?: string;

  /**
   * testID param.
   * @default "btn-delete"
   */
  testID?: string;
}

/**
 * A delete button is drawn as a round button in the lower left corner of the screen.
 *
 * @param {ButtonDeleteProps} props - The props for the component.
 * @returns {JSX.Element} - The rendered save button element.
 */
const ButtonDelete: React.FC<ButtonDeleteProps> = ({
  onPress,
  icon = "close",
  size = 30,
  color = "white",
  bgColor = "#ffa5a5",
  testID = "btn-delete",
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
        [ButtonDeleteStyles.btnDelete, {
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
        testID="btn-delete-icon"
      />
    </TouchableOpacity>
  );

};

export default ButtonDelete;