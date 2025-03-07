import { Alert, Platform, ScrollView, Switch, Text, TextInput, View, TouchableOpacity } from 'react-native';
import {  useNavigation, NavigationProp, RouteProp } from '@react-navigation/native';
import {  useEffect, useRef, useState } from 'react';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import WheelPicker from 'react-native-wheel-color-picker';

import ButtonSave from '../components/ButtonSave';
import ButtonDelete from '../components/ButtonDelete';
import { DaysOfWeekNames, Time} from '../models/Time';
import { Workflow } from '../models/Workflow';
import { addWorkflow, updateWorkflow, deleteWorkflow, validateWorkflow } from '../scripts/Workflow';
import { WorkflowScreenStyles } from '../styles/WorkflowScreen.styles';
import { TabParamList } from './Navigator';
import DropdownPicker from '../components/DropdownPicker';
import TimeSelector from '../components/TimeSelector';
import APP_SCHEDLING_STYLES from '../models/SchedulingStyle';
import { switchColors } from '../styles/Common.styles';
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
    const [timeStart, setTimeStart] = useState<Date>(new Date(0, 0, 0, workflow.timeStart.hours, workflow.timeStart.minutes));
    const [timeEnd, setTimeEnd] = useState<Date>(new Date(0, 0, 0, workflow.timeEnd.hours, workflow.timeEnd.minutes));
    const [daysOfWeek, setDaysOfWeek] = useState<boolean[]>(workflow.daysOfWeek);
    const [schedulingStyle, setSchedulingStyle] = useState<string>(workflow.schedulingStyle.id.toString());
    const schedulingStyles= APP_SCHEDLING_STYLES

    const [showTimeStart, setShowTimeStart] = useState(false);
    const [showTimeEnd, setShowTimeEnd] = useState(false);

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
        const workflowNew:Workflow={
            id:workflow.id,
            name:name,
            color:color,
            pushNotifications:pushNotifications,
            timeStart:new Time(timeStart.getHours(), timeStart.getMinutes()),
            timeEnd:new Time(timeEnd.getHours(), timeEnd.getMinutes()),
            daysOfWeek:daysOfWeek,
            schedulingStyle:APP_SCHEDLING_STYLES[Number(schedulingStyle)]  // Convert string back to number
        };
        
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

    const handleTimeStartChange = (newTime: Date) => {
        setTimeStart(new Date(0, 0, 0, newTime.getHours(), newTime.getMinutes()));
    };

    const handleTimeEndChange = (newTime: Date) => {
        setTimeEnd(new Date(0, 0, 0, newTime.getHours(), newTime.getMinutes()));
    };

    useEffect(() => {
        setName(workflow.name);
        setColor(workflow.color);
        setPushNotifications(workflow.pushNotifications);
        setTimeStart(new Date(0, 0, 0, workflow.timeStart.hours, workflow.timeStart.minutes));
        setTimeEnd(new Date(0, 0, 0, workflow.timeEnd.hours, workflow.timeEnd.minutes));
        setDaysOfWeek(workflow.daysOfWeek);
        setSchedulingStyle(workflow.schedulingStyle.id.toString());
    }, [workflow]);


    return (
        <View style={WorkflowScreenStyles.container}>
            <ScrollView style={WorkflowScreenStyles.scrollContainer} ref={scrollRef} keyboardShouldPersistTaps="handled">
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
                    trackColor={switchColors.trackColor}
                    value={pushNotifications}
                    onValueChange={setPushNotifications}
                    testID="workflow-push-notifications"
                />
                <Text style={WorkflowScreenStyles.notificationText}>Push notifications</Text>
                </View>

                <Text style={WorkflowScreenStyles.header}>Time selection</Text>
                <View style={WorkflowScreenStyles.timeSelectors}>
                    <TimeSelector
                        value={timeStart}
                        onChange={handleTimeStartChange}
                        label="Start"
                        testID="workflow-time-start"
                    />
                    <TimeSelector
                        value={timeEnd}
                        onChange={handleTimeEndChange}
                        label="End"
                        testID="workflow-time-end"
                    />
                </View>
                {showTimeStart && Platform.OS === 'android' && (
                    <DateTimePicker
                        value={timeStart}
                        mode="time"
                        is24Hour={true}
                        display="default"
                        onChange={onChangeTimeStart}
                    />
                )}
                {showTimeEnd && Platform.OS === 'android' && (
                    <DateTimePicker
                        value={timeEnd}
                        mode="time"
                        is24Hour={true}
                        display="default"
                        onChange={onChangeTimeEnd}
                    />
                )}

                <Text style={WorkflowScreenStyles.header}>Days of week</Text>
                <View style={WorkflowScreenStyles.daysContainer}>
                {daysOfWeek.map((day, ind) => (
                    <TouchableOpacity
                    key={ind}
                    style={day ? WorkflowScreenStyles.dayButtonActive : WorkflowScreenStyles.dayButtonInactive}
                    onPress={() => { toggleDay(ind); }}
                    testID={`workflow-day-of-week-${String(ind)}`}
                    activeOpacity={0.7}
                    >
                    <Text style={day ? WorkflowScreenStyles.dayButtonText : WorkflowScreenStyles.dayButtonTextInactive}>
                        {DaysOfWeekNames[ind]}
                    </Text>
                    </TouchableOpacity>
                ))}
                </View>

                <Text style={WorkflowScreenStyles.header}>Scheduling style</Text>
                <View style={WorkflowScreenStyles.pickerContainer}>
                    <DropdownPicker
                        selectedValue={schedulingStyle}
                        onValueChange={(value) => { setSchedulingStyle(String(value)); }}
                        items={schedulingStyles.map((s) => ({
                            label: s.name,
                            value: s.id.toString()
                        }))}
                        testID="workflow-scheduling-style"
                        placeholder="Select scheduling style"
                    />
                </View>

                <Text style={WorkflowScreenStyles.header}>Color</Text>
                <View style={WorkflowScreenStyles.wheelPicker} testID="workflow-color">
                    <WheelPicker color={color} onColorChange={setColor} />
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