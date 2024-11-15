import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyB3MH_dVwn9UtHVoQCOMjYCeEEG46LT83g",
    authDomain: "ecommerce-data-2024.firebaseapp.com",
    databaseURL: "https://ecommerce-data-2024-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "ecommerce-data-2024",
    storageBucket: "ecommerce-data-2024.firebasestorage.app",
    messagingSenderId: "690377737319",
    appId: "1:690377737319:web:01119fe675f9dcaa35c0c2",
    measurementId: "G-MJ3VY2X55W"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase(app); 

export { app, analytics, database };