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
import EditProfile from './routes/editprofile.jsx';
import Flashcards from './routes/flashcards.jsx';

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
				<Routes>
					<Route path='/' element={<App />} />
					<Route path='signin' element={<SignIn />} />
					<Route path='forgotpass' element={<ForgotPass />} />
					<Route path='signup' element={<SignUp />} />
					<Route path='editprofile' element={<EditProfile />} />
					<Route path='flashcards' element={<Flashcards />} />
				</Routes>
			</BrowserRouter>
		</ThemeProvider>
	</React.StrictMode>
);