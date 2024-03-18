import React, { useEffect, useState } from 'react';
import './Tasklist.css';
import { Button } from '@mui/material';

function Task({ task, completeTask, removeTask }) {
    return (
        <div
            className="task"
            style={{ textDecoration: task.completed ? "line-through" : "" }}
        >
            {task.title}
            <div>
                <button onClick={completeTask}>Complete</button>
                <button style={{ background: "red" }} onClick={removeTask}>x</button>
            </div>
        </div>
    );
}



function Tasklist({title, deletefunc, id, tasksProp, addtaskfunc, deletetaskfunc, completetaskfunc}) { //not updating on tasksProp updating. or maybe tasksProp isnt updating?
    useEffect(() => {
        console.log("props updated. tasklist rerendering");
    }, [JSON.stringify(tasksProp)]);

    const addTask = taskTitle => {
        addtaskfunc(id, taskTitle);
    };

    return (
        <div>
            <div className="todo-container">
            <div className="header">{title}</div>
                <div>
                    <div className="tasks">
                        <input id="collapsible" className="toggle" type="checkbox"></input>
                        <label for="collapsible" className="lbl-toggle">Collapse/Expand</label>
                        <div className="collapsible-content">
                            {tasksProp.map((task) => { //not properly mapping
                                console.log("mapping task: ");
                                console.log(task);
                                return (
                                <Task
                                task={task}
                                completeTask={() => completetaskfunc(id, task.taskID)}
                                removeTask={() => deletetaskfunc(id, task.taskID)}
                                key={task.taskID}
                                />
                            )}
                            )}
                        </div>
                        {tasksProp.length} tasks left!
                    </div>
                    <div className="create-task" >
                        <CreateTask addTask={addTask} />
                    </div>
                    <Button onClick={() => deletefunc(id)}>Delete Tasklist</Button>
                </div>
            </div>
        </div>
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
