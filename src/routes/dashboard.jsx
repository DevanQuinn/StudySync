import React, {useState, useEffect} from 'react'
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
	const db = getFirestore(app)
	const user = useUser();

	const fetchFav = async () => {
		const docRef = doc(db, "users", user.displayName);
		const q = await getDoc(docRef);
		const data = q.data();
		const favArr = data.favorites;
		setFavorites(favArr);
	};
	
	const updatePreferences = prefObj => {
		setPreferences(prefObj);
	};

	useEffect(() => {
		//load user preferences into local state
	}, [user])
	
	useEffect(() => {
		fetchFav();
	}, [user])

	useEffect(() => {
		document.body.style.backgroundColor = preferences.color;
		return () => {
			document.body.style.backgroundColor = "#FFFFFF";
		}
	}, [preferences]);

	return (
		<div>
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
					mt: 2,
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
								Favorites
							</TableCell>
				{favorites.map(favorite => (
					<TableRow
						component={Link} to ={"/" + favorite.toLowerCase()}
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
