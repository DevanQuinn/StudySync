import React, { useState } from 'react';
import { Button, Checkbox, Container, CssBaseline, FormControlLabel, Grid, Link, TextField, Typography } from '@mui/material';
import useUser from '../hooks/useUser';
import {
	query,
	getFirestore,
	collection,
	getDocs,
	doc,
	addDoc,
	deleteDoc,
} from 'firebase/firestore';
import { app } from '../firebase';

const EditProfile = () => {
    const user = useUser(true);
    const db = getFirestore(app);
    const col = user
		? collection(db, `profile-data/${user?.uid}/data`)
		: null;

    const [studyGoals, setStudyGoals] = useState('');
    const [selectedFavorites, setSelectedFavorites] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [isPublicProfile, setIsPublicProfile] = useState(true); // State for public profile toggle
    const favoritesOptions = ['Leaderboard', 'Study Room', 'Timer', 'Pomodoro', 'SpotifyPlaylists', 'Flashcards'];

    // Load profile visibility setting from localStorage on component mount
    useEffect(() => {
        const storedVisibility = localStorage.getItem('isPublicProfile');
        if (storedVisibility !== null) {
            setIsPublicProfile(JSON.parse(storedVisibility));
        }
    }, []);

    // Save profile visibility setting to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('isPublicProfile', JSON.stringify(isPublicProfile));
    }, [isPublicProfile]);
    const uploadProfileData = async profile => {
		await addDoc(col, profile);
		//fetchProfileData();
	};

    const fetchProfileData = async () => {
		if (!col) return;
		const q = query(col);
		const snapshot = await getDocs(q);
        const data = snapshot.docs[0].data;
        console.log('fetched data',data);
	};

    const handleCheckboxChange = (event) => {
        const { value } = event.target;
        if (selectedFavorites.includes(value)) {
            setSelectedFavorites(selectedFavorites.filter((item) => item !== value));
        } else {
            setSelectedFavorites([...selectedFavorites, value]);
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);

        var newData = {
            favorites: selectedFavorites,
            studyGoals: data.get('studyGoals'),
            profilePicture: data.get('profilePicture'),
        }
        uploadProfileData(newData);
        console.log({
            favorites: selectedFavorites,
            studyGoals: data.get('studyGoals'),
            profilePicture: data.get('profilePicture'),
            isPublicProfile: isPublicProfile, // Include the value of isPublicProfile in the form data
        });
    };

    const handleChangePassword = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        console.log({
            newPassword: data.get('newPassword'),
            confirmNewPassword: data.get('confirmNewPassword'),
        });
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        setSelectedImage(file);
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
                        placeholder='Edit your study goals'
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
                    <label htmlFor="profilePicture">
                        <Button
                            variant="contained"
                            component="span"
                            fullWidth
                            color="primary"
                            sx={{ mt: 3 }}
                        >
                            Select Image
                        </Button>
                    </label>
                    {selectedImage && (
                        <Typography variant="body2" sx={{ mt: 1 }}>
                            {selectedImage.name}
                        </Typography>
                    )}
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
                    <Typography component="h6" variant="h6" sx={{ mt: 3, mb: 1, textAlign: 'left' }}>
                        Profile Visibility
                    </Typography>
                    {/* <FormControlLabel
                        control={<Switch checked={isPublicProfile} onChange={() => setIsPublicProfile(!isPublicProfile)} />}
                        label={isPublicProfile ? 'Public' : 'Private'}
                    /> */}
                    <FormControlLabel
                    control={<Switch checked={isPublicProfile} onChange={() => {
                        const newVisibility = !isPublicProfile;
                        console.log('New Profile Visibility:', newVisibility);
                        setIsPublicProfile(newVisibility);
                    }} />}
                    label={isPublicProfile ? 'Public' : 'Private'}
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
