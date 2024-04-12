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


const db = getFirestore(app);

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
  const [isSendingToSelf, setIsSendingToSelf] = useState(false);
  const [user, setUser] = useState(null); // Assuming you have a way to fetch the current user

  // useEffect(() => {
  //   const fetchFriends = async () => {
  //     try {
  //       const friendsCollection = collection(db, 'usersNew');
  //       const unsubscribe = onSnapshot(friendsCollection, (snapshot) => {
  //         const fetchedFriends = snapshot.docs.map((doc) => ({
  //           username: doc.id, // Extract username as key
  //           ...doc.data(),
  //         }));
  //         setFriends(fetchedFriends);
  //       });
  //       return () => {
  //         if (typeof unsubscribe === 'function') {
  //           unsubscribe();
  //         }
  //       };
  //     } catch (error) {
  //       console.error('Error fetching friends:', error);
  //       setError('Error fetching friends. Please try again later.');
  //     }
  //   };

  // useEffect(() => {
  //   const fetchFriends = async () => {
  //     try {
  //       const friendsCollection = collection(db, 'usersNew');
  //       const unsubscribe = onSnapshot(friendsCollection, (snapshot) => {
  //         const fetchedFriends = snapshot.docs.map((doc) => ({
  //           username: doc.id, // Extract username as key
  //           ...doc.data(),
  //         }));
  //         setFriends(fetchedFriends);
  //       });
  //       return () => {
  //         if (typeof unsubscribe === 'function') {
  //           unsubscribe();
  //         }
  //       };
  //     } catch (error) {
  //       console.error('Error fetching friends:', error);
  //       setError('Error fetching friends. Please try again later.');
  //     }
  //   };
  
  //   const fetchUser = async () => {
  //     const fetchedUser = firebase.auth().currentUser;
  //     if (fetchedUser) {
  //       // The user is signed in.
  //       setUser({
  //         username: fetchedUser.displayName,
  //         email: fetchedUser.email,
  //         // Add any other user fields you need.
  //       });
  //     } else {
  //       // No user is signed in.
  //       console.log('No user is signed in.');
  //     }
  //   };
  
  //   fetchFriends();
  //   fetchUser();
  
  //   const unsubscribe = fetchFriends();

  //   return () => {
  //     if (typeof unsubscribe === 'function') {
  //       unsubscribe();
  //     }
  //   };
  // }, []);

  //UPDATED USEEFFECT:
  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const friendsCollection = collection(db, 'usersNew');
        const unsubscribe = onSnapshot(friendsCollection, (snapshot) => {
          const fetchedFriends = snapshot.docs.map((doc) => ({
            username: doc.id, // Extract username as key
            ...doc.data(),
          }));
          setFriends(fetchedFriends);
        });
        return unsubscribe;
      } catch (error) {
        console.error('Error fetching friends:', error);
        setError('Error fetching friends. Please try again later.');
      }
    };
  
    const fetchUser = async () => {
      const fetchedUser = firebase.auth().currentUser;
      if (fetchedUser) {
        // The user is signed in.
        setUser({
          username: fetchedUser.displayName,
          email: fetchedUser.email,
          // Add any other user fields you need.
        });
      } else {
        // No user is signed in.
        console.log('No user is signed in.');
      }
    };  
  
    const unsubscribeFromFriends = fetchFriends();
    fetchUser();
  
    return () => {
      if (typeof unsubscribeFromFriends === 'function') {
        unsubscribeFromFriends();
      }
    };
  }, []);
  
  // useEffect(() => {
  //   const fetchFriends = async () => {
  //     try {
  //       const friendsCollection = collection(db, 'usersNew');
  //       const unsubscribe = onSnapshot(friendsCollection, (snapshot) => {
  //         const fetchedFriends = snapshot.docs.map((doc) => ({
  //           username: doc.id, // Extract username as key
  //           ...doc.data(),
  //         }));
  //         setFriends(fetchedFriends);
  //       });
  //       return unsubscribe;
  //     } catch (error) {
  //       console.error('Error fetching friends:', error);
  //       setError('Error fetching friends. Please try again later.');
  //     }
  //   };
  
  //   const unsubscribeFromFriends = fetchFriends();
  
  //   const unsubscribeFromAuth = firebase.auth().onAuthStateChanged((user) => {
  //     if (user) {
  //       setUser({
  //         username: user.displayName,
  //         email: user.email,
  //         // Add any other user fields you need.
  //       });
  //     } else {
  //       setUser(null);
  //     }
  //   });
  
  //   return () => {
  //     if (typeof unsubscribeFromFriends === 'function') {
  //       unsubscribeFromFriends();
  //     }
  //     if (typeof unsubscribeFromAuth === 'function') {
  //       unsubscribeFromAuth();
  //     }
  //   };
  // }, []);
  

  //OLD INVITEFRIEND
  // const inviteFriend = async () => {
  //   if (!selectedFriend) {
  //     console.error('No friend selected.');
  //     return;
  //   }
  
  //   console.log('Inviting friend:', selectedFriend);
  //   try {
  //     const recipientDocRef = doc(db, 'usersNew', selectedFriend.username);
  //     await updateDoc(recipientDocRef, {
  //       friendRequests: FieldValue.arrayUnion(user.username),
  //     });
  
  //     toast.success(`Friend request sent to ${selectedFriend.username}`);
  //   } catch (error) {
  //     console.error('Error sending friend request:', error);
  //     toast.error('Error sending friend request. Please try again.');
  //   }
  // };

  //UPDATED INVITEFRIEND
  // const inviteFriend = async () => {
  //   if (!selectedFriend) {
  //     console.error('No friend selected.');
  //     return;
  //   }
  
  //   console.log('Inviting friend:', selectedFriend);
  //   try {
  //     const recipientDocRef = doc(db, 'usersNew', selectedFriend.username);
  //     await updateDoc(recipientDocRef, {
  //       friendRequests: FieldValue.arrayUnion(user.username),
  //     });
  
  //     toast.success(`Friend request sent to ${selectedFriend.username}`);
  //   } catch (error) {
  //     console.error('Error sending friend request:', error);
  //     toast.error('Error sending friend request. Please try again.');
  //   }
  // };

  const inviteFriend = async () => {
    if (!selectedFriend) {
      console.error('No friend selected.');
      return;
    }
  
    if (!user || !user.username) {
      console.error('No user is signed in.');
      return;
    }
  
    console.log('Inviting friend:', selectedFriend);
    try {
      const recipientDocRef = doc(db, 'usersNew', selectedFriend.username);
      await updateDoc(recipientDocRef, {
        friendRequests: FieldValue.arrayUnion(user.username),
      });
  
      toast.success(`Friend request sent to ${selectedFriend.username}`);
    } catch (error) {
      console.error('Error sending friend request:', error);
      toast.error('Error sending friend request. Please try again.');
    }
  };
  
  
  

    // Implement logic to handle accepting friend requests (not shown)

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
    </div>
  );
};

export default App1;
