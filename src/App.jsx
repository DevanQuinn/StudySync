// // App.jsx
// import React, { useState, useEffect } from 'react';
// import PlaylistItem from './PlaylistItem';

// const App = () => {
//   const [accessToken, setAccessToken] = useState(null);

//   // Sample playlist data (replace this with actual data fetched from Spotify API)
//   const playlistData = [
//     { id: 1, title: 'Song 1', artist: 'Artist 1' },
//     { id: 2, title: 'Song 2', artist: 'Artist 2' },
//     // Add more songs as needed
//   ];

//   // Function to handle the login with Spotify
//   const handleLogin = () => {
//     // Redirect users to the Spotify authorization page
//     window.location.href = 'https://accounts.spotify.com/authorize' +
//       '?response_type=token' +
//       '&client_id=e28c33e4105c463e92a7fe625cbd507a' + // Replace with your client ID
//       '&redirect_uri=http://localhost:5173/callback' + // Specify your redirect URI
//       '&scope=user-read-private%20user-read-email%20playlist-read-private'; // Add the necessary scopes for playlist access
//   };

//   // Check if the access token is present in the URL hash upon page load
//   useEffect(() => {
//     const urlParams = new URLSearchParams(window.location.hash.substring(1));
//     const token = urlParams.get('access_token');

//     if (token) {
//       setAccessToken(token);
//       // Remove the access token from the URL to keep it clean
//       window.history.replaceState({}, document.title, window.location.pathname);
//     }
//   }, []);

//   // Render the authenticated content (playlist, player, etc.) if the user is logged in
//   const renderAuthenticatedContent = () => (
//     <>
//       <h2>Your Playlist</h2>
//       <div className="playlist-embed">
//         <iframe
//           title="Spotify Embed: Recommendation Playlist"
//           src={`https://open.spotify.com/embed/playlist/${playlistId}?utm_source=generator&theme=0`}
//           width="100%"
//           height="100%"
//           style={{ minHeight: '360px' }}
//           frameBorder="0"
//           allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
//           loading="lazy"
//         />
//       </div>
  
//       <div className="player-container">
//         <div className="player-controls">
//           <button>Previous</button>
//           <button>Play</button>
//           <button>Next</button>
//         </div>
//         <div className="track-info">
//           <img src="album-artwork.jpg" alt="Album Artwork" />
//           <div>
//             <p>Track Title</p>
//             <p>Artist Name</p>
//           </div>
//         </div>
//       </div>
//     </>
//   );
  

//   return (
//     <div>
//       {accessToken ? (
//         renderAuthenticatedContent()
//       ) : (
//         // Render the login button if not authenticated
//         <button onClick={handleLogin}>Login with Spotify</button>
//       )}
//     </div>
//   );
// };

import React, { useState, useEffect } from 'react';

const App = () => {
  const [accessToken, setAccessToken] = useState(null);
  const [userPlaylists, setUserPlaylists] = useState([]);

  const handleLogin = () => {
    window.location.href = 'https://accounts.spotify.com/authorize' +
      '?response_type=token' +
      '&client_id=e28c33e4105c463e92a7fe625cbd507a' +
      '&redirect_uri=http://localhost:5173/callback' +
      '&scope=user-read-private%20user-read-email%20playlist-read-private';
  };

  const fetchUserPlaylists = async () => {
    try {
      const response = await fetch('https://api.spotify.com/v1/me/playlists', {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUserPlaylists(data.items);
      } else {
        console.error('Error fetching user playlists:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching user playlists:', error.message);
    }
  };

  useEffect(() => {
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

  const renderAuthenticatedContent = () => {
    return (
      <>
        <h2>Your Playlists</h2>
        <ul>
          {userPlaylists.map(playlist => (
            <div key={playlist.id}>
              <h3>{playlist.name}</h3>
              <iframe
                title={`Spotify Embed: Playlist - ${playlist.name}`}
                src={`https://open.spotify.com/embed/playlist/${playlist.id}`}
                width="300"
                height="380"
                frameBorder="0"
                allowtransparency="true"
                allow="encrypted-media"
              ></iframe>
            </div>
          ))}
        </ul>
      </>
    );
  };

  return (
    <div>
      {accessToken ? (
        renderAuthenticatedContent()
      ) : (
        <button onClick={handleLogin}>Login with Spotify</button>
      )}
    </div>
  );
};

export default App;
