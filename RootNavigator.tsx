// RootNavigator.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MainNavigator from './MainNavigator';
import ReferFriendScreen from './app/ReferFriendScreen';
import CustomHeader from './CustomHeader'; // استيراد الهيدر المخصص

const Stack = createStackNavigator();

export default function RootNavigator() {
  return (
    <NavigationContainer>
      {/* عرض الهيدر الثابت في أعلى جميع الشاشات */}
      <CustomHeader />
      <Stack.Navigator initialRouteName="MainNavigator" screenOptions={{ headerShown: false }}>
        <Stack.Screen 
          name="MainNavigator" 
          component={MainNavigator} 
        />
        <Stack.Screen 
          name="ReferFriendScreen" 
          component={ReferFriendScreen} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}