import TasklistList from '../components/TasklistList.jsx'
import '../components/TasklistList.css'

/*
TODO LIST:
	* store all tasks in the dashboard component and pass as props the relevant tasks to the tasklist
	* debug the above procedure
*/

function Dashboard() {
	return (
		<div>
			<TasklistList/>
		</div>
	)
}

export default Dashboard;
