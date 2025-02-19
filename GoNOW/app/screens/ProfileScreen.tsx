import { Alert, FlatList, Text, TouchableOpacity, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { JSX, useCallback, useEffect, useState } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, NavigationProp } from '@react-navigation/native';

import AddressPicker from '../components/AddressPicker';
import { Location } from '../models/Location';
import { Time, DaysOfWeekNames } from '../models/Time';
import { Workflow } from '../models/Workflow';
import { resetDatabase } from '../scripts/Database';
import { getMyLocation } from '../scripts/Geo';
import { getLocation, updateLocation } from '../scripts/Profile';
import { getSchedulingStyle } from '../scripts/SchedulingStyle';
import { getWorkflows } from '../scripts/Workflow';
import { ProfileScreenStyles } from '../styles/ProfileScreen.styles';
import { TabParamList } from './Navigator';

const ProfileScreen = (): JSX.Element => {
    const [workflows, setWorkflows] = useState<Workflow[]>([]);
    const [location, setLocation] = useState<Location | null>(null);

    const navigation = useNavigation<NavigationProp<TabParamList>>();

    const loadWorkflows = async (): Promise<void> => {
        const items = await getWorkflows();
        setWorkflows(items);
    };

    useFocusEffect(
        useCallback(() => {
            void loadWorkflows();
        }, [])
    );

    useEffect(() => {
        const fetchLocation = async (): Promise<void> => {
            const location = await getLocation();
            if (location === null
                || !location.Address
                && location.Coordinates.Latitude === 0
                && location.Coordinates.Longitude === 0
            ) {
                const currentLocation = await getMyLocation();
                if (currentLocation !== null) {
                    await updateLocation(currentLocation);
                    setLocation(currentLocation);
                }
            } else {
                setLocation(location);
            }
        };
        void fetchLocation();
    }, []);

    // Removed async since no await is used
    const handleReset = (): void => {
        Alert.alert('Confirm', 'Are you sure?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'OK',
                    onPress: () => {
                        void resetDatabase().then(() => {
                            void loadWorkflows();
                        });
                    }
                },
            ],
            { cancelable: false }
        );
    };

    // Removed async since no await is used
    const handleAdd = (): void => {
        const schedulingStyleDefault = getSchedulingStyle(0);
        const workflowDefault = new Workflow(
            0,
            '',
            '#d5f9cf',
            false,
            new Time(9, 0),
            new Time(10, 0),
            new Array<boolean>(7).fill(false),
            schedulingStyleDefault
        );
        navigation.navigate('Workflow', { workflow: workflowDefault });
    };

    const handleLocation = (location: Location): void => {
        void updateLocation(location).then(() => {
            setLocation(location);
        });
    };

    return (
        <View style={ProfileScreenStyles.container}>
            <Text style={ProfileScreenStyles.title} testID="home-location-title">Home Location</Text>

            <View>
                <View style={[ProfileScreenStyles.locationPicker, {}]}>
                    <AddressPicker
                        initialAddress={location?.Address}
                        initialCoordinates={location?.Coordinates}
                        onSelect={handleLocation}
                        placeHolder="Your home location"
                    />
                </View>
            </View>

            <Text style={ProfileScreenStyles.title} testID="workflow-title">Workflows</Text>

            <FlatList
                data={workflows}
                keyExtractor={(item) => String(item.id)}
                contentContainerStyle={ProfileScreenStyles.workflowList}
                renderItem={({ item }) => (
                    <View
                        style={[ProfileScreenStyles.workflow, { backgroundColor: item.color }]}
                        testID={`workflow-${String(item.id)}`}
                    >
                        <TouchableOpacity
                            onPress={() => { navigation.navigate('Workflow', { workflow: item }); }}
                            testID={`workflow-link-${String(item.id)}`}
                        >
                            <Text style={ProfileScreenStyles.header} testID={`workflow-header-${String(item.id)}`}>
                                {item.name}
                                {item.pushNotifications && <Ionicons name="notifications" size={14} />}
                            </Text>
                            <Text style={ProfileScreenStyles.center} testID={`workflow-text-${String(item.id)}`}>
                                Schedule{' '}
                                <Text style={ProfileScreenStyles.emphasis}>
                                    between {item.timeStart.toString()} and {item.timeEnd.toString()}{' '}
                                </Text>
                                {item.daysOfWeek.map((day, ind) => day ? DaysOfWeekNames[ind] : null).filter(Boolean).join(' ')}
                            </Text>
                            <Text style={ProfileScreenStyles.center} testID={`workflow-scheduling-style-${String(item.id)}`}>
                                {item.schedulingStyle.Name}
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}
                ListFooterComponent={() => (
                    <View style={ProfileScreenStyles.center}>
                        <TouchableOpacity onPress={handleAdd} testID="workflow-btn-add">
                            <Text style={ProfileScreenStyles.addLink} testID="workflow-btn-add-text">
                                {workflows.length > 0 ? 'Add Another Workflow' : 'Add a Workflow'}
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