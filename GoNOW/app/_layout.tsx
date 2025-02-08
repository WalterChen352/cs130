import { Stack } from "expo-router";
import {View} from 'react-native';

export default function RootLayout() {
  return (
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
  );
}
