import React from 'react';

const UserProfile = ({ user, isPublic }) => {
  return (
    <div>
      <h2>User Profile</h2>
      <p>Username: {user.username}</p>
      {isPublic && <p>Email: {user.email}</p>}
      <p>Profile Visibility: {isPublic ? 'Public' : 'Private'}</p>
    </div>
  );
};

export default UserProfile;
