/**
 * الملف: Profile.tsx
 * 
 * هذا الملف يحتوي على الصفحة الخاصة بملف المستخدم في تطبيق CandyLoop، حيث تعرض هذه الصفحة بيانات المستخدم
 * مثل الرقم الشخصي (kundnummer)، الاسم، رقم الهاتف، والبريد الإلكتروني. كما يحتوي على خيارات لتسجيل الخروج،
 * حذف الحساب، والاطلاع على العروض والكوبونات المتعلقة بالمستخدم.
 * 
 * الأجزاء الرئيسية في الصفحة:
 * - استرجاع بيانات المستخدم من قاعدة البيانات Firebase وعرضها.
 * - إمكانية حذف الحساب مع تنبيه لتأكيد الحذف.
 * - إمكانية تسجيل الخروج مع تنبيه لتأكيد الخروج.
 * - روابط لصفحات "إحالة صديق" و "مراقبة الكوبونات".
 * - التعامل مع التنبيهات الخاصة بمختلف العمليات.
 * 
 * يعرض هذا الملف المعلومات بناءً على حالة تسجيل دخول المستخدم، ويجب أن يكون المستخدم قد سجل دخوله باستخدام Firebase.
 * إذا لم يكن المستخدم قد سجل دخوله، فسيتم إعادة توجيهه إلى شاشة التسجيل أو تسجيل الدخول.
 */

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { firebase, firestore } from '../../firebaseConfig'; // استيراد Firebase والFirestore لإدارة المستخدمين.
import { useNavigation, NavigationProp } from '@react-navigation/native'; // استخدام التنقل بين الصفحات
import { RootStackParamList } from '../../types'; // تعريف قائمة الصفحات للتنقل.
import { useAuth } from '../../context/AuthContext'; // جلب البيانات المتعلقة بالمستخدم من سياق التسجيل.

const colors = {
  primary: '#D60265', // اللون الأساسي للتطبيق
  background: '#f5f5f5', // الخلفية
  buttonText: '#ffffff', // نص الأزرار
};

export default function Profile() {
  // تحديد التنقل في التطبيق
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  // جلب بيانات المستخدم من سياق التسجيل
  const { user } = useAuth();

  // استخدام state لتخزين بيانات المستخدم
  const [userData, setUserData] = useState({ kundnummer: '', name: '', phone: '', email: '' });

  /**
   * تخصيص التنبيه لعرض رسالة تأكيد بألوان خاصة
   * @param {string} title - عنوان التنبيه
   * @param {string} message - نص الرسالة
   * @param {Function} onConfirm - وظيفة سيتم استدعاؤها عند تأكيد العملية
   */
  const showCustomAlert = (title: string, message: string, onConfirm: () => void) => {
    Alert.alert(
      title,
      message,
      [
        {
          text: 'Nej', // خيار لإلغاء العملية
          style: 'cancel',
        },
        {
          text: 'Ja', // خيار لتأكيد العملية
          style: 'destructive',
          onPress: onConfirm, // استدعاء الدالة عند الضغط على "نعم"
        },
      ],
      {
        cancelable: true, // السماح بإلغاء التنبيه
      }
    );
  };

  /**
   * وظيفة لحذف الحساب بعد التأكيد من المستخدم
   * ستتم العملية عن طريق Firebase
   */
  const handleDeleteAccount = () => {
    showCustomAlert(
      'Bekräfta borttagning', // عنوان التنبيه
      'Är du säker på att du vill ta bort kontot?', // رسالة التنبيه
      () => {
        if (user) {
          firebase.auth().currentUser?.delete().then(() => { // حذف حساب المستخدم
            Alert.alert(
              'Kontot borttaget',
              'Ditt konto har tagits bort.',
              [{ text: 'OK', style: 'default' }],
              {
                cancelable: true,
              }
            );
            navigation.reset({ // إعادة التوجيه إلى صفحة التسجيل بعد الحذف
              index: 0,
              routes: [{ name: 'SignUpScreen' }],
            });
          }).catch((error: Error) => {
            Alert.alert('Fel vid borttagning av konto', error.message); // في حال حدوث خطأ
          });
        }
      }
    );
  };

  /**
   * وظيفة لتسجيل الخروج وإعادة التوجيه إلى شاشة Mina Sidor
   */
  const handleLogout = () => {
    firebase.auth().signOut().then(() => {
      Alert.alert(
        'Utloggad',
        'Du har loggats ut.',
        [
          {
            text: 'OK',
            style: 'default',
          },
        ],
        {
          cancelable: true,
        }
      );
      navigation.reset({
        index: 0,
        routes: [{ name: 'MainTabs' }], // إعادة التوجيه إلى الشاشة الرئيسية
      });
    }).catch((error: Error) => {
      Alert.alert('Fel vid utloggning', error.message);
    });
  };
  

  /**
   * استخدام useEffect لجلب بيانات المستخدم من قاعدة بيانات Firebase
   * وتحديث حالة الواجهة عند تحميل البيانات
   */
  useEffect(() => {
    if (user) { // التأكد من وجود المستخدم
      const fetchUserData = async () => {
        try {
          const userDoc = await firestore.collection('users').doc(user.uid).get(); // جلب بيانات المستخدم
          if (userDoc.exists) {
            const data = userDoc.data();
            setUserData({
              kundnummer: data?.kundnummer || '',
              name: `${data?.firstName || ''} ${data?.lastName || ''}`,
              phone: data?.phone || '',
              email: data?.email || '',
            });
          } else {
            Alert.alert('Fel', 'Kunde inte hitta användarens data.'); // إذا لم يتم العثور على البيانات
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          Alert.alert('Fel', 'Det gick inte att hämta användarens data.'); // في حال حدوث خطأ في جلب البيانات
        }
      };

      fetchUserData();
    } else { // إعادة التوجيه إلى صفحة تسجيل الدخول إذا لم يكن هناك مستخدم
      navigation.reset({
        index: 0,
        routes: [{ name: 'LoginScreen' }],
      });
    }
  }, [user]); // إعادة تنفيذ الوظيفة إذا تغيرت بيانات المستخدم

  return (
    <View style={styles.container}>
      {/* عرض بيانات المستخدم */}
      <Text style={styles.label}>Kundnummer: {userData.kundnummer}</Text>
      <Text style={styles.label}>Namn: {userData.name}</Text>
      <Text style={styles.label}>E-post: {userData.email}</Text>
      <Text style={styles.label}>Mobilnr: {userData.phone}</Text>

      <Text style={styles.sectionTitle}>Refer a friend-belöningar</Text>
      <TouchableOpacity style={[styles.button, styles.referButton]} onPress={() => navigation.navigate('ReferFriendScreen')}>
        <Text style={styles.buttonText}>REFER A FRIEND</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Mina kuponger</Text>
      <TouchableOpacity style={[styles.button, styles.couponButton]} onPress={() => console.log('Visa kuponger')}>
        <Text style={styles.buttonText}>VISA KUPONGER</Text>
      </TouchableOpacity>

      <View style={styles.actionButtonsContainer}>
        {/* أزرار تسجيل الخروج وحذف الحساب */}
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

// تحديد أنماط الصفحة
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.background,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
    color: '#000',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 20,
    marginBottom: 10,
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
  referButton: {
    backgroundColor: colors.primary,
  },
  couponButton: {
    backgroundColor: colors.primary,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 100,
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
