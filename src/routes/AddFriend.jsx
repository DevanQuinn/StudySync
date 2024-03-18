import React, { useState, useEffect } from 'react';

// User class with friends list property
class User {
  constructor(username) {
    this.username = username;
    this.friends = [];
  }

  addFriend(friend) {
    this.friends.push(friend);
  }
}

// FriendDropdown component
const FriendDropdown = ({ user, friends }) => {
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

// App component
const App = () => {
  const [currentUser, setCurrentUser] = useState(new User('Alice'));
  const [friends, setFriends] = useState([
    new User('Bob'),
    new User('Charlie'),
    new User('David'),
    new User('Emily')
  ]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  // Search functionality
  useEffect(() => {
    const filteredResults = friends.filter(friend =>
      friend.username.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSearchResults(filteredResults);
  }, [searchQuery, friends]);

  // Invite friends function
  const inviteFriends = selectedFriends => {
    // Add logic to send invitations to selected friends
    console.log('Inviting friends:', selectedFriends);
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <FriendDropdown user={currentUser} friends={searchResults} />
      <input
        type="text"
        placeholder="Search for friends"
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
      />
      <button onClick={() => inviteFriends(selectedFriends)}>Invite Selected Friends</button>
    </div>
  );
};

export default App;