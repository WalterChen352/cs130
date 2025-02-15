import { Alert, Button, FlatList, ScrollView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from "react-native"
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { JSX, useCallback, useEffect, useRef , useState } from "react";
import { Ionicons } from "react-native-vector-icons";
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import WheelPicker from 'react-native-wheel-color-picker';

import { getSchedulingStyles, getSchedulingStyle } from "../scripts/SchedulingStyle";
import { DaysOfWeekNames, Time, TimeFromDate } from "../models/Time";
import { Workflow } from "../models/Workflow";
import { addWorkflow, updateWorkflow, deleteWorkflow, validateWorkflow } from "../scripts/Workflow";

const WorkflowScreen = ({ route }): JSX.Element => {

    //console.log('> Route: ', route);
    console.log('> Route');
    const { workflow } = route.params;

    const navigation = useNavigation();

    const scrollRef = useRef(null);

    const [name, setName] = useState(workflow.Name);
    const [color, setColor] = useState(workflow.Color);
    const [pushNotifications, setPushNotifications] = useState<boolean>(workflow.PushNofications === true);
    const [timeStart, setTimeStart] = useState<Date | null>(new Date(0, 0, 0, workflow.TimeStart.Hours, workflow.TimeStart.Minutes));
    const [timeEnd, setTimeEnd] = useState<Date | null>(new Date(0, 0, 0, workflow.TimeEnd.Hours, workflow.TimeEnd.Minutes));
    const [daysOfWeek, setDaysOfWeek] = useState<boolean[]>(workflow.DaysOfWeek);
    const [schedulingStyle, setSchedulingStyle] = useState(workflow.SchedulingStyle);

    const [schedulingStyles, setSchedulingStyles] = useState([]);

    const [showTimeStart, setShowTimeStart] = useState(false);
    const [showTimeEnd, setShowTimeEnd] = useState(false);

    const openTimeStart = () => { setShowTimeStart(true); }
    const onChangeTimeStart = (event, time) => {
        setTimeStart(new Date(0, 0, 0, time.getHours(), time.getMinutes()));
        setShowTimeStart(false);
    };
    const openTimeEnd = () => { setShowTimeEnd(true); }
    const onChangeTimeEnd = (event, time) => {
        setTimeEnd(new Date(0, 0, 0, time.getHours(), time.getMinutes()));
        setShowTimeEnd(false);
    };

    const toggleDay = (indexDay) => {
        setDaysOfWeek((prev) => {
            const next = [...prev];
            next[indexDay] = !next[indexDay];
            return next;
        });
    };

    const handleSaveForm = async () => {
        const workflowNew = new Workflow(
            workflow.Id,
            name,
            color,
            (pushNotifications === true),
            new Time(timeStart.getHours(), timeStart.getMinutes()),
            new Time(timeEnd.getHours(), timeEnd.getMinutes()),
            daysOfWeek,
            await getSchedulingStyle(Number(schedulingStyle))
        );
        try {
            await validateWorkflow(workflowNew);
        } catch (error) {
            Alert.alert("Validation Error", error.message);
            return;
        }
        if (workflow.Id > 0) {
            await updateWorkflow(workflowNew);
        }
        else {
            await addWorkflow(workflowNew);
        }
        navigation.navigate("Profile");
    };

    const handleDelete = async () => {
        Alert.alert("Confirm", `Remove workflow ${workflow.Name}?`,
            [
                { text: "Cancel", style: "cancel" },
                { text: "OK", onPress: async () => {
                    await deleteWorkflow(workflow);
                    navigation.navigate("Profile");
                } },
            ],
            { cancelable: false }
        );
    };

    const loadSchedulingStyle = async () => {
        setSchedulingStyles(await getSchedulingStyles());
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
            return () => {
                //console.log('WorkflowScreen lost focus');
            };
        }, [])
    );

    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollContainer} ref={scrollRef}>
                <Text style={styles.title} testID="workflow-title">
                    {workflow.Id === 0 ? "Add a workflow" : "Update the workflow"}
                </Text>
                <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Workflow name" testID="workflow-name" />

                <View style={styles.center}>
                    <Switch value={pushNotifications} onValueChange={setPushNotifications} testID="workflow-push-notifications" />
                    <Text style={styles.rightElem}>Push notifications</Text>
                </View>

                <Text style={styles.header}>Time selection</Text>
                <View style={styles.center}>
                    <Button style={styles.rightElem} onPress={openTimeStart} title={TimeFromDate(timeStart).toString()} testID="workflow-time-start" />
                    {showTimeStart && (
                        <DateTimePicker value={timeStart} mode="time" is24Hour={true} display="default" onChange={onChangeTimeStart} />
                    )}
                    <Text></Text>
                    <Button style={styles.rightElem} onPress={openTimeEnd} title={TimeFromDate(timeEnd).toString()} testID="workflow-time-end" />
                    {showTimeEnd && (
                        <DateTimePicker value={timeEnd} mode="time" is24Hour={true} display="default" onChange={onChangeTimeEnd} />
                    )}
                </View>

                <View style={styles.centerWrap}>
                    {daysOfWeek.map((day, ind) => (
                        <View key={ind} style={styles.blockDayOfWeek}>
                            <Button title={ DaysOfWeekNames[ind] }
                                onPress={() => toggleDay(ind)}
                                color={day ? "#388dff" : 'lightgray'}
                                testID={`workflow-day-of-week-${ind}`}
                            />
                        </View>
                    ))}
                </View>

                <Text style={styles.header}>Scheduling style</Text>
                <View style={styles.center}>
                    <Picker style={styles.picker} selectedValue={workflow.SchedulingStyle.Id} testID="workflow-scheduling-style" onValueChange={(s) => setSchedulingStyle(s)} >
                        {schedulingStyles.map((s) => (
                            <Picker.Item key={s.Id} label={s.Name} value={s.Id} testID={`workflow-scheduling-style-${s.Id}`} />
                        ))}
                    </Picker>
                </View>

                <Text style={styles.header}>Color</Text>
                <View style={styles.center}>
                    <WheelPicker
                        style={styles.wheelPicker}
                        color={color}
                        onColorChange={setColor}
                        testID="workflow-color"
                    />
                </View>

                <Text style={styles.footer}> </Text>
            </ScrollView>

            <TouchableOpacity style={styles.btnSave} onPress={handleSaveForm} testID="workflow-btn-save">
                <Ionicons name="checkmark" size={34} color="#fff" />
            </TouchableOpacity>
            {workflow?.Id > 0 &&
                <TouchableOpacity style={styles.btnDel} onPress={handleDelete} testID="workflow-btn-delete">
                    <Ionicons name="close" size={34} color="#fff" />
                </TouchableOpacity>
            }
        </View>
    );
};

const styles = StyleSheet.create({
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
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 16
    },
    header: {
        fontSize: 23,
        textAlign: "center",
        marginTop: 24,
        marginBottom: 10,
        color: "#888888"
    },
    input: {
        borderWidth: 1,
        padding: 8,
        marginVertical: 8
    },
    center: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center"
    },
    centerWrap: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems: "center"
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
        position: "absolute",
        bottom: 20,
        right: 20,
        backgroundColor: "#388dff",
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: "center",
        alignItems: "center",
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        borderWidth: 4,
        borderColor: "white",
    },
    btnDel: {
        position: "absolute",
        bottom: 20,
        left: 20,
        backgroundColor: "#ffa5a5",
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: "center",
        alignItems: "center",
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        borderWidth: 4,
        borderColor: "white",
    },
    footer: {
        paddingBottom: 100,
    }
});

export default WorkflowScreen;