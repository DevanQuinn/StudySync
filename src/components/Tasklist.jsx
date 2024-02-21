import Draggable, {DraggableCore} from "react-draggable";
import React from 'react';

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