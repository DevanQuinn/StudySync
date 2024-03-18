import StudyRoomUI from "./routes/StudyRoomUI.jsx"; 
import React, { useState, useEffect } from 'react';
import './App.css'; // Make sure to import your CSS file



// User class with friends list property
class User {
  constructor(username) {
    this.username = username;
    this.friends = [];
  }

  addFriend(friend) {
    this.friends.push(friend);
  }
}

// FriendDropdown component
const FriendDropdown = ({ user, friends }) => {
  return (
    <select>
      <option value="">Select a friend</option>
      {friends.map((friend, index) => (
        <option key={index} value={friend.username}>
          {friend.username}
        </option>
      ))}
    </select>
  );
};

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
};

export default App;




// import React, { useState, useEffect } from 'react';
// import firebase from 'firebase/app';
// import 'firebase/firestore';

// const firebaseConfig = {
//   apiKey: "AIzaSyAOLFu9q6gvdcDoOJ0oPuQKPgDyOye_2uM",
//   authDomain: "studysync-3fbd7.firebaseapp.com",
//   projectId: "studysync-3fbd7",
//   storageBucket: "studysync-3fbd7.appspot.com",
//   messagingSenderId: "885216959280",
//   appId: "1:885216959280:web:8192435e7a6433d104c6f5",
//   measurementId: "G-3X6VT6TSTB"
// };

// // Initialize Firebase
// if (!firebase.apps.length) {
//   firebase.initializeApp(firebaseConfig);
// }

// const db = firebase.firestore();

// const App = () => {
//   const [user, setUser] = useState(null);
//   const [userPlaylists, setUserPlaylists] = useState([]);

//   const handleLogin = () => {
//     const provider = new firebase.auth.GoogleAuthProvider();
//     firebase.auth().signInWithPopup(provider);
//   };

//   const fetchUserPlaylists = async (userId) => {
//     try {
//       const playlistsRef = db.collection('users').doc(userId).collection('playlists');
//       const snapshot = await playlistsRef.get();
//       const playlists = snapshot.docs.map(doc => doc.data());
//       setUserPlaylists(playlists);
//     } catch (error) {
//       console.error('Error fetching user playlists:', error);
//     }
//   };

//   useEffect(() => {
//     firebase.auth().onAuthStateChanged(authUser => {
//       if (authUser) {
//         setUser(authUser);
//         fetchUserPlaylists(authUser.uid);
//       } else {
//         setUser(null);
//         setUserPlaylists([]);
//       }
//     });
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
//       {user ? (
//         renderAuthenticatedContent()
//       ) : (
//         <button onClick={handleLogin}>Login with Google</button>
//       )}
//     </div>
//   );
// };

// export default App;

