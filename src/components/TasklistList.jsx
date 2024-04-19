import Tasklist from '../components/Tasklist.jsx';
import Button from '@mui/material/Button';
import React, { useState, useEffect } from 'react';
import { Task } from '@mui/icons-material';
import { nanoid } from 'nanoid';
// import "./TasklistList.css"
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
import useUser from '../hooks/useUser';

/*
TODO LIST:
	* store all tasks in the dashboard component and pass as props the relevant tasks to the tasklist
	* debug the above procedure
*/

function TasklistList() {
	const [tasklistsList, setTasklists] = React.useState([]);
	const [tasks, setTasks] = React.useState({});

	const db = getFirestore(app);

	const user = useUser(false);

	useEffect(() => {
	}, [JSON.stringify(tasks)]);

	useEffect(() => {
		if (user) {
			const q = query(collection(db, "users"), where("userID", "==", user.uid));
			getDocs(q).then((snapshot) => {
				snapshot.forEach((doc) => {
					loadState(doc.data().username);
				})
			})
		}
	}, [user]);

	const addTasklist = title => {
		if (tasklistsList.length < 10) {
			let id = nanoid();
			let newTasklistsList = [...tasklistsList, { title: title, id: id }];
			setTasklists(newTasklistsList);
			let newTasks = tasks;
			newTasks[id] = [];
			setTasks(newTasks);
		} else {
			alert('The maximum number of tasklists is 10!');
		}
	};

	const deleteByIndex = id => {
		const newTasklistsList = tasklistsList.filter(tasklist => {
			if (tasklist.id != id) {
				return true;
			}
			return false;
		});
		setTasklists(newTasklistsList);
	};

	const addTaskToTasklist = (tasklistID, title) => {
		let tempid = nanoid();
		let newTasks = tasks; //newtasks is a dictionary where key is tasklistID and value is an array of dictionaries, where each dict is a task
		const newTasksArray = tasks[tasklistID]; //newTasksArray is an array of dicts, where each dict is a task, with the new task appended
		newTasksArray.push({ title: title, taskID: tempid, completed: false });
		newTasks[tasklistID] = newTasksArray; //setting the array that corresponds with the tasklistID to the updated array
		setTasks(JSON.parse(JSON.stringify(newTasks))); //saving to the state
	};

	const completeTask = (tasklistID, taskID) => {
		let newTasks = tasks;
		let newTasksArray = tasks[tasklistID];
		newTasksArray = newTasksArray.filter(task => {
			if (task.taskID == taskID) {
				task.completed = !(task.completed);
			}
			return true;
		});
		newTasks[tasklistID] = newTasksArray;
		setTasks(JSON.parse(JSON.stringify(newTasks)));
	};

	const deleteTaskFromTasklist = (tasklistID, taskID) => {
		let newTasks = tasks;
		let newTasksArray = tasks[tasklistID];
		newTasksArray = newTasksArray.filter(task => task.taskID != taskID);
		newTasks[tasklistID] = newTasksArray;
		setTasks(JSON.parse(JSON.stringify(newTasks)));
	};

	const SaveState = () => {
		var username;
		if (user) {
			const q = query(collection(db, "users"), where("userID", "==", user.uid));
			getDocs(q).then(userssnapshot => {
				userssnapshot.forEach(user => {
					username = user.data().username;
				})
			}).then(() => {
				setDoc(doc(db, 'users', username), {}, { merge: true }).then(() => {
					const tasklistsRef = collection(db, 'users', username, 'tasklists');
					const tasklistsQuery = query(tasklistsRef);
					getDocs(tasklistsQuery).then(tasklistsSnapshot => {
						tasklistsSnapshot.forEach(tasklistDoc => {
							const tasksRef = collection(db,'users', username,'tasklists',tasklistDoc.id,'tasks'
							);
							const tasksQuery = query(tasksRef);
							getDocs(tasksQuery).then(tasksSnapshot => {
								tasksSnapshot.forEach(taskDoc => {
									deleteDoc(doc(db, 'users', user.uid, 'tasklists', tasklistDoc.id, 'tasks', taskDoc.id));
								});
							});
							deleteDoc(doc(db, 'users', username, 'tasklists', tasklistDoc.id));
						});
					}).then(() => {
						//add new up-to-date data to the database
						tasklistsList.forEach(tasklist => {
							setDoc(
								doc(db, 'users', username, 'tasklists', tasklist.id),
								{ title: tasklist.title },
								{ merge: true }
							).then(() => {
								tasks[tasklist.id].forEach(task => {
									setDoc(doc(db, 'users', username, 'tasklists', tasklist.id, 'tasks', task.taskID),
										{ title: task.title, completed: task.completed },
										{ merge: true }
								  );
								});
							});
						});
					});
				})
			});
		}
	};

	const loadState = (username) => {
		setTasks({});
		setTasklists([]);
		let newTasklists = [];
		if (user) {
			const tasklistsQuery = query(
				collection(db, 'users', username, 'tasklists')
			);
			getDocs(tasklistsQuery).then(tasklistsSnapshot => {
				tasklistsSnapshot.forEach(tasklistsDoc => {
					newTasklists = [...newTasklists, { title: tasklistsDoc.data().title, id: tasklistsDoc.id },
					];
					setTasklists(JSON.parse(JSON.stringify(newTasklists)));
					let dummyTasks = tasks;
					dummyTasks[tasklistsDoc.id] = [];
					setTasks(dummyTasks);
					const tasksQuery = query(collection(db, 'users', username, 'tasklists', tasklistsDoc.id, 'tasks'));
					getDocs(tasksQuery).then(tasksSnap => {
						tasksSnap.forEach(taskDoc => {
							let newTasks = tasks;
							let newTasksArray = newTasks[tasklistsDoc.id];
							newTasksArray.push({
								title: taskDoc.data().title,
								taskID: taskDoc.id,
								completed: taskDoc.data().completed,
							});
							newTasks[tasklistsDoc.id] = newTasksArray;
							setTasks(JSON.parse(JSON.stringify(newTasks)));
						});
					});
				});
			});
		}
	};

	return (
		<div>
			<Draggable handle='.header'>
				<div className='component-wrapper'>
					<div className='header'>Tasklists</div>
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
						/>
					))}
					<CreateTasklist addTasklist={addTasklist} />
					<h2>There are currently {tasklistsList.length} active tasklists</h2>
					<Button onClick={SaveState}>Save Tasks</Button>
				</div>
			</Draggable>
		</div>
	);
}

function CreateTasklist({ addTasklist }) {
	const [value, setValue] = useState('');

	const handleSubmit = e => {
		e.preventDefault();
		if (!value) return;
		addTasklist(value);
		setValue('');
	};

	return (
		<form onSubmit={handleSubmit}>
			<input
				type='text'
				className='input'
				value={value}
				placeholder='Add a new tasklist'
				onChange={e => setValue(e.target.value)}
			/>
		</form>
	);
}

export default TasklistList;
