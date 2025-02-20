import { Alert, Button, ScrollView, Switch, Text, TextInput, View } from 'react-native';
import { useFocusEffect, useNavigation, NavigationProp, RouteProp } from '@react-navigation/native';
import { useCallback, useEffect, useRef, useState } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import WheelPicker from 'react-native-wheel-color-picker';

import ButtonSave from '../components/ButtonSave';
import ButtonDelete from '../components/ButtonDelete';
import { getSchedulingStyles, getSchedulingStyle } from '../scripts/SchedulingStyle';
import { DaysOfWeekNames, Time, TimeFromDate } from '../models/Time';
import { Workflow } from '../models/Workflow';
import { addWorkflow, updateWorkflow, deleteWorkflow, validateWorkflow } from '../scripts/Workflow';
import { WorkflowScreenStyles } from '../styles/WorkflowScreen.styles';
import SchedulingStyle from '../models/SchedulingStyle';
import { TabParamList } from './Navigator';

/**
 * Properties for screen `WorkflowScreen`.
 *
 * @interface WorkflowScreenProps
 * @typedef {WorkflowScreenProps}
 */
interface WorkflowScreenProps {
    
    /**
     * Route of Tab.Navigator that contains `workflow` object in params.
     *
     * @type {RouteProp<TabParamList, 'Workflow'>}
     */
    route: RouteProp<TabParamList, 'Workflow'>;
}

/**
 * `WorkflowScreen` component that displays a workflow recieved in the `route` prop.
 *
 * @component
 * @example
 * // Usage
 * <WorkflowScreen route={{ params: { workflow: someWorkflowData } }} />
 * 
 * @param {WorkflowScreenProps} props - The props that includes the route object.
 * @returns {React.FC} - The rendered `WorkflowScreen` component.
 */
const WorkflowScreen: React.FC<WorkflowScreenProps> = ({ route }) => {
    const { workflow } = route.params;
    const navigation = useNavigation<NavigationProp<TabParamList>>();

    const scrollRef = useRef<ScrollView>(null);

    const [name, setName] = useState<string>(workflow.name);
    const [color, setColor] = useState<string>(workflow.color);
    const [pushNotifications, setPushNotifications] = useState<boolean>(workflow.pushNotifications);
    const [timeStart, setTimeStart] = useState<Date>(new Date(0, 0, 0, workflow.timeStart.Hours, workflow.timeStart.Minutes));
    const [timeEnd, setTimeEnd] = useState<Date>(new Date(0, 0, 0, workflow.timeEnd.Hours, workflow.timeEnd.Minutes));
    const [daysOfWeek, setDaysOfWeek] = useState<boolean[]>(workflow.daysOfWeek);
    const [schedulingStyle, setSchedulingStyle] = useState<string>(workflow.schedulingStyle.Id.toString());

    const [schedulingStyles, setSchedulingStyles] = useState<SchedulingStyle[]>([]);

    const [showTimeStart, setShowTimeStart] = useState(false);
    const [showTimeEnd, setShowTimeEnd] = useState(false);

    /** Shows pop-up window for select start time for the workflow. */
    const openTimeStart = (): void => {
        setShowTimeStart(true);
    };

    /**
     * Keeps start time for the workflow from user input.
     * This method does not return any value.
     *
     * @param {DateTimePickerEvent} event - The event of DateTimePickerEvent.
     * @param {?Date} [time] - The `Date` object that contains time data selected by user.
     * @returns {void} - This component does not return any value.
     */
    const onChangeTimeStart = (event: DateTimePickerEvent, time?: Date  ): void => {
        if (time) {
            setTimeStart(new Date(0, 0, 0, time.getHours(), time.getMinutes()));
        }
        setShowTimeStart(false);
    };

    /** Shows pop-up window for select end time for the workflow. */
    const openTimeEnd = (): void => {
        setShowTimeEnd(true);
    };

    /**
     * Keeps end time for the workflow from user input.
     * This method does not return any value.
     *
     * @param {DateTimePickerEvent} event - The event of DateTimePickerEvent.
     * @param {(Date | undefined)} time - The `Date` object that contains time data selected by user.
     * @returns {void} - This component does not return any value.
     */
    const onChangeTimeEnd = (event: DateTimePickerEvent, time: Date | undefined): void => {
        if (time) {
            setTimeEnd(new Date(0, 0, 0, time.getHours(), time.getMinutes()));
        }
        setShowTimeEnd(false);
    };

    /**
     * Keeps day of week for the workflow from user input.
     * This method does not return any value.
     *
     * @param {number} indexDay - The index of the day of week that is included to or excluded from `daysOfWeek`.
     * @returns {void} - This component does not return any value.
     */
    const toggleDay = (indexDay: number): void => {
        setDaysOfWeek((prev) => {
            const next = [...prev];
            next[indexDay] = !next[indexDay];
            return next;
        });
    };

    /**
     * Collect workflow form data and saves it into DB.
     * This method does not return any value.
     *
     * @async
     * @returns {Promise<void>} - A promise that resolves when the workflow is saved in DB.
     */
    const handleSaveForm = async (): Promise<void> => {
        const workflowNew = new Workflow(
            workflow.id,
            name,
            color,
            pushNotifications,
            new Time(timeStart.getHours(), timeStart.getMinutes()),
            new Time(timeEnd.getHours(), timeEnd.getMinutes()),
            daysOfWeek,
            getSchedulingStyle(parseInt(schedulingStyle, 10))  // Convert string back to number
        );
        
        try {
            await validateWorkflow(workflowNew);
        } catch (error) {
            Alert.alert('Validation Error', error instanceof Error ? error.message : 'Unknown error');
            return;
        }

        if (workflow.id > 0) {
            await updateWorkflow(workflowNew);
        } else {
            await addWorkflow(workflowNew);
        }
        navigation.navigate('Profile');
    };

    /** Shows pop-up window and requests user confirmation to delete workflow. */
    const handleDelete = (): void => {
        Alert.alert(
            'Confirm',
            `Remove workflow ${workflow.name}?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'OK',
                    onPress: () => {
                        void (async () => {
                            await deleteWorkflow(workflow);
                            navigation.navigate('Profile');
                        })();
                    },
                },
            ],
            { cancelable: false }
        );
    };

    /**
     * Loads list of scheduling styles to `schedulingStyles` state.
     * This method does not return any value.
     */
    const loadSchedulingStyle = useCallback((): void => {
        setSchedulingStyles(getSchedulingStyles());
    }, []);

    useEffect(() => {
        loadSchedulingStyle();
        setName(workflow.name);
        setColor(workflow.color);
        setPushNotifications(workflow.pushNotifications);
        setTimeStart(new Date(0, 0, 0, workflow.timeStart.Hours, workflow.timeStart.Minutes));
        setTimeEnd(new Date(0, 0, 0, workflow.timeEnd.Hours, workflow.timeEnd.Minutes));
        setDaysOfWeek(workflow.daysOfWeek);
        setSchedulingStyle(workflow.schedulingStyle.Id.toString());
    }, [workflow, loadSchedulingStyle]);

    useFocusEffect(
        useCallback(() => {
            loadSchedulingStyle();
            scrollRef.current?.scrollTo({ y: 0, animated: true });
        }, [loadSchedulingStyle])
    );

    return (
        <View style={WorkflowScreenStyles.container}>
            <ScrollView style={WorkflowScreenStyles.scrollContainer} ref={scrollRef}>
                <Text style={WorkflowScreenStyles.title} testID="workflow-title">
                    {workflow.id === 0 ? 'Add a workflow' : 'Update the workflow'}
                </Text>
                <TextInput
                    style={WorkflowScreenStyles.input}
                    value={name}
                    onChangeText={setName}
                    placeholder="Workflow name"
                    testID="workflow-name"
                />

                <View style={WorkflowScreenStyles.center}>
                    <Switch
                        value={pushNotifications}
                        onValueChange={setPushNotifications}
                        testID="workflow-push-notifications"
                    />
                    <Text style={WorkflowScreenStyles.rightElem}>Push notifications</Text>
                </View>

                <Text style={WorkflowScreenStyles.header}>Time selection</Text>
                <View style={WorkflowScreenStyles.center}>
                <TouchableOpacity
                        style={WorkflowScreenStyles.rightElem}
                        onPress={openTimeStart}
                        testID="workflow-time-start"
                    >
                        <Text>{TimeFromDate(timeStart).toString()}</Text>
                    </TouchableOpacity>
                    {showTimeStart && (
                        <DateTimePicker
                            value={timeStart}
                            mode="time"
                            is24Hour={true}
                            display="default"
                            onChange={onChangeTimeStart}
                        />
                    )}
                    <Text />
                    <TouchableOpacity
                        style={WorkflowScreenStyles.rightElem}
                        onPress={openTimeEnd}
                        testID="workflow-time-end"
                    >
                        <Text>{TimeFromDate(timeEnd).toString()}</Text>
                    </TouchableOpacity>

                    {showTimeEnd && (
                        <DateTimePicker
                            value={timeEnd}
                            mode="time"
                            is24Hour={true}
                            display="default"
                            onChange={onChangeTimeEnd}
                        />
                    )}
                </View>

                <View style={WorkflowScreenStyles.centerWrap}>
                    {daysOfWeek.map((day, ind) => (
                        <View key={ind} style={WorkflowScreenStyles.blockDayOfWeek}>
                            <Button
                                title={DaysOfWeekNames[ind]}
                                onPress={() => { toggleDay(ind); }}
                                color={day ? '#388dff' : 'lightgray'}
                                testID={`workflow-day-of-week-${String(ind)}`}
                            />
                        </View>
                    ))}
                </View>

                <Text style={WorkflowScreenStyles.header}>Scheduling style</Text>
                <View style={WorkflowScreenStyles.center}>
                <Picker
                    style={WorkflowScreenStyles.picker}
                    selectedValue={schedulingStyle}
                    testID="workflow-scheduling-style"
                    onValueChange={(value: string) => { setSchedulingStyle(value); }}
                >
                    {schedulingStyles.map((s: SchedulingStyle) => (
                        <Picker.Item
                            key={s.Id.toString()}
                            label={s.Name}
                            value={s.Id.toString()}  // Convert to string
                            testID={`workflow-scheduling-style-${String(s.Id)}`}
                        />
                    ))}
                </Picker>
                </View>

                <Text style={WorkflowScreenStyles.header}>Color</Text>
                <View style={WorkflowScreenStyles.center}>
                    <View style={WorkflowScreenStyles.wheelPicker} testID="workflow-color">
                        <WheelPicker color={color} onColorChange={setColor} />
                    </View>
                </View>

                <Text style={WorkflowScreenStyles.footer}> </Text>
            </ScrollView>

            <ButtonSave
                onPress={handleSaveForm}
                testID="workflow-btn-save"
            />
            {workflow.id > 0 &&
                <ButtonDelete
                    onPress={handleDelete}
                    testID="workflow-btn-delete"
                />
            }
        </View>
    );
};

export default WorkflowScreen;