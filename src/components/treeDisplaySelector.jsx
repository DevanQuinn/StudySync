import {useState, useEffect} from 'react'
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

const TreeDisplaySelector = () => {
    const [treeInventory, updateTreeInventory] = useState({}); //treeInventory should be an object
    // with keys being treeIDs and values being quantity in user inventory
    const [virtualInventory, updateVirtualInventory] = useState({}) //same as treeInventory, except
    // ommitting trees that are already selected
    const [currentSelection, updateCurrentSelection] = useState({}) //currentSelection should be an object
    //where  keys are the index of the dropdown and values are the treeID selected at that dropdown
    
	const db = getFirestore(app)
	const user = useUser(false);

    useEffect(() => {
        if (user) { //if logged in
			const q = query(collection(db, "users"), where("userID", "==", user.uid)); //set up username query
			getDocs(q).then(userssnapshot => { //get username
				userssnapshot.forEach(user => { //should only run once if userIDs are unique
                    console.log(user.data().trees);
					updateTreeInventory(user.data().trees); //save username
				})
			})
        }
    }, [user])
    
    useEffect(()=>{}, treeInventory);

    useEffect(() => {
        var tempVirtualInventory = treeInventory;
        Object.values(currentSelection).forEach((item, index) => {
            tempVirtualInventory = {...tempVirtualInventory, [item]:(tempVirtualInventory[item] - 1)}
        })
        updateVirtualInventory(tempVirtualInventory);
        //set virtualInventory to be treeInventory minus currentSelection
    }, [currentSelection, treeInventory])

    const onDropdownUpdate = (index, newVal) => {
        updateCurrentSelection({...currentSelection, [index]:newVal});
    }

    const updateGardenTrees = (e) => { //This function needs to save an array of trees to the database as a property of the user doc
        e.preventDefault();
        console.log(treeInventory);
        console.log(currentSelection);
        console.log(virtualInventory);
    }

    //display html form with 5 drop downs
    //the options of the drop downs should be each unique tree a user owns from the virtual inventory state
    //on update of a dropdown, it should update currentSelection
    return (
        <div>
            <form onSubmit={updateGardenTrees}>
                {[0,1,2,3,4].map((numouter, index) => {
                    return (
                    <select key={index} name={"tree"+numouter} onChange={(e)=>{onDropdownUpdate(numouter, e.target.value)}}>
                        <option value="none" selected disabled hidden>Select a tree for slot {numouter+1}</option>
                        {Object.entries(virtualInventory).map((num)=>{
                            if (num[1] > 0) {
                                return (
                                    <option>{num[0]}</option>
                                )
                            }
                            else {
                                return (
                                    <option disabled>{num[0]}</option>
                                )
                            }
                        })}
                    </select>
                    )
                })}
                <button type="submit"> funnybutton </button>
            </form>
        </div>
    )
}

export default TreeDisplaySelector;