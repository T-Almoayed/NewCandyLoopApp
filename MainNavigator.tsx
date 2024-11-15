// MainNavigator.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider } from './context/AuthContext';
import ProfileScreen from './app/(tabs)/profile';
import LoginScreen from './app/auth/LoginScreen';
import SignUpScreen from './app/auth/SignUpScreen';
import Layout from './app/_layout';

const Stack = createNativeStackNavigator();

export default function MainNavigator() {
  return (
    <AuthProvider>
      <Stack.Navigator initialRouteName="LoginScreen">
        <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="SignUpScreen" component={SignUpScreen} options={{ headerShown: false }} />
        <Stack.Screen name="MainTabs" component={Layout} options={{ headerShown: false }} />
      </Stack.Navigator>
    </AuthProvider>
  );
}