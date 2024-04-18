import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom'; // Import BrowserRouter and Routes
import { ThemeProvider, createTheme } from '@mui/material';
import './index.css';
import App from './App';
import Navbar from './components/Navbar.jsx';
import Dashboard from './routes/dashboard.jsx';
import Leaderboard from './routes/leaderboard.jsx';
import SignIn from './routes/signin.jsx';
import SignUp from './routes/signup.jsx';
import ForgotPass from './routes/forgotpass.jsx';
import AddFriend from './routes/AddFriend.jsx'; // Import your AddFriend component here
import SpotifyPlaylists from './routes/SpotifyPlaylists.jsx';
import Callback from './routes/Callback.jsx';
import Pomodoro from './routes/pomodoro.jsx';
import Firebase from './firebase.js';
import EditProfile from './routes/editprofile.jsx';
import Flashcards from './routes/flashcards.jsx';
import ProfilePage from './routes/profilepage.jsx';
import StudyRoomUI from './routes/StudyRoomUI.jsx';
import RoomDetailsPage from './routes/RoomDetailsPage.jsx';
import Posts from './routes/posts.jsx';
import UserPosts from './routes/userposts.jsx';
import Note from './routes/note.jsx';
import ButtonWrapper from './routes/ButtonWrapper'; // Import ButtonWrapper component

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
        <Navbar />
        <Routes> {/* Wrap Routes inside BrowserRouter */}
          <Route path="/" element={<App />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/forgotpass" element={<ForgotPass />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/editprofile" element={<EditProfile />} />
          <Route path="/flashcards" element={<Flashcards />} />
          <Route path="/pomodoro" element={<Pomodoro />} />
          <Route path="/SpotifyPlaylists" element={<SpotifyPlaylists />} />
          <Route path="/Callback" element={<Callback />} />
          <Route path="/studyroom/*" element={<StudyRoomUI />} />
          <Route path="/posts" element={<Posts />} />
          <Route path="/:username/posts" element={<UserPosts />} />
          <Route path="/profilepage" element={<ProfilePage />} />
          <Route path="/note/:id" element={<Note />} />
          <Route path="/room/:roomId" element={<RoomDetailsPage />} />
          <Route path="/AddFriend" element={<AddFriend />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);
