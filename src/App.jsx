import StudyRoomUI from "./routes/StudyRoomUI.jsx"; 
import React, { useState, useEffect } from 'react';
import './App.css'; // Make sure to import your CSS file

const App = () => {
  const [accessToken, setAccessToken] = useState(null);
  const [userPlaylists, setUserPlaylists] = useState([]);

  const handleLogin = () => {
    window.location.href = `https://accounts.spotify.com/authorize` +
      `?response_type=token` +
      `&client_id=e28c33e4105c463e92a7fe625cbd507a` +
      `&redirect_uri=${encodeURIComponent('http://localhost:5173/callback')}` +
      `&scope=user-read-private%20user-read-email%20playlist-read-private`;
  };

  /*const fetchUserPlaylists = async () => {
    try {
      const response = await fetch('https://api.spotify.com/v1/me/playlists', {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Fetched Playlists:', data.items);
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
      console.log('Access Token:', token);
      setAccessToken(token);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  useEffect(() => {
    if (accessToken) {
      console.log('Fetching playlists...');
      fetchUserPlaylists();
    }
  }, [accessToken]);

*/

const fetchUserPlaylists = async () => {
  try {
    const response = await fetch('https://api.spotify.com/v1/me/playlists', {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    console.log('API Response:', response);

    if (response.ok) {
      const data = await response.json();
      console.log('Fetched Playlists:', data.items);
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
    console.log('Access Token:', token);
    setAccessToken(token);
    window.history.replaceState({}, document.title, window.location.pathname);

    // Fetch user playlists when token is set
    fetchUserPlaylists();
  } else {
    console.error('No access token found');
  }
}, []);

useEffect(() => {
  if (accessToken) {
    console.log('Fetching playlists...');
    fetchUserPlaylists();
  }
}, [accessToken]);


  const renderAuthenticatedContent = () => (
    <div>
      <h2>Your Playlists</h2>
      <ul className="playlist-container">
        {userPlaylists.map(playlist => (
          <li key={playlist.id} className="playlist-item">
            <a
              href={`https://open.spotify.com/playlist/${playlist.id}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {playlist.name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );



 /* return (
    <div>
      {accessToken ? (
        renderAuthenticatedContent()
      ) : (
        <button onClick={handleLogin}>Login with Spotify</button>
      )}
    </div>
  );
  */


};

export default App;



// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import './App.css';
// import LoginButton from './LoginButton'; // Import the new component

// const App = () => {
//   const [accessToken, setAccessToken] = useState(null);
//   const [userPlaylists, setUserPlaylists] = useState([]);
//   const navigate = useNavigate();

//   const handleLogin = () => {
//     window.location.href = `https://accounts.spotify.com/authorize` +
//       `?response_type=token` +
//       `&client_id=e28c33e4105c463e92a7fe625cbd507a` +
//       `&redirect_uri=${encodeURIComponent('http://localhost:5173/callback')}` +
//       `&scope=user-read-private%20user-read-email%20playlist-read-private`;
//   };

//  const fetchUserPlaylists = async () => {
//     try {
//       const response = await fetch('https://api.spotify.com/v1/me/playlists', {
//         headers: {
//           'Authorization': `Bearer ${accessToken}`
//         }
//       });

//       if (response.ok) {
//         const data = await response.json();
//         console.log('Fetched Playlists:', data.items);
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
//       fetchUserPlaylists();
//     }
//   }, []);

//   const renderAuthenticatedContent = () => (
//     <div>
//       <h2>Your Playlists</h2>
//       <ul className="playlist-container">
//         {userPlaylists.map(playlist => (
//           <li key={playlist.id} className="playlist-item">
//             <a
//               href={`https://open.spotify.com/playlist/${playlist.id}`}
//               target="_blank"
//               rel="noopener noreferrer"
//             >
//               {playlist.name}
//             </a>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );

//   return (
//     <div>
//       {accessToken ? (
//         renderAuthenticatedContent()
//       ) : (
//         <LoginButton /> // Render the LoginButton component when not authenticated
//       )}
//     </div>
//   );
// };

// export default App;





