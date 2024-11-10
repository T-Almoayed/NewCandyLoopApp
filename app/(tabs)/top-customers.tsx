import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function TopCustomersScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Toppkunder</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 20,
    color: '#D60265', // اللون الرسمي
  },
});
