import { useEffect } from 'react';
import { initializeApp } from 'firebase/app';

const FirebaseProvider = () => {
	const firebaseConfig = {
		apiKey: 'AIzaSyAOLFu9q6gvdcDoOJ0oPuQKPgDyOye_2uM',
		authDomain: 'studysync-3fbd7.firebaseapp.com',
		projectId: 'studysync-3fbd7',
		storageBucket: 'studysync-3fbd7.appspot.com',
		messagingSenderId: '885216959280',
		appId: '1:885216959280:web:917a7216776b36e904c6f5',
		measurementId: 'G-TS13EWHRMB',
	};

	useEffect(() => {
		const app = initializeApp(firebaseConfig);
		console.log(`Firebase app ${app.name} initialized.`);
	}, []);
};

export default FirebaseProvider;
