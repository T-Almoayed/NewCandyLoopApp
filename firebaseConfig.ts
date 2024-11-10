// firebaseConfig.ts
import firebase from 'firebase/compat/app'; // استيراد firebase من compat
import 'firebase/compat/auth'; // استيراد مكتبة المصادقة من compat

const firebaseConfig = {
  apiKey: "AIzaSyC1_D-mYzt8hldJGCcxnikQNASx2HcXwGw",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export { firebase };
