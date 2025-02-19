import { StyleSheet } from 'react-native';

/**
 * Styles for the Profile Screen components.
 */
export const ProfileScreenStyles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16
    },
    title: {
        fontSize: 23,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 16
    },
    center: {
        alignItems: 'center',
        textAlign: 'center',
    },
    emphasis: {
        fontWeight: 'bold',
    },
    workflow: {
        padding: 10,
        marginBottom: 16,
        borderRadius: 15,
        alignItems: 'center',
        textAlign: 'center',
    },
    header: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    addLink: {
        marginTop: 20,
        textAlign: 'center',
        color: '#388dff',
        fontSize: 16,
    },
    workflowList: {
        marginBottom: 40,
    },
    emptyContainer:{
        textAlign: 'center',
    },
    emptyText : {
        color: '#999',
    },
    block: {
        paddingVertical: 26,
    },
    locationPicker:{
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
});