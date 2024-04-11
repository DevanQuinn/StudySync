import treeImages from './treeImages.jsx';
import {useState, useEffect} from 'react';
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

const treeDisplayBanner = () => { //trees should be an array of ints, each representing a treeID
    const [trees, updateTrees] = useState([]); //used to hold truncated tree array
    const user = useUser(false);
    const db = getFirestore(app);

    useEffect(()=>{console.log(trees)}, [trees]);

    useEffect(() => {
		var username;
		if (user) { //if logged in
			const q = query(collection(db, "users"), where("userID", "==", user.uid)); //get user
			getDocs(q).then(userssnapshot => {
				userssnapshot.forEach(user => { //should only run once if userID is unique
					username = user.data().username;
				})
			}).then(() => { //with username
				const docRef = doc(db, 'users', username); //find user object. usernames should be unique
				setDoc(docRef, {}, {merge:true}).then(() => { //ensure that user object exists before trying to write to its properties
					getDoc(docRef).then((doc) => { //get that users properties
						updateTrees(doc.data().treeSelection)
                    }); //set the frontends properties equal to the database properties
				})
			})
		}
    }, [user])

    return (
        <div>
            {trees.map((tree, index) => {
                return(
                    <img key={index} src={treeImages[tree].tree} style={{width:'10wv', height:'10vw'}}/>
                )
            })}
        </div>
    )
}

export default treeDisplayBanner;