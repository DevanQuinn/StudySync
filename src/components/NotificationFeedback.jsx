import React from 'react';

const NotificationFeedback = ({ onConfirm, onDecline, selectedFriend }) => {
  return (
    <div className="notification-popup"> {/* Add CSS class for styling */}
      <p>Would you like to accept the friend request from {selectedFriend.name}?</p>
      <button className="confirm-button" onClick={onConfirm}>
        <i className="fas fa-check"></i> {/* Replace with your preferred icon */}
      </button>
      <button className="decline-button" onClick={onDecline}>
        <i className="fas fa-times"></i> {/* Replace with your preferred icon */}
      </button>
    </div>
  );
};

export default NotificationFeedback;
