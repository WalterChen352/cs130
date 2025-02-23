import { StyleSheet } from 'react-native';

export const WorkflowPickerStyles = StyleSheet.create({
    container: {
      flex: 1,
    },
    textInput: {
      borderWidth: 1,
      borderColor: '#ccc',
      padding: 10,
      borderRadius: 5,
    },
    listView: {
      position: 'absolute',
      top: 45,
      left: 0,
      right: 0,
      backgroundColor: 'white',
      borderRadius: 3,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.2,
      shadowRadius: 5,
      elevation: 5,
      maxHeight: 200,
    },
    resultItem: {
      padding: 15,
      borderBottomWidth: 1,
      // borderBottomColor: '#eee',
      color: 'black',
    },
    description: {
      fontWeight: 'bold',
    },
  });