// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: import.meta.env.REACT_APP_apiKey,
	authDomain: import.meta.env.REACT_APP_authDomain,
	projectId: import.meta.env.REACT_APP_projectId,
	storageBucket: import.meta.env.REACT_APP_storageBucket,
	messagingSenderId: import.meta.env.REACT_APP_messagingSenderId,
	appId: import.meta.env.REACT_APP_appId,
};

// Initialize Firebase
export default initializeApp(firebaseConfig);
