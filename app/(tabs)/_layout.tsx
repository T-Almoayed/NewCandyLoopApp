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
import { MaterialCommunityIcons } from '@expo/vector-icons';


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
          paddingTop: 5,
          height: 80,
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
      <MaterialCommunityIcons
        name={focused ? 'rocket-launch' : 'rocket-launch-outline'}
        size={30} // حجم الأيقونة
        color={color} // لون الأيقونة
      />
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
        name="Profile"
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
