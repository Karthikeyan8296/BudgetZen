// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCTX976S05K7akxiliPOJde2J_rIesyz7k",
  authDomain: "budgetzen-daa1c.firebaseapp.com",
  projectId: "budgetzen-daa1c",
  storageBucket: "budgetzen-daa1c.firebasestorage.app",
  messagingSenderId: "1066701405490",
  appId: "1:1066701405490:web:adad30d1794d9c46b3eb2b",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

//auth
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

//database
export const firestore = getFirestore(app);
