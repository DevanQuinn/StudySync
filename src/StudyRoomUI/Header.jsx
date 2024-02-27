import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Input from '@mui/material/Input';
import FormHelperText from '@mui/material/FormHelperText';
import TextField from '@mui/material/TextField'; // For multiline input
import { getStorage, ref, uploadBytes } from "firebase/storage";

import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
//import { getStorage, ref, uploadBytes } from "firebase/storage";
import { getDownloadURL } from "firebase/storage"; // Import getDownloadURLimport { getDownloadURL } from "firebase/storage"; // Import getDownloadURL

const Header = () => {
  const [open, setOpen] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [time, setTime] = useState('');
  const [friendInvites, setFriendInvites] = useState('');

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

  const app = initializeApp(firebaseConfig); // Initialize Firebase
  const db = getFirestore(); // Get Firestore instance
  const storage = getStorage(app);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setBackgroundImage(null); // Reset background image state on close
  };

  const handleImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();

      reader.onload = function(e) {
        setBackgroundImage(e.target.result);
      };

      reader.readAsDataURL(event.target.files[0]);
    }
  };

  const handleFormSubmit = async () => {
    // Check if a file was selected
    if (backgroundImage) {
      // Define the file path and name in your storage
      // Assuming `backgroundImage` is now a File object
      const storageRef = ref(storage, `studyrooms/${backgroundImage.name}`);
  
      try {
        // Upload the file to Firebase Storage
        const snapshot = await uploadBytes(storageRef, backgroundImage);
        // After successful upload, get the download URL
        const downloadURL = await getDownloadURL(snapshot.ref);
  
        // Prepare your study room data, including the image URL
        const studyRoomData = {
          name,
          description,
          time: parseInt(time, 10), // Ensure time is stored as a number
          backgroundImage: downloadURL, // Save the URL of the uploaded image
          friendInvites: friendInvites.split(',').map(invite => invite.trim()), // Split string into array
        };
  
        // Save study room data in Firestore
        const docRef = await addDoc(collection(db, "studyrooms"), studyRoomData);
        console.log("Document written with ID: ", docRef.id);
      } catch (error) {
        console.error("Error uploading image or adding document: ", error);
      }
    } else {
      // Handle the case where no image is uploaded
      const studyRoomDataWithoutImage = {
        name,
        description,
        time: parseInt(time, 10),
        friendInvites: friendInvites.split(',').map(invite => invite.trim()),
        // Optionally handle backgroundImage differently if not uploaded
      };
  
      try {
        const docRef = await addDoc(collection(db, "studyrooms"), studyRoomDataWithoutImage);
        console.log("Document written with ID: ", docRef.id);
      } catch (error) {
        console.error("Error adding document without an image: ", error);
      }
    }
  
    handleClose(); // Close the dialog
  };

  return (
    <header className="hero" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className="heroInner">
        <h1>Study Room</h1>
        <button className="btn" onClick={handleClickOpen}>
          Create Study Room
        </button>

        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Create a New Study Room</DialogTitle>
          <DialogContent>
            <FormControl fullWidth margin="normal">
              <InputLabel htmlFor="room-name">Room Name</InputLabel>
              <Input id="room-name" value={name} onChange={e => setName(e.target.value)} />
              <FormHelperText>Name your study room.</FormHelperText>
            </FormControl>

            <FormControl fullWidth margin="normal">
              <TextField
                id="room-description"
                label="Description"
                multiline
                rows={4}
                variant="outlined"
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Describe your study room"
              />
            </FormControl>

            <FormControl fullWidth margin="normal">
              <InputLabel htmlFor="time-limit">Time Limit (Minutes)</InputLabel>
              <Input id="time-limit" type="number" value={time} onChange={e => setTime(e.target.value)} />
              <FormHelperText>Set a time limit for the study session.</FormHelperText>
            </FormControl>

            <FormControl fullWidth margin="normal">
              <InputLabel htmlFor="invite-friends">Invite Friends</InputLabel>
              <Input id="invite-friends" value={friendInvites} onChange={e => setFriendInvites(e.target.value)} placeholder="Enter emails separated by commas" />
              <FormHelperText>Invite friends by email.</FormHelperText>
            </FormControl>

            {/* Background Image Upload */}
            <FormControl fullWidth margin="normal">
              <Button
                variant="contained"
                component="label"
              >
                Upload Background Image (Optional)
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </Button>
              {backgroundImage && (
                <div style={{ marginTop: '20px' }}>
                  <img src={backgroundImage} alt="Background Preview" style={{ width: '100%', maxHeight: '300px', objectFit: 'contain' }} />
                </div>
              )}
              <FormHelperText>Upload an image to use as the background.</FormHelperText>
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
