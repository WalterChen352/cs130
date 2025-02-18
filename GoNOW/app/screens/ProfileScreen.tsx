import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { JSX, useCallback, useEffect , useState } from 'react';
import { Ionicons } from 'react-native-vector-icons';
import { useNavigation } from '@react-navigation/native';

import AddressPicker from '../components/AddressPicker';
import { Location } from '../models/Location';
import { Time, DaysOfWeekNames } from '../models/Time';
import { Workflow } from '../models/Workflow';
import { resetDatabase } from '../scripts/Database';
import { getMyLocation } from '../scripts/Geo';
import { getLocation, updateLocation } from '../scripts/Profile';
import { getSchedulingStyle } from '../scripts/SchedulingStyle';
import { getWorkflows } from '../scripts/Workflow';

const ProfileScreen = (): JSX.Element => {

    const [workflows, setWorkflows] = useState<Workflow[]>([]);
    const [location, setLocation] = useState<Location | null>(null);

    const navigation = useNavigation();

    const loadWorkflows = async (): Promise<void> => {
        const items = await getWorkflows();
        setWorkflows(items);
    };

    useFocusEffect(
        useCallback(() => {
            //console.log('ProfileScreen got focus');
            loadWorkflows();
        }, [])
    );

    useEffect(() => {
        const fetchLocation = async (): Promise<void> => {
            let location =  await getLocation();
            if ( location === null 
                || !location.Address 
                && location.Coordinates.Latitude === 0 
                && location.Coordinates.Longitude === 0 )
            {
                //console.log("location null");
                const currentLocation = await getMyLocation();
                if (currentLocation !== null) {
                    //console.log("my location isnot null");
                    await updateLocation(currentLocation);
                    setLocation(currentLocation);
                }
            } else {
                setLocation(location);
            }
        };
        fetchLocation();
    }, []);

    const handleLocation = async (location:Location): Promise<void> => {
        //console.log("LOCATION: ", location);
        await updateLocation(location);
        setLocation(location);
    };

    const handleReset = async (): Promise<void> => {
        Alert.alert('Confirm', 'Are you sure?',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'OK', onPress: async (): Promise<void> => {
                    await resetDatabase();
                    loadWorkflows();
                } },
            ],
            { cancelable: false }
        );
    };

    const handleAdd = async (): Promise<void> => {
        const schedulingStyleDefault = await getSchedulingStyle(0);
        const workflowDefault = new Workflow(
          0,
          '',
          '#d5f9cf',
          false,
          new Time(9, 0),
          new Time(10, 0),
          new Array(7).fill(false),
          schedulingStyleDefault
        );
        navigation.navigate('Workflow', {workflow: workflowDefault});
      };

    return (
        <View style={styles.container}>

            <Text style={styles.title} testID="home-location-title">Home Location</Text>

            <View >
                <View style={[styles.locationPicker, { }]} > 
                    <AddressPicker initialAddress={location?.Address} initialCoordinates={location?.Coordinates} onSelect={handleLocation} placeHolder="Your home location" />
                </View>
            </View>

            <Text style={styles.title} testID="workflow-title">Workflows</Text>

            <FlatList data={workflows} keyExtractor={(item) => item.Id.toString()}
                contentContainerStyle={styles.workflowList}
                renderItem={({ item }) => (
                    <View style={[styles.workflow, {backgroundColor: item.Color}]} testID={`workflow-${item.Id}`}>
                        <TouchableOpacity onPress={() => navigation.navigate('Workflow', {workflow: item})} testID={`workflow-link-${item.Id}`}>
                            <Text style={styles.header} testID={`workflow-header-${item.Id}`}>
                                {item.Name}
                                {item.PushNotifications === true && <Ionicons name="notifications" size={14} />}
                            </Text>
                            <Text style={styles.center} testID={`workflow-text-${item.Id}`}>
                                Schedule{' '}
                                <Text style={styles.emphasis}> 
                                    between {item.TimeStart.toString()} and {item.TimeEnd.toString()}{' '}
                                </Text> 
                                {item.DaysOfWeek.map((day, ind) => day ? DaysOfWeekNames[ind] : null).filter(Boolean).join(' ')}
                            </Text>
                            <Text style={styles.center} testID={`workflow-scheduling-style-${item.Id}`}>
                                {item.SchedulingStyle?.Name}
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}

                ListFooterComponent={() => (
                    <View style={styles.center}>
                        <TouchableOpacity onPress={handleAdd} testID="workflow-btn-add">
                            <Text style={styles.addLink} testID="workflow-btn-add-text">
                                {workflows?.length > 0 ? 'Add Another Workflow' : 'Add a Workflow'}
                            </Text>
                        </TouchableOpacity>
                        <Text style={styles.footer}></Text>
                    </View>
                )}
            />

            <TouchableOpacity style={styles.btnDel} onPress={handleReset} testID="workflow-btn-delete">
                <Ionicons name="trash-outline" size={34} color="#fff" />
            </TouchableOpacity>

        </View>
    );
};

export default ProfileScreen;

const styles = StyleSheet.create({
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
});