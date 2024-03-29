import React from 'react';

const NotificationFeedback = ({ onConfirm, onDecline, selectedFriend }) => {

  return (
    <div>
      {/* Pop-up content for accepting or declining friend request */}
      <p>Do you want to accept {selectedFriend.name}'s friend request?</p>
      <button onClick={onConfirm}>Yes</button>
      <button onClick={onDecline}>No</button>
    </div>
  );
};

export default NotificationFeedback;