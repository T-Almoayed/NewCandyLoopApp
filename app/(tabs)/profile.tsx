/**
 * الملف: Profile.tsx
 * 
 * هذا الملف يحتوي على الصفحة الخاصة بملف المستخدم في تطبيق CandyLoop.
 */

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { firebase, firestore } from '../../firebaseConfig'; // استيراد Firebase والFirestore.
import { useNavigation, NavigationProp } from '@react-navigation/native'; // التنقل بين الصفحات.
import { RootStackParamList } from '../../types'; // تعريف قائمة الصفحات.
import { useAuth } from '../../context/AuthContext'; // جلب بيانات المستخدم.

const colors = {
  primary: '#D60265', // اللون الأساسي.
  background: '#f5f5f5', // الخلفية.
  buttonText: '#ffffff', // نص الأزرار.
};

export default function Profile() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { user } = useAuth();

  const [userData, setUserData] = useState({ kundnummer: '', name: '', phone: '', email: '' });

  const showCustomAlert = (title: string, message: string, onConfirm: () => void) => {
    Alert.alert(
      title,
      message,
      [
        { text: 'Nej', style: 'cancel' },
        { text: 'Ja', style: 'destructive', onPress: onConfirm },
      ],
      { cancelable: true }
    );
  };

  const handleDeleteAccount = () => {
    showCustomAlert('Bekräfta borttagning', 'Är du säker på att du vill ta bort kontot?', () => {
      if (user) {
        firebase.auth().currentUser?.delete().then(() => {
          Alert.alert('Kontot borttaget', 'Ditt konto har tagits bort.', [{ text: 'OK' }]);
          navigation.reset({ index: 0, routes: [{ name: 'SignUpScreen' }] });
        }).catch((error: Error) => {
          Alert.alert('Fel vid borttagning av konto', error.message);
        });
      }
    });
  };

  const handleLogout = () => {
    firebase.auth().signOut().then(() => {
      Alert.alert('Utloggad', 'Du har loggats ut.', [{ text: 'OK' }]);
      navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] });
    }).catch((error: Error) => {
      Alert.alert('Fel vid utloggning', error.message);
    });
  };

  useEffect(() => {
    if (user) {
      const fetchUserData = async () => {
        try {
          const userDoc = await firestore.collection('users').doc(user.uid).get();
          if (userDoc.exists) {
            const data = userDoc.data();
            setUserData({
              kundnummer: data?.kundnummer || '',
              name: `${data?.firstName || ''} ${data?.lastName || ''}`,
              phone: data?.phone || '',
              email: data?.email || '',
            });
          } else {
            Alert.alert('Fel', 'Kunde inte hitta användarens data.');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          Alert.alert('Fel', 'Det gick inte att hämta användarens data.');
        }
      };

      fetchUserData();
    } else {
      navigation.reset({ index: 0, routes: [{ name: 'LoginScreen' }] });
    }
  }, [user]);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Kundnummer: {userData.kundnummer}</Text>
      <Text style={styles.label}>Namn: {userData.name}</Text>
      <Text style={styles.label}>E-post: {userData.email}</Text>
      <Text style={styles.label}>Mobilnr: {userData.phone}</Text>

      <Text style={styles.sectionTitle}>Refer a friend-belöningar</Text>
      <TouchableOpacity
        style={[styles.button, styles.referButton]}
        onPress={() => navigation.navigate('ReferFriendScreen')}
      >
        <Text style={styles.buttonText}>REFER A FRIEND</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Mina kuponger</Text>
      <TouchableOpacity
        style={[styles.button, styles.couponButton]}
        onPress={() => navigation.navigate('MinaKuponger')} // التنقل إلى MinaKuponger
      >
        <Text style={styles.buttonText}>VISA KUPONGER</Text>
      </TouchableOpacity>

      <View style={styles.actionButtonsContainer}>
        <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={handleLogout}>
          <Text style={styles.buttonText}>LOGGA UT</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={handleDeleteAccount}>
          <Text style={styles.buttonText}>TA BORT KONTO</Text>
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
  label: {
    fontSize: 16,
    marginBottom: 10,
    color: '#000',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 20,
    marginBottom: 10,
  },
  button: {
    paddingVertical: 12,
    borderRadius: 5,
    marginBottom: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: colors.buttonText,
    fontWeight: 'bold',
  },
  referButton: {
    backgroundColor: colors.primary,
  },
  couponButton: {
    backgroundColor: colors.primary,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 100,
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
