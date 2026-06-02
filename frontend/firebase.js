// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "ecommerce-2-5ac5c.firebaseapp.com",
  projectId: "ecommerce-2-5ac5c",
  storageBucket: "ecommerce-2-5ac5c.firebasestorage.app",
  messagingSenderId: "404915181217",
  appId: "1:404915181217:web:0702a512ccebe449cc82e0"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);