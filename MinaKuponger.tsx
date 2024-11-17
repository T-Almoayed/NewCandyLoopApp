import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { firebase, firestore } from './firebaseConfig'; // استيراد Firebase
import { useNavigation } from '@react-navigation/native';

const colors = {
  primary: '#D60265',
  background: '#FFFFFF',
  text: '#333333',
  couponBackground: '#F5F5F5',
};

// تعريف نوع الكوبون
type Coupon = {
  id: string;
  code: string;
  value: number;
  createdAt: { seconds: number; nanoseconds: number }; // نوع التاريخ من Firebase
};

export default function MinaKuponger() {
  const [coupons, setCoupons] = useState<Coupon[]>([]); // تحديد نوع حالة الكوبونات
  const navigation = useNavigation();

  useEffect(() => {
    const fetchCoupons = async () => {
      const user = firebase.auth().currentUser; // التحقق من المستخدم
      if (user) {
        // جلب الكوبونات الخاصة بالمستخدم من قاعدة البيانات
        const couponsSnapshot = await firestore
          .collection('coupons')
          .where('userId', '==', user.uid)
          .get();

        const userCoupons = couponsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Coupon[]; // تأكيد النوع على أنه Coupon[]
        setCoupons(userCoupons); // تحديث حالة الكوبونات
      }
    };

    fetchCoupons(); // استدعاء الوظيفة عند تحميل الشاشة
  }, []);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButtonContainer}>
        <Text style={styles.backButton}>Tillbaka</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Mina Kuponger</Text>
      {coupons.length === 0 ? (
        <Text style={styles.placeholderText}>Du har inga kuponger just nu.</Text> // عرض رسالة إذا لم توجد كوبونات
      ) : (
        <FlatList
          data={coupons}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.couponContainer}>
              <Text style={styles.couponText}>Kod: {item.code}</Text>
              <Text style={styles.couponText}>Värde: {item.value} SEK</Text>
              <Text style={styles.couponText}>
                Utfärdad: {new Date(item.createdAt.seconds * 1000).toLocaleDateString()}
              </Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.background,
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
    marginBottom: 20,
    textAlign: 'center',
  },
  placeholderText: {
    fontSize: 16,
    color: colors.text,
    textAlign: 'center',
  },
  couponContainer: {
    backgroundColor: colors.couponBackground,
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
  },
  couponText: {
    fontSize: 16,
    color: colors.text,
  },
});
