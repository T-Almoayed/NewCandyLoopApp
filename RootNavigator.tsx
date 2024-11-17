import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MainNavigator from './MainNavigator';
import ReferFriendScreen from './app/ReferFriendScreen';
import Profile from './app/(tabs)/Profile';
import MinaKuponger from './app/MinaKuponger'; // إضافة الشاشة هنا

const Stack = createStackNavigator();

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="MainNavigator" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MainNavigator" component={MainNavigator} />
        <Stack.Screen name="ReferFriendScreen" component={ReferFriendScreen} />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="MinaKuponger" component={MinaKuponger} /> {/* إضافة الشاشة */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
