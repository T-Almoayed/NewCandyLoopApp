import React from 'react';
import { View, Text, StyleSheet, Platform, ActivityIndicator } from 'react-native';
import Constants from 'expo-constants';
import { useFonts } from 'expo-font';
import { Tabs } from 'expo-router';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider } from '../../context/AuthContext';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import LoginScreen from '../auth/LoginScreen';
import SignUpScreen from '../auth/SignUpScreen';

const Stack = createNativeStackNavigator();

function CustomHeader() {
  return (
    <View style={styles.header}>
      <Text style={styles.headerText}>CandyLoop</Text>
    </View>
  );
}

function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        tabBarInactiveTintColor: Colors[colorScheme ?? 'light'].tint,
        header: () => <CustomHeader />,
        tabBarStyle: {
          backgroundColor: '#FFF2F5',
          paddingBottom: 10,
          paddingTop: 8,
          height: 70,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Startsida',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="offers"
        options={{
          title: 'Erbjudanden',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'pricetag' : 'pricetag-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="top-customers"
        options={{
          title: 'Toppkunder',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'star' : 'star-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="stores"
        options={{
          title: 'Butiker',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'location' : 'location-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Mina Sidor',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'person' : 'person-outline'} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

export default function Layout() {
  const [fontsLoaded] = useFonts({
    'luckybones-bold': require('../../assets/fonts/luckybones-bold.ttf'),
  });

  if (!fontsLoaded) {
    return <ActivityIndicator size="large" color="#D60265" />;
  }

  return (
    <AuthProvider>
      <Stack.Navigator initialRouteName="MainTabs" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
        <Stack.Screen name="MainTabs" component={TabLayout} />
      </Stack.Navigator>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: Platform.OS === 'android' ? Constants.statusBarHeight : 44,
    height: 100,
    backgroundColor: '#FFF2F5',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerText: {
    fontSize: 30,
    fontFamily: 'luckybones-bold',
    color: '#D60265',
  },
});
