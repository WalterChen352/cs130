import { Alert, Button, ScrollView, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useFocusEffect, useNavigation, NavigationProp, RouteProp } from '@react-navigation/native';
import { useCallback, useEffect, useRef, useState } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import WheelPicker from 'react-native-wheel-color-picker';

import { getSchedulingStyles, getSchedulingStyle } from '../scripts/SchedulingStyle';
import { DaysOfWeekNames, Time, TimeFromDate } from '../models/Time';
import { Workflow } from '../models/Workflow';
import { addWorkflow, updateWorkflow, deleteWorkflow, validateWorkflow } from '../scripts/Workflow';
import { WorkflowScreenStyles } from '../styles/WorkflowScreen.styles';
import SchedulingStyle from '../models/SchedulingStyle';
import { TabParamList } from './Navigator';

interface WorkflowScreenProps {
    route: RouteProp<TabParamList, 'Workflow'>;
}

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

    const openTimeStart = (): void => {
        setShowTimeStart(true);
    };

    const onChangeTimeStart = (event: DateTimePickerEvent, date?: Date  ): void => {
        if (date) {
            setTimeStart(new Date(0, 0, 0, date.getHours(), date.getMinutes()));
        }
        setShowTimeStart(false);
    };

    const openTimeEnd = (): void => {
        setShowTimeEnd(true);
    };

    const onChangeTimeEnd = (event: DateTimePickerEvent, time: Date | undefined): void => {
        if (time) {
            setTimeEnd(new Date(0, 0, 0, time.getHours(), time.getMinutes()));
        }
        setShowTimeEnd(false);
    };

    const toggleDay = (indexDay: number): void => {
        setDaysOfWeek((prev) => {
            const next = [...prev];
            next[indexDay] = !next[indexDay];
            return next;
        });
    };

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
        setSchedulingStyle(workflow.schedulingStyle.Id);
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
                    <Button
                        style={WorkflowScreenStyles.rightElem}
                        onPress={openTimeStart}
                        title={TimeFromDate(timeStart).toString()}
                        testID="workflow-time-start"
                    />
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
                    <Button
                        style={WorkflowScreenStyles.rightElem}
                        onPress={openTimeEnd}
                        title={TimeFromDate(timeEnd).toString()}
                        testID="workflow-time-end"
                    />
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

            <TouchableOpacity
                style={WorkflowScreenStyles.btnSave}
                onPress={() => void handleSaveForm()}
                testID="workflow-btn-save"
            >
                <Ionicons name="checkmark" size={34} color="#fff" />
            </TouchableOpacity>
            {workflow.id > 0 && (
                <TouchableOpacity
                    style={WorkflowScreenStyles.btnDel}
                    onPress={() => { handleDelete(); }}
                    testID="workflow-btn-delete"
                >
                    <Ionicons name="close" size={34} color="#fff" />
                </TouchableOpacity>
            )}
        </View>
    );
};

export default WorkflowScreen;