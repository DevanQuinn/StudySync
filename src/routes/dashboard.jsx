import React, {useState, useEffect} from 'react'
import DashboardConfigurator from '../components/DashboardConfigurator.jsx'
import TasklistList from '../components/TasklistList.jsx'
import RoomPomodoro from '../components/RoomPomodoro.jsx';
import AddIcon from '@mui/icons-material/Add';
import { Fab, Box, Slide } from '@mui/material';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
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
import useUser from '../hooks/useUser';
import '../components/tasklistlist.css';
/*
TODO LIST:
	* store all tasks in the dashboard component and pass as props the relevant tasks to the tasklist
	* debug the above procedure
*/

function Dashboard() {
	const [showPomodoro, setShowPomodoro] = useState(false);
	const [showTask, setShowTask] = useState(false);
	const togglePomodoro = () => setShowPomodoro(!showPomodoro);
	const toggleTask = () => setShowTask(!showTask);
	const defaultPreferences = {color:"#FFFFFF"};
	//should load preferences from user doc and reflect them
	const [preferences, setPreferences] = useState(defaultPreferences);
	const [anchorEl, setAnchorEl] = useState(null);
  	const open = Boolean(anchorEl);
  	const handleClick = (event) => {   
		setAnchorEl(event.currentTarget);
  	};
  	const handleClosePomo = () => {
		togglePomodoro();
    	setAnchorEl(null);
  	};
	const handleCloseTask = () => {
		toggleTask();
    	setAnchorEl(null);
  	};
	const handleClose = () => {
    	setAnchorEl(null);
  	};
	const db = getFirestore(app)
	const user = useUser(false);

	const updatePreferences = prefObj => {
		setPreferences(prefObj);
	};

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
			<Fab color="primary" aria-label="add"    id="basic-button"
				aria-controls={open ? 'basic-menu' : undefined}
				aria-haspopup="true"
				aria-expanded={open ? 'true' : undefined}
				onClick={handleClick} 
				sx={{ position: 'fixed', top: 100, right:  100}}>
				<AddIcon />
			</Fab>
			<Menu
				id="basic-menu"
				anchorEl={anchorEl}
				open={open}
				onClose={handleClose}
				MenuListProps={{
				'aria-labelledby': 'basic-button',
				}}>
				<MenuItem onClick={handleCloseTask}>Tasklist</MenuItem>
				<MenuItem onClick={handleClosePomo}>Pomodoro Timer</MenuItem>
      		</Menu>
			<Slide direction="up" in={showPomodoro} mountOnEnter unmountOnExit>
       		 	<Box sx={{ position: 'fixed', bottom: 60, right: 0, zIndex: 1100 }}><RoomPomodoro /></Box>
      		</Slide>
			<DashboardConfigurator initialPreference={preferences} preferenceCallback={updatePreferences}/>
			<Slide direction="up" in={showTask} mountOnEnter unmountOnExit>
       		 	<Box><TasklistList className="component-wrapper"/></Box>
      		</Slide>
		</div>
		
	)
}

export default Dashboard;
