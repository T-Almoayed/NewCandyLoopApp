/**
 * الملف: ReferFriendScreen.tsx
 * 
 * الهدف:
 * - عرض رابط الإحالة الخاص بالمستخدم.
 * - جلب قائمة الأصدقاء الذين سجلوا عبر رابط الإحالة ولم يكملوا أول عملية شراء.
 * - تحديث البيانات في الوقت الفعلي باستخدام Firestore.
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, Share } from 'react-native'; // إضافة ActivityIndicator وShare
import { Ionicons } from '@expo/vector-icons'; // الأيقونات
import { firebase, firestore } from '../firebaseConfig'; // Firebase

// الألوان المستخدمة
const colors = {
  primary: '#D60265', // اللون الأساسي
  background: '#FFF2F5', // لون الخلفية
  buttonText: '#FFFFFF', // لون نص الأزرار
  linkBackground: '#F5F5F5', // خلفية الرابط
  linkText: '#333333', // لون النص
  copyButton: '#4CAF50', // لون زر النسخ
  shareButton: '#2196F3', // لون زر المشاركة
};

export default function ReferFriendScreen() {
  const [referralLink, setReferralLink] = useState(''); // رابط الإحالة
  const [inProgressList, setInProgressList] = useState([]); // قائمة الأصدقاء
  const [isLoading, setIsLoading] = useState(true); // حالة التحميل

  // جلب البيانات من Firestore
  useEffect(() => {
    const fetchReferralData = () => {
      const user = firebase.auth().currentUser;

      if (user) {
        console.log("Current User UID:", user.uid); // عرض معرف المستخدم في السجلات

        // إنشاء رابط الإحالة
        const referralPath = `https://candyloop.com/referral/${user.uid}`;
        setReferralLink(referralPath);

        // Listener لجلب البيانات في الوقت الفعلي
        const referralRef = firestore.collection('referrals').doc(user.uid);

        const unsubscribe = referralRef.onSnapshot(
          (doc) => {
            if (doc.exists) {
              const data = doc.data();
              console.log("Data fetched from Firestore:", data); // عرض البيانات في السجلات
              setInProgressList(data?.inProgress || []); // تحديث قائمة inProgress
            } else {
              console.log("No document found for this user."); // إذا لم يتم العثور على مستند
            }
            setIsLoading(false); // إيقاف حالة التحميل
          },
          (error) => {
            console.error("Error fetching Firestore data:", error); // عرض الخطأ في حال حدوث مشكلة
            setIsLoading(false);
          }
        );

        return () => unsubscribe(); // إلغاء الاشتراك عند مغادرة الشاشة
      } else {
        console.log("User is not authenticated.");
        setIsLoading(false);
      }
    };

    fetchReferralData();
  }, []);

  // دالة نسخ الرابط
  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    Alert.alert('Kopierad!', 'Referenslänk kopierad till urklipp!');
  };

  // دالة مشاركة الرابط
  const handleShareLink = async () => {
    try {
      await Share.share({
        message: `Gå med i CandyLoop med min referenslänk: ${referralLink}`,
      });
    } catch (error) {
      Alert.alert('Fel', 'Kunde inte dela länken.');
    }
  };

  return (
    <View style={styles.container}>
      {/* عنوان الصفحة */}
      <Text style={styles.title}>Refer a Friend-belöningar</Text>

      {/* وصف الإحالة */}
      <Text style={styles.description}>
        Få belöningar genom att bjuda in dina vänner till att gå med i{' '}
        <Text style={styles.candyLoopText}>CandyLoop</Text>. {'\n'}
        Du får en kupong när de registrerar sig via din länk och gör sitt första köp.
      </Text>

      {/* رابط الإحالة */}
      <View style={styles.linkContainer}>
        <Text style={styles.label}>Dela din referenslänk:</Text>
        <View style={styles.linkWrapper}>
          <Text style={styles.linkText}>{referralLink}</Text>
          <View style={styles.buttonGroup}>
            <TouchableOpacity onPress={handleCopyLink} style={styles.copyButton}>
              <Ionicons name="copy-outline" size={18} color="#FFF" />
              <Text style={styles.buttonText}>Kopiera</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleShareLink} style={styles.shareButton}>
              <Ionicons name="share-social-outline" size={18} color="#FFF" />
              <Text style={styles.buttonText}>Dela</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* قائمة الأصدقاء في الانتظار */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>In progress ({inProgressList.length})</Text>
        {isLoading ? (
          <ActivityIndicator size="large" color={colors.primary} /> // مؤشر التحميل
        ) : inProgressList.length === 0 ? (
          <View style={styles.placeholderContainer}>
            <Text style={styles.placeholderText}>
              Invite your friends to see progress here!
            </Text>
          </View>
        ) : (
          inProgressList.map((referral, index) => (
            <Text key={index} style={styles.referralText}>
              {referral}
            </Text>
          ))
        )}
      </View>
    </View>
  );
}

// الأنماط
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
  },
  linkText: {
    fontSize: 14,
    color: colors.linkText,
    marginBottom: 10,
    textAlign: 'center',
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.copyButton,
    borderRadius: 5,
    padding: 10,
    marginRight: 5,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.shareButton,
    borderRadius: 5,
    padding: 10,
  },
  buttonText: {
    color: colors.buttonText,
    fontSize: 14,
    marginLeft: 5,
  },
  sectionContainer: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 10,
  },
  placeholderContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    fontSize: 16,
    color: colors.linkText,
  },
  referralText: {
    fontSize: 16,
    color: colors.linkText,
    marginVertical: 5,
  },
});
