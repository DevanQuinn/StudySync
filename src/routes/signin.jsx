import * as React from 'react';
import { useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
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

export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const handleSubmit = event => {
      event.preventDefault();
      const data = new FormData(event.currentTarget);
      const email = data.get('email');
      const password = data.get('password');
      signInWithEmailAndPassword(getAuth(), email, password)
          .then(userCredential => {
              // Signed in
              const user = userCredential.user;
              console.log(user);
          })
          .catch(error => {
              const errorCode = error.code;
              const errorMessage = error.message;
              alert(error.message);
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
            Sign in
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              name='email'
              id="email"
              label="Email Address"
              autoComplete="email"
              placeholder='Email Address'
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name='password'
              label="Password"
              type={showPassword ? 'text' : 'password'}
              id="password"
              placeholder='Password'
              autoComplete="current-password"
              color='primary'
            />
            <FormControlLabel
              control={<Checkbox value="remember" sx={{
                color: grey[900],
                '&Mui.checked': {
                  color: grey[900],
                },
              }} />}
              label="Remember me"
              variant="filled"
            />
            <FormControlLabel
              control={<Checkbox value="showPass" sx={{
                color: grey[900],
                '&Mui.checked': {
                  color: grey[900],
                },
              }} />}
              label="Show Password"
              onChange={() =>
                setShowPassword((prev) => !prev)
            }
              variant="filled"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="forgotpass" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="signup" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
  );
}
