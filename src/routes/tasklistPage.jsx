import React, { useState, useEffect } from 'react'
import DashboardConfigurator from '../components/DashboardConfigurator.jsx'
import TasklistList from '../components/TasklistList.jsx'
import RoomPomodoro from '../components/RoomPomodoro.jsx';
import AddIcon from '@mui/icons-material/Add';
import { Fab, Box, Slide } from '@mui/material';
import Menu from '@mui/material/Menu';
import { Link } from 'react-router-dom';
import MenuItem from '@mui/material/MenuItem';
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
import {
	TableContainer,
	Table,
	TableHead,
	TableRow,
	TableCell,
	Paper,
} from '@mui/material';
import app from '../firebase.js';
import useUser from '../hooks/useUser.jsx';
import '../components/tasklistlist.css';
import TreeDisplayBanner from '../components/treeDisplayBanner.jsx';
import TreeDisplaySelector from '../components/treeDisplaySelector.jsx';

function TasklistsPage() {
	const [showPomodoro, setShowPomodoro] = useState(false);
	const togglePomodoro = () => setShowPomodoro(!showPomodoro);
	const [showTask, setShowTask] = useState(false);
	const toggleTask = () => setShowTask(!showTask);
	const defaultPreferences = { color: "#FFFFFF" };
	//should load preferences from user doc and reflect them
	const [preferences, setPreferences] = useState(defaultPreferences);
	const db = getFirestore(app)
	const user = useUser();
	const [favorites, setFavorites] = useState([]);
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
				setDoc(docRef, { preferences: preferences }, { merge: true }); //update preferences
			})
		}
	}

	const updatePreferences = prefObj => { //callback for configurator panel
		savePreferences(prefObj);
		setPreferences(prefObj);
	};

	const fetchFav = async () => {
		const docRef = doc(db, "users", user.displayName);
		const q = await getDoc(docRef);
		const data = q.data();
		const favArr = data.favorites;
		setFavorites(favArr);
	};


	useEffect(() => { //loads user preferences
		var username;
		if (user) { //if logged in
			const q = query(collection(db, "users"), where("userID", "==", user.uid)); //get user
			getDocs(q).then(userssnapshot => {
				userssnapshot.forEach(user => { //should only run once if userID is unique
					username = user.data().username;
				})
			}).then(() => { //with username
				const docRef = doc(db, 'users', username); //find user object. usernames should be unique
				setDoc(docRef, {}, { merge: true }).then(() => { //ensure that user object exists before trying to write to its properties
					getDoc(docRef).then((doc) => { //get that users properties
						if (doc.data().preferences != undefined) {
							setPreferences({ color: doc.data().preferences.color }); //set the frontends properties equal to the database properties
						}
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

	useEffect(() => {
		fetchFav();
	}, [user])


	return (
		<div className="tasklist-page-wrapper">
			<Box
				sx={{
					position: 'fixed',
					top: 60,
					left: 10
				}}>
				<TableContainer
					component={Paper}
					sx={{
						mb: 5,
						maxWidth: 400,
						marginLeft: 'auto',
						marginRight: 'auto',
						mt: 5,
						ml: 4,
						borderTop: '1px solid lightgrey',
					}}
				>
					<Table sx={{ minWidth: 200 }}>
						<TableHead>
							<TableCell
								sx={{
									fontWeight: 'bold',
									textAlign: 'center',
									borderBottom: '2px solid lightgrey',
									borderRight: '1px solid lightgrey',
								}}
							>
								<h2>Favorites</h2>
							</TableCell>
							{favorites.map(favorite => (
								<TableRow
									component={Link} to={"/" + favorite.toLowerCase()}
									sx={{
										borderBottom: '1px solid lightgrey',
										borderRight: '1px solid lightgrey',
										minWidth: 200,
									}}
								>
									{favorite}
								</TableRow>
							))}
						</TableHead>
					</Table>
				</TableContainer>
			</Box>
			<Fab color="primary" aria-label="add" id="basic-button"
				aria-controls={open ? 'basic-menu' : undefined}
				aria-haspopup="true"
				aria-expanded={open ? 'true' : undefined}
				onClick={handleClick}
				sx={{ position: 'fixed', bottom: 50, left: 50 }}>
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
				<Box sx={{ position: 'fixed', bottom: 0, right: 0, zIndex: 1100 }}><RoomPomodoro /></Box>
			</Slide>
			<DashboardConfigurator initialPreference={preferences} preferenceCallback={updatePreferences} />
			<Slide direction="up" in={showTask} mountOnEnter unmountOnExit>
				<Box><TasklistList className="component-wrapper" /></Box>
			</Slide>
		</div>

	)
}

export default TasklistsPage;
