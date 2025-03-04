import { StyleSheet } from 'react-native';

export const TimeSelectorStyles = StyleSheet.create({
    container: {
      alignItems: 'center',
      marginHorizontal: 10,
    },
    label: {
      fontSize: 14,
      color: '#666',
      marginBottom: 4,
    },
    button: {
      backgroundColor: '#007AFF',
      paddingHorizontal: 20,
      paddingVertical: 12,
      borderRadius: 10,
      minWidth: 100,
      alignItems: 'center',
    },
    text: {
      color: 'white',
      fontWeight: 'bold',
      fontSize: 16,
    },
    modalOverlay: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
      width: '80%',
      backgroundColor: 'white',
      borderRadius: 10,
      overflow: 'hidden',
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: '#EEE',
    },
    modalTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: '#000',
    },
    cancelButton: {
      fontSize: 16,
      color: '#999',
    },
    confirmButton: {
      fontSize: 16,
      fontWeight: '600',
      color: '#007AFF',
    },
    pickerContainer: {
      padding: 20,
      alignItems: 'center',
    },
    picker: {
      width: 200,
    }
  });

export default TimeSelectorStyles;