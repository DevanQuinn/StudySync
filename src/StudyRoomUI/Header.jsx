import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Input from '@mui/material/Input';
import FormHelperText from '@mui/material/FormHelperText';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, addDoc, getDocs, query, where, onSnapshot, doc, getDoc} from 'firebase/firestore';
import { initializeApp } from 'firebase/app';

const Header = () => {
  const [open, setOpen] = useState(false);
  const [invitations, setInvitations] = useState([]);
  const [videoCategory, setVideoCategory] = useState('');
  const [friendInvites, setFriendInvites] = useState([]);
  const [usernames, setUsernames] = useState([]); // New state for usernames
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

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
    // Function to fetch usernames from Firestore
    const fetchUsernames = async () => {
      const querySnapshot = await getDocs(collection(db, "users"));
      const fetchedUsernames = [];
      querySnapshot.forEach((doc) => {
        fetchedUsernames.push(doc.data().username); // Assuming 'username' is the field
      });
      setUsernames(fetchedUsernames);
    };

    fetchUsernames();
  }, [db]); // Run once when the component mounts

 

  
  useEffect(() => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;
  
    const invitationsQuery = query(collection(db, "invitations"), where("invitedUserId", "==", currentUser.uid));
    const unsubscribe = onSnapshot(invitationsQuery, async (querySnapshot) => {
      const invitationsPromises = querySnapshot.docs.map(async (doc) => {
        const invitation = { id: doc.id, ...doc.data() };
        // Assuming you have a users collection where each document ID is `uid`
        const inviterRef = doc(db, "users", invitation.inviterUserId);
        const inviterDoc = await getDoc(inviterRef);
        if (inviterDoc.exists()) {
          // Add the inviter's displayName to the invitation object
          invitation.inviterDisplayName = inviterDoc.data().displayName;
        }
        return invitation;
      });
  
      const fetchedInvitations = await Promise.all(invitationsPromises);
      setInvitations(fetchedInvitations);
    });
  
    return () => unsubscribe();
  }, [auth.currentUser, db]);
  
  
  
  // Handler to navigate to the room based on invitation
const handleJoinRoom = async (roomId) => {
  const roomRef = doc(db, `${roomId}_studyrooms`, roomId); // Adjust the path according to your database structure
  const docSnap = await getDoc(roomRef);

  if (docSnap.exists()) {
    // If the room exists, navigate to the room
    navigate(`/room/${roomId}`);
  } else {
    // If the room does not exist, show an error message
    // This could be a state-based message shown in the UI, an alert, or a custom modal/dialog
    alert("The creator of the room has left, and the room no longer exists.");
  }
};

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleFormSubmit = async () => {
    const auth = getAuth(app);
    const user = auth.currentUser;
  
    if (user) {
      const collectionName = `${user.uid}_studyrooms`;
      const studyRoomData = {
        videoCategory,
        videoUrl: null, // Set videoUrl to null initially
      };
  
      try {
        const docRef = await addDoc(collection(db, collectionName), studyRoomData);
        // After successfully creating the study room, send invitations
        friendInvites.forEach(async (invitedUserId) => {
          await addDoc(collection(db, "invitations"), {
            invitedUserId,
            roomId: docRef.id,
            inviterUserId: user.uid,
          });
        });
        navigate(`/room/${docRef.id}`, { state: { ...studyRoomData } });
      } catch (error) {
        console.error("Error adding document: ", error);
        setErrorMessage('Error creating study room. Please try again.');
      }
    } else {
      setErrorMessage('You must be signed in to create a study room.');
    }
  
    handleClose(); // Close the dialog after handling form submission
  };

  const handleInviteChange = (event) => {
    const {
      target: { value },
    } = event;
    setFriendInvites(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };
  

  // Customized button styles
  const customButtonStyles = {
    backgroundColor: "#32BAAE",
    color: "white",
    fontWeight: "bold",
    border: "2px solid white",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.2)",
    fontSize: "1em",
    padding: "10px 20px",
    cursor: "pointer",
    transition: "all 0.3s ease",
  };

  return (
    <header className="hero" style={{}}>
      <div className="heroInner">
        <h1 style={{ color: '#32BAAE' }}>Study Room</h1>
        <button className="customButton" onClick={handleClickOpen} style={customButtonStyles}>
          Create Study Room
        </button>

        {invitations.map(invitation => (
        <div key={invitation.id} onClick={() => handleJoinRoom(invitation.roomId)}>
          You've been invited by {invitation.inviterUserId} to join a study room.
        </div>
        ))}
   

        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Create a New Study Room</DialogTitle>
          <DialogContent>
            {errorMessage && <div style={{ color: 'red', marginBottom: '20px' }}>{errorMessage}</div>}

            <FormControl fullWidth margin="normal">
              <InputLabel htmlFor="video-category">Video Category</InputLabel>
              <Select
                value={videoCategory}
                onChange={(e) => setVideoCategory(e.target.value)}
                label="Video Category"
                id="video-category"
              >
                <MenuItem value="Lofi">Lofi</MenuItem>
                <MenuItem value="Nature">Nature</MenuItem>
                <MenuItem value="Indie">Indie</MenuItem>
                <MenuItem value="Pop">Pop</MenuItem>
                <MenuItem value="Upbeat">Upbeat</MenuItem>
                <MenuItem value="Speedrun">Speedrun</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth margin="normal">
          <InputLabel id="invite-friends-label">Invite Friends</InputLabel>
          <Select
            labelId="invite-friends-label"
            id="invite-friends"
            multiple
            value={friendInvites}
            onChange={handleInviteChange}
            renderValue={(selected) => selected.join(', ')}
          >
            {usernames.map((username) => (
              <MenuItem key={username} value={username}>
                {username}
              </MenuItem>
            ))}
          </Select>
          <FormHelperText>Invite friends by username.</FormHelperText>
        </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleFormSubmit}>Create</Button>
          </DialogActions>
        </Dialog>
      </div>
    </header>
  );
};

export default Header;
