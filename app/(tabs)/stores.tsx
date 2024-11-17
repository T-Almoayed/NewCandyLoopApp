import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Alert } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons'; // مكتبة الأيقونات

export default function StoresScreen() {
  // دالة لفتح تطبيق الاتصال
  const handlePhonePress = () => {
    Linking.openURL('tel:0722611311').catch((err) =>
      Alert.alert('Error', 'Unable to make a call at this time')
    );
  };

  // دالة لفتح تطبيق البريد الإلكتروني
  const handleEmailPress = () => {
    Linking.openURL('mailto:info@candyloop.se').catch((err) =>
      Alert.alert('Error', 'Unable to open email client')
    );
  };

  return (
    <View style={styles.container}>
      {/* خريطة المتجر */}
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 58.32260,
          longitude: 15.13730,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        <Marker
          coordinate={{ latitude: 58.32260, longitude: 15.13730 }}
          title="CandyLoop"
          description="Obemannad godisbutik"
        >
          {/* عنصر مخصص للدبوس */}
          <View style={styles.customMarker}>
            <Ionicons name="storefront" size={20} color="#D60265" />
          </View>
          <Callout>
            <View>
              <Text style={{ fontWeight: 'bold', color: '#D60265' }}>CandyLoop</Text>
              <Text>Obemannad godisbutik</Text>
            </View>
          </Callout>
        </Marker>
      </MapView>

      {/* معلومات المتجر */}
      <View style={styles.storeInfo}>
        <Text style={styles.storeHours}>Öppet dygnet runt</Text>
        <Text style={styles.storeAddress}>
          <Text style={styles.label}>Adress:</Text> Vasavägen 13 B, 595 52 Mjölby
        </Text>
        {/* زر الهاتف */}
        <TouchableOpacity onPress={handlePhonePress}>
          <Text style={styles.storePhone}>
            <Text style={styles.label}>Telefon:</Text> 0722611311
          </Text>
        </TouchableOpacity>
        {/* زر البريد الإلكتروني */}
        <TouchableOpacity onPress={handleEmailPress}>
          <Text style={styles.storeEmail}>
            <Text style={styles.label}>Email:</Text> info@candyloop.se
          </Text>
        </TouchableOpacity>
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
  customMarker: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 5,
    borderWidth: 2,
    borderColor: '#D60265', // اللون الرسمي
    alignItems: 'center',
    justifyContent: 'center',
  },
  storeInfo: {
    padding: 20,
    backgroundColor: '#fff',
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
