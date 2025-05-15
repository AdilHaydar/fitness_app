import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';

import WorkoutScreen from './src/screens/WorkoutScreen';
import StepCounter from './src/screens/StepCounter';
import SettingsScreen from './src/screens/SettingsScreen';
import SupplementScreen from './src/screens/SuplementScreen';

const Tab = createBottomTabNavigator();
const icons = {
  Home: 'walk',
  Settings: 'settings',
  Workout: 'barbell',
  Suplement: 'medkit',
} as const;
export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => (
            <Ionicons name={icons[route.name as keyof typeof icons]} size={size} color={color} />
          ),
          tabBarActiveTintColor: 'tomato',
          tabBarInactiveTintColor: 'gray',
        })}
      >
          <Tab.Screen name="Home" component={StepCounter} />
          <Tab.Screen name="Suplement" component={SupplementScreen} />
          <Tab.Screen name="Workout" component={WorkoutScreen} />
          <Tab.Screen name="Settings" component={SettingsScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
