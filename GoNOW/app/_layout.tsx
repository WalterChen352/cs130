import { Stack } from 'expo-router';
import { JSX } from 'react';
import { View, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function RootLayout(): JSX.Element {
  return (
    <GestureHandlerRootView style={styles.container}>
      <Stack 
        screenOptions={{ 
          header: () => (
            <View style={styles.header}>
              {}
            </View>
          )
        }} 
      />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 60, 
    backgroundColor: 'lightblue',
  },
});
