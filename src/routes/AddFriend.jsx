import React, { useState, useEffect } from 'react';
//import { getFirestore } from 'firebase/firestore';
console.log("WORKED HERE");


//import { app, db } from '/Users/saimonishtunguturu/307S24Project/StudySync/src/firebase.js'; // Adjust the path if necessary

import { db } from '/Users/saimonishtunguturu/307S24Project/StudySync/src/firebase.js';
console.log("DB: ", db);

//const db = getFirestore(app); // Initialize Firestore using the Firebase app

const FriendDropdown = ({ friends }) => {
  return (
    <select>
      <option value="">Select a friend</option>
      {friends.map((friend, index) => (
        <option key={index} value={friend.username}>
          {friend.username}
        </option>
      ))}
    </select>
  );
};

const App = () => {
  const [friends, setFriends] = useState([]);

  const [error, setError] = useState(null);

useEffect(() => {
  const fetchFriends = async () => {
    try {
      const friendsCollection = await db.collection('friends').get();
      const fetchedFriends = friendsCollection.docs.map(doc => doc.data());
      setFriends(fetchedFriends);
    } catch (error) {
      console.error('Error fetching friends:', error);
      setError('Error fetching friends. Please try again later.');
    }
  };

  fetchFriends();
}, []);


  const inviteFriends = selectedFriends => {
    console.log('Inviting friends:', selectedFriends);
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <FriendDropdown friends={friends} />
      <button onClick={() => inviteFriends(friends)}>Invite Selected Friends</button>
    </div>
  );
};

export { FriendDropdown, App };
