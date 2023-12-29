// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Fi rebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDksMImzsz8ZExOwkJejOG8Cyv7f20CEHs",
  authDomain: "podcast-platform-b5f3c.firebaseapp.com",
  projectId: "podcast-platform-b5f3c",
  storageBucket: "podcast-platform-b5f3c.appspot.com",
  messagingSenderId: "1067698755937",
  appId: "1:1067698755937:web:0478afb24a2d28e94a4d20",
  measurementId: "G-843NVFBS92"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db  = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);
export {auth,db,storage};