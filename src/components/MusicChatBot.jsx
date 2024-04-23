import React, { useState } from 'react';

const MusicChatBot = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleButtonClick = () => {
    setIsExpanded(!isExpanded);
  };

  const handleLogin = () => {
    window.location.href = `https://accounts.spotify.com/authorize` +
      `?response_type=token` +
      `&client_id=e28c33e4105c463e92a7fe625cbd507a` +
      `&redirect_uri=${encodeURIComponent('http://localhost:5173/callback')}` +
      `&scope=user-read-private%20user-read-email%20playlist-read-private`;
  };

  return (
    <div className={`chat-icon ${isExpanded ? 'expanded' : ''}`} onClick={handleButtonClick}>
      {isExpanded ? (
        <div>
          <p>Please login to view your playlists.</p>
          <button onClick={handleLogin}>Login with Spotify</button>
        </div>
      ) : (
        'Listen to Music'
      )}
      <style>{`
        .chat-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          position: fixed;
          bottom: -35px;
          right: 30px;
          background-color: #1ec997;
          color: #000000;
          width: 95px;
          height: 95px;
          margin-bottom: 80px;
          margin-right: 10px;
          cursor: pointer;
          z-index: 1049;
          transition: width 0.5s, height 0.5s;  // Add transition for smooth animation
        }

        .chat-icon.expanded {
          width: 300px;  // Increase width when expanded
          height: 300px;  // Increase height when expanded
          padding: 10px;  // Add some padding for the expanded content
          text-align: center;  // Center the expanded content
        }
      `}</style>
    </div>
  );
};

export default MusicChatBot;
