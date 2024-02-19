import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import {
	BrowserRouter,
	Routes,
	Route,
} from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import './index.css';
import Navbar from './components/Navbar.jsx';
import SignIn from '../routes/signin.jsx';


const theme = createTheme({
	palette: {
		text: {
			primary: '#000000',
			secondary: '#FFFFFF',
		},
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
				</Routes>
			</BrowserRouter>
		</ThemeProvider>
	</React.StrictMode>
);
