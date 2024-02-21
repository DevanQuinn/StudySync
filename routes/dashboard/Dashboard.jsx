import Tasklist from '../../src/components/Tasklist.jsx'
import Button from '../../src/components/Button.jsx';
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
			addTasklist(tasklistsList.concat(<Tasklist />));
		}
		else {
			alert("The maximum number of tasklists is 10!");
		}
	}

	return (
		<div>
			<Button onClick={addTasklistButtonClick}>Add new task list</Button>
			<>There are currently {tasklistsList.length} active tasklists</>
				{tasklistsList}
		</div>
	);
}

export default Dashboard;
