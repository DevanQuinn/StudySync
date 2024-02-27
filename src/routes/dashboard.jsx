import Tasklist from '../components/Tasklist.jsx'
import Button from '../components/Button.jsx';
import React, {useState} from 'react'
import { Task } from '@mui/icons-material';
import { nanoid } from 'nanoid'

/*
TODO LIST:
	* Tasklists should be saved to the database automatically and be per-user
	* on loading the page, the tasklistsList should load from the database all previous tasklists
	* Users should be able to choose a wallpaper and have it persist
	* The addTasklistButton should not move when adding a new tasklist
*/

function Dashboard() {
	const [tasklistsList, setTasklists] = React.useState([]);

	const addTasklistButtonClick = () => {
		if (tasklistsList.length < 10) {
			let newTasklistsList = [...tasklistsList, {title:"yourmom"}];
			setTasklists(newTasklistsList);
		}
		else {
			alert("The maximum number of tasklists is 10!");
		}
	}

	const deleteByIndex = index => { //curiously, the old and new tasklistlists have the right length 
		console.log(tasklistsList); //however, regardless of how something is deleted, the tasklistlist is truncated to one tasklist
		console.log("deleting index " + index); //could be because splice mutates, whereas filter does not. look into this?
		let newTasklistsList = [...tasklistsList];
		newTasklistsList = tasklistsList.splice(index, 1);
		setTasklists(newTasklistsList);
		console.log(tasklistsList);
	}

	return (
		<div>
			<>{tasklistsList.map((tasklist, index) => (
                        <Tasklist
						id={nanoid()}
                        title={tasklist.title}
                        index={index}
                        deletefunc={deleteByIndex}
                        tasklistlength={tasklistsList.length}
                        key={index}
                        />
                    ))}</>
			<div>
				<Button onClick={addTasklistButtonClick}>Add new task list</Button>
				<h2>There are currently {tasklistsList.length} active tasklists</h2>
			</div>
		</div>
	);
}

export default Dashboard;
