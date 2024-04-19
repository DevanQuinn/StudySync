import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import './index.css';
import App from './App';
import Navbar from './components/Navbar.jsx';
import Tasklists from './routes/tasklistPage.jsx';
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
//import Chatbot from './components/ChatBot.jsx';
import MusicChatBot from './components/MusicChatBot';


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
	// <React.StrictMode>
	<ThemeProvider theme={theme}>
		<BrowserRouter>
		<MusicChatBot />
			<Routes>
				<Route
					path='/'
					element={
						<>
							<Navbar />
							<App />
						</>
					}
				/>
				<Route
					path='tasklists'
					element={
						<>
							<Navbar />
							<Tasklists />
						</>
					}
				/>
				<Route
					path='leaderboard'
					element={
						<>
							<Navbar />
							<Leaderboard />
						</>
					}
				/>
				<Route
					path='signin'
					element={
						<>
							<Navbar />
							<SignIn />
						</>
					}
				/>
				<Route
					path='forgotpass'
					element={
						<>
							<Navbar />
							<ForgotPass />
						</>
					}
				/>
				<Route
					path='signup'
					element={
						<>
							<Navbar />
							<SignUp />
						</>
					}
				/>
				<Route
					path='editprofile'
					element={
						<>
							<Navbar />
							<EditProfile />
						</>
					}
				/>
				<Route
					path='flashcards'
					element={
						<>
							<Navbar />
							<Flashcards />
						</>
					}
				/>
				<Route
					path='pomodoro'
					element={
						<>
							<Navbar />
							<Pomodoro />
						</>
					}
				/>
				<Route
					path='SpotifyPlaylists'
					element={
						<>
							<Navbar />
							<SpotifyPlaylists />
						</>
					}
				/>
				<Route
					path='Callback'
					element={
						<>
							<Navbar />
							<Callback />
						</>
					}
				/>
				<Route
					path='studyroom/*'
					element={
						<>
							<Navbar />
							<StudyRoomUI />
						</>
					}
				/>
				<Route
					path='posts'
					element={
						<>
							<Navbar />
							<Posts />
						</>
					}
				/>
				<Route
					path=':username/posts'
					element={
						<>
							<Navbar />
							<UserPosts />
						</>
					}
				/>
				<Route
					path=':username/profile'
					element={
						<>
							<Navbar />
							<ProfilePage />
						</>
					}
				/>
				<Route
					path='/note/:id'
					element={
						<>
							<Navbar /> <Note />{' '}
						</>
					}
				/>
				<Route path='/room/:roomId' element={<RoomDetailsPage />} />{' '}
				{/* No Navbar for /room */}
				<Route
					path='/AddFriend'
					element={
						<>
							<Navbar />
							<AddFriend />
						</>
					}
				/>{' '}
				{/* New route for AddFriend */}
				<Route
					path='/AddFriend'
					element={
						<>
							<Navbar />
							<AddFriend />
						</>
					}
				/>{' '}
				{/* New route for AddFriend */}
			</Routes>
			<MusicChatBot />
		</BrowserRouter>
	</ThemeProvider>
	// </React.StrictMode>
);
