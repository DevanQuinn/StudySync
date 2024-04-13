import React, { useState, useEffect } from 'react';
import {
  getFirestore,
  collection,
  onSnapshot,
  doc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NotificationFeedback from '../components/NotificationFeedback.jsx';
import app from '../firebase'; // Adapt this import path to your Firebase configuration
import firebase from '../firebase';
import { FieldValue } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { setPersistence, browserLocalPersistence } from 'firebase/auth'; 


const db = getFirestore(app);
const auth = getAuth(app);

//DROPDOWN ON FRIENDS TO SEND A FRIEND REQUEST TO
const FriendDropdown = ({ friends, setSelectedFriend, inviteFriend }) => {
  const handleSelectChange = (event) => {
    const selectedFriendName = event.target.value;
    const selectedFriend = friends.find((friend) => friend.username === selectedFriendName);
    setSelectedFriend(selectedFriend);
  };

  return (
    <div>
      <select onChange={handleSelectChange}>
        <option value="">Select a friend</option>
        {friends.map((friend, index) => (
          <option key={index} value={friend.username}>
            {friend.username}
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
  const [user, setUser] = useState(null); 
  const [isLoadingUser, setIsLoadingUser] = useState(true); // Add this state
  const [isLoadingRequest, setIsLoadingRequest] = useState(false);


  const fetchFriends = async () => {
    try {
        const friendsCollection = collection(db, 'usersNew');
        const unsubscribe = onSnapshot(friendsCollection, (snapshot) => {
            setFriends(snapshot.docs.map((doc) => ({
                username: doc.id, // Extract username as key
                ...doc.data(),
            })));
        });
        return unsubscribe;
    } catch (error) {
        console.error('Error fetching friends:', error);
        setError('Error fetching friends. Please try again later.');
    }
};



// const fetchUser = async () => {
//   setIsLoadingUser(true); 
//   console.log("fetchUser - before auth.currentUser:", auth.currentUser); 
//   try {
//     const fetchedUser = auth.currentUser;
//     console.log("fetchUser - after fetch:", fetchedUser); 
//     if (fetchedUser) {
//       setUser(fetchedUser);
//       localStorage.setItem('loggedInUser', fetchedUser.displayName); 
//     } else {
//       console.log('No user is signed in.');
//     }
//   } catch (error) {
//     console.error('Error fetching user:', error);
//     setError('Failed to fetch user information. Please try again.'); 
//   } finally {
//     setIsLoadingUser(false);
//   }
// };


// Modified fetchUser function
const fetchUser = async () => { 
  setIsLoadingUser(true); 
  try {
      const fetchedUser = auth.currentUser;

      // Double-check for null
      if (!fetchedUser) {
          console.error('No user found in fetchUser, even after sign-in.');
          toast.error('User data not found. Please try signing in again.');
          return; // Exit if user data is unexpectedly missing
      }

      // ... (Potentially fetch additional user data from Firestore if needed)

      setUser(fetchedUser);
      localStorage.setItem('loggedInUser', fetchedUser.displayName); 
  } catch (error) {
      console.error('Error fetching user:', error);
      toast.error('Failed to fetch user information. Please try again.'); 
  } finally {
      setIsLoadingUser(false);
  }
};

useEffect(() => {
  
    // Attempt to fetch user on component mount
    const initialFetch = async () => {
      try {
          await setPersistence(auth, browserLocalPersistence); // Assuming this is initialized correctly
          console.log('Persistence set successfully'); 
          await new Promise(resolve => setTimeout(resolve, 1000)); // Delay of 1 second    
          await fetchUser(); 
      } catch (error) {
          console.error('Error initializing authentication persistence or fetching user', error);
      }
  };

  initialFetch();

  const unsubscribeFromFriends = fetchFriends();
  fetchUser(); 
  return () => {
      if (typeof unsubscribeFromFriends === 'function') {
          unsubscribeFromFriends();
      }
  };
}, []);

const inviteFriend = async () => {
  if (!selectedFriend) {
    toast.error('Please select a friend to send a request to.');
    return; 
  }

  if (!user) {
    toast.error('Please sign in to send a friend request.');
    return; 
  }

  if (selectedFriend.username === user.username) {
    toast.error('You cannot send a friend request to yourself.');
    return;
  }

  setIsLoadingRequest(true);

  try {
    const recipientDocRef = doc(db, 'usersNew', selectedFriend.username);
    console.log("Sender's ID:", user.uid);
    // await updateDoc(recipientDocRef, {
    //   friendRequests: FieldValue.arrayUnion({
    //     senderId: user.uid, // Store sender's ID for request management
    //     senderUsername: user.username
    //   }),
    // });
    await updateDoc(recipientDocRef, {
      friendRequests: FieldValue.arrayUnion({
        senderId: user.uid, 
        senderUsername: user.username
      })
    });
    

    toast.success(`Friend request sent to ${selectedFriend.username}`);
  } catch (error) {
    console.error('Error sending friend request:', error);
    toast.error('Error sending friend request. Please try again.');
  } finally {
    setIsLoadingRequest(false);
  }
};

const handleAcceptRequest = async (accept) => {
  if (accept) {
    try {
      // Update the friends list of the current user and the selected friend
      const userDocRef = doc(db, 'usersNew', user.username);
      const friendDocRef = doc(db, 'usersNew', selectedFriend.username);

      await updateDoc(userDocRef, {
        friends: FieldValue.arrayUnion(selectedFriend.username),
      });

      await updateDoc(friendDocRef, {
        friends: FieldValue.arrayUnion(user.username),
      });

      toast.success(`You are now friends with ${selectedFriend.username}`);
    } catch (error) {
      console.error('Error accepting friend request:', error);
      toast.error('Error accepting friend request. Please try again.');
    }
  }

  // Close the confirmation modal
  setShowConfirmation(false);
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

    {/* Conditional User Status Display */} 
    <div> {/* Added a container div */} 
        {isLoadingUser ? (
            <p>Loading user data...</p>
        ) : (
            user ? (
            <> 
                <p>Logged in as: {user.username}</p>
                <button onClick={inviteFriend} disabled={isLoadingRequest}>
                {isLoadingRequest ? 'Sending Request...' : 'Send Friend Request'}
                </button> 
            </>
            ) : (
            <p>Please sign in.</p> 
            )
        )}
    </div>  
    </div>
  );
};

export default App1;