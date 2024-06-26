import React, { useState, useEffect } from 'react';

const SpotifyPlaylists = () => {
  const [accessToken, setAccessToken] = useState(null);
  const [userPlaylists, setUserPlaylists] = useState([]);
  // const [showChat, setShowChat] = useState(false);

  // const fetchUserPlaylists = async (token) => {
  //   try {
  //     const response = await fetch('https://api.spotify.com/v1/me/playlists', {
  //       headers: {
  //         'Authorization': `Bearer ${token}`
  //       }
  //     });

  //     if (response.ok) {
  //       const data = await response.json();
  //       setUserPlaylists(data.items);
  //     } else {
  //       console.error('Error fetching user playlists:', response.statusText);
  //     }
  //   } catch (error) {
  //     console.error('Error fetching user playlists:', error.message);
  //   }
  // };

  // useEffect(() => {
  //   const urlParams = new URLSearchParams(window.location.hash.substring(1));
  //   const token = urlParams.get('access_token');
  
  //   if (token) {
  //     console.log('Access Token:', token);  // Add this line
  //     setAccessToken(token);
  //     window.history.replaceState({}, document.title, window.location.pathname);
  //     fetchUserPlaylists(token);
  //   }
  // }, []);

  // const renderAuthenticatedContent = () => (
  //   <>
  //     <h2>Your Playlists</h2>
  //     <ul className="playlist-list">
  //       {userPlaylists.map(playlist => (
  //         <li key={playlist.id}>
  //           <a href={`https://open.spotify.com/playlist/${playlist.id}`} target="_blank" rel="noopener noreferrer">
  //             {playlist.name}
  //           </a>
  //         </li>
  //       ))}
  //     </ul>
  //   </>
  // );

  // const renderLoginButton = () => (
  //   <div className={`login-container ${showChat ? 'show' : ''}`}>
  //     <p>Please login to view your playlists.</p>
  //     <button onClick={handleLogin}>Login with Spotify</button>
  //   </div>
  // );

  // const handleLogin = () => {
  //   window.location.href = `https://accounts.spotify.com/authorize` +
  //     `?response_type=token` +
  //     `&client_id=e28c33e4105c463e92a7fe625cbd507a` +
  //     `&redirect_uri=${encodeURIComponent('http://localhost:5173/callback')}` +
  //     `&scope=user-read-private%20user-read-email%20playlist-read-private`;
  // };

  // const toggleChat = () => {
  //   setShowChat(!showChat);
  // };

  
  return (
    <div className="spotify-playlists-container">
      {accessToken ? renderAuthenticatedContent() : renderLoginButton()}
      <style>{`
        .spotify-playlists-container {
          position: relative;
        }
        
        .login-container {
          display: none;
          position: absolute;
          bottom: 0;
          right: 0;
          background-color: #f1f1f1;
          padding: 10px;
          border-radius: 5px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
        }

        .login-container.show {
          display: block;
        }
      `}</style>
    </div>
  );
};


export default SpotifyPlaylists;
