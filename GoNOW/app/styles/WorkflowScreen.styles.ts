import { StyleSheet } from 'react-native';

/**
 * Updated styles for the Workflow Screen components with a simpler notifications section.
 */
export const WorkflowScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    color: '#000',
  },
  header: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 12,
    color: '#000',
    textAlign: 'center', 
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 10,
    padding: 12,
    marginBottom: 14,
    backgroundColor: '#FFF',
    fontSize: 16,
  },
  center: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  centerWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  rightElem: {
    marginLeft: 12,
    fontSize: 16,
    color: '#000',
  },
  pickerContainer: {
    width: '100%',
    marginBottom: 14,
    zIndex: 1000,
  },
  wheelPicker: {
    height: 300,
    width: '100%',
    marginVertical: 12,
  },
  footer: {
    paddingBottom: 80,
  },
  timeSelectors: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 14,
  },
  notificationText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#000',
  },
  sectionContainer: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#DDD',
  },
  saveButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#007AFF',
    borderRadius: 10,
    padding: 14,
  },
  deleteButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    padding: 14,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  dayButtonActive: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
    minWidth: 36,
    alignItems: 'center',
    margin: 3,
  },
  dayButtonInactive: {
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
    minWidth: 36,
    alignItems: 'center',
    margin: 3,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  dayButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  dayButtonTextInactive: {
    color: '#000',
    fontWeight: '600',
    fontSize: 14,
  },
  section: {
    marginBottom: 16,
  },
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginBottom: 14,
  }
});