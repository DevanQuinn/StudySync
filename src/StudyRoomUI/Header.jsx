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
import { getFirestore, collection, addDoc, getDocs, query, where, onSnapshot, doc, getDoc, serverTimestamp, updateDoc, setDoc, deleteDoc} from 'firebase/firestore';
import { initializeApp } from 'firebase/app';


/*
TODO
- The room gets correctly deleted from the database
when they exit the room
- The invitation gets deleted when a user declines
- The invitiation gets deleted from the db when a user accepts
- Multiple invitations work.
*/

const Header = () => {
  const [open, setOpen] = useState(false);
  const [invitations, setInvitations] = useState([]);
  const [videoCategory, setVideoCategory] = useState('');
  const [friendInvites, setFriendInvites] = useState([]);
  const [usernames, setUsernames] = useState([]); // New state for usernames
  const [errorMessage, setErrorMessage] = useState('');
  const [invitationDialogOpen, setInvitationDialogOpen] = useState(false);
  const [currentInvitation, setCurrentInvitation] = useState(null);

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
    if (invitations.length > 0) {
      // Assuming you want to show the first invitation for simplicity
      setCurrentInvitation(invitations[0]);
      setInvitationDialogOpen(true);
    }
  }, [invitations]);

  /*
  const handleAcceptInvitation = async () => {
    if (currentInvitation && currentInvitation.roomId) {
      const roomId = currentInvitation.roomId;
      // Navigate to the room
      navigate(`/room/${currentInvitation.roomId}`, { state: { videoCategory: currentInvitation.videoCategory } });
      // Call a function to add the current user to the room's subcollection 'roomUsers'
    
      await addUserToRoom(currentInvitation.creator_id, currentInvitation.roomId, auth.currentUser.displayName);
      // Here, you might also want to handle the deletion of the accepted invitation from the 'invitations' collection
      // TODO
      setInvitationDialogOpen(false); // Close the dialog upon accepting
    }
  };
  */
  const handleAcceptInvitation = async (invitation) => {
    if (invitation && invitation.roomId && auth.currentUser) {
      const roomId = invitation.roomId;
      const userDisplayName = auth.currentUser.displayName;
      const uid = currentInvitation.inviterUid;
      const collectionName = `${uid}_studyrooms`;
    
      try {
        // Add the current user to the room's subcollection 'roomUsers'
        await addUserToRoom(collectionName, roomId, userDisplayName);
  
        // Optionally delete the accepted invitation from the 'invitations' collection
        // This requires you to know the document ID of the invitation
        const invitationRef = doc(db, "invitations", currentInvitation.id);
        await deleteDoc(invitationRef);
  
        // Navigate to the room
        navigate(`/room/${roomId}`, { state: { inviterUid: invitation.inviterUid, videoCategory: invitation.videoCategory } });

        
        setInvitationDialogOpen(false); // Close the dialog upon accepting
      } catch (error) {
        console.error("Error handling the invitation:", error);
        // Handle errors, such as displaying a message to the user
      }
    }
  };
  


  const handleCloseInvitationDialog = () => {
    setInvitationDialogOpen(false);
  };

  
  useEffect(() => {
    const currentUser = auth.currentUser;
    console.log("Current User:", currentUser); // Debug current user
    if (!currentUser || !currentUser.displayName) return;
  
    // Adjust this query to use display names
    const invitationsQuery = query(collection(db, "invitations"), where("invitedUserDisplayName", "==", currentUser.displayName));
    console.log("Invitations Query:", invitationsQuery); // Debug the query
  
    const unsubscribe = onSnapshot(invitationsQuery, (querySnapshot) => {
      const fetchedInvitations = [];
      querySnapshot.forEach((doc) => {
        console.log("Invitation Document:", doc.id, doc.data());
        fetchedInvitations.push({ id: doc.id, ...doc.data() });
      });
      setInvitations(fetchedInvitations);
    });
  
    return () => unsubscribe();
  }, [auth.currentUser]);
  
  

const addUserToRoom = async (collectionName, roomId, userDisplayName) => {
  // Correct path to target a document within the roomUsers subcollection
  const userRef = doc(db, `${collectionName}/${roomId}/roomUsers/${userDisplayName}`);

  try {
    await setDoc(userRef, {
      displayName: userDisplayName,
      joinTime: serverTimestamp(),
    });
    console.log(`Successfully added ${userDisplayName} to room ${roomId}`);
  } catch (error) {
    console.error(userRef)
  }
};


  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleFormSubmit = async () => {
    const user = auth.currentUser; // Use 'user' throughout this function
  
    if (user) {
      const collectionName = `${user.uid}_studyrooms`;
      const studyRoomData = {
        creator_id: user.displayName,
        videoCategory,
        videoUrl: null, 
      };

    
      //try to add the invitiations to the invitations in the database
      try {
        const docRef = await addDoc(collection(db, collectionName), studyRoomData);
        // Send invitations using displayName
        friendInvites.forEach(async (friendDisplayName) => {
          await addDoc(collection(db, "invitations"), {
            invitedUserDisplayName: friendDisplayName, // Assuming this matches exactly with users' displayNames
            roomId: docRef.id,
            inviterUserId: user.displayName, // Correctly using 'user' here
            videoUrl: null, //include the video url from the original room
            inviterUid: user.uid,
          });
        });


        // also add the user to the room.
        addUserToRoom(collectionName, docRef.id, user.displayName);
        
        //navigate to the new room after all the data has been added to the firebase
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

  const handleDeclineInvitation = async (invitation) => {
    if (invitation) {
      try {
        // Delete the declined invitation from the 'invitations' collection
        const invitationRef = doc(db, "invitations", invitation.id);
        await deleteDoc(invitationRef);
  
        console.log("Invitation declined and deleted from the database.");
        setInvitationDialogOpen(false); // Close the dialog upon declining
      } catch (error) {
        console.error("Error declining the invitation:", error);
        // Optionally handle errors, such as displaying a message to the user
      }
    }
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
        <div key={invitation.id} onClick={() => handleAcceptInvitation(invitation)}>
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

      <Dialog open={invitationDialogOpen} onClose={handleCloseInvitationDialog}>
<DialogTitle>Invitation to Join Study Room</DialogTitle>
<DialogContent>
  <p>{currentInvitation ? `You've been invited by ${currentInvitation.inviterUserId} to join a study room.` : ''}</p>
</DialogContent>
<DialogActions>
  <Button onClick={() => handleDeclineInvitation(currentInvitation)}>Decline</Button>
  <Button onClick={() => handleAcceptInvitation(currentInvitation)} color="primary">Join Room</Button>
</DialogActions>

</Dialog>

    </header>



  );
};

export default Header;

