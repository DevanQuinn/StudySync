import { AppBar, Container, Toolbar, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import React from 'react';
import Logo from './Logo';
import useUser from '../hooks/useUser';

/*
TODO LIST:
	* navbar should have a profile button with a drop down menu
		- profile button should display pfp where applicable
		- drop down should have links to profile page, or if not logged in, sign in page
*/
const Navbar = () => {
	const user = useUser();

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
		<AppBar position='fixed' color='secondary'>
			<Toolbar>
				<Typography sx={{ mr: 3 }} color='textPrimary' component={'span'}>
					<Link to='/'>
						<Logo />
					</Link>
				</Typography>
				{pages.map(page => (
					<Typography sx={{ mr: 3 }} key={page.title}>
						<Link to={page.path}>{page.title}</Link>
					</Typography>
				))}
				<Typography
					variant='h6'
					component='div'
					sx={{ flexGrow: 1 }}
				></Typography>
				<Typography sx={{ mr: 2 }} color='textPrimary'>
					<Link to='/signin'>{user ? user.displayName : 'Sign In'}</Link>
				</Typography>
				<Typography sx={{ mr: 2 }} color='textPrimary'>
					<Link to='/editprofile'>Edit Profile</Link>
				</Typography>
			</Toolbar>
		</AppBar>
	);
};

export default Navbar;
