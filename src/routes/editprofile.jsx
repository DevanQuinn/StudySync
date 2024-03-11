import React, { useState } from 'react';
import { Button, Checkbox, Container, CssBaseline, FormControlLabel, Grid, Link, TextField, Typography } from '@mui/material';

const EditProfile = () => {
    const [selectedFavorites, setSelectedFavorites] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const favoritesOptions = ['Leaderboard', 'Study Room', 'Timer', 'Pomodoro', 'SpotifyPlaylists', 'Flashcards'];

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
        console.log({
            favorites: selectedFavorites,
            studyGoals: data.get('studyGoals'),
            profilePicture: data.get('profilePicture'),
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
                <Typography component="h1" variant="h5" >
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
                <Typography component="h1" variant="h5" sx={{ mt: 5 }}>
                    Edit Profile
                </Typography>
                <form onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        fullWidth
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
