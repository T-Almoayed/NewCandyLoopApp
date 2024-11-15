import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { firebase, firestore } from '../../firebaseConfig';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../../types';
import { useAuth } from '../../context/AuthContext';

const colors = {
  primary: '#D60265',
  background: '#f5f5f5',
  buttonText: '#ffffff',
};

export default function Profile() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { user } = useAuth(); // يحصل على بيانات المستخدم من AuthContext
  const [userData, setUserData] = useState({ kundnummer: '', name: '', phone: '', email: '' });

  // التحقق من حالة تسجيل الدخول
  useEffect(() => {
    if (!user) {
      // إذا لم يكن المستخدم مسجلاً الدخول، يتم توجيهه إلى شاشة تسجيل الدخول
      navigation.reset({
        index: 0,
        routes: [{ name: 'LoginScreen' }],
      });
    }
  }, [user, navigation]);

  // جلب بيانات المستخدم من Firestore
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
    }
  }, [user]);

  // تسجيل الخروج
  const handleLogout = () => {
    firebase.auth().signOut().then(() => {
      Alert.alert('Utloggad', 'Du har loggats ut.');
      navigation.reset({
        index: 0,
        routes: [{ name: 'LoginScreen' }],
      });
    }).catch((error: Error) => {
      Alert.alert('Fel vid utloggning', error.message);
    });
  };

  // حذف الحساب
  const handleDeleteAccount = () => {
    Alert.alert(
      'Bekräfta borttagning',
      'Är du säker på att du vill ta bort kontot?',
      [
        { text: 'Nej', style: 'cancel' },
        {
          text: 'Ja',
          style: 'destructive',
          onPress: () => {
            if (user) {
              firebase.auth().currentUser?.delete().then(() => {
                Alert.alert('Kontot borttaget', 'Ditt konto har tagits bort.');
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'SignUpScreen' }],
                });
              }).catch((error: Error) => {
                Alert.alert('Fel vid borttagning av konto', error.message);
              });
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Kundnummer: {userData.kundnummer}</Text>
      <Text style={styles.label}>Namn: {userData.name}</Text>
      <Text style={styles.label}>E-post: {userData.email}</Text>
      <Text style={styles.label}>Mobilnr: {userData.phone}</Text>

      <Text style={styles.sectionTitle}>Refer a friend-belöningar</Text>
      <TouchableOpacity style={[styles.button, styles.referButton]} onPress={() => navigation.navigate('ReferFriendScreen')}>
        <Text style={styles.buttonText}>REFER A FRIEND</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Mina kuponger</Text>
      <TouchableOpacity style={[styles.button, styles.couponButton]} onPress={() => console.log('View Coupons')}>
        <Text style={styles.buttonText}>VIEW COUPONS</Text>
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
