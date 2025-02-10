import { Alert, Button, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useEffect , useState } from "react";
import { Ionicons } from 'react-native-vector-icons';
import { useNavigation } from "@react-navigation/native";

import { DaysOfWeekNames } from "../models/Time";
import { Workflow, NewWorkflow } from "../models/Workflow";
import { getWorkflows } from "../scripts/Workflow";
import { resetDatabase } from "../scripts/Database";

const ProfileScreen = () => {

    const [workflows, setWorkflows] = useState<Workflow[]>([]);
    const navigation = useNavigation();

    const loadWorkflows = async () => {
        console.log('> ProfileScreen > loadWorkflows');
        const items = await getWorkflows();
        //console.log(items);
        setWorkflows(items);
    };

    useFocusEffect(
        useCallback(() => {
            console.log('ProfileScreen got focus');
            loadWorkflows();
            return () => {
                console.log('ProfileScreen lost focus');
            };
        }, [])
    );

    const handleReset = async () => {
        Alert.alert("Confirm", "Are you sure?",
            [
                { text: "Cancel", style: "cancel" },
                { text: "OK", onPress: async () => {
                    await resetDatabase();
                    loadWorkflows();
                } },
            ],
            { cancelable: false }
        );
    };


    return (
        <View style={styles.container}>

            <Text style={styles.title}>Workflows</Text>

            <FlatList data={workflows} keyExtractor={(item) => item.Id.toString()}
                renderItem={({ item }) => (
                    <View style={{ padding: 10, marginBottom: 16, borderRadius: 15, backgroundColor: item.Color }}>
                        <TouchableOpacity onPress={() => navigation.navigate("Workflow", {workflow: item})}>
                            <Text style={{ fontSize: 18, fontWeight: "bold", textAlign: "center" }}>
                                {item.Name}
                                {item.PushNotifications === true && <Ionicons name="push" size={14} color="#ccc" />}
                            </Text>
                            <Text style={{textAlign: "center" }}> 
                                Schedule <Text style={{fontWeight: 'bold'}}> 
                                    between {item.TimeStart.toString()} and {item.TimeEnd.toString()}
                                </Text> 
                                {item.DaysOfWeek.map((day, ind) => day ? DaysOfWeekNames[ind] : '').join(" ")}
                            </Text>
                            <Text style={{textAlign: "center" }}>
                                {item.SchedulingStyle?.Name}
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}
                ListFooterComponent={() => (
                    <View style={{ alignItems: "center", marginVertical: 10 }}>
                        <TouchableOpacity onPress={() => navigation.navigate("Workflow", {workflow: NewWorkflow()})} style={{ paddingVertical: 10 }}>
                            <Text style={{ textAlign: "center", color: "#388dff", fontSize: 16 }}>
                                {workflows.length > 0 ? "Add Another Workflow" : "Add an Workflow"}
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}
            />

            <Button title="Reset Storage" onPress={handleReset} />

        </View>
    );
}

export default ProfileScreen;

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16 },
    title: {fontSize: 23, fontWeight: "bold", textAlign: "center", marginBottom: 16},
});