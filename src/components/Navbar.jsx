import { AppBar, Container, Toolbar, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import Logo from './Logo';

const Navbar = () => {
  const [navbarColor, setNavbarColor] = useState('secondary');

  const handleColorChange = (newColor) => {
    setNavbarColor(newColor);
  };

  const pages = [
    { title: 'Study Room', path: '/studyroom' },
    { title: 'Pomodoro', path: '/pomodoro' },
  ];

  return (
    <AppBar position='fixed' color={navbarColor}>
      <Toolbar>
        <Typography sx={{ mr: 3 }} color='textPrimary'>
          <Link to='/'>
            <Logo />
          </Link>
        </Typography>
        {pages.map((page) => (
          <Typography sx={{ mr: 3 }}>
            <Link to={page.path} key={page.title}>
              {page.title}
            </Link>
          </Typography>
        ))}
        <Typography variant='h6' component='div' sx={{ flexGrow: 1 }}></Typography>
        <Button onClick={() => handleColorChange('primary')} sx={{ mr: 2 }}>
          Set Color 1
        </Button>
        <Button onClick={() => handleColorChange('secondary')} sx={{ mr: 2 }}>
          Set Color 2
        </Button>
        <Button onClick={() => handleColorChange('error')} sx={{ mr: 2 }}>
          Set Color 3
        </Button>
        <Button onClick={() => handleColorChange('info')}>
          Set Color 4
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
