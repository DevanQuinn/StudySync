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
import app from '../firebase';

const EditProfile = () => {
    const user = useUser(true);
    const db = getFirestore(app);
    const col = user
		? collection(db, `profile-data/${user?.uid}/data`)
		: null;

    const [studyGoals, setStudyGoals] = useState('');
    const [selectedFavorites, setSelectedFavorites] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const favoritesOptions = ['Leaderboard', 'Study Room', 'Timer', 'Pomodoro', 'SpotifyPlaylists', 'Flashcards'];

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
            favorites: data.get('favorites'),
            newPassword: data.get('newPassword'),
            confirmNewPassword: data.get('confirmNewPassword'),
            studyGoals: data.get('studyGoals'),
            profilePicture: data.get('profilePicture'),
        });
    };

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Typography component="h1" variant="h5">
                    Edit Profile
                </Typography>
                <form onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        fullWidth
                        name='favorites'
                        label="Favorites"
                        id="favorites"
                        autoFocus
                        placeholder='Edit your favorites'
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
                    <TextField
                        margin="normal"
                        fullWidth
                        name='studyGoals'
                        label="Study Goals"
                        id="studyGoals"
                        placeholder='Edit your study goals'
                    />
                    <TextField
                        margin="normal"
                        fullWidth
                        name='profilePicture'
                        label="Profile Picture URL"
                        id="profilePicture"
                        placeholder='Enter URL for profile picture'
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
                        <Link href="/" variant="body2">
                            Go Back
                        </Link>
                    </Grid>
                </Grid>
            </div>
        </Container>
    );
};

export default EditProfile;
