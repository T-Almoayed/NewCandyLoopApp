import React, { useState } from 'react';
import { View, TextInput, Button, Alert, Text, StyleSheet } from 'react-native';
import { firebase } from '../../firebaseConfig';
import { NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../../types';

interface LoginScreenProps {
  navigation: NavigationProp<RootStackParamList, 'LoginScreen'>;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Fel', 'Ange e-post och lösenord');
      return;
    }

    try {
      const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
      const user = userCredential.user;

      if (user && !user.emailVerified) {
        Alert.alert(
          'Verifiera din e-post',
          'Du måste verifiera din e-post för att logga in. Kontrollera din e-post och klicka på verifieringslänken.',
          [
            {
              text: 'OK',
              onPress: () => firebase.auth().signOut(),
            },
          ]
        );
        return;
      }

      console.log('Inloggning lyckades');
      Alert.alert('Välkommen', 'Du är nu inloggad i appen');
      navigation.reset({
        index: 0,
        routes: [{ name: 'MainTabs' }],
      });
    } catch (error: any) {
      console.error('Login error:', error.message);
      Alert.alert('Inloggningsfel', error.message || 'Ett okänt fel inträffade');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Logga in</Text>
      <TextInput
        placeholder="E-post"
        value={email}
        onChangeText={setEmail}
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
      <Button title="LOGGA IN" onPress={handleLogin} color="#D60265" />
      <Text style={styles.registerText}>
        Har du inget konto?{' '}
        <Text style={styles.registerLink} onPress={() => navigation.navigate('SignUpScreen')}>
          Registrera dig
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
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  registerText: {
    marginTop: 20,
    textAlign: 'center',
    fontSize: 16,
    color: '#000',
  },
  registerLink: {
    color: '#D60265',
    fontWeight: 'bold',
  },
});

export default LoginScreen;
