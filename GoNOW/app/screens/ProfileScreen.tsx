import { Alert, FlatList, Text, TouchableOpacity, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { JSX, useCallback, useEffect, useState } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, NavigationProp } from '@react-navigation/native';

import AddressPicker from '../components/AddressPicker';
import ButtonDelete from '../components/ButtonDelete';
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

/**
 * `ProfileScreen` component that displays a profile of the user.
 *
 * @returns {JSX.Element} - The rendered `ProfileScreen` component.
 */
const ProfileScreen = (): JSX.Element => {
    const [workflows, setWorkflows] = useState<Workflow[] | undefined>([]);
    const [location, setLocation] = useState<Location | null>(null);

    const navigation = useNavigation<NavigationProp<TabParamList>>();

    /**
     * Loads list of workflows to `workflows` state.
     *
     * @async
     * @returns {Promise<void>} - A promise that resolves when `workflows` state is updated.
     */
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
        void loadWorkflows();
    }, []);

    useEffect(() => {
        const fetchLocation = async (): Promise<void> => {
            const location = await getLocation();
            if (location === null
                || !location.address
                && location.coordinates.latitude === 0
                && location.coordinates.longitude === 0
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

    /** Shows pop-up window and requests confirmation to reset DB.
     * This method does not return any value.
     */
    const handleReset = (): void => {
        Alert.alert('Confirm reset DB', 'Are you sure?',
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

    /** Calls rendering screen for new workflow.
     * This method does not return any value.
     */
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

    /**
     * Sets `location` state from user input.
     * This method does not return any value.
     *
     * @param {Location} location - The `location` object from user input.
     */
    const handleLocation = (location: Location): void => {
        void updateLocation(location).then(() => {
            setLocation(location);
        });
    };

    /**
     * Formats the days of the week as a readable string
     * 
     * @param {boolean[]} daysOfWeek - Array of 7 booleans representing days of the week
     * @returns {string} - Formatted days string
     */
    const formatDays = (daysOfWeek: boolean[]): string => {
        const selectedDays = daysOfWeek
            .map((day, idx) => day ? DaysOfWeekNames[idx] : null)
            .filter(Boolean);
        
        return selectedDays.length > 0 ? selectedDays.join(' ') : 'None';
    };

    return (
        <View style={ProfileScreenStyles.container}>
            <Text style={ProfileScreenStyles.title} testID="home-location-title">Home Location</Text>

            <View>
                <View style={ProfileScreenStyles.locationPicker}>
                    <AddressPicker
                        initialAddress={location?.address}
                        initialCoordinates={location?.coordinates}
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
                            activeOpacity={0.9}
                            style={ProfileScreenStyles.workflowTouchable}
                            testID={`workflow-link-${String(item.id)}`}
                        >
                            <View style={ProfileScreenStyles.headerContainer}>
                                <Text style={ProfileScreenStyles.header} testID={`workflow-header-${String(item.id)}`}>
                                    {item.name}
                                </Text>
                                {item.pushNotifications && (
                                    <Ionicons name="notifications" size={16} style={ProfileScreenStyles.notificationIcon} />
                                )}
                            </View>
                            
                            <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 2}}>
                                <View style={ProfileScreenStyles.timeContainer}>
                                    <View style={ProfileScreenStyles.iconText}>
                                        <Ionicons name="time-outline" size={14} color="#666" style={{ marginRight: 4 }} />
                                        <Text style={ProfileScreenStyles.infoValue}>
                                            {item.timeStart.toString()} - {item.timeEnd.toString()}
                                        </Text>
                                    </View>
                                </View>
                                
                                <View style={ProfileScreenStyles.daysContainer}>
                                    <View style={ProfileScreenStyles.iconText}>
                                        <Ionicons name="calendar-outline" size={14} color="#666" style={{ marginRight: 4 }} />
                                        <Text style={ProfileScreenStyles.infoValue}>
                                            {formatDays(item.daysOfWeek)}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                            
                            <View style={ProfileScreenStyles.styleContainer}>
                                <View style={ProfileScreenStyles.iconText}>
                                    <Ionicons name="options-outline" size={14} color="#666" style={{ marginRight: 4 }} />
                                    <Text style={ProfileScreenStyles.infoValue}>
                                        {item.schedulingStyle.name}
                                    </Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                )}
                ListFooterComponent={() => (
                    <View style={ProfileScreenStyles.center}>
                        <TouchableOpacity onPress={handleAdd} testID="workflow-btn-add">
                            <Text style={ProfileScreenStyles.addLink} testID="workflow-btn-add-text">
                                {workflows !== undefined && workflows.length > 0
                                    ? 'Add Another Workflow'
                                    : 'Add a Workflow'}
                            </Text>
                        </TouchableOpacity>
                        <Text style={ProfileScreenStyles.footer}></Text>
                    </View>
                )}
            />

            <ButtonDelete onPress={handleReset} icon="trash-outline" testID="workflow-btn-delete" />
        </View>
    );
};

export default ProfileScreen;