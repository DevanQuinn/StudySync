import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Menu,
  MenuItem,
} from '@mui/material';
import { Link } from 'react-router-dom';
import Logo from './Logo';

/*
TODO LIST:
	* navbar should have a profile button with a drop down menu
		- profile button should display pfp where applicable
		- drop down should have links to profile page, or if not logged in, sign in page
*/
const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [navbarColor, setNavbarColor] = useState('secondary');

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleColorChange = (newColor) => {
    setNavbarColor(newColor);
    setAnchorEl(null);
  };

  const colorOptions = [
    { label: 'Color 1', value: 'primary' },
    { label: 'Color 2', value: 'secondary' },
    { label: 'Color 3', value: 'error' },
    { label: 'Color 4', value: 'info' },
  ];

  const renderColorMenuItems = () => {
    return colorOptions.map((color) => (
      <MenuItem key={color.value} onClick={() => handleColorChange(color.value)}>
        {color.label}
      </MenuItem>
    ));
  };

  return (
    <AppBar position='fixed' color={navbarColor}>
      <Toolbar>
        <Typography sx={{ mr: 3 }} color='textPrimary'>
          <Link to='/'>
            <Logo />
          </Link>
        </Typography>
        <Typography sx={{ ml: 'auto', mr: 2 }}>
          <Link to='/signin'>Sign In</Link>
        </Typography>
        <Button onClick={handleMenuClick} sx={{ mr: 2 }}>
          Set Color
        </Button>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          {renderColorMenuItems()}
        </Menu>
        <Typography sx={{ mr: 2 }} color='textPrimary'>
          <Link to='/editprofile'>Edit Profile</Link>
        </Typography>
        <Typography sx={{ mr: 2 }} color='textPrimary'>
          <Link to='/flashcards'>Flashcards</Link>
        </Typography>
      </Toolbar>
    </AppBar>
  );

};

export default Navbar;
