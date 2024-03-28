import TasklistList from '../components/TasklistList.jsx'
import DashboardConfigurator from '../components/DashboardConfigurator.jsx'
import '../components/TasklistList.css';
import {useState, useEffect, componentWillUnmount} from 'react';
import {
	query,
	where,
	getFirestore,
	collection,
	getDocs,
	setDoc,
	doc,
	addDoc,
	deleteDoc,
} from 'firebase/firestore';
import app from '../firebase.js';
import useUser from "../hooks/useUser";

function Dashboard() {
	const defaultPreferences = {color:"#FFFFFF"};
	//should load preferences from user doc and reflect them
	const [preferences, setPreferences] = useState(defaultPreferences);
	const db = getFirestore(app)
	const user = useUser(false);

	const updatePreferences = (prefObj) => {
		setPreferences(prefObj);
	}

	useEffect(() => {
		//load user preferences into local state
	}, [user])

	useEffect(() => {
		document.body.style.backgroundColor = preferences.color;
		return () => {
			document.body.style.backgroundColor = "#FFFFFF";
		}
	}, [preferences]);



	return (
		<div>
			<DashboardConfigurator initialPreference={preferences} preferenceCallback={updatePreferences}/>
			<TasklistList/>
		</div>
	)
}

export default Dashboard;
