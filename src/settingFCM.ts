// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getMessaging } from 'firebase/messaging';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyDsM4hePgL7i58NCZvInHGxB5hbX75Q2bY',
  authDomain: 'safemap-472fd.firebaseapp.com',
  projectId: 'safemap-472fd',
  storageBucket: 'safemap-472fd.firebasestorage.app',
  messagingSenderId: '931327955321',
  appId: '1:931327955321:web:0fa76a03c989d3ff835fa8',
  measurementId: 'G-T6YBR8E44Y',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);
