// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBUeJeTLIACj6WP8XAfkYkBbVJqQReO0SY",
  authDomain: "devfest-2024-64eb1.firebaseapp.com",
  projectId: "devfest-2024-64eb1",
  storageBucket: "devfest-2024-64eb1.appspot.com",
  messagingSenderId: "940154441436",
  appId: "1:940154441436:web:f23cf742f2c14fcc132e19",
  measurementId: "G-GMNG13FRZ8",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
export { auth, db };
