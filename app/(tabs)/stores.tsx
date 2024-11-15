import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

export default function StoresScreen() {
  return (
    <View style={styles.container}>
      {/* خريطة المتجر */}
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 58.32196, // هنا يمكنك تحديد إحداثيات المتجر
          longitude: 15.13774 ,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        <Marker
          coordinate={{ latitude: 58.32196, longitude: 15.13774 }} // إحداثيات موقع المتجر
          title="CandyLoop"
          description="Unmanned Candy Store"
        />
      </MapView>

      {/* معلومات المتجر */}
      <View style={styles.storeInfo}>
        <Text style={styles.storeHours}>Öppet dygnet runt</Text>
        <Text style={styles.storeAddress}><Text style={styles.label}>Adress:</Text> Vasavägen 13 B lgh 1002, 595 52 Mjölby</Text>
        <Text style={styles.storePhone}><Text style={styles.label}>Telefon:</Text> 0142-29 82 00</Text>
        <Text style={styles.storeEmail}><Text style={styles.label}>Email:</Text> candyloop@example.com</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  map: {
    width: '100%',
    height: '50%', // ارتفاع الخريطة
  },
  storeInfo: {
    padding: 20,
    backgroundColor: '#fff',
    //alignItems: 'center', // محاذاة النص في المنتصف
  },
  storeHours: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center', // محاذاة النص في المنتصف
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000', // اللون الأسود للنص
  },
  storeAddress: {
    fontSize: 16,
    color: '#007AFF',
    marginBottom: 5,
  },
  storePhone: {
    fontSize: 16,
    color: '#007AFF',
    marginBottom: 5,
  },
  storeEmail: {
    fontSize: 16,
    color: '#007AFF',
  },
});
