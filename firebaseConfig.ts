// firebaseConfig.ts
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyC1_D-mYzt8hldJGCcxnikQNASx2HcXwGw",
  authDomain: "candyloop-f8567.firebaseapp.com",
  projectId: "candyloop-f8567",
  storageBucket: "candyloop-f8567.appspot.com",
  messagingSenderId: "381555635155",
  appId: "1:381555635155:android:180c332325bca44fb3b526",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const firestore = firebase.firestore();

export { firebase, firestore };
