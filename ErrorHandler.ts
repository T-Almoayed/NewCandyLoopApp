import { Alert } from 'react-native';

/**
 * إدارة الأخطاء باستخدام تنسيق مخصص يعرض رسائل للمطورين في بيئة التطوير
 * ورسائل بسيطة للمستخدمين في بيئة الإنتاج.
 *
 * @param error - الخطأ الذي حدث
 * @param userFriendlyMessage - الرسالة المخصصة التي ستظهر للمستخدم
 */
export function handleError(error: any, userFriendlyMessage: string = 'Något gick fel. Försök igen.') {
  if (__DEV__) {
    // عرض تفاصيل الخطأ في وحدة التحكم أثناء التطوير
    console.error('App Error:', error.message || error);
  }

  // عرض رسالة خطأ للمستخدم
  Alert.alert(
    'Fel',
    userFriendlyMessage,
    [{ text: 'OK', style: 'default' }],
    { cancelable: true }
  );
}
