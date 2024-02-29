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
import Pomodoro from './routes/pomodoro.jsx';
import Firebase from './firebase.js'
import EditProfile from './routes/editprofile.jsx'
import Flashcards from './routes/flashcards.jsx'

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
				<App />
				<Routes>
					<Route path='signin' element={<SignIn />} />
					<Route path='forgotpass' element={<ForgotPass />} />
					<Route path='signup' element={<SignUp />} />
					<Route path='editprofile' element={<EditProfile />} />
					<Route path='flashcards' element={<Flashcards/>} />
				</Routes>
			</BrowserRouter>
		</ThemeProvider>
	</React.StrictMode>
);
