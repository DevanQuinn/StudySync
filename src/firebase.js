// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

console.log("Imports worked");

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAOLFu9q6gvdcDoOJ0oPuQKPgDyOye_2uM",
  authDomain: "studysync-3fbd7.firebaseapp.com",
  projectId: "studysync-3fbd7",
  storageBucket: "studysync-3fbd7.appspot.com",
  messagingSenderId: "885216959280",
  appId: "1:885216959280:web:8192435e7a6433d104c6f5",
  measurementId: "G-3X6VT6TSTB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firestore
const db = getFirestore(app);
console.log("Right before export in firebase.js");
export { app, analytics, db };
