import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; 


const firebaseConfig = {
    apiKey: "AIzaSyDMtIWPCWHq2QPBAV4EYmWA4F1hqN3wdNc",
    authDomain: "foodmate-2d2d9.firebaseapp.com",
    projectId: "foodmate-2d2d9",
    storageBucket: "foodmate-2d2d9.firebasestorage.app",
    messagingSenderId: "641232150320",
    appId: "1:641232150320:web:4c443fcc9693257b6cf2f5"
};


const app = initializeApp(firebaseConfig);


export const auth = getAuth(app);