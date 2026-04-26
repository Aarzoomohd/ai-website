// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import {getAuth, GoogleAuthProvider} from "firebase/auth"

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "aiwebsite-e10a5.firebaseapp.com",
  projectId: "aiwebsite-e10a5",
  storageBucket: "aiwebsite-e10a5.firebasestorage.app",
  messagingSenderId: "1054702358746",
  appId: "1:1054702358746:web:dded933d910065498795e3",
  measurementId: "G-QBM1F0X51S"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const auth=getAuth(app)
const provider=new GoogleAuthProvider()

export {auth,provider}

