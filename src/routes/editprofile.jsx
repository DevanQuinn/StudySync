import React, { useState, useEffect, useRef } from 'react';
import { Button, Checkbox, Container, CssBaseline, FormControlLabel, Grid, Link, Switch, TextField, Typography } from '@mui/material';
import useUser from '../hooks/useUser';
import {
    getFirestore,
    getDoc,
    doc,
    setDoc,
} from 'firebase/firestore';
import { getAuth, reauthenticateWithCredential, updatePassword, EmailAuthProvider } from 'firebase/auth';
import { getStorage, getBlob, ref, uploadBytes } from 'firebase/storage';
import app from '../firebase';
import { v4 as uuid } from 'uuid';

const EditProfile = () => {
    const auth = getAuth(app);
    const user = useUser(true);
    const db = getFirestore(app);
    const docRef = user ? doc(db, `profile-data`, user.uid) : null;

    const fetchProfileDataCalled = useRef(false);
    const storage = getStorage();
    const [userEmail, setUserEmail] = useState('');
    const [imageBlob, setImageBlob] = useState(null);
    const [profileData, setProfileData] = useState({ favorites: [], studyGoals: '', profilePicture: 'unset', profileVisibility: true });
    const [studyGoals, setStudyGoals] = useState('');
    const [selectedFavorites, setSelectedFavorites] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);
    const favoritesOptions = ['Leaderboard', 'Study Room', 'Timer', 'Pomodoro', 'SpotifyPlaylists', 'Flashcards'];
    //const [isPublicProfile, setIsPublicProfile] = useState(true); // State for public profile toggle
    const [profileVisibility, setProfileVisibility] = useState(true); // State for profile visibility


// useEffect(() => {
//     const storedVisibility = localStorage.getItem('profileVisibility');
//     console.log("storedVisibility setting to localStorage", storedVisibility);
//     if (storedVisibility !== null) {
//         try {
//             setIsPublicProfile(JSON.parse(storedVisibility));
//             console.log("in try", JSON.parse(storedVisibility));
//         } catch (error) {
//             // Handle error parsing JSON
//             console.error('Error parsing JSON:', error);
//         }
//     } else {
//         console.log("storedVisibility is null or undefined");
//     }
// }, []);

useEffect(() => {
    const storedVisibility = localStorage.getItem('profileVisibility');
    console.log("storedVisibility setting to localStorage", storedVisibility);
    if (storedVisibility !== null) {
        try {
            setProfileVisibility(JSON.parse(storedVisibility));
            console.log("in try", JSON.parse(storedVisibility));
        } catch (error) {
            // Handle error parsing JSON
            console.error('Error parsing JSON:', error);
        }
    } else {
        console.log("storedVisibility is null or undefined");
    }
}, []);


// Save profile visibility setting to localStorage whenever it changes
useEffect(() => {
    localStorage.setItem('profileVisibility', JSON.stringify(profileVisibility));
}, [profileVisibility]);

const fetchProfileData = async () => {
    if (docRef && !fetchProfileDataCalled.current) {
        fetchProfileDataCalled.current = true;
        console.log('docRef:', docRef);
        const docSnapshot = await getDoc(docRef);
        if (docSnapshot.exists()) {
            const docData = docSnapshot.data();
            setProfileData(docData);
            console.log('fetched data:', docData);
            if (docData.hasOwnProperty('profileVisibility')) {
                setProfileVisibility(docData.profileVisibility);
            } else {
                setProfileVisibility(true); // Assuming true if profileVisibility is missing
            }
        }
    }
};

useEffect(() => {
    fetchProfileData();
}, [docRef]);


    useEffect(() => {
        if (user) {
            setUserEmail(user.email);
        }
    }, [user]);


    useEffect(() => {
        setStudyGoals(profileData.studyGoals);
        setSelectedFavorites(profileData.favorites);

        const loadImageBlob = async () => {
            if (profileData.profilePicture && profileData.profilePicture != 'unset') {
                const storage = getStorage();
                const pathReference = ref(storage, profileData.profilePicture);
                try {
                    // getting the binary data from the StorageReference path
                    const blob = await getBlob(pathReference);
                    setImageBlob(blob);
                } catch (error) {
                    console.error('Error loading image blob:', error);
                }
            }
        };

        loadImageBlob();
    }, [profileData]);

    useEffect(() => {

    }, [imageBlob]);

    const uploadProfileData = async profile => {
        if (user) {
            const docRef = doc(db, `profile-data/`, `${user.uid}`);
            await setDoc(docRef, profile);
        }
    };

    const handleCheckboxChange = (event) => {
        const { value } = event.target;
        if (selectedFavorites.includes(value)) {
            setSelectedFavorites(selectedFavorites.filter((item) => item !== value));
        } else {
            setSelectedFavorites([...selectedFavorites, value]);
        }
    };

    const handleChangePassword = async (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);

        const oldPassword = data.get('oldPassword');
        const newPassword = data.get('newPassword');
        const confirmNewPassword = data.get('confirmNewPassword');

        if (newPassword !== confirmNewPassword) {
            alert('New passwords do not match!');
            return;
        }

        try {
            const user = auth.currentUser;

            // confirm the user's current password before allowing them to change
            const credential = EmailAuthProvider.credential(user.email, oldPassword);
            await reauthenticateWithCredential(user, credential);
            await updatePassword(user, newPassword);
            alert('Password updated successfully!');
        } catch (err) {
            alert(`Failed to update password.\n${err}`);
        }
        uploadPublicProfileData(newData);
        console.log({
            favorites: selectedFavorites,
            studyGoals: data.get('studyGoals'),
            profilePicture: data.get('profilePicture'),
            profileVisibility: profileVisibility, // Include the value of isPublicProfile in the form data
        });
    };

    const uploadImage = async imageToUpload => {
        const imageId = uuid();
        const storageRef = ref(storage, `profile-images/${imageId}`);
        await uploadBytes(storageRef, imageToUpload);

        return storageRef.fullPath;
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            setSelectedImage(file);
            setImageUrl(reader.result);
        };
        if (file) {
            reader.readAsDataURL(file);
        }
    };

    const handleStudyGoalsChange = (event) => {
        setStudyGoals(event.target.value);
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        var imagePath = 'unset';
        if (selectedImage != null) {
            imagePath = await uploadImage(selectedImage);
        } else {
            imagePath = profileData.profilePicture;
        }

        var newData = {
            favorites: selectedFavorites,
            studyGoals: studyGoals,
            profilePicture: imagePath,
            //Add profile visibility
            profileVisibility: profileVisibility // Add profileVisibility to newData
        }

        await uploadProfileData(newData);
        setProfileData(newData);

        alert('Profile updated successfully!');
    };

    return (
        <Container component="main" maxWidth="xs" sx={{ mt: 10 }}>
            <CssBaseline />
            <div
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Typography component="h1" variant="h5" sx={{ mt: 5 }}>
                    Edit Profile
                </Typography>
                <Typography component="h6" variant="h6" sx={{ mt: 3, textAlign: 'left' }}>
                    Change Password
                </Typography>
                <form onSubmit={handleChangePassword} noValidate sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        fullWidth
                        name='oldPassword'
                        label="Old Password"
                        type="password"
                        id="oldPassword"
                        placeholder='Old Password'
                    />
                    <TextField
                        margin="normal"
                        fullWidth
                        name='newPassword'
                        label="New Password"
                        type="password"
                        id="newPassword"
                        placeholder='New Password'
                    />
                    <TextField
                        margin="normal"
                        fullWidth
                        name='confirmNewPassword'
                        label="Confirm New Password"
                        type="password"
                        id="confirmNewPassword"
                        placeholder='Confirm New Password'
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Set new password
                    </Button>
                </form>
                <form onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                    <Typography component="h6" variant="h6" sx={{ mt: 3, textAlign: 'left' }}>
                        Set Study Goals
                    </Typography>
                    <TextField
                        margin="normal"
                        fullWidth
                        multiline
                        rows={4}
                        name='studyGoals'
                        label="Study Goals"
                        id="studyGoals"
                        placeholder={studyGoals ? '' : 'Edit your study goals'}
                        value={studyGoals}
                        onChange={handleStudyGoalsChange}
                    />
                    <Typography component="h6" variant="h6" sx={{ mt: 3, textAlign: 'left' }}>
                        Change Profile Picture
                    </Typography>
                    <input
                        accept="image/*"
                        style={{ display: 'none' }}
                        id="profilePicture"
                        type="file"
                        onChange={handleImageChange}
                    />

                    <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center' }}>
                        <label htmlFor="profilePicture">
                            <Button
                                variant="contained"
                                component="span"
                                fullWidth
                                color="primary"
                                sx={{ width: '100%' }}
                            >
                                Select Image
                            </Button>
                        </label>
                        <div style={{ flex: '1', marginLeft: '1rem', display: 'flex', width: '200px', height: '200px', border: '1px solid black', justifyContent: 'center', alignItems: 'center' }}>
                            {imageUrl && (
                                <img src={imageUrl} alt="Uploaded" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', justifyContent: 'center', alignItems: 'center' }} />
                            )}
                            {!imageUrl && imageBlob && (
                                <img src={URL.createObjectURL(imageBlob)} alt="Uploaded" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', justifyContent: 'center', alignItems: 'center' }} />
                            )}
                        </div>
                    </div>

                    <Typography component="h6" variant="h6" sx={{ mt: 3, mb: 1, textAlign: 'left' }}>
                        Edit Favorites
                    </Typography>
                    <Grid container spacing={1}>
                        {favoritesOptions.map((option, index) => (
                            <Grid item xs={6} key={index} style={{ display: 'flex', alignItems: 'flex-start' }}>
                                <FormControlLabel
                                    key={index}
                                    control={
                                        <Checkbox
                                            value={option}
                                            onChange={handleCheckboxChange}
                                            checked={selectedFavorites.includes(option)}
                                        />
                                    }
                                    label={option}
                                />
                            </Grid>
                        ))}
                    </Grid>
                    {/* <Typography component="h6" variant="h6" sx={{ mt: 3, mb: 1, textAlign: 'left' }}>
                        Profile Visibility
                    </Typography> */}
                    <Typography component="h6" variant="h6" sx={{ mt: 3, mb: 1, textAlign: 'left' }}>
                        Profile Visibility
                    </Typography>
                    <FormControlLabel
                        control={<Switch checked={profileVisibility} onChange={() => setProfileVisibility(!profileVisibility)} />}
                        label={profileVisibility ? 'Public' : 'Private'}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Save Changes
                    </Button>
                </form>
                <Grid container>
                    <Grid item xs>
                        <Link href="/" variant="body2" paddingBottom="10pt">
                            Go Back
                        </Link>
                    </Grid>
                </Grid>
            </div>
        </Container>
    );
};

export default EditProfile;