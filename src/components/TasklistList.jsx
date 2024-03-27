import Tasklist from '../components/Tasklist.jsx'
import Button from '../components/Button.jsx';
import React, {useState, useEffect} from 'react'
import { Task } from '@mui/icons-material';
import { nanoid } from 'nanoid'
import "./TasklistList.css"
import Draggable from 'react-draggable';
import {
	query,
	where,
	getFirestore,
	collection,
	getDocs,
	setDoc,
	doc,
	addDoc,
	deleteDoc,
} from 'firebase/firestore';
import app from '../firebase.js';
import useUser from "../hooks/useUser";


/*
TODO LIST:
	* store all tasks in the dashboard component and pass as props the relevant tasks to the tasklist
	* debug the above procedure
*/

function TasklistList() {
	const [tasklistsList, setTasklists] = React.useState([]);
	const [tasks, setTasks] = React.useState({})

	const db = getFirestore(app);

	const user = useUser(false);

	useEffect(() => {
		console.log("props updated. rerendering dashboard.");
		console.log(tasks);
	}, [JSON.stringify(tasks)]);

	useEffect(()=>{
		console.log("attempting to load state");
		loadState();
	}, [user]);

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

	const SaveState = () => {
		if (user) {
			setDoc(doc(db, "users", user.uid), {}, {merge: true}).then(() => { //first ensure the user's information is in the database
				//Clear what data the database currently has
				console.log("attempting to clear database of user tasks");
				const tasklistsRef = collection(db, "users", user.uid, "tasklists");
				const tasklistsQuery = query(tasklistsRef);
				getDocs(tasklistsQuery).then((tasklistsSnapshot) => {
					tasklistsSnapshot.forEach((tasklistDoc) => {
						const tasksRef = collection(db, "users", user.uid, "tasklists", tasklistDoc.id, "tasks")
						const tasksQuery = query(tasksRef);
						getDocs(tasksQuery).then((tasksSnapshot) => {
							tasksSnapshot.forEach(taskDoc => {
								deleteDoc(doc(db, "users", user.uid, "tasklists", tasklistDoc.id, "tasks", taskDoc.id));
							})
						})
						deleteDoc(doc(db, "users", user.uid, "tasklists", tasklistDoc.id));
					})
				}).then(() => {

					//add new up-to-date data to the database
					tasklistsList.forEach((tasklist) => {
						console.log("attempting to save to database");
						setDoc(doc(db, "users", user.uid, "tasklists", tasklist.id), {title: tasklist.title}, {merge: true}).then(() => {
							tasks[tasklist.id].forEach(task => {
								setDoc(doc(db, "users", user.uid, "tasklists", tasklist.id, "tasks", task.taskID), {title: task.title, completed: task.completed}, {merge: true});
							})
						})
					})

				})
			});
		}
	}

	const loadState = () => {
		console.log("attempting to load tasks");
		setTasks({});
		setTasklists([]);
		let newTasklists = [];
		if(user) {
			const tasklistsQuery = query(collection(db, "users", user.uid, "tasklists"));
			getDocs(tasklistsQuery).then((tasklistsSnapshot) => {
				console.log(tasklistsSnapshot);
				tasklistsSnapshot.forEach((tasklistsDoc) => {
					console.log(tasklistsDoc.data());
					newTasklists = [...newTasklists, {title:tasklistsDoc.data().title, id:tasklistsDoc.id}]
					setTasklists(JSON.parse(JSON.stringify(newTasklists)));
					let dummyTasks = tasks;
					dummyTasks[tasklistsDoc.id] = [];
					setTasks(dummyTasks);
					const tasksQuery = query(collection(db, "users", user.uid, "tasklists", tasklistsDoc.id, "tasks"))
					getDocs(tasksQuery).then((tasksSnap) => {
						//console.log(tasksSnap);
						tasksSnap.forEach((taskDoc) => {
							//console.log(taskDoc.data())
							let newTasks = tasks;
							let newTasksArray = newTasks[tasklistsDoc.id];
							newTasksArray.push({title:taskDoc.data().title, taskID:taskDoc.id, completed:taskDoc.data().completed});
							newTasks[tasklistsDoc.id] = newTasksArray;
							setTasks(JSON.parse(JSON.stringify(newTasks)));
						});
					});
				});
			});
		}
	}

	return (
    <div>
      <Draggable handle=".header">
				<div className="component-wrapper">
					<div className="header">
						Tasklists
					</div>
					{tasklistsList.map((tasklist, index) => (
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
					/>))}
					<CreateTasklist addTasklist={addTasklist}/>
					<h2>There are currently {tasklistsList.length} active tasklists</h2>
					<Button onClick={SaveState}>Save Tasks</Button>
        </div>
    	</Draggable>
		</div>
	);
}

function CreateTasklist({addTasklist}) {
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

function LoadUserTasks({handleLoad}) {
	const [formValues, setFormValues] = useState({tasklists:'', tasks:''});
	
	const handleSubmit = e => {
		console.log("handling submit");
		e.preventDefault();
		if (!formValues) return;
		handleLoad();
	}

	return (
		<form onSubmit={handleSubmit}>
			<button type="submit">load</button>
		</form>
	)
}

export default TasklistList;
