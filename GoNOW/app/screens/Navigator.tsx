import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import MapScreen from './MapScreen';
import ProfileScreen from './ProfileScreen';
import CalendarScreen from './CalendarScreen';
import DailyScreen from './DailyScreen';
import CreateTaskScreen from './CreateTaskScreen';
import WorkflowScreen from './WorkflowScreen';
import { NavigatorStyles } from '../styles/Navigator.styles';
import { Workflow } from '../models/Workflow';
import { ParamListBase } from '@react-navigation/native';


export type TabParamList = ParamListBase & {
  Map: undefined;
  Daily: { 
    eventDate?: string,
    eventId?: number
   };
  CreateTask: {
    mode?: string,
    eventData?: Event
  };
  Calendar: undefined;
  Profile: undefined;
  Workflow: { workflow: Workflow };
};

const Tab = createBottomTabNavigator<TabParamList>();

const CustomTabBar: React.FC<BottomTabBarProps> = ({ state, navigation }) => {
  return (
    <View style={NavigatorStyles.container}>
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;

        if (route.name === 'Workflow') {
          return null;
        }

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        let iconName = '';
        if (route.name === 'Map') iconName = 'pin-outline';
        else if (route.name === 'Profile') iconName = 'person';
        else if (route.name === 'Calendar') iconName = 'calendar';
        else if (route.name === 'Daily') iconName = 'list';

        return (
          <TouchableOpacity
            key={index}
            onPress={onPress}
            style={NavigatorStyles.tabButton}
          >
            <Ionicons
              testID="tab-icon"
              name={iconName}
              size={24}
              color={isFocused ? '#007AFF' : '#8E8E8F'}
            />
          </TouchableOpacity>
        );
      })}
      
      {/* Create Task Button */}
      <TouchableOpacity
        style={NavigatorStyles.createButton}
        onPress={() => { navigation.navigate('CreateTask'); }}
      >
        <Ionicons name="add" size={30} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const Navigator: React.FC = () => {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name="Map" component={MapScreen} />
      <Tab.Screen name="Daily" component={DailyScreen} />
      <Tab.Screen 
        name="CreateTask" 
        component={CreateTaskScreen}
        options={{
          tabBarButton: () => null,
          headerShown: false
        }}
      />
      <Tab.Screen name="Calendar" component={CalendarScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen 
        name="Workflow" 
        component={WorkflowScreen}
        options={{
          tabBarButton: () => null,
          headerShown: false
        }}
      />
    </Tab.Navigator>
  );
};

export default Navigator;