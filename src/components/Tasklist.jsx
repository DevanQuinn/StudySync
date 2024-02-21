import Draggable, {DraggableCore} from "react-draggable";
import React, {useState} from 'react';

/*
TODO LIST:
    * tasklists should be have editable fields:
        - Title
        - Brief description
        - Tasklist color
    * tasklists should be able to store tasks
    * tasks should be ordered
    * tasklists should be resizable
    * tasks should be markable as complete, and ALSO deletable. completing a task shouldn't complete it.
    * tasklists should have a large maximum number of tasks
    * tasklists should be collapsable, and users should be able to scroll through their tasks
    * tasklists should be savable to a file in the database
*/

const Tasklist = () => {
    return (
        <Draggable handle=".handle">
            <div>
                <div className="handle">Drag from here</div>
                <div>check this bad boy out</div>
            </div>
        </Draggable>
    );
}

export default Tasklist;