import * as React from 'react';
import { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword, updateProfile,} from 'firebase/auth';
import { doc, setDoc, getFirestore, getDoc} from "firebase/firestore"
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import app from '../firebase';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { v4 as uuid } from 'uuid';
import { getStorage, ref as storageRef, uploadBytes } from 'firebase/storage';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Copyright from '../components/Copyright.jsx';
import { grey } from '@mui/material/colors';

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [newImage, setNewImage] = React.useState(null);
  const [image, setImage] = useState();
  const storage = getStorage(app);
  const uploadImage = async imageUpload => {
		const imageId = uuid();
		const imageRef = storageRef(storage, `profile-pictures/${imageId}`);
		await uploadBytes(imageRef, imageUpload);
		return imageId;
	};
  const handleSubmit = async event => {
      event.preventDefault();
      const data = new FormData(event.currentTarget);
      const username = data.get('username');
      const email = data.get('email');
      const password = data.get('password');
      const db = getFirestore(app);
      const docRef = doc(db, "users", username);
      const docSnap = await getDoc(docRef);
      console.log(docSnap);
      if(password != data.get('confirm-password')){
        alert("Please make sure your passwords match.")
      }
      else if(docSnap.exists()) {
        alert("The username is currently in use, please input a different one")
      }
      else{
        createUserWithEmailAndPassword(getAuth(), email, password)
            .then(async userCredential => {
                // Signed in
                const user = userCredential.user;
                const imageID = image ? await uploadImage(image) : "default-avatar-icon-of-social-media-user-vector.jpg";
                if(image != null) {
                  updateProfile(getAuth().currentUser, {
                    displayName: username,
                  })
                }
                else {
                  updateProfile(getAuth().currentUser, {
                    displayName: username,
                  })
                }
                console.log(user);
                const db = getFirestore(app);
                const docData = {
                  username: username,
                  userID: user.uid,
                  pfpID: imageID,
                  lower: username.toLowerCase(),
                  favorites: [],
                  studyGoals: ""
                }
                await setDoc(doc(db, 'users', username), docData);
                alert("Success!")
                window.location = "/"
                // ...
            })
            .catch(error => {
                const errorMessage = error.message;
                alert(errorMessage);
            });
        }
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
              color='primary'
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirm-password"
              label="Confirm Password"
              type={showPassword ? 'text' : 'password'}
              id="confirm-password"
              placeholder='Confirm Password'
              color='primary'
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
            <br />
            <Typography>
              Profile Picture:
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}  
              />
            </Typography>
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
