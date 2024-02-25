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
          <Route path='signin' element={<><Navbar /><SignIn /></>} />
          <Route path='forgotpass' element={<><Navbar /><ForgotPass /></>} />
          <Route path='signup' element={<><Navbar /><SignUp /></>} />
          <Route path='studyroom/*' element={<><Navbar /><StudyRoomUI /></>} />
          <Route path='room/:name' element={<RoomDetailsPage />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);
