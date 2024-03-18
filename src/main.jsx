import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import './index.css';
import Navbar from './components/Navbar.jsx';
import Dashboard from './routes/dashboard.jsx'
import Leaderboard from './routes/leaderboard.jsx'
import SignIn from './routes/signin.jsx';
import SignUp from './routes/signup.jsx';
import ForgotPass from './routes/forgotpass.jsx';
import AddFriend from './routes/AddFriend.jsx'; // Import your AddFriend component here

import SpotifyPlaylists from './routes/SpotifyPlaylists.jsx';
import Callback from './routes/Callback.jsx';
import Pomodoro from './routes/pomodoro.jsx';
import Firebase from './firebase.js'
import EditProfile from './routes/editprofile.jsx'
import Flashcards from './routes/flashcards.jsx'
import StudyRoomUI from './routes/StudyRoomUI.jsx';
import RoomDetailsPage from './routes/RoomDetailsPage.jsx';

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
        <ThemeProvider theme={theme}>
            <BrowserRouter>
                <Routes>
                    <Route path='/' element={<><Navbar /><App /></>} />
                    <Route path="dashboard" element={<><Navbar /><Dashboard /></>} />
                    <Route path="leaderboard" element={<><Navbar /><Leaderboard /></>} />
                    <Route path='signin' element={<><Navbar /><SignIn /></>} />
                    <Route path='forgotpass' element={<><Navbar /><ForgotPass /></>} />
                    <Route path='signup' element={<><Navbar /><SignUp /></>} />
                    <Route path='editprofile' element={<><Navbar /><EditProfile /></>} />
                    <Route path='flashcards' element={<><Navbar /><Flashcards/></>} />
                    <Route path='pomodoro' element={<><Navbar /><Pomodoro/></>} />
                    <Route path='SpotifyPlaylists' element={<><Navbar /><SpotifyPlaylists /></>} />
                    <Route path='Callback' element={<><Navbar /><Callback /></>} />
                    <Route path='studyroom/*' element={<><Navbar /><StudyRoomUI /></>} />
                    <Route path="/room/:roomId" element={<RoomDetailsPage />} /> {/* No Navbar for /room */}
                    <Route path='/AddFriend' element={<><Navbar /><AddFriend /></>} /> {/* New route for AddFriend */}
                </Routes>
            </BrowserRouter>
        </ThemeProvider>
    </React.StrictMode>

);
