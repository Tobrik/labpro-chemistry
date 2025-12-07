// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD2db6FHDkQyxd6rsfBxSszR_UkwtF5rSw",
  authDomain: "labpro1234.firebaseapp.com",
  projectId: "labpro1234",
  storageBucket: "labpro1234.firebasestorage.app",
  messagingSenderId: "493142321848",
  appId: "1:493142321848:web:7308634c1135c70f19624d",
  measurementId: "G-KNHVTCL46L"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);