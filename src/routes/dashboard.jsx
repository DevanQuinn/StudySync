import Tasklist from '../components/Tasklist.jsx'
import Button from '../components/Button.jsx';
import React, {useState, useEffect} from 'react'
import { Task } from '@mui/icons-material';
import { nanoid } from 'nanoid'
import { Fab, Box, Slide } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RoomPomodoro from '../components/RoomPomodoro.jsx';
/*
TODO LIST:
	* store all tasks in the dashboard component and pass as props the relevant tasks to the tasklist
	* debug the above procedure
*/
export function Dashboard() {
	const [tasklistsList, setTasklists] = React.useState([]);
	const [tasks, setTasks] = React.useState({})
	const [showPomodoro, setShowPomodoro] = useState(false);
	const togglePomodoro = () => setShowPomodoro(!showPomodoro);

	useEffect(() => {
		console.log("props updated. rerendering dashboard.");
		console.log(tasks);
	}, [JSON.stringify(tasks)]);

	const addTasklist = (title) => {
		if (tasklistsList.length < 10) {
			let id = nanoid();
			let newTasklistsList = [...tasklistsList, {title:title, id:id}];
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
			if (task.taskID == taskID) {
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
				<CreateTasklist addTasklist={addTasklist}/>
				<h2>There are currently {tasklistsList.length} active tasklists</h2>
			</div>
			<Fab color="primary" aria-label="add" onClick={togglePomodoro}>
				<AddIcon />
			</Fab>
			<Slide direction="up" in={showPomodoro} mountOnEnter unmountOnExit>
       		 	<Box sx={{ position: 'fixed', bottom: 60, right: 0, zIndex: 1100 }}><RoomPomodoro /></Box>
      		</Slide>	
		</div>	
	);
}

function CreateTasklist({addTasklist}) { //Not Yet Implemented
	const [value, setValue] = useState("");

	const handleSubmit = e => {
		e.preventDefault();
		if (!value) return;
		addTasklist(value);
		setValue("");
	}

	return (
		<form onSubmit={handleSubmit}>
			<input
				type="text"
				className="input"
				value={value}
				placeholder="Add a new tasklist"
				onChange={e => setValue(e.target.value)}
			/>
		</form> 
	)
}

export default Dashboard;
