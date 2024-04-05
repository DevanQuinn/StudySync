import ProgressBar from "@ramonak/react-progress-bar";
import treeImages from './treeImages.jsx'
import {Button} from '@mui/material'
import {useState, useEffect} from 'react'
const TimerBar = ({percentDone, studyState}) => {
    const [treeSelection, updateTreeSelection] = useState(0)
    const maxTrees = 2;
    const decrementTreeSelection = () => {
        if (treeSelection == 0) {
            updateTreeSelection(maxTrees - 1);
        }
        else {
            updateTreeSelection(treeSelection - 1);
        }
    }
    const incrementTreeSelection = () => {
        if (treeSelection == maxTrees - 1) {
            updateTreeSelection(0);
        }
        else {
            updateTreeSelection(treeSelection + 1);
        }
    }


    return (
        <div style={{position:"relative"}}>
            <ProgressBar completed={percentDone}/>
            <img src={treeImages[treeSelection].tree} style={{opacity:percentDone / 100}}/>
            <img src={treeImages[treeSelection].sapling} style={{opacity:(1 - (percentDone/100)), position:"absolute", top:0, left:0,}}/>
            <div>
                <Button variant="contained" sx={{ fontSize: '0.75rem', padding: '6px 12px' }} onClick={decrementTreeSelection}>
                    Previous Tree
                </Button>
                <Button variant="contained" sx={{ fontSize: '0.75rem', padding: '6px 12px' }} onClick={incrementTreeSelection}>
                    Next Tree
                </Button>
            </div>
        </div>
    )
}
export default TimerBar