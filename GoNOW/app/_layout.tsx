import { Stack } from 'expo-router';
import { JSX } from 'react';
import { View, StyleSheet, Platform, StatusBar } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function RootLayout(): JSX.Element {
  // Define a consistent color for both status bar and header
  const headerColor = 'lightblue';

  return (
    <GestureHandlerRootView style={styles.container}>
      <StatusBar 
        backgroundColor={headerColor}
        barStyle="dark-content" 
      />
      <Stack
        screenOptions={{
          headerShown: true,
          header: () => (
            <View style={[
              styles.header,
              { height: Platform.OS === 'android' ? 5 : 60 }
            ]}>
              {}
            </View>
          ),
          contentStyle: {
            backgroundColor: 'white',
          }
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
    backgroundColor: 'lightblue',
  },
});