import React, { useEffect, useState } from 'react';
import './Tasklist.css';
import { Button } from '@mui/material';
import Collapsible from 'react-collapsible';

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
    }, [JSON.stringify(tasksProp)]);

    const addTask = taskTitle => {
        addtaskfunc(id, taskTitle);
    };

    return (
        <div>
            <div className="todo-container">
            <div className="header">{title}</div>
                <Collapsible trigger="Expand/Collapse">
                    <div className="tasks">
                        <div>
                            {tasksProp.map((task) => {
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
                </Collapsible>
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
