import Tasklist from '../../src/components/Tasklist.jsx'
import Button from '../../src/components/Button.jsx';
import React, {useState} from 'react'

function Dashboard() {
	const [tasklistsList, addTaskList] = React.useState([]);

	const addTaskListButtonClick = () => {
		if (tasklistsList.length < 10) {
			addTaskList(tasklistsList.concat(<Tasklist />));
		}
		else {
			alert("The maximum number of tasklists is 10!");
		}
	}

	return (
		<div>
			<Button onClick={addTaskListButtonClick}>Add new task list</Button>
			<>There are currently {tasklistsList.length} active tasklists</>
				{tasklistsList}
		</div>
	);
}

export default Dashboard;
