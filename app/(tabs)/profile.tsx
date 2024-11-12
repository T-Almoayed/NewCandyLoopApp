// ProfileScreen.tsx

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { firebase, firestore } from '../../firebaseConfig';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../../types';

const colors = {
  primary: '#D60265',
  background: '#f5f5f5',
  buttonText: '#ffffff',
};

// تأكد من وجود `export default` واحد فقط
export default function ProfileScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [userData, setUserData] = useState({ kundnummer: '', name: '', phone: '', email: '' });

  useEffect(() => {
    const fetchUserData = async () => {
      const user = firebase.auth().currentUser;
      if (user) {
        try {
          const userDoc = await firestore.collection('users').doc(user.uid).get();
          if (userDoc.exists) {
            const data = userDoc.data();
            setUserData({
              kundnummer: user.uid,
              name: `${data?.firstName || ''} ${data?.lastName || ''}`,
              phone: data?.phone || '',
              email: user.email || '',
            });
          } else {
            Alert.alert('Fel', 'Kunde inte hitta användarens data.');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          Alert.alert('Fel', 'Det gick inte att hämta användarens data.');
        }
      } else {
        Alert.alert('Fel', 'Ingen användare är inloggad.');
      }
    };
    fetchUserData();
  }, []);

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

  const handleDeleteAccount = () => {
    const user = firebase.auth().currentUser;
    if (user) {
      user.delete().then(() => {
        Alert.alert('Kontot borttaget', 'Ditt konto har tagits bort.');
        navigation.reset({
          index: 0,
          routes: [{ name: 'SignUpScreen' }],
        });
      }).catch((error: Error) => {
        Alert.alert('Fel vid borttagning av konto', error.message);
      });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mina sidor</Text>
      <Text style={styles.label}>Kundnummer: {userData.kundnummer}</Text>
      <Text style={styles.label}>Namn: {userData.name}</Text>
      <Text style={styles.label}>E-post: {userData.email}</Text>
      <Text style={styles.label}>Mobilnr: {userData.phone}</Text>
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
    marginBottom: 20,
    color: '#000',
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
