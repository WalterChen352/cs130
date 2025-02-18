import { Alert, FlatList, Text, TouchableOpacity, View } from 'react-native';
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
import {ProfileScreenStyles} from '../styles/ProfileScreen.styles';

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
        <View style={ProfileScreenStyles.container}>

            <Text style={ProfileScreenStyles.title} testID="home-location-title">Home Location</Text>

            <View >
                <View style={[ProfileScreenStyles.locationPicker, { }]} > 
                    <AddressPicker initialAddress={location?.Address} initialCoordinates={location?.Coordinates} onSelect={handleLocation} placeHolder="Your home location" />
                </View>
            </View>

            <Text style={ProfileScreenStyles.title} testID="workflow-title">Workflows</Text>

            <FlatList data={workflows} keyExtractor={(item) => item.Id.toString()}
                contentContainerStyle={ProfileScreenStyles.workflowList}
                renderItem={({ item }) => (
                    <View style={[ProfileScreenStyles.workflow, {backgroundColor: item.Color}]} testID={`workflow-${item.Id}`}>
                        <TouchableOpacity onPress={() => navigation.navigate('Workflow', {workflow: item})} testID={`workflow-link-${item.Id}`}>
                            <Text style={ProfileScreenStyles.header} testID={`workflow-header-${item.Id}`}>
                                {item.Name}
                                {item.PushNotifications === true && <Ionicons name="notifications" size={14} />}
                            </Text>
                            <Text style={ProfileScreenStyles.center} testID={`workflow-text-${item.Id}`}>
                                Schedule{' '}
                                <Text style={ProfileScreenStyles.emphasis}> 
                                    between {item.TimeStart.toString()} and {item.TimeEnd.toString()}{' '}
                                </Text> 
                                {item.DaysOfWeek.map((day, ind) => day ? DaysOfWeekNames[ind] : null).filter(Boolean).join(' ')}
                            </Text>
                            <Text style={ProfileScreenStyles.center} testID={`workflow-scheduling-style-${item.Id}`}>
                                {item.SchedulingStyle?.Name}
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}

                ListFooterComponent={() => (
                    <View style={ProfileScreenStyles.center}>
                        <TouchableOpacity onPress={handleAdd} testID="workflow-btn-add">
                            <Text style={ProfileScreenStyles.addLink} testID="workflow-btn-add-text">
                                {workflows?.length > 0 ? 'Add Another Workflow' : 'Add a Workflow'}
                            </Text>
                        </TouchableOpacity>
                        <Text style={ProfileScreenStyles.footer}></Text>
                    </View>
                )}
            />

            <TouchableOpacity style={ProfileScreenStyles.btnDel} onPress={handleReset} testID="workflow-btn-delete">
                <Ionicons name="trash-outline" size={34} color="#fff" />
            </TouchableOpacity>

        </View>
    );
};

export default ProfileScreen;