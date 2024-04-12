import React from 'react';
import firebase from 'firebase/app'; // Assuming Firebase is initialized
import 'firebase/firestore';

const FriendDropdown = ({ friends, setSelectedFriend, user }) => {
  const handleSelectChange = async (event) => {
    const selectedFriendName = event.target.value;
    const selectedFriend = friends.find(friend => friend.name === selectedFriendName);
    setSelectedFriend(selectedFriend);
  
    if (selectedFriend) {
      await handleSendFriendRequest(selectedFriend.username);
    }
  };
  
  

  const handleSendFriendRequest = async (friendUsername) => {
    try {
      const recipientRef = await firestore.collection('usersNew').doc(friendUsername);
      await recipientRef.update({
        friendRequests: firebase.firestore.FieldValue.arrayUnion(user.username),
      });

      const notificationRef = await firestore.collection('notifications').add({
        senderId: user.username,
        recipientId: friendUsername,
        type: 'friendRequest',
        message: `${user.username} sent you a friend request!`,
      });

      console.log('Friend request sent!', notificationRef.id);
      // Optionally trigger UI update to reflect sent request
    } catch (error) {
      console.error('Error sending friend request:', error);
      // Handle errors gracefully, e.g., display an error message
    }
  };

  return (
    <select onChange={handleSelectChange}>
      <option value="">Select a friend</option>
      {friends.map((friend, index) => (
        <option key={index} value={friend.username} onClick={() => handleSendFriendRequest(friend.username)}>
          {friend.name}
        </option>
      ))}
    </select>
  );
};

export default FriendDropdown;
