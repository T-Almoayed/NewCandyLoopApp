import React, { useState } from 'react';
import { View, TextInput, Button, Alert, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { firebase } from '../../firebaseConfig';
import { NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../../types';
import { Ionicons } from '@expo/vector-icons';

interface LoginScreenProps {
  navigation: NavigationProp<RootStackParamList, 'LoginScreen'>;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

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
      navigation.reset({
        index: 0,
        routes: [{ name: 'MainTabs', params: { screen: 'Profile' } }],
      });
    } catch (error: any) {
      console.error('Login error:', error.message);
      Alert.alert('Inloggningsfel', error.message || 'Ett okänt fel inträffade');
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert('Fel', 'Ange din e-postadress för att återställa lösenordet.');
      return;
    }

    try {
      await firebase.auth().sendPasswordResetEmail(email);
      Alert.alert(
        'Återställ lösenord',
        'Ett e-postmeddelande för återställning har skickats till din e-postadress.'
      );
    } catch (error: any) {
      console.error('Password reset error:', error.message);
      Alert.alert('Fel vid återställning', error.message || 'Ett okänt fel inträffade.');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('MainTabs')}>
        <Ionicons name="arrow-back" size={24} color="#D60265" />
        <Text style={styles.backButtonText}>Tillbaka</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Logga in</Text>
      <TextInput
        placeholder="E-post"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <View style={styles.passwordContainer}>
        <TextInput
          placeholder="Lösenord"
          value={password}
          onChangeText={setPassword}
          style={styles.passwordInput}
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Ionicons name={showPassword ? 'eye' : 'eye-off'} size={24} color="#ccc" style={styles.eyeIcon} />
        </TouchableOpacity>
      </View>
      {/* Forgot Password */}
      <TouchableOpacity onPress={handleResetPassword}>
        <Text style={styles.forgotPasswordText}>Har du glömt ditt lösenord?</Text>
      </TouchableOpacity>
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
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  backButton: { flexDirection: 'row', alignItems: 'center', marginTop: 10, marginBottom: 20, position: 'absolute', top: 40, left: 10 },
  backButtonText: { fontSize: 16, color: '#D60265', marginLeft: 8 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#D60265', textAlign: 'center', marginBottom: 20, marginTop: 80 },
  input: { height: 50, borderColor: '#ccc', borderWidth: 1, borderRadius: 8, paddingHorizontal: 10, marginBottom: 20 },
  passwordContainer: { flexDirection: 'row', alignItems: 'center', borderColor: '#ccc', borderWidth: 1, borderRadius: 8, paddingHorizontal: 10, marginBottom: 10 },
  passwordInput: { flex: 1, height: 50 },
  eyeIcon: { padding: 5 },
  forgotPasswordText: { color: '#D60265', fontWeight: 'bold', marginBottom: 20, textAlign: 'right' },
  registerText: { marginTop: 20, textAlign: 'center', fontSize: 16, color: '#000' },
  registerLink: { color: '#D60265', fontWeight: 'bold' },
});

export default LoginScreen;
