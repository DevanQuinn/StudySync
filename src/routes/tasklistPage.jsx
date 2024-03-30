import React, {useState, useEffect} from 'react'
import DashboardConfigurator from '../components/DashboardConfigurator.jsx'
import TasklistList from '../components/TasklistList.jsx'
import RoomPomodoro from '../components/RoomPomodoro.jsx';
import AddIcon from '@mui/icons-material/Add';
import { Fab, Box, Slide } from '@mui/material';
import {
	query,
	where,
	getFirestore,
	collection,
	getDocs,
	getDoc,
	setDoc,
	doc,
	addDoc,
	deleteDoc,
} from 'firebase/firestore';
import app from '../firebase.js';
import useUser from '../hooks/useUser.jsx';
import '../components/tasklistlist.css';
/*
TODO LIST:
	* store all tasks in the dashboard component and pass as props the relevant tasks to the tasklist
	* debug the above procedure
*/

function TasklistsPage() {
	const [showPomodoro, setShowPomodoro] = useState(false);
	const togglePomodoro = () => setShowPomodoro(!showPomodoro);
	const defaultPreferences = {color:"#FFFFFF"};
	//should load preferences from user doc and reflect them
	const [preferences, setPreferences] = useState(defaultPreferences);
	const db = getFirestore(app)
	const user = useUser(false);

	const savePreferences = () => {
		if (user) {
			const docRef = doc(db, 'users', user.uid);
			console.log("saving user prefs");
			console.log(preferences);
			setDoc(docRef, {preferences:preferences}, {merge:true});
		}
	}

	const updatePreferences = prefObj => {
		savePreferences(prefObj);
		setPreferences(prefObj);
	};


	useEffect(() => {
		if (user) {
			const docRef = doc(db, 'users', user.uid);
			setDoc(docRef, {}, {merge:true}).then(() => {
				getDoc(docRef).then((doc) => {
					setPreferences({color:doc.data().preferences.color});
				})
			})
		}
	}, [user])

	useEffect(() => {
		document.body.style.backgroundColor = preferences.color;
		return () => {
			document.body.style.backgroundColor = "#FFFFFF";
		}
	}, [preferences]);

	return (
		<div>
			<Fab color="primary" aria-label="add" onClick={togglePomodoro} sx={{top: 450, left: 675 }}>
				<AddIcon />
			</Fab>
			<Slide direction="up" in={showPomodoro} mountOnEnter unmountOnExit>
       		 	<Box sx={{ position: 'fixed', bottom: 60, right: 0, zIndex: 1100 }}><RoomPomodoro /></Box>
      		</Slide>
			<DashboardConfigurator initialPreference={preferences} preferenceCallback={updatePreferences}/>
			<TasklistList className="component-wrapper"/>	
		</div>
		
	)
}

export default TasklistsPage;
