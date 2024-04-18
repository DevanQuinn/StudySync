import React, { useState, useEffect } from 'react';
import '/Users/saimonishtunguturu/307S24Project/StudySync/src/routes/SpotifyPlaylists.css'; // Import your CSS file
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  chatbotContainer: {
    position: 'fixed',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
    zIndex: 1000,
  },
  chatbotMessages: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    background: '#ffffff',
    border: '1px solid #cccccc',
    borderRadius: '8px',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
    padding: theme.spacing(2),
    display: 'none',
  },
  chatbotMessagesVisible: {
    display: 'block',
  },
}));

const SpotifyPlaylists = () => {
  const [accessToken, setAccessToken] = useState(null);
  const [userPlaylists, setUserPlaylists] = useState([]);
  const [showChatbot, setShowChatbot] = useState(false);

  const classes = useStyles();

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
      console.log('Access Token:', token);  // Add this line
      setAccessToken(token);
      window.history.replaceState({}, document.title, window.location.pathname);
      fetchUserPlaylists(token);
    }
  }, []);
  

  const renderPlaylists = () => (
    <ul className="playlist-list">
      {userPlaylists.map(playlist => (
        <li key={playlist.id}>
          <a href={`https://open.spotify.com/playlist/${playlist.id}`} target="_blank" rel="noopener noreferrer">
            {playlist.name}
          </a>
        </li>
      ))}
    </ul>
  );

  const handleLogin = () => {
    window.location.href = `https://accounts.spotify.com/authorize` +
      `?response_type=token` +
      `&client_id=e28c33e4105c463e92a7fe625cbd507a` +
      `&redirect_uri=${encodeURIComponent('http://localhost:5173/callback')}` +
      `&scope=user-read-private%20user-read-email%20playlist-read-private`;
  };

  const toggleChatbot = () => {
    setShowChatbot(prevState => !prevState);
  };

  return (
    <div>
      <div className={classes.chatbotContainer}>
        <Button variant="contained" color="primary" onClick={toggleChatbot}>
          {showChatbot ? 'Hide Chatbot' : 'Show Chatbot'}
        </Button>
        {showChatbot && (
          <div className={`${classes.chatbotMessages} ${classes.chatbotMessagesVisible}`}>
            {accessToken ? (
              <>
                <Typography variant="h6" gutterBottom>Your Playlists</Typography>
                {renderPlaylists()}
              </>
            ) : (
              <div className="login-button-container">
                <Typography variant="body1">Please login to view your playlists.</Typography>
                <Button variant="contained" color="primary" onClick={handleLogin}>Login with Spotify</Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SpotifyPlaylists;

