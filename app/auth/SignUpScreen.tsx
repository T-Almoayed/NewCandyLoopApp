import React, { useState } from 'react';
import { View, TextInput, Button, Alert, Text, StyleSheet } from 'react-native';
import { firebase } from '../../firebaseConfig';
import { NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../../types';

interface SignUpScreenProps {
  navigation: NavigationProp<RootStackParamList, 'SignUpScreen'>;
}

const SignUpScreen: React.FC<SignUpScreenProps> = ({ navigation }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSignUp = async () => {
    if (!firstName || !lastName || !email || !phone || !password || !confirmPassword) {
      Alert.alert('Fel', 'Vänligen fyll i alla fält');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Fel', 'Lösenorden matchar inte');
      return;
    }

    try {
      const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;

      if (user) {
        await user.sendEmailVerification();
        await firebase.firestore().collection('users').doc(user.uid).set({
          firstName,
          lastName,
          email,
          phone,
        });
        Alert.alert(
          'Registrerad',
          'Ditt konto har skapats. Kontrollera din e-post för att verifiera kontot.',
          [
            {
              text: 'OK',
              onPress: () => navigation.navigate('LoginScreen'),
            },
          ]
        );
      }
    } catch (error: any) {
      console.error('Signup error:', error.message);
      Alert.alert('Fel vid registrering', error.message || 'Ett okänt fel inträffade');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registrera dig</Text>
      <View style={styles.row}>
        <TextInput
          placeholder="Förnamn"
          value={firstName}
          onChangeText={setFirstName}
          style={[styles.input, styles.halfInput]}
        />
        <TextInput
          placeholder="Efternamn"
          value={lastName}
          onChangeText={setLastName}
          style={[styles.input, styles.halfInput]}
        />
      </View>
      <TextInput
        placeholder="E-post"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Telefonnummer"
        value={phone}
        onChangeText={setPhone}
        style={styles.input}
        keyboardType="phone-pad"
      />
      <TextInput
        placeholder="Lösenord"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
      />
      <TextInput
        placeholder="Bekräfta lösenord"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        style={styles.input}
        secureTextEntry
      />
      <Button title="REGISTRERA" onPress={handleSignUp} color="#D60265" />
      <Text style={styles.loginText}>
        Har du redan ett konto?{' '}
        <Text style={styles.loginLink} onPress={() => navigation.navigate('LoginScreen')}>
          Logga in
        </Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#D60265',
    textAlign: 'center',
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  halfInput: {
    width: '48%',
  },
  loginText: {
    marginTop: 20,
    textAlign: 'center',
    fontSize: 16,
    color: '#000',
  },
  loginLink: {
    color: '#D60265',
    fontWeight: 'bold',
  },
});

export default SignUpScreen;
