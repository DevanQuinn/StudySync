import Select from 'react-dropdown-select'
import {useState, useEffect} from 'react'

const TreeDisplaySelector = () => {
    const [treeInventory, updateTreeInventory] = useState({}); //treeInventory should be an object
    // with keys being treeIDs and values being quantity in user inventory
    const [virtualInventory, updateVirtualInventory] = useState({}) //same as treeInventory, except
    // ommitting trees that are already selected
    const [currentSelection, updateCurrentSelection] = useState({}) //currentSelection should be an object
    //where  keys are the index of the dropdown and values are the treeID selected at that dropdown
    
    
    
    useEffect(() => {
        var tempVirtualInventory = treeInventory;
        currentSelection.forEach((item, index) => {
            tempVirtualInventory = {...tempVirtualInventory, [item[index]]:(tempVirtualInventory[item[index]] - 1)}
        })
        updateVirtualInventory(tempVirtualInventory);
        //set virtualInventory to be treeInventory minus currentSelection
    }, [currentSelection])

    const onDropdownUpdate = (index, newVal) => {
        updateCurrentSelection({...currentSelection, [index]:newVal});
    }

    //handle submission of form
    //  if requested trees are not in inventory
    //    throw alert, dont update database
    //  if requested trees are in inventory
    //    update user doc in database with a new gardenTrees obj
    //    should be a property on the user doc with the key gardenTrees
    //    and a value equal to an array of 5 ints



    //display html form with 5 drop downs
    //the options of the drop downs should be each unique tree a user owns from the virtual inventory state
    //on update of a dropdown, it should update currentSelection
    return (
        <form handleSubmit={updateGardenTrees}>
        </form>
    )
}