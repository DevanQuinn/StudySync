import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import './index.css';
import Navbar from './components/Navbar.jsx';
import SignIn from './routes/signin.jsx';
import SignUp from './routes/signup.jsx';
import ForgotPass from './routes/forgotpass.jsx';
import FirebaseProvider from './components/FirebaseProvider.jsx';
import SpotifyPlaylists from './routes/SpotifyPlaylists.jsx';
import Callback from './routes/Callback.jsx';

const theme = createTheme({
  palette: {
    primary: {
      main: '#20c997',
    },
    secondary: {
      main: '#B0DCCD',
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <FirebaseProvider />
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path='/' element={<App />} />
          <Route path='signin' element={<SignIn />} />
          <Route path='forgotpass' element={<ForgotPass />} />
          <Route path='signup' element={<SignUp />} />
          {/* Add the route for SpotifyPlaylists */}
          <Route path='SpotifyPlaylists' element={<SpotifyPlaylists />} />
		  <Route path='Callback' element={<Callback />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);
