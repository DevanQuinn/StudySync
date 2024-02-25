import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../StudyRoomUI/RoomDetailsPage.css'


function RoomDetailsPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const { name, description, img } = location.state || {}; // Assuming state is passed correctly

    const handleExit = () => {
        navigate('/studyroom'); // Adjust the path as needed based on your app's routing structure
    };

    const friends = [
        //Get friends later from firebase
        { id: 1, name: "Alice" },
        { id: 2, name: "Bob" },
        { id: 3, name: "Charlie" },
    ];
    
    //toggle off if its apart of the invitedRooms
    const handleAddToFavorites = () => {
        console.log(`Adding ${name} to favorites`);
        // Implement the logic to add the room to favorites // add to firebase
    };
    
    // Inline style for green text
    const textStyle = { color: 'green' };

   
    return (
        <div style={{ backgroundImage: `url(${img})`, backgroundSize: 'cover', height: '100vh', color: '#fff' }}>
            <h1 style={textStyle}>{name}</h1>
            <p style={textStyle}>{description}</p>
            <button onClick={handleExit} style={{ position: 'absolute', top: '20px', right: '20px' }}>Exit</button>
            <div style={{ color: 'green', position: 'absolute', top: '200px', right: '20px', backgroundColor: 'rgba(255, 255, 255, 0.9)', padding: '10px', borderRadius: '5px' }}>
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