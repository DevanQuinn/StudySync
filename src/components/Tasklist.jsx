import Draggable, {DraggableCore} from "react-draggable";
import React, {useEffect, useState} from 'react';
import Button from "./Button.jsx";
import Task from "./Task.jsx";

/*
TODO LIST:
    * tasklists should be have editable fields:
        - Title
        - Brief description
        - Tasklist color
    * tasklists should be able to store tasks
    * tasks should be ordered
    * tasklists should be resizable
    * tasks should be markable as complete, and ALSO deletable. completing a task shouldn't complete it. <<This is next step, create a Task component
    * tasklists should have a large maximum number of tasks
    * tasklists should be collapsable, and users should be able to scroll through their tasks
    * tasklists should be savable to a file in the database
*/

const Tasklist = ({title}) => { //we want the Task component to have a button that sends the index of that task to the parent (TaskList) and removes it from the tasks array
    const [currTitle, updateTitle] = React.useState("");
    const [tasks, updateTasks] = React.useState([]);
    
    useEffect(() => {
        updateTitle("New Tasklist");
    });

    const addTask = () => {
        updateTasks(tasks.concat(<div><Task /></div>))
    }

    return (
        <Draggable handle=".handle">
            <div>
                <div className="handle">{currTitle}</div>
                <div>{tasks}</div>
                <div><Button onClick={addTask}>New Task</Button></div>
            </div>
        </Draggable>
    );
}

export default Tasklist;