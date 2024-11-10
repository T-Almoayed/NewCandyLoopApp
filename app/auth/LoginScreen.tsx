import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { firebase } from '../../firebaseConfig';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../../types';

const colors = {
  primary: '#D60265', // اللون الرسمي لـ CandyLoop
  background: '#f5f5f5',
  inputBackground: '#ffffff',
  text: '#000000',
  buttonText: '#ffffff',
};

const LoginScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (!emailOrPhone || !password) {
      Alert.alert('Error', 'Please enter email/phone and password.');
      return;
    }
    firebase.auth().signInWithEmailAndPassword(emailOrPhone, password)
      .then(() => {
        Alert.alert('Success', 'Logged in successfully');
        setEmailOrPhone('');
        setPassword('');
        navigation.reset({
          index: 0,
          routes: [{ name: 'MainTabs' }], // الانتقال إلى شريط التبويبات الرئيسي بعد تسجيل الدخول
        });
      })
      .catch((error: any) => {
        Alert.alert('Login Error', error.message);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Logga in</Text>
      <TextInput
        placeholder="E-postadress eller telefonnummer"
        value={emailOrPhone}
        onChangeText={setEmailOrPhone}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Lösenord"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
      />
      <TouchableOpacity onPress={() => Alert.alert('Reset Password', 'Password reset link sent.')}>
        <Text style={styles.forgotPassword}>Glömt ditt lösenord?</Text>
      </TouchableOpacity>
      <Button title="Logga in" onPress={handleLogin} color={colors.primary} />
      
      <TouchableOpacity onPress={() => navigation.navigate('SignUpScreen')}>
        <Text style={styles.registerLink}>Har du inget konto? Registrera dig</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.background,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: colors.primary,
  },
  input: {
    height: 50,
    borderColor: colors.primary,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
    backgroundColor: colors.inputBackground,
  },
  forgotPassword: {
    color: colors.primary,
    textAlign: 'right',
    marginBottom: 20,
  },
  registerLink: {
    color: colors.primary,
    textAlign: 'center',
    marginTop: 10,
    fontSize: 16,
  },
});

export default LoginScreen;
