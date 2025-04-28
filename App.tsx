import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import StepCounter from './src/screens/StepCounter'; // dosya yolunu uyarlarsın

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={StepCounter} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
