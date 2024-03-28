import React, {useState, useEffect} from 'react'
import TasklistList from '../components/TasklistList.jsx'
import RoomPomodoro from '../components/RoomPomodoro.jsx';
import AddIcon from '@mui/icons-material/Add';
import { Fab, Box, Slide } from '@mui/material';
/*
TODO LIST:
	* store all tasks in the dashboard component and pass as props the relevant tasks to the tasklist
	* debug the above procedure
*/

function Dashboard() {
	const [showPomodoro, setShowPomodoro] = useState(false);
	const togglePomodoro = () => setShowPomodoro(!showPomodoro);
	return (
		<div>
			<DashboardConfigurator initialPreference={preferences} preferenceCallback={updatePreferences}/>
			<TasklistList/>
			<Fab color="primary" aria-label="add" onClick={togglePomodoro} sx={{top: 300, left: 675 }}>
				<AddIcon />
			</Fab>
			<Slide direction="up" in={showPomodoro} mountOnEnter unmountOnExit>
       		 	<Box sx={{ position: 'fixed', bottom: 60, right: 0, zIndex: 1100 }}><RoomPomodoro /></Box>
      		</Slide>	
		</div>
		
	)
}

export default Dashboard;
