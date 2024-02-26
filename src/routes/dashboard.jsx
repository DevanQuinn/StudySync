import Tasklist from '../components/Tasklist.jsx'
import Button from '../components/Button.jsx';
import React, {useState} from 'react'

/*
TODO LIST:
	* Tasklists should be saved to the database automatically and be per-user
	* on loading the page, the tasklistsList should load from the database all previous tasklists
	* Users should be able to choose a wallpaper and have it persist
	* The addTasklistButton should not move when adding a new tasklist
*/

function Dashboard() {
	const [tasklistsList, addTasklist] = React.useState([]);

	const addTasklistButtonClick = () => {
		if (tasklistsList.length < 10) {
			addTasklist(tasklistsList.concat(<Tasklist title="yourmom"/>));
		}
		else {
			alert("The maximum number of tasklists is 10!");
		}
	}

	return (
		
		<div>
			<>{tasklistsList}</>
			<div>
				<Button onClick={addTasklistButtonClick}>Add new task list</Button>
				<h2>There are currently {tasklistsList.length} active tasklists</h2>
			</div>
		</div>
	);
}

export default Dashboard;
