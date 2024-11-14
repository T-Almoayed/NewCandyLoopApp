// ReferFriendScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Clipboard } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { firebase, firestore } from '../firebaseConfig';

const colors = {
  primary: '#D60265',
  background: '#FFFFFF',
  buttonText: '#ffffff',
  linkBackground: '#F5F5F5',
  linkText: '#333333',
};

export default function ReferFriendScreen() {
  const navigation = useNavigation();
  const [referralLink, setReferralLink] = useState('');
  const [inProgressList, setInProgressList] = useState([]);

  useEffect(() => {
    const fetchReferralLink = async () => {
      const user = firebase.auth().currentUser;
      if (user) {
        const referralPath = `https://candyloop.com/referral/${user.uid}`;
        setReferralLink(referralPath);
      }
    };

    const fetchReferralStatus = async () => {
      const user = firebase.auth().currentUser;
      if (user) {
        const referrals = await firestore.collection('referrals').doc(user.uid).get();
        if (referrals.exists) {
          const data = referrals.data();
          setInProgressList(data?.inProgress || []);
        }
      }
    };

    fetchReferralLink();
    fetchReferralStatus();
  }, []);

  const handleCopyLink = () => {
    Clipboard.setString(referralLink);
    alert('Referral link copied to clipboard!');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButtonContainer}>
        <Text style={styles.backButton}>Tillbaka</Text>
      </TouchableOpacity>
      
      <Text style={styles.title}>Refer a Friend-belöningar</Text>
      <Text style={styles.description}>
  Få belöningar genom att bjuda in dina vänner till att gå med i{' '}
  <Text style={styles.candyLoopText}>CandyLoop</Text>.
  {'\n'}Du får en kupong när de registrerar sig via din länk och gör sitt första köp.
</Text>

      <View style={styles.linkContainer}>
        <Text style={styles.label}>Dela din referenslänk</Text>
        <TouchableOpacity onPress={handleCopyLink} style={styles.linkButton}>
          <Text style={styles.linkText}>{referralLink}</Text>
          <Text style={styles.copyText}>Kopiera</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>In progress ({inProgressList.length})</Text>
        {inProgressList.length === 0 && (
          <View style={styles.placeholderContainer}>
            <Text style={styles.placeholderText}>Invite your friends to see progress here!</Text>
          </View>
        )}
        {inProgressList.map((referral, index) => (
          <Text key={index} style={styles.referralText}>{referral}</Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.background,
    alignItems: 'center',
  },
  backButtonContainer: {
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  backButton: {
    color: colors.primary,
    fontSize: 16,
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
    fontFamily: 'luckybones-bold',
  },
  linkContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.linkText,
    marginBottom: 5,
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: colors.linkBackground,
    borderRadius: 8,
    width: '100%',
  },
  linkText: {
    fontSize: 14,
    color: colors.linkText,
    flex: 1,
  },
  copyText: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  sectionContainer: {
    marginTop: 20,
    alignItems: 'center',
    width: '100%',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 10,
    textAlign: 'center',
  },
  placeholderContainer: {
    backgroundColor: colors.linkBackground,
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  placeholderText: {
    fontSize: 16,
    color: colors.linkText,
    textAlign: 'center',
  },
  referralText: {
    fontSize: 16,
    color: colors.linkText,
    marginVertical: 5,
  },
});
