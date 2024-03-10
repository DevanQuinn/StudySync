import React from 'react';
import { Button, Container, CssBaseline, Grid, Link, TextField, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';

const EditProfile = () => {
    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        console.log({
            favorites: data.get('favorites'),
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
                        name='favorites'
                        label="Favorites"
                        id="favorites"
                        autoFocus
                        placeholder='Edit your favorites'
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
