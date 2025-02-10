import { Alert, Button, FlatList, ScrollView, StyleSheet, Switch, Text, TextInput, View } from "react-native"
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useCallback, useEffect, useRef , useState } from "react";
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import WheelPicker from 'react-native-wheel-color-picker';

import { SchedulingStyles, FindSchedulingStyleById } from "../models/SchedulingStyle";
import { DaysOfWeekNames, Time } from "../models/Time";
import { Workflow } from "../models/Workflow";
import { addWorkflow, updateWorkflow } from "../scripts/Workflow";

const WorkflowScreen = ({ route }) => {

    //console.log('> Route: ', route);
    console.log('> Route');
    const { workflow } = route.params;

    const navigation = useNavigation();

    //const currentDate = new Date();
    const scrollRef = useRef(null);
    const [name, setName] = useState(workflow.Name);
    const [color, setColor] = useState(workflow.Color);
    const [pushNotifications, setPushNotifications] = useState(workflow.PushNofications);
    const [timeStart, setTimeStart] = useState<Date | null>(new Date(0, 0, 0, workflow.TimeStart.Hours, workflow.TimeStart.Minutes));
    const [timeEnd, setTimeEnd] = useState<Date | null>(new Date(0, 0, 0, workflow.TimeEnd.Hours, workflow.TimeEnd.Minutes));
    const [daysOfWeek, setDaysOfWeek] = useState<boolean[]>(workflow.DaysOfWeek);
    const [schedulingStyle, setSchedulingStyle] = useState(workflow.SchedulingStyle);

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
        console.log(name);
        if (!name) {
            Alert.alert("Validation Error", "Enter Name");
            return;
        }
        //TODO: add validation
        //console.log(name, "2");
        const workflowNew = new Workflow(
            workflow.Id,
            name,
            color,
            pushNotifications,
            new Time(timeStart.getHours() * 60 + timeStart.getMinutes()),
            new Time(timeEnd.getHours() * 60 + timeEnd.getMinutes()),
            daysOfWeek,
            FindSchedulingStyleById(schedulingStyle)
        );
        //console.log(name, "3");
        if (workflow.Id > 0) {
            await updateWorkflow(workflowNew);
        }
        else {
            await addWorkflow(workflowNew);
        }
        //console.log(name, "4");
        navigation.navigate("Profile");
    };

    useEffect(() => {
        console.log(`> Change workflow ${workflow.Name}`);
        setName(workflow.Name);
        setColor(workflow.Color);
        setPushNotifications(workflow.PushNotifications);
        setTimeStart(new Date(0, 0, 0, workflow.TimeStart.Hours, workflow.TimeStart.Minutes));
        setTimeEnd(new Date(0, 0, 0, workflow.TimeEnd.Hours, workflow.TimeEnd.Minutes));
        setDaysOfWeek(workflow.DaysOfWeek);
        setSchedulingStyle(workflow.SchedulingStyle);
    }, [workflow]);
    
    useFocusEffect(
        useCallback(() => {
            console.log('WorkflowScreen got focus');
            scrollRef.current?.scrollTo({ y: 0, animated: true });
            return () => {
                console.log('WorkflowScreen lost focus');
            };
        }, [])
    );

    return (
        <ScrollView style={styles.container} ref={scrollRef}>
            
            <Text style={styles.title}>{workflow.Id === 0 ? "Add a workflow" : "Update the workflow"}</Text>
            <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Workflow name" />

            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                <Switch value={pushNotifications} onValueChange={setPushNotifications} />
                <Text style={{ marginLeft: 8 }}>Push notifications</Text>
            </View>

            <Text style={styles.header}>Time selection</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                <Button style={{ marginRight: 16 }} onPress={openTimeStart} title={`${timeStart.getHours().toString().padStart(2, '0')}:${timeStart.getMinutes().toString().padStart(2, '0')}`} />
                {showTimeStart && (
                    <DateTimePicker value={timeStart} mode="time" is24Hour={true} display="default" onChange={onChangeTimeStart} />
                )}
                <Text></Text>
                <Button style={{ marginLeft: 16 }} onPress={openTimeEnd} title={`${timeEnd.getHours().toString().padStart(2, '0')}:${timeEnd.getMinutes().toString().padStart(2, '0')}`} />
                {showTimeEnd && (
                    <DateTimePicker value={timeEnd} mode="time" is24Hour={true} display="default" onChange={onChangeTimeEnd} />
                )}
            </View>

            <View style={{ flexDirection: 'row',  flexWrap: 'wrap', marginTop: 16, justifyContent: 'center', alignItems: 'center'  }}>
            {daysOfWeek.map((day, ind) => (
                <View key={ind} style={{ margin: 5 }}>
                    <Button title={ DaysOfWeekNames[ind] }
                        onPress={() => toggleDay(ind)}
                        color={day ? 'green' : 'lightgray'}
                    />
                </View>
            ))}
            </View>

            <Text style={styles.header}>Scheduling style</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                <Picker selectedValue={workflow.SchedulingStyle.Id} onValueChange={(s) => setSchedulingStyle(s)} style={{ height: 50, width: 300, borderWidth: 1 }}>
                {SchedulingStyles.map((s) => (
                    <Picker.Item key={s.Id} label={s.Name} value={s.Id} />
                ))}
                </Picker>
            </View>

            <Text style={styles.header}>Color</Text>
            <View style={{ flex: 1,  justifyContent: "center" }}>
                <WheelPicker
                    color={color}
                    onColorChange={(c) => setColor(c)}
                    style={styles.picker}
                />
            </View>

            <View style={{ marginTop: 46, marginBottom: 46 }}>
                <Button title={workflow.Id === 0 ? "Create" : "Update"} onPress={handleSaveForm} />
            </View>

        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16 },
    title: {fontSize: 23, fontWeight: "bold", textAlign: "center", marginBottom: 16},
    header: {fontSize: 23,  textAlign: "center", marginTop: 14, marginBottom: 10, color: "#888888"},
    input: { borderWidth: 1, padding: 8, marginVertical: 8 },
    picker: { height: 200 },
});
  
export default WorkflowScreen;