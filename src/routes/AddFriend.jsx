import React, { useState, useEffect } from 'react';
import {
  getFirestore,
  collection,
  onSnapshot,
  doc,
  updateDoc,
} from "firebase/firestore";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import app from '../firebase'; // Adapt this import path to your Firebase configuration
import firebase from '../firebase';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { FieldValue } from 'firebase/firestore';


const db = getFirestore(app);
const auth = getAuth(app);

// const FriendDropdown = ({ friends, selectedFriend, setSelectedFriend, inviteFriend }) => {
//   const handleSelectChange = (event) => {
//     const selectedFriendName = event.target.value;
//     const friend = friends.find((friend) => friend.username === selectedFriendName);
//     setSelectedFriend(friend);
//   };

//   return (
//     <div>
//       <select onChange={handleSelectChange}>
//         <option value="">Select a friend</option>
//         {friends.map((friend, index) => (
//           <option key={index} value={friend.username}>
//             {friend.username}
//           </option>
//         ))}
//       </select>
//       <button onClick={() => selectedFriend && inviteFriend(selectedFriend)}>Send Invite</button>
//     </div>
//   );
// };


const FriendDropdown = ({ friends, selectedFriend, setSelectedFriend, inviteFriend }) => {
  const handleSelectChange = (event) => {
    const selectedFriendId = event.target.value;
    const friend = friends.find((friend) => friend.id === selectedFriendId);
    setSelectedFriend(friend);
  };

  return (
    <div>
      <select onChange={handleSelectChange}>
        <option value="">Select a friend</option>
        {friends.map((friend, index) => (
          <option key={index} value={friend.id}>
            {friend.username}
          </option>
        ))}
      </select>
      <button onClick={() => selectedFriend && inviteFriend(selectedFriend)}>Send Invite</button>
    </div>
  );
};

const App1 = () => {
  const [friends, setFriends] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [isLoadingRequest, setIsLoadingRequest] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);

  /*const fetchFriends = async () => {
    try {
      const friendsCollection = collection(db, 'usersNew');
      const unsubscribe = onSnapshot(friendsCollection, (snapshot) => {
        setFriends(snapshot.docs.map((doc) => ({
          username: doc.id,
          ...doc.data(),
        })));
      });
      return unsubscribe;
    } catch (error) {
      console.error('Error fetching friends:', error);
      // Handle errors, if any
    }
  };
  */
  // Modify the fetchFriends function to filter out private profiles
  const fetchFriends = async () => {
    try {
      const friendsCollection = collection(db, 'usersNew');
      const unsubscribe = onSnapshot(friendsCollection, (snapshot) => {
        setFriends(snapshot.docs.map((doc) => ({
          username: doc.id,
          ...doc.data(),
        })).filter((friend) => !friend.isPrivate)); // Filter out friends with isPrivate set to true
      });
      return unsubscribe;
    } catch (error) {
      console.error('Error fetching friends:', error);
      // Handle errors, if any
    }
  };


// Add a function to handle the visibility toggle
const handleVisibilityToggle = async () => {
  setIsPrivate(!isPrivate);
  const userDocRef = doc(db, 'usersNew', user.uid);
  await updateDoc(userDocRef, {
    isPrivate: !isPrivate
  });
};

  const fetchUser = async () => {
    setIsLoadingUser(true);
    try {
      const fetchedUser = auth.currentUser;
      if (!fetchedUser) {
        console.error('No user found in fetchUser, even after sign-in.');
        toast.error('User data not found. Please try signing in again.');
        return;
      }
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
    const fetchData = async () => {
      try {
        await setPersistence(auth, browserLocalPersistence);
        await fetchUser();
        const unsubscribeFromFriends = fetchFriends();
        return () => {
          if (unsubscribeFromFriends) {
            unsubscribeFromFriends();
          }
        };
      } catch (error) {
        console.error('Error fetching data:', error);
        // Handle errors, if any
      }
    };
    fetchData();
  }, []);


  async function inviteFriend(selectedFriend) {
    try {
      if (!selectedFriend || !selectedFriend.username) {
        throw new Error('Selected friend or username is undefined or null.');
      }
  
      const recipientDocRef = doc(db, 'usersNew', selectedFriend.username);
  
      // Use FieldValue directly
      await updateDoc(recipientDocRef, {
        friendRequests: FieldValue.arrayUnion(user.uid)
      });
  
      toast.success(`Friend request sent to ${selectedFriend.username}`);

    console.log('Inviting friend:', selectedFriend);
    setSelectedFriend(selectedFriend);
  };

  const handleAcceptRequest = async (accept) => {
    try {
      const userDocRef = doc(db, 'usersNew', "Sai Monish"); // Change "Your Name" to your actual name
      const friendsCount = accept ? 1 : 0;
      await setDoc(userDocRef, { friendsCount });
      //toast.success(`Friend request ${accept ? 'accepted' : 'rejected'}`);
      setShowConfirmation(false);
      console.log('Friend request processed successfully');
    } catch (error) {
      console.error('Error sending friend request:', error);
      toast.error('Error sending friend request. Please try again.');
    } finally {
      setIsLoadingRequest(false);
    }
  }
  
  

  return (
    <div>
      <button onClick={handleVisibilityToggle}>
  {isPrivate ? 'Set Profile to Public' : 'Set Profile to Private'}
  </button>
      <h2>Sending Friend Request</h2>
      <FriendDropdown
        friends={friends}
        selectedFriend={selectedFriend}
        setSelectedFriend={setSelectedFriend}
        inviteFriend={inviteFriend}
      />
      <ToastContainer />
      <div>
        {isLoadingUser ? (
          <p>Loading user data...</p>
        ) : (
          user ? (
            <button onClick={inviteFriend} disabled={isLoadingRequest}>
              {isLoadingRequest ? 'Sending Request...' : 'Send Friend Request'}
            </button>
          ) : (
            <p>Please sign in.</p>
          )
        )}
      </div>
    </div>
  );
};

export default App1;
