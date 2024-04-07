import treeImages from './treeImages.jsx';
import {useState, useEffect} from 'react';
const treeDisplayBanner = ({inittrees}) => { //trees should be an array of ints, each representing a treeID
    const [trees, updateTrees] = useState([]); //used to hold truncated tree array

    useEffect(() => { //once loaded
        updateTrees(inittrees.slice(0,5)); //truncate init trees to 5 long
    }, [inittrees])

    useEffect(()=>{console.log(trees)}, [trees]);

    return (
        <div>
            {trees.map((tree) => {
                return(
                    <img src={treeImages[tree].tree} style={{width:'10wv', height:'10vw'}}/>
                )
            })}
        </div>
    )
}

export default treeDisplayBanner;