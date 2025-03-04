import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16, // Match ProfileScreen padding
  },
  title: {
    fontSize: 23,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  listContainer: {
    paddingBottom: 20, // Add some padding at the bottom of the list
  },
  eventCard: {
    padding: 20,
    marginVertical: 8,
    borderRadius: 10,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  eventDescription: {
    marginTop: 5,
  },
  eventTime: {
    marginTop: 5,
    color: '#666',
  },
  noEvents: {
    padding: 20,
    textAlign: 'center',
    fontSize: 16,
    color: '#999', // Match ProfileScreen's empty text color
  },
  loading: {
    padding: 40,
    textAlign: 'center',
    fontSize: 20,
  },
  highlightedEventCard: {
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  eventActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
    gap: 10,
  },
  editButton: {
    backgroundColor: '#007AFF',
    padding: 8,
    borderRadius: 5,
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
    padding: 8,
    borderRadius: 5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
  }
});