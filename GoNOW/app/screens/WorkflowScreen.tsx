import { Alert, Button, ScrollView, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useFocusEffect, useNavigation,NavigationProp } from '@react-navigation/native';
import { JSX, useCallback, useEffect, useRef , useState } from 'react';
import { Ionicons } from 'react-native-vector-icons';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import WheelPicker from 'react-native-wheel-color-picker';

import { getSchedulingStyles, getSchedulingStyle } from '../scripts/SchedulingStyle';
import { DaysOfWeekNames, Time, TimeFromDate } from '../models/Time';
import { Workflow } from '../models/Workflow';
import { addWorkflow, updateWorkflow, deleteWorkflow, validateWorkflow } from '../scripts/Workflow';
import { WorkflowScreenStyles } from '../styles/WorkflowScreen.styles';
import SchedulingStyle from '../models/SchedulingStyle';
import { TabParamList } from './Navigator';

const WorkflowScreen = ({ route }): JSX.Element => {

    //console.log('> Route: ', route);
    const { workflow } = route.params;
    const navigation = useNavigation<NavigationProp<TabParamList>>();

    const scrollRef = useRef<ScrollView>(null);

    const [name, setName] = useState(workflow.Name);
    const [color, setColor] = useState(workflow.Color);
    const [pushNotifications, setPushNotifications] = useState<boolean>(workflow.PushNofications === true);
    const [timeStart, setTimeStart] = useState<Date | null>(new Date(0, 0, 0, workflow.TimeStart.Hours, workflow.TimeStart.Minutes));
    const [timeEnd, setTimeEnd] = useState<Date | null>(new Date(0, 0, 0, workflow.TimeEnd.Hours, workflow.TimeEnd.Minutes));
    const [daysOfWeek, setDaysOfWeek] = useState<boolean[]>(workflow.DaysOfWeek);
    const [schedulingStyle, setSchedulingStyle] = useState(workflow.SchedulingStyle);

    const [schedulingStyles, setSchedulingStyles] = useState<SchedulingStyle[]>([]);

    const [showTimeStart, setShowTimeStart] = useState(false);
    const [showTimeEnd, setShowTimeEnd] = useState(false);

    const openTimeStart = (): void => { setShowTimeStart(true); };
    const onChangeTimeStart = (time:Date): void => {
        setTimeStart(new Date(0, 0, 0, time.getHours(), time.getMinutes()));
        setShowTimeStart(false);
    };
    const openTimeEnd = (): void => { setShowTimeEnd(true); };
    const onChangeTimeEnd = (time: Date): void => {
        setTimeEnd(new Date(0, 0, 0, time.getHours(), time.getMinutes()));
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
            workflow.Id,
            name,
            color,
            (pushNotifications),
            timeStart? new Time(timeStart.getHours(), timeStart.getMinutes()) : new Time( 0, 0),
            timeEnd? new Time(timeEnd.getHours(), timeEnd.getMinutes()):new Time(23,59),
            daysOfWeek,
            await getSchedulingStyle(Number(schedulingStyle))
        );
        try {
            await validateWorkflow(workflowNew);
        } catch (error) {
            const typedError = error as Error;
            Alert.alert('Validation Error', typedError.message);
            return;
        }
        if (workflow.Id > 0) {
            await updateWorkflow(workflowNew);
        }
        else {
            await addWorkflow(workflowNew);
        }
        navigation.navigate('Profile');
    };

    const handleDelete = async (): Promise<void> => {
        Alert.alert('Confirm', `Remove workflow ${workflow.Name}?`,
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'OK', onPress: async (): Promise<void> => {
                    await deleteWorkflow(workflow);
                    navigation.navigate('Profile');
                } },
            ],
            { cancelable: false }
        );
    };

    const loadSchedulingStyle = ():void => {
        setSchedulingStyles(getSchedulingStyles());
    };

    useEffect(() => {
        loadSchedulingStyle();
        setName(workflow.Name);
        setColor(workflow.Color);
        setPushNotifications((workflow.PushNotifications === true));
        setTimeStart(new Date(0, 0, 0, workflow.TimeStart.Hours, workflow.TimeStart.Minutes));
        setTimeEnd(new Date(0, 0, 0, workflow.TimeEnd.Hours, workflow.TimeEnd.Minutes));
        setDaysOfWeek(workflow.DaysOfWeek);
        setSchedulingStyle(workflow.SchedulingStyle);
    }, [workflow]);
    
    useFocusEffect(
        useCallback(() => {
            loadSchedulingStyle();
            scrollRef.current?.scrollTo({ y: 0, animated: true });
        }, [])
    );

    return (
        <View style={WorkflowScreenStyles.container}>
            <ScrollView style={WorkflowScreenStyles.scrollContainer} ref={scrollRef}>
                <Text style={WorkflowScreenStyles.title} testID="workflow-title">
                    {workflow.Id === 0 ? 'Add a workflow' : 'Update the workflow'}
                </Text>
                <TextInput style={WorkflowScreenStyles.input} value={name} onChangeText={setName} placeholder="Workflow name" testID="workflow-name" />

                <View style={WorkflowScreenStyles.center}>
                    <Switch value={pushNotifications} onValueChange={setPushNotifications} testID="workflow-push-notifications" />
                    <Text style={WorkflowScreenStyles.rightElem}>Push notifications</Text>
                </View>

                <Text style={WorkflowScreenStyles.header}>Time selection</Text>
                <View style={WorkflowScreenStyles.center}>
                    <Button style={WorkflowScreenStyles.rightElem} onPress={openTimeStart} title={timeStart?TimeFromDate(timeStart).toString(): (new Time (0,0)).toString()} testID="workflow-time-start" />
                    {showTimeStart && (
                        <DateTimePicker value={timeStart} mode="time" is24Hour={true} display="default" onChange={onChangeTimeStart} />
                    )}
                    <Text></Text>
                    <Button style={WorkflowScreenStyles.rightElem} onPress={openTimeEnd} title={timeEnd? TimeFromDate(timeEnd).toString(): (new Time(23,59)).toString()} testID="workflow-time-end" />
                    {showTimeEnd && (
                        <DateTimePicker value={timeEnd} mode="time" is24Hour={true} display="default" onChange={onChangeTimeEnd} />
                    )}
                </View>

                <View style={WorkflowScreenStyles.centerWrap}>
                    {daysOfWeek.map((day, ind) => (
                        <View key={ind} style={WorkflowScreenStyles.blockDayOfWeek}>
                            <Button title={ DaysOfWeekNames[ind] }
                                onPress={() => { toggleDay(ind); }}
                                color={day ? '#388dff' : 'lightgray'}
                                testID={`workflow-day-of-week-${ind}`}
                            />
                        </View>
                    ))}
                </View>

                <Text style={WorkflowScreenStyles.header}>Scheduling style</Text>
                <View style={WorkflowScreenStyles.center}>
                    <Picker style={WorkflowScreenStyles.picker} selectedValue={workflow.SchedulingStyle.Id} testID="workflow-scheduling-style" onValueChange={(s) => { setSchedulingStyle(s); }} >
                        {schedulingStyles.map((s: SchedulingStyle) => (
                            <Picker.Item key={String(s.Id)} label={s.Name} value={s.Id} testID={`workflow-scheduling-style-${String(s.Id)}`} />
                        ))}
                    </Picker>
                </View>

                <Text style={WorkflowScreenStyles.header}>Color</Text>
                <View style={WorkflowScreenStyles.center}>
                    <View style={WorkflowScreenStyles.wheelPicker} testID="workflow-color">
                    <WheelPicker
                        color={color}
                        onColorChange={setColor}
                    />
                    </View>
                </View>

                <Text style={WorkflowScreenStyles.footer}> </Text>
            </ScrollView>

            <TouchableOpacity style={WorkflowScreenStyles.btnSave} onPress={handleSaveForm} testID="workflow-btn-save">
                <Ionicons name="checkmark" size={34} color="#fff" />
            </TouchableOpacity>
            {workflow?.Id > 0 &&
                <TouchableOpacity style={WorkflowScreenStyles.btnDel} onPress={handleDelete} testID="workflow-btn-delete">
                    <Ionicons name="close" size={34} color="#fff" />
                </TouchableOpacity>
            }
        </View>
    );
};

export default WorkflowScreen;