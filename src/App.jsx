// App.jsx
// import React, { useState, useEffect } from 'react';
// import PlaylistEmbed from './PlaylistEmbed';
// import './App.css'; // Make sure to import your CSS file

// const App = () => {
//   const [accessToken, setAccessToken] = useState(null);
//   const [userPlaylists, setUserPlaylists] = useState([]);

//   const handleLogin = () => {
//     window.location.href = 'https://accounts.spotify.com/authorize' +
//       '?response_type=token' +
//       '&client_id=e28c33e4105c463e92a7fe625cbd507a' +
//       '&redirect_uri=http://localhost:5173/callback' +
//       '&scope=user-read-private%20user-read-email%20playlist-read-private';
//   };

//   const fetchUserPlaylists = async () => {
//     try {
//       const response = await fetch('https://api.spotify.com/v1/me/playlists', {
//         headers: {
//           'Authorization': `Bearer ${accessToken}`
//         }
//       });

//       if (response.ok) {
//         const data = await response.json();
//         setUserPlaylists(data.items);
//       } else {
//         console.error('Error fetching user playlists:', response.statusText);
//       }
//     } catch (error) {
//       console.error('Error fetching user playlists:', error.message);
//     }
//   };

//   useEffect(() => {
//     const urlParams = new URLSearchParams(window.location.hash.substring(1));
//     const token = urlParams.get('access_token');

//     if (token) {
//       setAccessToken(token);
//       window.history.replaceState({}, document.title, window.location.pathname);
//     }
//   }, []);

//   useEffect(() => {
//     if (accessToken) {
//       fetchUserPlaylists();
//     }
//   }, [accessToken]);

//   const renderAuthenticatedContent = () => {
//     return (
//       <>
//         <h2>Your Playlists</h2>
//         <div className="playlists-container">
//           {userPlaylists.map(playlist => (
//             <PlaylistEmbed key={playlist.id} playlist={playlist} />
//           ))}
//         </div>
//       </>
//     );
//   };

//   return (
//     <div>
//       {accessToken ? (
//         renderAuthenticatedContent()
//       ) : (
//         <button onClick={handleLogin}>Login with Spotify</button>
//       )}
//     </div>
//   );
// };

// export default App;

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
        <div className="playlist-container">
          {userPlaylists.map(playlist => (
            <div key={playlist.id} className="playlist-item">
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
        </div>
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

