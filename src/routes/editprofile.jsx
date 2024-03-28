import React from 'react';
import { Button, Container, CssBaseline, Grid, Link, TextField, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';

const EditProfile = () => {
    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
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
