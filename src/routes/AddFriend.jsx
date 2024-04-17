import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection, writeBatch, getFirestore, doc, updateDoc, arrayUnion, arrayRemove, onSnapshot, getDoc, getDocs } from "firebase/firestore";
import {
  CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle,
  Button, Alert, Box, List, ListItem, ListItemText, ListItemAvatar, Avatar,
  IconButton, Tooltip, Badge, Typography
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import DeleteIcon from '@mui/icons-material/Delete';

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

const AddFriend = () => {
  const [users, setUsers] = useState([]);
  const [invites, setInvites] = useState([]);
  const [userDetails, setUserDetails] = useState({});
  const [selectedUser, setSelectedUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [friends, setFriends] = useState([]);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [friendToDelete, setFriendToDelete] = useState(null);



  useEffect(() => {
    if (!auth.currentUser) {
      navigate('/login');
      return;
    }

    // Subscribe to the friends list of the current user
    const unsubscribe = onSnapshot(doc(db, "users", auth.currentUser.displayName), (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        setFriends(data.friends || []);
        setIsLoading(false);
      } else {
        console.log("No such document!");
        setIsLoading(false);
      }
    });

    return () => unsubscribe(); // Cleanup subscription on component unmount
  }, [db, navigate]);

  useEffect(() => {
    if (!auth.currentUser) {
      navigate('/login');
      return;
    }
  
    let isMounted = true; // flag to check if the component is still mounted when async tasks complete
  
    const fetchAllUsers = async () => {
      console.log("Fetching users..."); // Log when users are being fetched
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        const allUsers = [];

        querySnapshot.forEach((doc) => {
          if (doc.id !== auth.currentUser.displayName && !doc.data().friends?.includes(auth.currentUser.displayName)) { // Assuming you use uid for identification
            allUsers.push(doc.data().username); // Assuming 'username' is the field for user display names
          }
        });
        if (isMounted) {
          
          setUsers([...new Set(allUsers)]); // Using Set to remove any potential duplicates
          console.log("Users set:", allUsers); // Log the list of users set to state
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        setError("Failed to fetch user list.");
      }
    };
  
    fetchAllUsers();
  
    return () => {
      isMounted = false; // Clean up the isMounted flag
    };
  }, [db, auth.currentUser, navigate]); // Assuming db and auth.currentUser do not change often, this useEffect will not re-trigger unnecessarily
  



  useEffect(() => {
    if (!auth.currentUser) {
      navigate('/login');
      return;
    }

    // Listen to the authenticated user's document for real-time updates
    const unsubscribe = onSnapshot(doc(db, "users", auth.currentUser.displayName), (docSnapshot) => {
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        setInvites(data.invites || []);
        setIsLoading(false);
        fetchUserDetails(data.invites || []);
      } else {
        console.log("No such document!");
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, [db, auth.currentUser, navigate]);

  async function fetchUserDetails(inviteDisplayNames) {
    const userDetailsFetch = {};
    const fetchPromises = inviteDisplayNames.map(async (displayName) => {
        try {
            const userDocRef = doc(db, "users", displayName); // Ensure 'displayName' is correctly used as a doc ID
            const userDoc = await getDoc(userDocRef);
            if (userDoc.exists()) {
                userDetailsFetch[displayName] = userDoc.data().username || "Anonymous User"; // Use a default fallback
            } else {
                console.error("No user document found for displayName:", displayName);
                userDetailsFetch[displayName] = "Unknown User"; // Specific for not found documents
            }
        } catch (error) {
            console.error("Error fetching user details for:", displayName, error);
            userDetailsFetch[displayName] = "Failed to fetch"; // Indicate a fetch failure
        }
    });

    await Promise.all(fetchPromises);
    setUserDetails(userDetailsFetch); // Update state with the results
    setIsLoading(false);
}

// Call this function when initializing or when the list of invites updates
useEffect(() => {
    if (invites.length > 0) {
        fetchUserDetails(invites);
    }
}, [invites]);

  const handleAcceptInvite = async (inviterUserDisplayName) => {
    if (!auth.currentUser) return;
  
    const batch = writeBatch(db);
    const currentUserRef = doc(db, "users", auth.currentUser.displayName);
    const inviterRef = doc(db, "users", inviterUserDisplayName);
  
    batch.update(currentUserRef, {
      friends: arrayUnion(inviterUserDisplayName),
      invites: arrayRemove(inviterUserDisplayName)
    });
    batch.update(inviterRef, {
      friends: arrayUnion(auth.currentUser.displayName)
    });
  
    try {
      await batch.commit();
      console.log(`Accepted friend request from ${inviterUserDisplayName}`);
      alert('Friend added successfully!');
    } catch (error) {
      console.error("Error accepting friend request:", error);
      setError("Failed to accept friend request. Please try again later.");
    }
  };

  const handleDeclineInvite = async (inviterUserDisplayName) => {
    if (!auth.currentUser) return;

    try {
      await updateDoc(doc(db, "users", auth.currentUser.displayName), {
        invites: arrayRemove(inviterUserDisplayName)
      });
      console.log(`Declined friend request from ${inviterUserDisplayName}`);
      alert('Friend request declined.');
    } catch (error) {
      console.error("Error declining friend request:", error);
      setError("Failed to decline friend request. Please try again later.");
    }
  };



  const handleAddFriend = async (event) => {
    //event.preventDefault();
    if (!selectedUser || !auth.currentUser) {
      alert('Please select a user to add as a friend.');
      return;
    }
  
    try {
      const currentUserID = auth.currentUser.displayName; // Make sure this is the correct identifier
      const userRef = doc(db, "users", selectedUser); // Ensure selectedUser is the correct ID for Firestore document
  
      console.log("Selected user:", selectedUser);
      console.log("Current user ID:", currentUserID);
      console.log("Document path:", userRef.path);
  
      await updateDoc(userRef, {
        invites: arrayUnion(currentUserID)  // Attempt to add the current user's ID to the selected user's invites
      });
      console.log('Invite sent to:', selectedUser);
      alert('Friend invite sent!');
      // setOpenDialog(false); // Uncomment if you manage dialog state
    } catch (error) {
      console.error("Error sending invite:", error);
      setError("Failed to send invite. Please try again later.");
    }
  };

  const handleOpenConfirmDialog = (friend) => {
    setFriendToDelete(friend);
    setOpenConfirmDialog(true);
  };
  
  const handleCloseConfirmDialog = () => {
    setOpenConfirmDialog(false);
  };
  
  

  const handleRemoveFriend = async (friend) => {
    if (!auth.currentUser) return;

    try {
      await updateDoc(doc(db, "users", auth.currentUser.displayName), {
        friends: arrayRemove(friend)
      });
      console.log('Friend removed:', friend);
      alert('Friend removed successfully!');
      handleCloseConfirmDialog();
    } catch (error) {
      console.error("Error removing friend:", error);
      alert('Failed to remove friend. Please try again later.');
      handleCloseConfirmDialog();
    }
  }
  
  

  return (
    <Box sx={{ display: 'flex', width: '100%', height: '100%' }}>
      {/* Current Friends List */}
      <Box sx={{
        position: 'fixed', top: 120, left: 50, width: 300, overflowY: 'auto',
        display: 'flex', flexDirection: 'column', alignItems: 'center'  // Added to center everything
      }}>
        <Typography variant="h6" sx={{ alignSelf: 'center', marginBottom: 2 }}>Current Friends</Typography>
        {friends.length > 0 ? (
          friends.map((friend, index) => (
            <Box key={index} sx={{ display: 'flex', width: '100%', paddingX: 1, alignItems: 'center' }}>
              <Typography sx={{ textAlign: 'center', marginRight: 2 }}>{friend}</Typography>
              <IconButton onClick={() => handleOpenConfirmDialog(friend)} color="primary">
                <DeleteIcon />
              </IconButton>
            </Box>
          ))
        ) : (
          <Typography color="textSecondary">No current friends</Typography>
        )}
      </Box>


      {/* Friend Requests and Search */}
      <Box sx={{ flexGrow: 3 }}>
        <Box sx={{ position: 'fixed', top: 100, right: 100 }}>
          <Badge badgeContent={invites.length} color="secondary">
            <IconButton color="primary" sx={{ fontSize: '2rem' }}>
              <NotificationsIcon fontSize="large" />
            </IconButton>
          </Badge>
          {invites.length === 0 && (
            <Typography color="textSecondary" sx={{ mt: 1 }}>
              No Friend Requests
            </Typography>
          )}
        <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
  {invites.map(inviteId => (
    <ListItem 
      key={inviteId}
      secondaryAction={
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Accept">
            <IconButton onClick={() => handleAcceptInvite(inviteId)} color="primary">
              <CheckIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Deny">
            <IconButton onClick={() => handleDeclineInvite(inviteId)} color="secondary">
              <CloseIcon />
            </IconButton>
          </Tooltip>
        </Box>
      }
      sx={{ paddingRight: 15 }} // Increase padding on the right side of the list item
    >
      <ListItemText primary={`Invite from: ${userDetails[inviteId] || inviteId}`} />
    </ListItem>
  ))}
</List>

        </Box>
        <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Autocomplete
            options={users}
            getOptionLabel={(option) => option || ""}
            style={{ width: 300, marginBottom: 20 }}
            onChange={(event, newValue) => setSelectedUser(newValue)}
            renderInput={(params) => <TextField {...params} label="Search for users" variant="outlined" />}
          />
          <Button onClick={handleAddFriend} color="primary" disabled={!selectedUser || isLoading}>
            Send Invite
          </Button>
          {isLoading && <CircularProgress />}
          {error && <Alert severity="error">{error}</Alert>}
        </Box>
      </Box>

{/* Confirm Delete Dialog */}
<Dialog
      open={openConfirmDialog}
      onClose={handleCloseConfirmDialog}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{"Confirm Delete"}</DialogTitle>
      <DialogContent>
        <Typography id="alert-dialog-description">
          Are you sure you want to delete {friendToDelete} from your friends list?
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseConfirmDialog} color="primary">
          Cancel
        </Button>
        <Button onClick={() => handleRemoveFriend(friendToDelete)} color="primary" autoFocus>
          Confirm
        </Button>
      </DialogActions>
    </Dialog>

    </Box>
  );
};

export default AddFriend;