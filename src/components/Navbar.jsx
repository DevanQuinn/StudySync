import {
	AppBar,
	Toolbar,
	Typography,
	Button,
	Menu,
	MenuItem,
	Link as RouterLink,
  } from '@mui/material';
  import { Link } from 'react-router-dom';
  import React, { useEffect, useState } from 'react';
  import Logo from './Logo';
  import { getAuth, onAuthStateChanged } from 'firebase/auth';
  
  const Navbar = () => {
	const [user, setUser] = useState();
	const [anchorEl, setAnchorEl] = useState(null);
	const [navbarColor, setNavbarColor] = useState('secondary');
  
	useEffect(() => {
	  const auth = getAuth();
	  onAuthStateChanged(auth, (authUser) => {
		setUser(authUser);
		// Set Navbar color based on user authentication status
		setNavbarColor(authUser ? 'primary' : 'secondary');
	  });
	}, []);
  
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
  
	const pages = [
	  { title: 'Study Room', path: '/studyroom' },
	  { title: 'Leaderboard', path: '/leaderboard' },
	  { title: 'Dashboard', path: '/dashboard' },
	  { title: 'Study Room', path: '/studyroom' },
	  { title: 'Timer', path: '/timer' },
	  { title: 'Pomodoro', path: '/pomodoro' },
	  { title: 'SpotifyPlaylists', path: '/SpotifyPlaylists' },
	  { title: 'Flash Cards', path: '/flashcards' },
	];
  
	return (
	  <AppBar position='fixed' color={navbarColor}>
		<Toolbar>
		  <Typography sx={{ mr: 3 }} color='textPrimary' component={'span'}>
			<RouterLink to='/'>
			  <Logo />
			</RouterLink>
		  </Typography>
		  {pages.map((page) => (
			<Typography sx={{ mr: 3 }} key={page.title}>
			  <RouterLink to={page.path}>{page.title}</RouterLink>
			</Typography>
		  ))}
		  <Typography variant='h6' component='div' sx={{ flexGrow: 1 }}></Typography>
		  <Button
			aria-controls='color-menu'
			aria-haspopup='true'
			onClick={handleMenuClick}
			color='inherit'
		  >
			Set Color
		  </Button>
		  <Menu
			id='color-menu'
			anchorEl={anchorEl}
			open={Boolean(anchorEl)}
			onClose={handleMenuClose}
		  >
			{colorOptions.map((option) => (
			  <MenuItem
				key={option.value}
				onClick={() => handleColorChange(option.value)}
			  >
				{option.label}
			  </MenuItem>
			))}
		  </Menu>
		  <Typography sx={{ mr: 2 }} color='textPrimary'>
			<RouterLink to='/signin'>{user ? user.displayName : 'Sign In'}</RouterLink>
		  </Typography>
		  <Typography sx={{ mr: 2 }} color='textPrimary'>
			<RouterLink to='/editprofile'>Edit Profile</RouterLink>
		  </Typography>
		</Toolbar>
	  </AppBar>
	);
  };
  
  export default Navbar;
  