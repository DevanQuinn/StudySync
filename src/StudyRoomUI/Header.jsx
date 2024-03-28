import React, { useState } from 'react';
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
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';

const Header = () => {
  const [open, setOpen] = useState(false);
  const [videoCategory, setVideoCategory] = useState('');
  const [friendInvites, setFriendInvites] = useState('');
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

  const [errorMessage, setErrorMessage] = useState('');

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleFormSubmit = async () => {
    const auth = getAuth(app);
    const user = auth.currentUser;

    if (user) {
      const collectionName = `${user.uid}_studyrooms`;
      const studyRoomData = {
        videoCategory,
        friendInvites: friendInvites.split(',').map(invite => invite.trim()),
      };

      try {
        const docRef = await addDoc(collection(db, collectionName), studyRoomData);
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
              <InputLabel htmlFor="invite-friends">Invite Friends</InputLabel>
              <Input
                id="invite-friends"
                value={friendInvites}
                onChange={(e) => setFriendInvites(e.target.value)}
                placeholder="Enter emails separated by commas"
              />
              <FormHelperText>Invite friends by email.</FormHelperText>
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
