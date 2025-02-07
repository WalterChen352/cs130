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
  }
});