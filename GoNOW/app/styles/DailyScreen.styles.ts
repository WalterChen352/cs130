import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  eventCard: {
    padding: 20,
    backgroundColor: '#a1ffba',
    marginTop: 10,
    marginHorizontal: 10,
    marginVertical: 10,
    borderRadius: 10
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
  },
  loading: {
    padding: 40,
    textAlign: 'center',
    fontSize: 20
  },
  highlightedEventCard: {
    backgroundColor: '#f0f0f0', // or your preferred highlight color
    borderWidth: 2,
    borderColor: '#007AFF', // or your preferred border color
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