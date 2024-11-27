import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, Share, FlatList, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const colors = {
  primary: '#D60265',
  background: '#FFF2F5',
  buttonText: '#FFFFFF',
  linkBackground: '#F5F5F5',
  linkText: '#333333',
  shareButton: '#2196F3',
  copyButton: '#4CAF50',
  cardBackground: '#FFFFFF',
  cardShadow: '#000000',
};

export default function ReferFriendScreen() {
  const [referralLink, setReferralLink] = useState('https://candyloop.com/referral/rIxUbhCjFyOb5k7WbuMB0xmVN7K2');
  const [inProgressList, setInProgressList] = useState([
    'Rehab Althawr',
    'Taha Almoayed',
    'Ali Almoayed',
    'Ahmed Almoayed',
    'Ibaheem Almoayed',
    'Hussaein Almoayed',
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleShareLink = async () => {
    try {
      await Share.share({
        message: `Gå med i CandyLoop med min referenslänk: ${referralLink}`,
      });
    } catch (error) {
      Alert.alert('Fel', 'Kunde inte dela länken.');
    }
  };

  const handleCopyLink = () => {
    Alert.alert('Kopierat', 'Referenslänken har kopierats.');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Refer a Friend-belöningar</Text>
      <Text style={styles.description}>
        Få belöningar genom att bjuda in dina vänner till att gå med i{' '}
        <Text style={styles.candyLoopText}>CandyLoop</Text>. {'\n'}
        Du får en kupong när de registrerar sig via din länk och gör sitt första köp.
      </Text>

      <View style={styles.linkContainer}>
        <Text style={styles.label}>Dela din referenslänk:</Text>
        <View style={styles.linkWrapper}>
          <Text style={styles.linkText}>{referralLink}</Text>
          <TouchableOpacity onPress={handleCopyLink} style={styles.copyButton}>
            <Ionicons name="copy-outline" size={18} color="#FFF" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleShareLink} style={styles.shareButton}>
            <Ionicons name="share-social-outline" size={18} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>In progress ({inProgressList.length})</Text>
        {isLoading ? (
          <ActivityIndicator size="large" color={colors.primary} />
        ) : (
          <ScrollView style={styles.scrollView}>
            {inProgressList.map((name, index) => (
              <View key={index} style={styles.card}>
                <Text style={styles.cardText}>{name}</Text>
              </View>
            ))}
          </ScrollView>
        )}
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
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: colors.linkText,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 24,
  },
  candyLoopText: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  linkContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  linkWrapper: {
    backgroundColor: colors.linkBackground,
    padding: 10,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  linkText: {
    fontSize: 14,
    color: colors.linkText,
    flex: 1,
    marginRight: 10,
    fontWeight: 'bold',
  },
  copyButton: {
    backgroundColor: colors.copyButton,
    borderRadius: 20,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 5,
  },
  shareButton: {
    backgroundColor: colors.shareButton,
    borderRadius: 20,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionContainer: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 10,
    textAlign: 'center',
  },
  scrollView: {
    maxHeight: 300,
  },
  card: {
    backgroundColor: colors.cardBackground,
    borderRadius: 30,
    padding: 15,
    marginVertical: 5,
    width: '100%',
    shadowColor: colors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  cardText: {
    fontSize: 16,
    color: colors.linkText,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
