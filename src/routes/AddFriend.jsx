import React, { useState, useEffect } from 'react';
import { db } from '/Users/saimonishtunguturu/307S24Project/StudySync/src/firebase.js';
import { collection, onSnapshot } from "firebase/firestore";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NotificationFeedback from '/Users/saimonishtunguturu/307S24Project/StudySync/src/components/NotificationFeedback.jsx';

const FriendDropdown = ({ friends, setSelectedFriend }) => {
  const handleSelectChange = (event) => {
    const selectedFriendName = event.target.value;
    const selectedFriend = friends.find(friend => friend.name === selectedFriendName);
    setSelectedFriend(selectedFriend);
  };

  return (
    <select onChange={handleSelectChange}>
      <option value="">Select a friend</option>
      {friends.map((friend, index) => (
        <option key={index} value={friend.name}>
          {friend.name}
        </option>
      ))}
    </select>
  );
};

const App1 = () => {
  const [friends, setFriends] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const friendsCollection = collection(db, 'friends');
        const unsubscribe = onSnapshot(friendsCollection, (snapshot) => {
          const fetchedFriends = snapshot.docs.map(doc => doc.data());
          setFriends(fetchedFriends);
        });
        return () => {
          // Ensure that unsubscribe is a function before calling it
          if (typeof unsubscribe === 'function') {
            unsubscribe(); // Call the unsubscribe function when the component unmounts
          }
        };
      } catch (error) {
        console.error('Error fetching friends:', error);
        setError('Error fetching friends. Please try again later.');
      }
    };

    const unsubscribe = fetchFriends(); // Call the fetchFriends function and store the unsubscribe function

    return () => {
      // Ensure that unsubscribe is a function before calling it
      if (typeof unsubscribe === 'function') {
        unsubscribe(); // Call the unsubscribe function when the component unmounts
      }
    };
  }, []);

  const inviteFriend = async (friend) => {
    if (!friend) {
      console.error('No friend selected.');
      return;
    }

    console.log('Inviting friend:', friend);
    
    try {
      // Check if the browser supports notifications and permission is granted
      if ('Notification' in window && Notification.permission === 'granted') {
        // Create a notification
        new Notification(`Invitation sent to ${friend.name}`);
      } else if ('Notification' in window && Notification.permission !== 'denied') {
        // Request permission to display notifications
        await Notification.requestPermission();
        // Check if permission is granted
        if (Notification.permission === 'granted') {
          // Create a notification
          new Notification(`Invitation sent to ${friend.name}`);
        } else {
          console.log('Notification permission denied.');
          // Provide feedback to the user that notifications are blocked
        }
      } else {
        // Fallback for browsers that don't support notifications or permission denied
        alert(`Invitation sent to ${friend.name}`);
      }

      // Display toast notification
      toast.success(`Invitation sent to ${friend.name}`);
      
      console.log('Invitation sent successfully');
    } catch (error) {
      console.error('Error sending invitation:', error);
    }
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <FriendDropdown friends={friends} setSelectedFriend={setSelectedFriend} />
      <button onClick={() => inviteFriend(selectedFriend)}>Invite Selected Friend</button>
      <ToastContainer />
    </div>
  );
};

export default App1;