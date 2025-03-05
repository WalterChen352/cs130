import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { TouchableOpacity } from 'react-native';
import { ButtonDeleteStyles, BUTTON_DELETE_DEFAULTS } from '../styles/ButtonDelete.styles';

interface ButtonDeleteProps {
  /**
   * Function triggered when the button is pressed.
   */
  onPress?: () => void | Promise<void>;
  /**
   * Icon name from Ionicons.
   */
  icon?: string;
  /**
   * Icon size (also affects button size).
   */
  size?: number;
  /**
   * Button background color.
   */
  bgColor?: string;
  /**
   * Icon color.
   */
  color?: string;
  /**
   * testID param.
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
  icon = BUTTON_DELETE_DEFAULTS.ICON_NAME,
  size = BUTTON_DELETE_DEFAULTS.ICON_SIZE,
  color = BUTTON_DELETE_DEFAULTS.ICON_COLOR,
  bgColor = BUTTON_DELETE_DEFAULTS.BG_COLOR,
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