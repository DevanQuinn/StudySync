import React from 'react';

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

export default FriendDropdown;
