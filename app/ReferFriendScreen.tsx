/**
 * الملف: ReferFriendScreen.tsx
 * 
 * هذه الصفحة تعرض للمستخدم رابط الإحالة الخاص به الذي يمكنه مشاركته مع الآخرين. 
 * كما تعرض قائمة بأصدقائه الذين قاموا بالتسجيل عبر رابط الإحالة ولم يقوموا بعد بتنفيذ الشراء الأول.
 * عند إتمام عملية الشراء لأول مرة من قبل أي صديق، يتم تحديث القائمة لإظهار ذلك.
 * 
 * الأجزاء الرئيسية في الصفحة:
 * - إنشاء رابط إحالة فريد لكل مستخدم.
 * - جلب بيانات الإحالات من قاعدة بيانات Firebase وعرضها في الوقت الفعلي باستخدام Listener.
 * - القدرة على نسخ رابط الإحالة إلى الحافظة.
 * - عرض قائمة "في الانتظار" التي تحتوي على أسماء الأصدقاء الذين سجلوا عبر رابط الإحالة.
 * 
 * الصفحة مرتبطة بصفحة `Profile` في التطبيق حيث يمكن للمستخدم الدخول إلى هذه الصفحة من خلال التنقل.
 * كما أن هذه الصفحة تعتمد على Firebase لجلب البيانات المرتبطة بالإحالات.
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Clipboard, Share } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // لإضافة الأيقونات
import { useNavigation } from '@react-navigation/native';
import { firebase, firestore } from '../firebaseConfig';

// الألوان المستخدمة في التطبيق
const colors = {
  primary: '#D60265', // اللون الأساسي للتطبيق
  background: '#FFF2F5', // الخلفية
  buttonText: '#FFFFFF', // نص الأزرار
  linkBackground: '#F5F5F5', // خلفية الرابط
  linkText: '#333333', // نص الرابط
  copyButton: '#4CAF50', // زر النسخ
  shareButton: '#2196F3', // زر المشاركة
};

export default function ReferFriendScreen() {
  const navigation = useNavigation(); // تحديد التنقل بين الصفحات
  const [referralLink, setReferralLink] = useState(''); // حالة لتخزين رابط الإحالة
  const [inProgressList, setInProgressList] = useState([]); // حالة لتخزين قائمة الأصدقاء في الانتظار
  const [isLoading, setIsLoading] = useState(true); // حالة لتحديد إذا كانت البيانات ما زالت محملة

  // دالة لاستخراج بيانات الإحالة من Firebase
  useEffect(() => {
    const fetchReferralLink = async () => {
      const user = firebase.auth().currentUser; // جلب بيانات المستخدم الحالي
      if (user) {
        const referralPath = `https://candyloop.com/referral/${user.uid}`; // إنشاء رابط الإحالة بناءً على UID المستخدم
        setReferralLink(referralPath); // تحديث رابط الإحالة
      }
    };

    const fetchReferralStatus = async () => {
      const user = firebase.auth().currentUser; // جلب بيانات المستخدم الحالي
      if (user) {
        const referrals = await firestore.collection('referrals').doc(user.uid).get(); // جلب بيانات الإحالات
        if (referrals.exists) {
          const data = referrals.data(); // جلب بيانات الإحالات
          setInProgressList(data?.inProgress || []); // تحديث قائمة الأصدقاء في الانتظار
        }
      }
      setIsLoading(false); // إيقاف حالة التحميل
    };

    fetchReferralLink(); // استدعاء دالة جلب رابط الإحالة
    fetchReferralStatus(); // استدعاء دالة جلب بيانات الإحالات
  }, []); // يتم تنفيذ هذا التابع مرة واحدة عند تحميل الصفحة

  /**
   * دالة لنسخ رابط الإحالة إلى الحافظة
   * ستقوم بنسخ الرابط وإظهار تنبيه للمستخدم
   */
  const handleCopyLink = () => {
    Clipboard.setString(referralLink); // نسخ الرابط إلى الحافظة
    alert('Referral link copied to clipboard!'); // عرض تنبيه يفيد بنسخ الرابط
  };

  /**
   * دالة لمشاركة رابط الإحالة عبر التطبيقات الاجتماعية
   */
  const handleShareLink = async () => {
    try {
      await Share.share({
        message: `Join CandyLoop using my referral link: ${referralLink}`, // مشاركة الرابط مع رسالة
      });
    } catch (error) {
      alert('Error sharing the link'); // في حال حدوث خطأ أثناء المشاركة
    }
  };

  return (
    <View style={styles.container}>
      {/* زر العودة إلى الصفحة السابقة */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButtonContainer}>
        <Text style={styles.backButton}>Tillbaka</Text>
      </TouchableOpacity>

      {/* عنوان الصفحة */}
      <Text style={styles.title}>Refer a Friend-belöningar</Text>
      {/* وصف كيفية استخدام رابط الإحالة */}
      <Text style={styles.description}>
        Få belöningar genom att bjuda in dina vänner till att gå med i{' '}
        <Text style={styles.candyLoopText}>CandyLoop</Text>. {'\n'}
        Du får en kupong när de registrerar sig via din länk och gör sitt första köp.
      </Text>

      {/* عرض رابط الإحالة */}
      <View style={styles.linkContainer}>
        <Text style={styles.label}>Dela din referenslänk:</Text>
        <View style={styles.linkWrapper}>
          <Text style={styles.linkText}>{referralLink}</Text>
          <View style={styles.buttonGroup}>
            {/* زر النسخ */}
            <TouchableOpacity onPress={handleCopyLink} style={styles.copyButton}>
              <Ionicons name="copy-outline" size={18} color="#FFF" style={styles.icon} />
              <Text style={styles.buttonText}>Kopiera</Text>
            </TouchableOpacity>
            {/* زر المشاركة */}
            <TouchableOpacity onPress={handleShareLink} style={styles.shareButton}>
              <Ionicons name="share-social-outline" size={18} color="#FFF" style={styles.icon} />
              <Text style={styles.buttonText}>Dela</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* عرض قائمة الأصدقاء في الانتظار */}
      <View style={styles.sectionContainer}>
        <Text style={[styles.sectionTitle,, { textAlign: 'center', alignSelf: 'center' }]}>In progress ({inProgressList.length})</Text>
        {isLoading ? (
          <Text style={[styles.placeholderText, { textAlign: 'center', alignSelf: 'center' }]}>Laddar data...</Text> // في حال كان التحميل جارياً
        ) : inProgressList.length === 0 ? (
          <View style={styles.placeholderContainer}>
            <Text style={styles.placeholderText}>Invite your friends to see progress here!</Text> {/* في حال لا يوجد أصدقاء في الانتظار */}
          </View>
        ) : (
          // عرض الأصدقاء في الانتظار
          inProgressList.map((referral, index) => (
            <Text key={index} style={styles.referralText}>{referral}</Text>
          ))
        )}
      </View>
    </View>
  );
}

// أنماط الصفحة
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.background, // تحديد الخلفية
  },
  backButtonContainer: {
    alignSelf: 'flex-start',
    marginBottom: 10, // تحديد المسافة أسفل زر العودة
  },
  backButton: {
    color: colors.primary,
    fontSize: 16, // تحديد حجم الخط
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    textAlign: 'center', // محاذاة النص في المنتصف
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: colors.linkText,
    textAlign: 'center',
    marginBottom: 20, // المسافة أسفل الوصف
    lineHeight: 24, // تحديد المسافة بين الأسطر
  },
  candyLoopText: {
    color: colors.primary,
    fontFamily: 'luckybones-bold', // استخدام الخط المطلوب
    fontSize: 20,
  },
  linkContainer: {
    width: '100%',
    marginBottom: 20, // المسافة أسفل الحاوية
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.linkText,
    marginBottom: 5, // المسافة أسفل التسمية
  },
  linkWrapper: {
    flexDirection: 'column',
    backgroundColor: colors.linkBackground,
    borderRadius: 8,
    padding: 10,
    alignItems: 'center', // محاذاة العناصر في المنتصف
  },
  linkText: {
    fontSize: 14,
    color: colors.linkText,
    marginBottom: 10, // المسافة أسفل النص
    textAlign: 'center',
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%', // تأكد من أن الحاوية تأخذ العرض الكامل
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.copyButton,
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginRight: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2, // إضافة الظلال للأزرار
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.shareButton,
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2, // إضافة الظلال للأزرار
  },
  buttonText: {
    color: colors.buttonText,
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 5, // المسافة بين الأيقونة والنص
  },
  sectionContainer: {
    marginTop: 20, // المسافة الرأسية بين الأقسام
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 10, // المسافة أسفل العنوان
  },
  placeholderContainer: {
    alignItems: 'center',
    marginTop: 10, // المسافة بين العناصر
  },
  placeholderText: {
    fontSize: 16,
    color: colors.linkText,
  },
  referralText: {
    fontSize: 16,
    color: colors.linkText,
    marginVertical: 5, // المسافة بين العناصر
  },
  icon: {
    marginRight: 5, // المسافة بين الأيقونة والنص
  },
});
