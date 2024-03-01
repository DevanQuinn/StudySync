import React from 'react';

const LoginButton = () => {
  const handleLogin = () => {
    window.location.href = `https://accounts.spotify.com/authorize` +
      `?response_type=token` +
      `&client_id=e28c33e4105c463e92a7fe625cbd507a` +
      `&redirect_uri=${encodeURIComponent('http://localhost:5173/callback')}` +
      `&scope=user-read-private%20user-read-email%20playlist-read-private`;
  };

  return (
    <div>
      <p>Please login to view your playlists.</p>
      <button onClick={handleLogin}>Login with Spotify</button>
    </div>
  );
};

export default LoginButton;
