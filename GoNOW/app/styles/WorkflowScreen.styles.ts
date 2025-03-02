import { StyleSheet } from 'react-native';

/**
 * Styles for the Workflow Screen components.
 */
export const WorkflowScreenStyles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 0,
        marginBottom: 0
    },
    scrollContainer: {
        flex: 1,
        padding: 16,
    },
    title: {
        fontSize: 23,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 16
    },
    header: {
        fontSize: 23,
        textAlign: 'center',
        marginTop: 24,
        marginBottom: 10,
        color: '#888888'
    },
    input: {
        borderWidth: 1,
        padding: 8,
        marginVertical: 8
    },
    center: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    centerWrap: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center'
    },
    blockDayOfWeek: {
        margin: 5,
        marginTop: 26,
    },
    rightElem: {
        marginRight: 16
    },
    picker: {
        height: 50,
        width: 300,
        borderWidth: 1
    },
    wheelPicker: {
        height: 300
    },
    footer: {
        paddingBottom: 100,
    },
    time: {
        backgroundColor: '#388dff',
        paddingHorizontal: 15,
        paddingVertical: 8,
        marginBottom: 10
    },
    timeText: {
        color: 'white',
        fontWeight: 'bold',
    },
});