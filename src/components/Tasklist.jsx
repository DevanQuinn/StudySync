import React, { useEffect, useState } from 'react';
import './Tasklist.css';
import Draggable from 'react-draggable';
import { Button } from '@mui/material';

function Task({ task, taskID, tasklistID, completeTask, removeTask }) {
    return (
        <div
            className="task"
            style={{ textDecoration: task.completed ? "line-through" : "" }}
        >
            {task.title}
            <button style={{ background: "red" }} onClick={() => removeTask(tasklistID, taskID)}>x</button>
            <button onClick={() => completeTask(tasklistID, taskID)}>Complete</button>
        </div>
    );
}



function Tasklist({title, deletefunc, id, tasksProp, addtaskfunc, deletetaskfunc, completetaskfunc}) { //not updating on tasksProp updating. or maybe tasksProp isnt updating?
    useEffect(() => {
        console.log(tasksProp);
        setTasks(tasksProp[id]);
        console.log(tasks);
    }, [JSON.stringify(tasksProp[id])]);

    const addTask = title => {
        addtaskfunc(id, title);
    };

    const completeTask = (tasklistID, taskID) => {
        completetaskfunc(tasklistID, taskID);
    };

    const removeTask = (tasklistID, taskID) => {
        deletetaskfunc(tasklistID, taskID);
    };

    return (
        <Draggable>
            <div className="todo-container">
                <div className="header">{title}</div>
                <div className="tasks">
                    {tasks.map((task, index, taskID) => (
                        <Task
                        task={task}
                        taskID={taskID}
                        tasklistID={id}
                        completeTask={completeTask}
                        removeTask={removeTask}
                        key={index}
                        />
                    ))}
                </div>
                <>{tasks.length} tasks left!</>
                <div className="create-task" >
                    <CreateTask addTask={addTask} />
                </div>
                <Button onClick={() => deletefunc(id)}>Delete Tasklist</Button>
            </div>
        </Draggable>
    );
}


function CreateTask({ addTask }) {
    const [value, setValue] = useState("");

    const handleSubmit = e => {
        e.preventDefault();
        if (!value) return;
        
        addTask(value);
        setValue("");
    }
    
    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                className="input"
                value={value}
                placeholder="Add a new task"
                onChange={e => setValue(e.target.value)}
            />
        </form>
    );
}

export default Tasklist;
