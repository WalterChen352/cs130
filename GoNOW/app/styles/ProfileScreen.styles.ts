import { StyleSheet } from 'react-native';

/**
 * Styles for the Profile Screen components.
 */
export const ProfileScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f9f9f9'
  },
  title: {
    fontSize: 23,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 16,
    color: '#333'
  },
  center: {
    alignItems: 'center',
    textAlign: 'center',
  },
  emphasis: {
    fontWeight: 'bold',
  },
  workflow: {
    marginBottom: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    overflow: 'hidden',
  },
  workflowTouchable: {
    padding: 16,
    width: '100%',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.06)',
  },
  header: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  notificationIcon: {
    opacity: 0.8,
  },
  infoGrid: {
    marginTop: 4,
  },
  infoItem: {
    paddingVertical: 3,
    paddingHorizontal: 0,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  infoLabel: {
    fontSize: 13,
    color: '#666',
    marginRight: 4,
  },
  infoValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  addLink: {
    marginTop: 24,
    textAlign: 'center',
    color: '#388dff',
    fontSize: 16,
    fontWeight: '500',
    padding: 8,
  },
  workflowList: {
    marginBottom: 40,
  },
  emptyContainer: {
    textAlign: 'center',
  },
  emptyText: {
    color: '#999',
  },
  block: {
    paddingVertical: 26,
  },
  locationPicker: {
    height: 60,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginBottom: 20,
    zIndex: 100
  },
  footer: {
    paddingBottom: 40,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 3,
    marginRight: 16,
  },
  daysContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 3,
  },
  styleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 3,
    marginTop: 0,
  },
  iconText: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});