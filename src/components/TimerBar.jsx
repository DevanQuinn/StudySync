import ProgressBar from "@ramonak/react-progress-bar";
import Tree from '../assets/tree.png'
import Sapling from '../assets/seedling.png'
const TimerBar = ({percentDone, studyState}) => {
    return (
        <div style={{position:"relative"}}>
            <ProgressBar completed={percentDone}/>
            <img src={Tree} style={{opacity:percentDone / 100}}/>
            <img src={Sapling} style={{opacity:(1 - (percentDone/100)), position:"absolute", top:0, left:0,}}/>
        </div>
    )
}
export default TimerBar