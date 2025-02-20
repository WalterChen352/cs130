import { StyleSheet } from 'react-native';

/**
 * Styles for the `ButtonSave` component.
 */
export const ButtonSaveStyles = StyleSheet.create({
  
  /**
   * Button TouchableOpacity container.
   */
  btnSave: {
      position: 'absolute',
      bottom: 20,
      right: 20,
      width: 60,
      height: 60,
      borderRadius: 30,
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 5,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      borderWidth: 4,
  }
});