import ProgressBar from "@ramonak/react-progress-bar";
import treeImages from './treeImages.jsx'
import { Button } from '@mui/material'
import { useState, useEffect } from 'react'
const TimerBar = ({ percentDone, studyState, treeSelection, updateTreeSelection, addTreeToGarden, studyTime, disableStartButtonFunc }) => {
    const [disableButton, updateDisableButton] = useState(false); //lock for tree selections
    const [timerNeverStarted, updateTimerNeverStarted] = useState(true); //flag to help keep tree selection buttons unlocked on initial load
    const [treeProgress, updateTreeProgress] = useState(0); //state to control tree growth progress
    const maxTrees = treeImages.length; //number of trees in imported tree array. Not hardcoded.
    const decrementTreeSelection = () => { //selector button function for tree selection
        if (treeSelection == 0) {
            updateTreeSelection(maxTrees - 1);
        }
        else {
            updateTreeSelection(treeSelection - 1);
        }
    }
    const incrementTreeSelection = () => { //selector button function for tree selection
        if (treeSelection == maxTrees - 1) {
            updateTreeSelection(0);
        }
        else {
            updateTreeSelection(treeSelection + 1);
        }
    }

    useEffect(() => { //update progress bar and lock buttons based on state
        if ((percentDone > 0) && (percentDone != 100) && studyState == "Study!") { //if timer is not empty, not full, and we are currently studying
            updateTreeProgress(percentDone); //grow tree based on percent done
        } else if ((percentDone == 100) && (studyState == "Break!")) { //if we just finished a study session
            console.log("You just grew a tree! It's been added to your garden.");
            addTreeToGarden(treeSelection, 1, studyTime);
            updateTreeProgress(100); //keep tree fully grown
        } else { //we are in a break or just finished a break
            updateTreeProgress(0); //only display saplings
        }
        if (((studyState == "Study!") && (percentDone != 100) && !(timerNeverStarted))) { //if we are studying and this isnt the first timer run
            updateDisableButton(true); //lock tree selection
        } else if ((studyState == "Break!") && (percentDone != 100)) { //if we are in a break or just finished one
            updateDisableButton(false); //unlock tree selection
        }
        updateTimerNeverStarted(false); //we are no longer in first run
    }, [percentDone, studyState])

    return (
        <div style={{ position: "relative" }}>
            <ProgressBar completed={percentDone} />
            <TreeSelectionSlide studyTime={studyTime} treeProgress={treeProgress} treeSelection={treeSelection} disableStartButtonFunc={disableStartButtonFunc} />
            <div>
                <Button variant="contained" disabled={disableButton} sx={{ fontSize: '0.75rem', padding: '6px 12px', mb: 1 }} onClick={decrementTreeSelection}>
                    Previous Tree
                </Button>&nbsp;&nbsp;&nbsp;
                <Button variant="contained" disabled={disableButton} sx={{ fontSize: '0.75rem', padding: '6px 12px', mb: 1 }} onClick={incrementTreeSelection}>
                    Next Tree
                </Button>
            </div>
        </div>
    )
}
export default TimerBar

const TreeSelectionSlide = ({ studyTime, treeProgress, treeSelection, disableStartButtonFunc }) => {
    if (treeSelection * 10 * 60 > studyTime) {
        disableStartButtonFunc(true);
        return (
            <div>
                You need to study for at least {treeSelection * 15 * 60} seconds to grow this tree!
            </div>
        )
    }
    disableStartButtonFunc(false);
    return (
        <div>
            <center>
                <img src={treeImages[treeSelection].tree} style={{ opacity: treeProgress / 100, maxHeight: 200, margin: 0, position: 'relative' }} />
                <img src={treeImages[treeSelection].sapling} style={{ opacity: (1 - (treeProgress / 100)), margin: 0, left: '25%', maxHeight: 200, position: 'absolute' }} />
            </center>
        </div>
    )
}