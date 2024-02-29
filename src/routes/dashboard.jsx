import Tasklist from '../components/Tasklist.jsx'
import Button from '../components/Button.jsx';
import React, {useState, useEffect} from 'react'
import { Task } from '@mui/icons-material';
import { nanoid } from 'nanoid'

/*
TODO LIST:
	* store all tasks in the dashboard component and pass as props the relevant tasks to the tasklist
	* debug the above procedure
*/

function Dashboard() {
	const [tasklistsList, setTasklists] = React.useState([]);
	const [tasks, setTasks] = React.useState({})

	useEffect(() => {
		console.log("props updated. rerendering dashboard.");
		console.log(tasks);
	}, [JSON.stringify(tasks)]);

	const addTasklistButtonClick = (title) => {
		if (tasklistsList.length < 10) {
			let id = nanoid();
			let newTasklistsList = [...tasklistsList, {title:title + id, id:id}];
			setTasklists(newTasklistsList);
			let newTasks = tasks;
			newTasks[id] = []
			console.log(newTasks);
			setTasks(newTasks);
		}
		else {
			alert("The maximum number of tasklists is 10!");
		}
	};

	const deleteByIndex = id => {
		console.log(tasklistsList);
		console.log("deleting index " + id);
		const newTasklistsList = tasklistsList.filter((tasklist) => {
		if (tasklist.id != id) {
			console.log("tasklist passed. ID: " + tasklist.id);
			return true;
		}
		console.log("tasklist failed. ID: " + tasklist.id);
		return false;
		});
		console.log(newTasklistsList);
		setTasklists(newTasklistsList);
	}

	const addTaskToTasklist = (tasklistID, title) => {
		let tempid = nanoid();
		let newTasks = tasks; //newtasks is a dictionary where key is tasklistID and value is an array of dictionaries, where each dict is a task
		const newTasksArray = tasks[tasklistID] //newTasksArray is an array of dicts, where each dict is a task, with the new task appended
		newTasksArray.push({title:title, taskID:tempid, completed:false}); 
		newTasks[tasklistID] = newTasksArray; //setting the array that corresponds with the tasklistID to the updated array
		setTasks(JSON.parse(JSON.stringify(newTasks))); //saving to the state
	}

	const completeTask = (tasklistID, taskID) => {
		let newTasks = tasks;
		let newTasksArray = tasks[tasklistID];
		newTasksArray = newTasksArray.filter((task) => {
			if (task.taskID = taskID) {
				task.completed = true;
			}
			return true;
		});
		newTasks[tasklistID] = newTasksArray;
		setTasks(JSON.parse(JSON.stringify(newTasks)));
	}

	const deleteTaskFromTasklist = (tasklistID, taskID) => {
		let newTasks = tasks;
		let newTasksArray = tasks[tasklistID];
		newTasksArray = newTasksArray.filter((task) => task.taskID != taskID);
		newTasks[tasklistID] = newTasksArray;
		setTasks(JSON.parse(JSON.stringify(newTasks)));
	}

	return (
		<div>
			<>{tasklistsList.map((tasklist, index) => (
                        <Tasklist
						id={tasklist.id}
                        title={tasklist.title}
                        deletefunc={deleteByIndex}
                        tasklistlength={tasklistsList.length}
                        key={index}
						tasksProp={tasks[tasklist.id]}
						addtaskfunc={addTaskToTasklist}
						deletetaskfunc={deleteTaskFromTasklist}
						completetaskfunc={completeTask}
                        />
                    ))}</>
			<div>
				<Button onClick={() => {addTasklistButtonClick("dummytitle")}}>Add new task list</Button>
				<h2>There are currently {tasklistsList.length} active tasklists</h2>
			</div>
		</div>
	);
}

export default Dashboard;
