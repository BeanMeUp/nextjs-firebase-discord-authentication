// Import the functions you need from the SDKs you need
import { getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBCQ-VgzaiKm8Ve2gMZgHOrb0E7p-BQNpE",
    authDomain: "discordauthexample.firebaseapp.com",
    projectId: "discordauthexample",
    storageBucket: "discordauthexample.appspot.com",
    messagingSenderId: "937480326760",
    appId: "1:937480326760:web:7318c7d0b8995262d235dd",
};

// Initialize Firebase
let app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);
const auth = getAuth(app);

export { auth, db, app };
export default db;
