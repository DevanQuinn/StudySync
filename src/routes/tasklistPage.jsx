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
import TreeDisplayBanner from '../components/treeDisplayBanner.jsx';
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
		var username;
		if (user) { //if logged in
			const q = query(collection(db, "users"), where("userID", "==", user.uid)); //set up username query
			getDocs(q).then(userssnapshot => { //get username
				userssnapshot.forEach(user => { //should only run once if userIDs are unique
					username = user.data().username; //save username
				})
			}).then(() => { //with username
				const docRef = doc(db, 'users', username); //find user object. Usernames should be unique.
				setDoc(docRef, {preferences:preferences}, {merge:true}); //update preferences
			})
		}
	}

	const updatePreferences = prefObj => { //callback for configurator panel
		savePreferences(prefObj);
		setPreferences(prefObj);
	};


	useEffect(() => { //loads user preferences
		var username;
		if (user) { //if logged in
			const q = query(collection(db, "users"), where("userID", "==", user.uid)); //get user
			getDocs(q).then(userssnapshot => {
				userssnapshot.forEach(user => { //should only run once if userID is unique
					console.log(user.data().username);
					username = user.data().username;
				})
			}).then(() => { //with username
				const docRef = doc(db, 'users', username); //find user object. usernames should be unique
				setDoc(docRef, {}, {merge:true}).then(() => { //ensure that user object exists before trying to write to its properties
					getDoc(docRef).then((doc) => { //get that users properties
						setPreferences({color:doc.data().preferences.color}); //set the frontends properties equal to the database properties
					})
				})
			})
		}
	}, [user])

	useEffect(() => { //dynamically update user page based on properties change
		document.body.style.backgroundColor = preferences.color;
		return () => { //cleanup function to return background to default color on page unmount
			document.body.style.backgroundColor = "#FFFFFF";
		}
	}, [preferences]);

	return (
		<div>
			<Fab color="primary" aria-label="add" onClick={togglePomodoro} style={{
				position: "fixed",
				bottom: 10,
				right: 10
				}}>
				<AddIcon />
			</Fab>
			<Slide direction="up" in={showPomodoro} mountOnEnter unmountOnExit>
       		 	<Box sx={{ position: 'fixed', bottom: 60, right: 0, zIndex: 1100 }}><RoomPomodoro /></Box>
      		</Slide>
			<DashboardConfigurator initialPreference={preferences} preferenceCallback={updatePreferences}/>
			<TasklistList className="component-wrapper"/>
			<TreeDisplayBanner inittrees={[0,0,0,0,0]}/>
		</div>
		
	)
}

export default TasklistsPage;
