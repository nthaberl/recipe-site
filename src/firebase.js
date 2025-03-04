// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBsDWDoQlTVihX6LzoRgPSWGpzH4lsHFMU",
    authDomain: "recipes-17e8a.firebaseapp.com",
    projectId: "recipes-17e8a",
    storageBucket: "recipes-17e8a.firebasestorage.app",
    messagingSenderId: "667768703500",
    appId: "1:667768703500:web:94fe520e4ff5d312e57c29"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);