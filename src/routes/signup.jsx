import * as React from 'react';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Copyright from '../components/Copyright.jsx';
import { grey } from '@mui/material/colors';
import { createTheme, ThemeProvider } from '@mui/material/styles';

export default function SignUp() {
  const handleSubmit = event => {
      event.preventDefault();
      const data = new FormData(event.currentTarget);
      const email = data.get('email');
      const password = data.get('password');
      createUserWithEmailAndPassword(getAuth(), email, password)
      createUserWithUserAndPassword()
          .then(userCredential => {
              // Signed in
              const user = userCredential.user;
              console.log(user);
              // ...
          })
          .catch(error => {
              const errorCode = error.code;
              const errorMessage = error.message;
              console.error({ errorCode, errorMessage });
          });
  };

  return (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography component="h1" variant="h5">
            Sign Up
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
              margin="normal"
              required
              fullWidth
              name='username'
              label="Username"
              type="username"
              id="username"
              placeholder='Username'
              autoComplete="current-username"
              color='primary'
              focused
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name='email'
              id="email"
              label="Email Address"
              autoComplete="email"
              placeholder='Email Address'
              focused
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name='password'
              label="Password"
              type="password"
              id="password"
              placeholder='Password'
              color='primary'
              focused
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Confirm Password"
              type="password"
              id="confirm-password"
              placeholder='Confirm Password'
              color='primary'
              focused
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="signin" variant="body2">
                  Go Back
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
  );
}
