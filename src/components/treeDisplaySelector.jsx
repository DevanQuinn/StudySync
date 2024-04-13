import {useState, useEffect} from 'react'
import { Button, Checkbox, Container, CssBaseline, FormControlLabel, Grid, Link, TextField, Typography } from '@mui/material';
import {
	query,
	where,
	getFirestore,
	collection,
	getDocs,
	getDoc,
	setDoc,
	doc,
	addDoc,
	deleteDoc,
} from 'firebase/firestore';
import app from '../firebase.js';
import useUser from '../hooks/useUser.jsx';
import treeImages from './treeImages.jsx';

const TreeDisplaySelector = () => {
    const [treeInventory, updateTreeInventory] = useState({}); //treeInventory should be an object
    // with keys being treeIDs and values being quantity in user inventory
    const [virtualInventory, updateVirtualInventory] = useState({}) //same as treeInventory, except
    // ommitting trees that are already selected
    const [currentSelection, updateCurrentSelection] = useState({}) //currentSelection should be an object
    //where keys are the index of the dropdown and values are the treeID selected at that dropdown
    
	const db = getFirestore(app)
	const user = useUser(false);

    useEffect(() => {
        if (user) { //if logged in
			const q = query(collection(db, "users"), where("userID", "==", user.uid)); //set up username query
			getDocs(q).then(userssnapshot => { //get username
				userssnapshot.forEach(user => { //should only run once if userIDs are unique
                    if (user.data().trees) {
					    updateTreeInventory(user.data().trees); //save username
                    }
				})
			})
        }
    }, [user])
    
    useEffect(()=>{}, [treeInventory]);

    useEffect(() => {
        var tempVirtualInventory = treeInventory;
        Object.values(currentSelection).forEach((item) => {
            tempVirtualInventory = {...tempVirtualInventory, [item]:(tempVirtualInventory[item] - 1)}
        })
        updateVirtualInventory(tempVirtualInventory);
    }, [currentSelection, treeInventory])

    const onDropdownUpdate = (index, newVal) => {
        updateCurrentSelection({...currentSelection, [index]:newVal});
    }

    const updateGardenTrees = (e) => { //This function needs to save an array of trees to the database as a property of the user doc
        e.preventDefault();
        var username;
        const q = query(collection(db, "users"), where("userID", "==", user.uid));
        getDocs(q).then(userssnapshot => {
            userssnapshot.forEach(user => {
                username = user.data().username;
            })
        }).then(() => {
            setDoc(doc(db, "users", username), {treeSelection:Object.values(currentSelection)}, {merge:true});
        })
    }

    return (
        <div style={{textAlign:"center"}}>
            <form onSubmit={updateGardenTrees}>
                <div>
                    {[0,1,2,3,4].map((numouter, index) => {
                        return (
                            <select defaultValue="none" key={index} name={"tree"+numouter} onChange={(e)=>{onDropdownUpdate(numouter, e.target.value)}}>
                                <option value="none" disabled hidden>Select a tree for slot {numouter+1}</option>
                                {Object.entries(virtualInventory).map((num, index)=>{
                                    if (num[1] > 0) {
                                        return (
                                            <option key={index} value={num[0]}>
                                                    {num[0]} - Left in inventory: {num[1]}
                                            </option>
                                        )
                                    }
                                    else {
                                        return (
                                            <option key={index} disabled>{num[0]} - None left in inventory!</option>
                                        )
                                    }
                                })}
                            </select>
                        )
                    })}
                </div>
                <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}> Select these trees </Button>
            </form>
            {Object.values(currentSelection).map((tree, index) => {
                return(
                    <img key={index} src={treeImages[tree].tree} style={{width:'10wv', height:'10vw'}}/>
                )
            })}
        </div>
    )
}

export default TreeDisplaySelector;