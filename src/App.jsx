import React, { useState } from 'react';
import './App.css';

function App() {
  const [studyRooms, setStudyRooms] = useState([
    { id: 1, title: 'Math Study Group', description: 'Studying for the upcoming math exam.' },
    // Add more study rooms as needed
    // get from database for favorited.
  ]);

  const [favoritedRooms, setFavoritedRooms] = useState([]);
  const [studyRoomHistory, setStudyRoomHistory] = useState([]);

  const handleCreateRoom = () => {
    console.log('Creating new study room...');
  };

  return (
    <div className="App">
      <header className="header">
        <h1>Study Room</h1>
      </header>
      <button className="button" onClick={handleCreateRoom}>Create Study Room</button>
      <div className="main-content">
        <div className="left-sidebar">
          <h3>Favorited Rooms</h3>
        </div>
        <div className="study-rooms">
          {studyRooms.map(room => (
            <div key={room.id} className="study-room">
              <h2>{room.title}</h2>
              <p>{room.description}</p>
            </div>
          ))}
         
        </div>
      </div>
    </div>
  );
}

export default App;
