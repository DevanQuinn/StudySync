// App.jsx
import React, { useState, useEffect } from 'react';
import PlaylistItem from './PlaylistItem';

const App = () => {
  const [accessToken, setAccessToken] = useState(null);

  // Function to handle the login with Spotify
  const handleLogin = () => {
    // Redirect users to the Spotify authorization page
    window.location.href = 'https://accounts.spotify.com/authorize' +
      '?response_type=token' +
      '&client_id=YOUR_SPOTIFY_CLIENT_ID' + // Replace with your client ID
      '&redirect_uri=YOUR_REDIRECT_URI' + // Specify your redirect URI
      '&scope=user-read-private%20user-read-email'; // Add the necessary scopes
  };

  // Check if the access token is present in the URL hash upon page load
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.hash.substring(1));
    const token = urlParams.get('access_token');

    if (token) {
      setAccessToken(token);
      // Remove the access token from the URL to keep it clean
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  return (
    <div>
      {accessToken ? (
        // Render your authenticated content (playlist, player, etc.)
        <>
          <h2>Your Playlist</h2>
          <ul>
            {playlistData.map(song => (
              <PlaylistItem key={song.id} song={song} />
            ))}
          </ul>

          <div className="player">
            {/* Add your player controls, album artwork, track info, etc. here */}
            <p>Player Controls</p>
            <img src="album-artwork.jpg" alt="Album Artwork" />
            <p>Track Info</p>
          </div>
        </>
      ) : (
        // Render the login button if not authenticated
        <button onClick={handleLogin}>Login with Spotify</button>
      )}
    </div>
  );
};

export default App;
