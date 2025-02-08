import { Stack } from "expo-router";
import {View} from 'react-native';
import { GestureHandlerRootView} from 'react-native-gesture-handler';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{flex:1}}>
    <Stack 
      screenOptions={{ 
        header: () => (
          <View style={{
            height: 60, // Your desired height
            backgroundColor: 'lightblue'
          }}>
            {}
          </View>
        )
      }} 
    />
    </GestureHandlerRootView>
  );
}
