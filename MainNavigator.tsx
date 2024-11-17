import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SplashScreen from './SplashScreen';
import LoginScreen from './app/auth/LoginScreen';
import SignUpScreen from './app/auth/SignUpScreen';
import Layout from './app/_layout';
import Profile from './app/(tabs)/Profile';
import MinaKuponger from './app/MinaKuponger'; // إضافة MinaKuponger هنا

const Stack = createStackNavigator();

export default function MainNavigator() {
  return (
    <Stack.Navigator initialRouteName="SplashScreen" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SplashScreen" component={SplashScreen} />
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
      <Stack.Screen name="MainTabs" component={Layout} />
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="MinaKuponger" component={MinaKuponger} /> {/* إضافة الشاشة */}
    </Stack.Navigator>
  );
}
