import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function MinaKuponger() {
  const [selectedButton, setSelectedButton] = useState('Giltiga'); // الحالة الافتراضية

  const handlePress = (button: string) => {
    setSelectedButton(button);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Mina Kuponger</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.button,
            selectedButton === 'Alla' && styles.activeButton,
          ]}
          onPress={() => handlePress('Alla')}
        >
          <Text
            style={[
              styles.buttonText,
              selectedButton === 'Alla' && styles.activeButtonText,
            ]}
          >
            Alla
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.button,
            selectedButton === 'Giltiga' && styles.activeButton,
          ]}
          onPress={() => handlePress('Giltiga')}
            >
           <Text
            style={[
              styles.buttonText,
              selectedButton === 'Giltiga' && styles.activeButtonText,
            ]}
            >
            Giltiga
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.button,
            selectedButton === 'Utgångna' && styles.activeButton,
          ]}
          onPress={() => handlePress('Utgångna')}
        >
          <Text
            style={[
              styles.buttonText,
              selectedButton === 'Utgångna' && styles.activeButtonText,
            ]}
          >
            Utgångna
          </Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.updateButton}>
        <Text style={styles.updateButtonText}>Uppdatera Kuponger</Text>
      </TouchableOpacity>
      <Text style={styles.noCouponsText}>Inga kuponger tillgängliga.</Text>
    </View>
  );
  }

  const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF2F5',
    padding: 20,
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#D60265',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#D60265',
    borderRadius: 5,
    backgroundColor: '#FFF2F5',
    alignItems: 'center',

  },
  buttonText: {
    fontSize: 16,
    color: '#D60265',
  },
  activeButton: {
    backgroundColor: '#D60265',
  },
  activeButtonText: {
    color: '#FFF',
  },
  updateButton: {
    marginTop: 10,
    backgroundColor: '#D60265',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    
  },
  updateButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  noCouponsText: {
    marginTop: 20,
    fontSize: 16,
    color: '#333',
  },
});
