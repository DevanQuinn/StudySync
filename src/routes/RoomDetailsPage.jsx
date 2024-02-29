import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth'; // Import getAuth

function RoomDetailsPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const { name, description, img } = location.state || {}; // Assuming state is passed correctly

    const handleExit = () => {
        navigate('/studyroom'); // Adjust the path as needed based on your app's routing structure
    };



    const handleAddToFavorites = async () => {
        const auth = getAuth(); // Initialize Firebase Auth
        const user = auth.currentUser; // Get the current user
      
        const favRoomData = {
            name,
            description,
            time: parseInt(time, 10),
            backgroundImage: downloadURL,
            friendInvites: friendInvites.split(',').map(invite => invite.trim()),
          };

        const db = getFirestore(); // Get Firestore instance, make sure Firebase is initialized
    
        try {
            const collectionName = `${userId}_favstudyroom`;
            await addDoc(collection(db, collectionName), favRoomData);
            console.log("Favorite room added with ID: ");
        } catch (e) {
            console.error("Error adding favorite room: ", e);
        }
    };

    const friends = [
        //Get friends later from firebase
        { id: 1, name: "Alice" },
        { id: 2, name: "Bob" },
        { id: 3, name: "Charlie" },
    ];
    
    
    // Inline style for green text
    const textStyle = { color: 'green' };

   
    return (
        <div style={{ position: 'fixed', top: 60, left: 0, width: '100vw', height: '100vh', backgroundImage: `url(${img})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <div style={{ padding: '20px' }}>
                <h1 style={textStyle}>{name}</h1>
                <p style={textStyle}>{description}</p>
                <button onClick={handleExit} style={{ background: 'green', position: 'absolute', top: '20px', right: '20px' }}>End Room</button>
                <button onClick={handleAddToFavorites} style={{ background: 'green', position: 'absolute', top: '20px', right: '140px' }}>Add to Favorites</button>
            </div>
            <div style={{ color: 'green', position: 'absolute', top: '200px', right: '20px', backgroundColor: 'rgba(255, 255, 255, 0.8)', padding: '10px', borderRadius: '5px' }}>
                <h3>Active Friends</h3>
                <ul>
                    {friends.map(friend => (
                        <li key={friend.id}>{friend.name}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default RoomDetailsPage;