import React, { useState, useEffect } from 'react';
import { db } from '/Users/saimonishtunguturu/307S24Project/StudySync/src/firebase.js';
import { collection, onSnapshot, doc, setDoc } from "firebase/firestore";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NotificationFeedback from '/Users/saimonishtunguturu/307S24Project/StudySync/src/components/NotificationFeedback.jsx';

const FriendDropdown = ({ friends, setSelectedFriend, inviteFriend }) => {
  const handleSelectChange = (event) => {
    const selectedFriendName = event.target.value;
    const selectedFriend = friends.find(friend => friend.name === selectedFriendName);
    setSelectedFriend(selectedFriend);
  };

  return (
    <div>
      <select onChange={handleSelectChange}>
        <option value="">Select a friend</option>
        {friends.map((friend, index) => (
          <option key={index} value={friend.name}>
            {friend.name}
          </option>
        ))}
      </select>
      <button onClick={inviteFriend}>Send Invite</button>
    </div>
  );
};

const App1 = () => {
  const [friends, setFriends] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [error, setError] = useState(null);
  const [isSendingToSelf, setIsSendingToSelf] = useState(false);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const friendsCollection = collection(db, 'friends');
        const unsubscribe = onSnapshot(friendsCollection, (snapshot) => {
          const fetchedFriends = snapshot.docs.map(doc => doc.data());
          setFriends(fetchedFriends);
        });
        return () => {
          if (typeof unsubscribe === 'function') {
            unsubscribe();
          }
        };
      } catch (error) {
        console.error('Error fetching friends:', error);
        setError('Error fetching friends. Please try again later.');
      }
    };

    const unsubscribe = fetchFriends();

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  const inviteFriend = () => {
    if (!selectedFriend) {
      console.error('No friend selected.');
      return;
    }

    console.log('Inviting friend:', selectedFriend);
    setSelectedFriend(selectedFriend);

    if (selectedFriend.name === "Your Name") { // Change "Your Name" to your actual name
      setIsSendingToSelf(true);
      setShowConfirmation(true);
    } else {
      setIsSendingToSelf(false);
      // Logic to send friend request to selectedFriend
      // For now, just display a toast
      toast.success(`Friend request sent to ${selectedFriend.name}`);
    }
  };

  const handleAcceptRequest = async (accept) => {
    try {
      const userDocRef = doc(db, 'usersNew', "Sai Monish"); // Change "Your Name" to your actual name
      const friendsCount = accept ? 1 : 0;
      await setDoc(userDocRef, { friendsCount });
      toast.success(`Friend request ${accept ? 'accepted' : 'rejected'}`);
      setShowConfirmation(false);
      console.log('Friend request processed successfully');
    } catch (error) {
      console.error('Error processing friend request:', error);
    }
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <FriendDropdown
        friends={friends}
        setSelectedFriend={setSelectedFriend}
        inviteFriend={inviteFriend}
      />

      {showConfirmation && (
        <div className="modal">
          <div className="modal-content">
            <h2>{isSendingToSelf ? 'Accept Friend Request' : 'Send Friend Request'}</h2>
            {isSendingToSelf ? (
              <p>Do you want to accept the friend request from {selectedFriend.name}?</p>
            ) : (
              <p>Do you want to send a friend request to {selectedFriend.name}?</p>
            )}
            <div className="modal-buttons">
              {isSendingToSelf ? (
                <>
                  <button onClick={() => handleAcceptRequest(true)}>Yes</button>
                  <button onClick={() => handleAcceptRequest(false)}>No</button>
                </>
              ) : (
                <button onClick={() => setShowConfirmation(false)}>Close</button>
              )}
            </div>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default App1;
