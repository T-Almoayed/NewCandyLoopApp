import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { firebase } from '../../firebaseConfig';
import { useNavigation } from 'expo-router';

const colors = {
  primary: '#D60265',
  background: '#f5f5f5',
  buttonText: '#ffffff',
};

export default function ProfileScreen() {
  const navigation = useNavigation();

  // دالة تسجيل الخروج
  const handleLogout = () => {
    firebase.auth().signOut().then(() => {
      Alert.alert('تم', 'تم تسجيل الخروج بنجاح');
      navigation.navigate('LoginScreen' as never); // ارجع لصفحة تسجيل الدخول
    }).catch((error: Error) => {
      Alert.alert('خطأ في تسجيل الخروج', error.message);
    });
  };

  // دالة حذف الحساب
  const handleDeleteAccount = () => {
    const user = firebase.auth().currentUser;
    if (user) {
      user.delete().then(() => {
        Alert.alert('تم', 'تم حذف الحساب بنجاح');
        navigation.navigate('SignUpScreen' as never); // ارجع لصفحة التسجيل
      }).catch((error: Error) => {
        Alert.alert('خطأ في حذف الحساب', error.message);
      });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mina sidor</Text>
      <Text style={styles.label}>Kundnummer: 5352490</Text>
      <Text style={styles.label}>E-post: user@example.com</Text>
      <Text style={styles.label}>Ändra lösenord: ******</Text>
      <Text style={styles.label}>Mobilnr: 0722611311</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Refer a friend-belöningar</Text>
        <TouchableOpacity style={[styles.button, { backgroundColor: colors.primary }]}>
          <Text style={styles.buttonText}>REFER A FRIEND</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Mina kuponger</Text>
        <TouchableOpacity style={[styles.button, { backgroundColor: colors.primary }]}>
          <Text style={styles.buttonText}>VIEW COUPONS</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.actionButtonsContainer}>
        <TouchableOpacity
          style={[styles.button, styles.deleteButton]}
          onPress={handleDeleteAccount}
        >
          <Text style={styles.buttonText}>TA BORT KONTO</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.logoutButton]}
          onPress={handleLogout}
        >
          <Text style={styles.buttonText}>LOGGA UT</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    textAlign: 'center',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
    color: '#000',
  },
  section: {
    marginVertical: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000',
  },
  button: {
    paddingVertical: 12,
    borderRadius: 5,
    marginBottom: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: colors.buttonText,
    fontWeight: 'bold',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  deleteButton: {
    backgroundColor: 'red',
    width: '48%',
  },
  logoutButton: {
    backgroundColor: colors.primary,
    width: '48%',
  },
});
