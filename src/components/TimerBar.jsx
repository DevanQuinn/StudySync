import ProgressBar from "@ramonak/react-progress-bar";
import Tree from '../assets/tree.png'
import Sapling from '../assets/seedling.png'
import {useState, useEffect} from 'react'
const TimerBar = ({percentDone, studyState}) => {
    const [treeSelection, updateTreeSelection] = useState({})
    const maxTrees = 2;
    const decrementTreeSelection = () => {
        if (treeSelection == 0) {
            updateTreeSelection(maxTrees);
        }
        else {
            updateTreeSelection(treeSelection - 1);
        }
    }
    const incrementTreeSelection = () => {
        if (treeSelection == maxTrees) {
            updateTreeSelection(0);
        }
        else {
            updateTreeSelection(treeSelection + 1);
        }
    }

    return (
        <div style={{position:"relative"}}>
            <ProgressBar completed={percentDone}/>
            <img src={Tree} style={{opacity:percentDone / 100}}/>
            <img src={Sapling} style={{opacity:(1 - (percentDone/100)), position:"absolute", top:0, left:0,}}/>
            <button onClick={decrementTreeSelection}/>
            <button onClick={incrementTreeSelection}/>
        </div>
    )
}
export default TimerBar