import { StyleSheet } from 'react-native';

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
    btnSave: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: '#388dff',
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
        borderColor: 'white',
    },
    btnDel: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        backgroundColor: '#ffa5a5',
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
        borderColor: 'white',
    },
    footer: {
        paddingBottom: 100,
    }
});