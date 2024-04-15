import React, { useState, useRef, useEffect } from 'react';
import "../index.css"
import { useParams } from 'react-router-dom';
import { Typography, Button, Stack, Box, Slide, Menu, MenuItem, TextField, withTheme, withStyles, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, Select} from '@mui/material';
import RoomPomodoro from '../components/RoomPomodoro';
import { useNavigate } from 'react-router-dom';
import Draggable from 'react-draggable';
import { doc, getDoc, getFirestore, deleteDoc, updateDoc, setDoc, addDoc, serverTimestamp, collection, query, where, getDocs, orderBy, onSnapshot } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth'; // Make sure to import getAuth
import { useLocation } from 'react-router-dom';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';

 // Your web app's Firebase configuration
 const firebaseConfig = {
  apiKey: 'AIzaSyAOLFu9q6gvdcDoOJ0oPuQKPgDyOye_2uM',
  authDomain: 'studysync-3fbd7.firebaseapp.com',
  projectId: 'studysync-3fbd7',
  storageBucket: 'studysync-3fbd7.appspot.com',
  messagingSenderId: '885216959280',
  appId: '1:885216959280:web:917a7216776b36e904c6f5',
  measurementId: 'G-TS13EWHRMB',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

/*
TODO

- Update the profile and hours with profile pictures when users enter the room
- Toggle voice for everyone?
- When the person exits the room, there time studied gets added to Nilisha's statistics for the leadorboard
- TODO Nilisha takes current time - join time and adds that to their study time.
*/

// Categories and their associated video URLs
export const videoCategories = {
  Lofi: [
    'jfKfPfyJRdk', 'SllpB3W5f6s', 'FxJ3zPUU6Y4', 'A_nRzRZQqv0', 
  ],
  Nature: [
    'eKFTSSKCzWA', 'FerGgYXVXiw', 'qRTVg8HHzUo', 'SuyWEu5Du8c',
    'ipf7ifVSeDU', 'Jvgx5HHJ0qw',
  ],
  Chill: [
    'iicfmXFALM8', 'lTRiuFIWV54',  'HO6cbtdmkIc', 'ANkxRGvl1VY',
    'sgEJ4sOwboM', 'b8K5sGFu1l4', 'hm7_T0RvnjY',
  ],
  Indie: [
    'nif7-fGMSAs', 'anPqAKBcsog', 'HxAkpLrW7cQ', 'L8hPtjGb3R0',
  ],
  Pop: [
    'HQtFR3mhzOY', '471IbdJ4ZOc', 
  ],
  Upbeat: [
    'ixnqJm697-o', 'ypHMIyXx4v0', '7EDWMYyqJqE',
  ],
  Speedrun: [
    '-XFJoMRMM4k', 'b3TOVBNSJDA', 
  ]
  // Add more categories and videos as needed
};




const Chat = ({theme, roomId}) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [activeDrags, setActiveDrags] = useState(0);
  const { inviterUid, videoCategory } = location.state || {};
  
   
  const clearMessages = () => {
    setMessages([]); // Clears the messages from the UI
  };

  const onStart = () => {
    setActiveDrags(prevActiveDrags => prevActiveDrags + 1);
  };

  const onStop = () => {
    setActiveDrags(prevActiveDrags => prevActiveDrags - 1);
  };

  useEffect(() => {
    const currentUser = auth.currentUser;
    const userId = inviterUid || currentUser.uid;

    const q = query(collection(db, `${inviterUid}_studyrooms/${roomId}/chat`), orderBy('timestamp')); 
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const messages = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));
        setMessages(messages);
    });

    return () => unsubscribe(); // Clean up on unmount
}, [roomId, db]);

  const sendMessage = async () => {
    const currentUser = auth.currentUser;
    const userId = inviterUid || currentUser.uid;


    if (message.trim() && currentUser) {
      try {
        const chatRef = doc(db, `${inviterUid}_studyrooms/${roomId}/chat`, new Date().toISOString()); // Creates a unique ID based on timestamp
        await setDoc(chatRef, {
          sender: currentUser.displayName,
          message: message,
          timestamp: serverTimestamp(), // Firebase server timestamp
        });
        
      //  setMessages([...messages, {text: message, sender: currentUser.displayName}]); 
        setMessage('');
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  const dragHandlers = {onStart: onStart, onStop: onStop};

  return (
    /*
    <Draggable handle=".handle" {...dragHandlers}>
      <Box sx={{
        position: 'fixed', 
        bottom: 0, 
        left: 0, 
        zIndex: 1100, 
        width: 300, 
       // maxHeight: '50vh',
        backgroundColor: theme === 'light' ? '#FFF' : '#333', // Use theme prop for background color
        padding: '10px', 
        borderRadius: '10px', 
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', 
        overflowY: 'auto',
        color: theme === 'light' ? '#000' : '#FFF', // Adjust text color based on theme
      }}>

        <Box className="handle" sx={{cursor: 'move', backgroundColor: '#f0f0f0', padding: '10px', borderRadius: '5px'}}>
          <strong>Drag Me</strong>
        </Box>
        <Stack spacing={2}>
          {messages.map((msg) => (
            <Box key={msg.id} sx={{ wordWrap: 'break-word' }}>
              <strong>{msg.sender}:</strong> {msg.message}
            </Box>
          ))}
          <Box>
            <TextField 
              fullWidth
              variant="outlined"
              size="small"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
            />
          </Box>
          <Button variant="contained" onClick={sendMessage}>Send</Button>
          <Button variant="outlined" onClick={clearMessages} sx={{ mt: 1 }}>Clear Messages</Button> 
        </Stack>
      </Box>
    </Draggable>
    */

    <Draggable handle=".handle" {...dragHandlers}>
  <Box sx={{
      position: 'fixed', 
      bottom: 0, 
      left: 0, 
      zIndex: 1100, 
      width: 300,
      backgroundColor: theme === 'light' ? '#FFF' : '#333', // Use theme prop for background color
      padding: '10px', 
      borderRadius: '10px', 
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      color: theme === 'light' ? '#000' : '#FFF', // Adjust text color based on theme
    }}>
    {/* Draggable handle */}
    <Box className="handle" sx={{cursor: 'move', backgroundColor: '#f0f0f0', padding: '10px', borderRadius: '5px'}}>
      <strong>Drag Me</strong>
    </Box>
    <Box sx={{ maxHeight: '50vh', overflowY: 'auto' }}> {/* This Box wraps the messages and allows for scrolling */}
      <Stack spacing={2}>
        {messages.map((msg) => (
          <Box key={msg.id} sx={{ wordWrap: 'break-word' }}>
            <strong>{msg.sender}:</strong> {msg.message}
          </Box>
        ))}
      </Stack>
    </Box>
    <Box sx={{ mt: 1 }}> {/* Separate Box for input to stay fixed at the bottom */}
      <TextField 
        fullWidth
        variant="outlined"
        size="small"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
      />
      <Button variant="contained" onClick={sendMessage} sx={{ mt: 1 }}>Send</Button>
      <Button variant="outlined" onClick={clearMessages} sx={{ mt: 1 }}>Clear Messages</Button>
    </Box>
  </Box>
</Draggable>

  );
};





const RoomDetailsPage = () => {
  const [isMuted, setIsMuted] = useState(true);
  const iframeRef = useRef(null);
  const [showPomodoro, setShowPomodoro] = useState(false);
  //const [showEditMenu, setShowEditMenu] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null); // For category menu
  const navigate = useNavigate(); 
  const [currentVideoUrl, setCurrentVideoUrl] = useState('');
  const [isLightMode, setIsLightMode] = useState(true); // Theme state
  const togglePomodoro = () => setShowPomodoro(!showPomodoro);
  const { roomId } = useParams(); // Using useParams to get roomId from the route
  const [roomData, setRoomData] = useState(null); // State to hold room data
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [allUsers, setAllUsers] = useState([]); // Assuming you fetch all users for inviting
  const location = useLocation();
  const { inviterUid, videoCategory } = location.state || {};
  const [roomUsers, setRoomUsers] = useState([]);
  const [roomJoinTime, setRoomJoinTime] = useState(0);
  
  // const handleCategoryClick = (event) => {
  //   setAnchorEl(event.currentTarget);
  // };
  const handleClose = () => {
    setAnchorEl(null);
  };

  // Function to handle "Change Room" button click
  const handleOpenCategoryMenu = () => {
    setShowCategoryMenu(true); // Show the category menu
  };

  

  const calculateTimeSpent = (joinTime) => {
    if (!joinTime || !joinTime.toDate) {
      console.warn("joinTime is null or not a valid Firestore timestamp");
      return 0; // Return 0 or some default value indicating no time spent
    }
  
    const now = new Date();
    const joinedAt = joinTime.toDate(); // Convert Firestore Timestamp to JavaScript Date
    setRoomJoinTime(joinedAt - 0); // Store joined at time as milliseconds
    const spentMilliseconds = now - joinedAt;
    return Math.round(spentMilliseconds / 1000 / 60); // Convert to minutes
  };



  useEffect(() => {

    const fetchAndUpdateTimeSpent = async () => {
      // Assuming collectionName and roomId are defined and accessible
      const currentUser = auth.currentUser;
      if (!currentUser) {
        console.error("User authentication is required.");
        return;
      }
  
      const userId = inviterUid || currentUser.uid;

      
  const roomUsersRef = collection(db, `${userId}_studyrooms/${roomId}/roomUsers`);
    try {
      const snapshot = await getDocs(roomUsersRef);
      const usersWithTime = [];
      snapshot.forEach((doc) => {
        const userData = doc.data();

        console.log("UserData " + userData.displayName);
    
        // Assuming `joinTime` is stored as a Firebase timestamp in the document
        const timeSpent = calculateTimeSpent(userData.joinTime);
        usersWithTime.push({ displayName: userData.displayName, timeSpent }); // Ensure you're pushing the correct user identifier
      });

      setRoomUsers(usersWithTime); // Update your state to render the UI with fetched data
    } catch (error) {
      console.error("Error fetching room users:", error);
    }
  };

  fetchAndUpdateTimeSpent();

  // You might not need to set this interval if you only want to fetch data once when the component mounts
  const intervalId = setInterval(fetchAndUpdateTimeSpent, 60000); // Refresh every minute if needed

  return () => clearInterval(intervalId); // Cleanup on unmount
}, []); // Ensure the useEffect dependencies are correctly set
  
// useEffect(() => {
//   const fetchUsers = async () => {
//     const querySnapshot = await getDocs(collection(db, "users"));
//     const users = [];
//     querySnapshot.forEach((doc) => {
//       users.push(doc.data().username);
//     });
//     setAllUsers(users);
//   };

//   fetchUsers();
// }, [db]);

// const sendInvitations = async () => {
//   const roomId = roomId;
//   const user = auth.currentUser;

//   if (user) {
//     selectedFriends.forEach(async (friendDisplayName) => {
//       await addDoc(collection(db, "invitations"), {
//         invitedUserDisplayName: friendDisplayName,
//         roomId,
//         inviterUserId: user.displayName,
//         // Additional fields as needed
//       });
//     });
    
//     // Reset state and close dialog after sending invitations
//     setSelectedFriends([]);
//     setInviteDialogOpen(false);
//   }
// };
  

  const handleSelectCategory = async (category) => {
    // Function logic to change the room, similar to changeRoom
    await changeRoom(category);
    setShowCategoryMenu(false); // Hide the category menu after selection
  };

  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: 'AIzaSyAOLFu9q6gvdcDoOJ0oPuQKPgDyOye_2uM',
    authDomain: 'studysync-3fbd7.firebaseapp.com',
    projectId: 'studysync-3fbd7',
    storageBucket: 'studysync-3fbd7.appspot.com',
    messagingSenderId: '885216959280',
    appId: '1:885216959280:web:917a7216776b36e904c6f5',
    measurementId: 'G-TS13EWHRMB',
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const auth = getAuth(app);


  useEffect(() => {
    const fetchUsers = async () => {
      const querySnapshot = await getDocs(collection(db, "users")); // Adjust path as necessary
      const users = [];
      querySnapshot.forEach((doc) => {
        users.push(doc.data().username); // Or whatever field you're using
      });
      setAllUsers(users);
    };
  
    fetchUsers();
  }, []);

  const sendInvitations = async () => {
    try {
      const user = auth.currentUser;
      selectedFriends.forEach(async (friendDisplayName) => {
        await addDoc(collection(db, "invitations"), {
          invitedUserDisplayName: friendDisplayName,
          roomId: roomId,
          inviterUserId: user.displayName, // Or UID, depending on your preference
        });
      });
      // Reset state and close dialog after sending invitations
      setSelectedFriends([]);
      setInviteDialogOpen(false);
      console.log("Invitations sent successfully.");
    } catch (error) {
      console.error("Error sending invitations:", error);
    }
  };
  

  useEffect(() => {
    // Example usage of inviterUid to fetch room data or any other required data
    const fetchRoomData = async () => {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        console.error("User not authenticated");
        navigate('/login');
        return;
      }
      // Use inviterUid if present, otherwise fall back to the current user's UID
      const userId = inviterUid || currentUser.uid;
      try {
        const roomRef = doc(db, `${userId}_studyrooms/${roomId}`);
        const docSnap = await getDoc(roomRef);
        if (docSnap.exists()) {
          console.log("Room data found:", docSnap.data());
          setRoomData(docSnap.data())

          
          
          // Logic to select a random video from the category
        const categoryVideos = videoCategories[docSnap.data().videoCategory];
        if (categoryVideos) {
          const randomIndex = Math.floor(Math.random() * categoryVideos.length);
          setCurrentVideoUrl(categoryVideos[randomIndex]);
        }
    
        } else {
          console.error("No such room exists");
          // Handle the error - maybe redirect to a "room not found" page or back to dashboard
        }
      } catch (error) {
        console.error("Error fetching room data:", error);
        // Handle the error appropriately
      }
    };

    fetchRoomData();
  }, [roomId, inviterUid, auth, navigate, db]);;



  const changeRoom = async (category) => {
    // Select a random video URL from the specified category
    const videos = videoCategories[category];
    const randomIndex = Math.floor(Math.random() * videos.length);
    const newVideoUrl = videos[randomIndex];
    setCurrentVideoUrl(newVideoUrl);
    handleClose(); // Close the category menu
  
    // Now update the video URL and category in the database
    const user = auth.currentUser;
    if (user) {
      const userId = user.uid;
      const roomRef = doc(db, `${userId}_studyrooms/${roomId}`);
      
      try {
        // Update the video URL and category in the room document
        await updateDoc(roomRef, {
          videoCategory: category, // Field for video category
          videoUrl: newVideoUrl // Assuming 'videoUrl' is the field name for video URL
        });
        console.log("Video URL and category updated successfully in the database.");
      } catch (error) {
        console.error("Error updating room details:", error);
      }
    } else {
      console.log("User is not authenticated");
      // Handle unauthenticated state, e.g., redirect to login
    }
  };
  

  const videoSrc = `https://www.youtube.com/embed/${currentVideoUrl}?playlist=${currentVideoUrl}&autoplay=1&controls=0&loop=1&modestbranding=1&mute=${isMuted ? '1' : '0'}&showinfo=0&rel=0&iv_load_policy=3`;

  const toggleVolume = () => setIsMuted(!isMuted);
  //const exitRoom = () => navigate('/studyroom');
  const handleExitAndDeleteRoom = async () => {
    const user = auth.currentUser;
    if (user) {
      try {
        // Define the room document reference
        const roomRef = doc(db, `studyrooms/${roomId}`); // Adjusted for a more generic path if necessary


        const now = new Date();
        const durationMs = now - roomJoinTime;

        const studyRoomCol = user
          ? collection(db, `userStats/${user?.uid}/studyRoomTimes`)
          : null;

        const statsData = { durationMs };

        try {
          await addDoc(studyRoomCol, statsData);
        } catch (error) {
          console.error('Error uploading user statistics:', error);
        }

        // Delete the room document
        await deleteDoc(roomRef);
        console.log(`Room ${roomId} deleted successfully`);
  
        // Now, query and delete all invitations for this room
        const invitationsRef = collection(db, 'invitations');
        const q = query(invitationsRef, where('roomId', '==', roomId));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(async (document) => {
          await deleteDoc(doc(db, 'invitations', document.id));
        });
        console.log(`All invitations for room ${roomId} deleted successfully`);
  
        // Navigate to another page after deletion and cleanup
        navigate('/dashboard'); // Adjust the navigation path as needed
      } catch (error) {
        console.error("Error during room exit and cleanup:", error);
      }
    } else {
      console.log("User is not authenticated");
      navigate('/signin'); // Redirect to signin page or handle unauthenticated state
    }
  };
  
  //const editScreen = () => setShowEditMenu(!showEditMenu);
  // Theme toggle function
 
   // Theme toggle function
   const toggleTheme = () => {
    setIsLightMode(!isLightMode);
    // Apply the dark class to the body
    document.body.classList.toggle('dark', !isLightMode);
  };


  // Adjusted to include styles for the left side
  const themeStyles = {
    layout: {
      backgroundColor: isLightMode ? '#F3F4F6' : '#1F2937',
      color: isLightMode ? '#000' : '#FFF',
    },
    leftSide: {
      backgroundColor: isLightMode ? '#FFF' : '#333', // Explicitly setting background color for left side
      color: isLightMode ? '#000' : '#FFF',
      padding: '16px',
      overflowY: 'auto', // Ensure content is scrollable if it overflows
    },
    button: {
      backgroundColor: isLightMode ? '#FFFFFF' : '#333333',
      color: isLightMode ? '#000000' : '#FFFFFF',
    }
  };

const isCreator = auth.currentUser?.displayName === roomData?.creator_id;


  return (
    <section className="layout" style={themeStyles.layout}>
       <div className="leftSide" style={themeStyles.leftSide}>
        <Typography variant="h5" component="h2" className="font-bold">
          Profiles & Hours
        </Typography>
        {/* Render each user and their time spent */}
        <div>
          {roomUsers.map((user, index) => (
            <Typography key={index}>{`${user.displayName}: ${user.timeSpent} minutes`}</Typography>
          ))}
        </div>

        <Chat theme={isLightMode ? 'light' : 'dark'} roomId={roomId} />
      </div>

      <div className="body">
        <iframe ref={iframeRef} src={videoSrc} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }} frameBorder="0" allowFullScreen></iframe>
      </div>

     

      <div className="footer">
        <Button variant="contained" style={themeStyles.button} onClick={toggleVolume}>{isMuted ? 'Unmute' : 'Mute'}</Button>
        <Button variant="contained" style={themeStyles.button} onClick={togglePomodoro}>{showPomodoro ? 'Hide Timer' : 'Show Timer'}</Button>
        {isCreator && (
        <>
          <Button variant="contained" style={themeStyles.button} onClick={() => setInviteDialogOpen(true)}>
            Invite Friends
          </Button>
        </>
        )}
          <Button variant="contained" style={themeStyles.button} onClick={handleOpenCategoryMenu}>
            Change Room
          </Button>
        
      
        <Button variant="contained" style={themeStyles.button} onClick={handleExitAndDeleteRoom}>Exit Room</Button>
       
      
        <Dialog open={inviteDialogOpen} onClose={() => setInviteDialogOpen(false)}>
      <DialogTitle>Invite Friends</DialogTitle>
      <DialogContent>
        <FormControl fullWidth>
          <InputLabel>Friends</InputLabel>
          <Select
            multiple
            value={selectedFriends}
            onChange={(event) => setSelectedFriends(event.target.value)}
            renderValue={(selected) => selected.join(', ')}
          >
            {allUsers.map((user, index) => (
              <MenuItem key={user + index} value={user}>
                {user}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setInviteDialogOpen(false)}>Cancel</Button>
        <Button onClick={sendInvitations}>Send Invites</Button>
      </DialogActions>
    </Dialog>
      {/* Slide-up category menu */}
{/*       
      <Slide direction="up" in={showCategoryMenu} mountOnEnter unmountOnExit>
        <Box sx={{ position: 'fixed', bottom: 0, width: '50%', zIndex: 1200}}>
          <Typography variant="h6" sx={{ textAlign: 'center', padding: '10px 0' }}>
            Select a Video Category
          </Typography>
          <Stack>
            {Object.keys(videoCategories).map((category) => (
              <Button key={category} onClick={() => handleSelectCategory(category)} sx={{ margin: '5px' }}>
                {category}
              </Button>
            ))}
          </Stack>
        </Box>
      </Slide> */}
         {/* Light/Dark Toggle Button */}
         <div>
          <input type="checkbox" className="checkbox" id="checkbox" checked={!isLightMode} onChange={toggleTheme} />
          <label htmlFor="checkbox" className="checkbox-label">
            <i className="fas fa-moon"></i>
            <i className="fas fa-sun"></i>
            <span className="ball"></span>
          </label>
        </div>
        
{/* Slide-up category menu with enhanced styling */}
<Slide direction="up" in={showCategoryMenu} mountOnEnter unmountOnExit>
  <Box 
    sx={{ 
      position: 'fixed', 
      bottom: 0, 
      width: '100%', // Full width for better visibility
      zIndex: 1200,
      background: (theme) => theme.palette.mode === 'dark' ? 
        'linear-gradient(145deg, #424242, #616161)' : // Dark mode gradient
        'linear-gradient(145deg, #ffffff, #e0e0e0)', // Light mode gradient
      boxShadow: '0px -2px 10px rgba(0,0,0,0.3)', // Shadow for depth, adjusted for upward direction
      borderTopLeftRadius: '20px', // Slightly larger rounded corners for the top
      borderTopRightRadius: '20px',
      p: 2, // Padding around the content
      color: (theme) => theme.palette.text.primary, // Text color from theme
    }}>
    <Typography variant="h6" sx={{ textAlign: 'center', mb: 2, fontWeight: 'bold' }}>
      Select a Video Category
    </Typography>
    <Stack direction="row" justifyContent="center" flexWrap="wrap" spacing={2}>
      {Object.keys(videoCategories).map((category) => (
        <Button 
          key={category} 
          onClick={() => handleSelectCategory(category)} 
          variant="contained" // Using contained for a more pronounced look
          startIcon={<VideoLibraryIcon />} // Assuming you have an icon for categories
          sx={{ 
            boxShadow: '0px 4px 10px rgba(0,0,0,0.2)', // Button shadow for depth
            textTransform: 'none', // Avoid uppercase text
            background: (theme) => theme.palette.mode === 'dark' ? 
              'linear-gradient(145deg, #616161, #424242)' : // Button gradient for dark mode
              'linear-gradient(145deg, #e0e0e0, #ffffff)', // Button gradient for light mode
            color: (theme) => theme.palette.mode === 'dark' ? '#FFF' : '#000', // Button text color
            '&:hover': { // Hover state for button
              background: (theme) => theme.palette.mode === 'dark' ? 
                'linear-gradient(145deg, #757575, #616161)' : 
                'linear-gradient(145deg, #f5f5f5, #e0e0e0)',
            },
          }}
        >
          {category}
        </Button>
      ))}
    </Stack>
  </Box>
</Slide>

        {/* <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          {Object.keys(videoCategories).map((category) => (
            <MenuItem key={category} onClick={() => changeRoom(category)}>{category}</MenuItem>
          ))}
        </Menu>
         */}
      </div>

      <Slide direction="up" in={showPomodoro} mountOnEnter unmountOnExit>
        <Box sx={{ position: 'fixed', bottom: 60, right: 0, zIndex: 1100 }}><RoomPomodoro /></Box>
      </Slide>
    </section>
  );
};

export default RoomDetailsPage;
