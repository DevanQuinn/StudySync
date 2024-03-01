import React, { useState, useEffect } from 'react';

const SpotifyPlaylists = () => {
  const [accessToken, setAccessToken] = useState(null);
  const [userPlaylists, setUserPlaylists] = useState([]);
  const urlParams = new URLSearchParams(window.location.hash.substring(1));
  const token = urlParams.get('access_token');

  const fetchUserPlaylists = async () => {
    try {
      const response = await fetch('https://api.spotify.com/v1/me/playlists', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log("response: ", response);
      console.log(accessToken);
      if (response.ok) {
        const data = await response.json();
        setUserPlaylists(data.items);
        console.log("Hello");
      } else {
        console.error('Error fetching user playlists:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching user playlists:', error.message);
    }
  };

  /*useEffect(() => {
    const urlParams = new URLSearchParams(window.location.hash.substring(1));
    const token = urlParams.get('access_token');

    if (token) {
      setAccessToken(token);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  useEffect(() => {
    if (accessToken) {
      fetchUserPlaylists();
    }
  }, [accessToken]);
  */
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.hash.substring(1));
    const token = urlParams.get('access_token');
  
    if (token) {
      console.log('Access Token:', token);  // Add this line
      setAccessToken(token);
      console.log(accessToken);
      window.history.replaceState({}, document.title, window.location.pathname);
      fetchUserPlaylists();
      console.log("in if(token)");
    }
  }, []);
  

  const renderAuthenticatedContent = () => (
    <>
      <h2>Your Playlists</h2>
      <ul className="playlist-list">
        {userPlaylists.map(playlist => (
          <li key={playlist.id}>
            <a href={`https://open.spotify.com/playlist/${playlist.id}`} target="_blank" rel="noopener noreferrer">
              {playlist.name}
            </a>
          </li>
        ))}
      </ul>
    </>
  );

  const renderLoginButton = () => (
    <div>
      <p>Please login to view your playlists.</p>
      <button onClick={handleLogin}>Login with Spotify</button>
    </div>
  );

  const handleLogin = () => {
    window.location.href = `https://accounts.spotify.com/authorize` +
      `?response_type=token` +
      `&client_id=e28c33e4105c463e92a7fe625cbd507a` +
      `&redirect_uri=${encodeURIComponent('http://localhost:5173/callback')}` +
      `&scope=user-read-private%20user-read-email%20playlist-read-private`;
  };

  return (
    <div>
      {accessToken ? renderAuthenticatedContent() : renderLoginButton()}
    </div>
  );
};

export default SpotifyPlaylists;
