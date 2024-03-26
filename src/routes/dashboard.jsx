import TasklistList from '../components/TasklistList.jsx'
import DashboardConfigurator from '../components/DashboardConfigurator.jsx'
import '../components/TasklistList.css';
import {useState, useEffect} from 'react';
/*
TODO LIST:
	* store all tasks in the dashboard component and pass as props the relevant tasks to the tasklist
	* debug the above procedure
*/

function Dashboard() {
	const defaultPreferences = {color:"#000000"};
	//should load preferences from user doc and reflect them
	const [preferences, setPreferences] = useState(defaultPreferences);

	const updatePreferences = (prefObj) => {
		setPreferences(prefObj);
	}

	useEffect(() => {
		document.body.style.backgroundColor = preferences.color;
	}, [preferences])

	return (
		<div>
			<DashboardConfigurator initialPreference={preferences} preferenceCallback={updatePreferences}/>
			<TasklistList/>
		</div>
	)
}

export default Dashboard;
