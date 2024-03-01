import { AppBar, Container, Toolbar, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import Logo from './Logo';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const Navbar = () => {
<<<<<<< Updated upstream
	const pages = [{ title: 'Study Room', path: '/studyroom' }, {title: 'Pomodoro', path: '/pomodoro'}];
=======
	const [user, setUser] = useState();
	const pages = [
		{ title: 'Dashboard', path: '/dashboard' },
		{ title: 'Study Room', path: '/studyroom' },
		{ title: 'Leaderboard', path: '/leaderboard' },
		{ title: 'Pomodoro', path: '/pomodoro' },
		{ title: 'Flash Cards', path: '/flashcards' },
	];

	useEffect(() => {
		const auth = getAuth();
		onAuthStateChanged(auth, user => {
			console.log(user);
			setUser(user);
		});
	}, []);

>>>>>>> Stashed changes
	return (
		<AppBar position='fixed' color='secondary'>
			<Toolbar>
				<Typography sx={{ mr: 3 }} color='textPrimary' component={'span'}>
					<Link to='/'>
						<Logo />
					</Link>
				</Typography>
				{pages.map(page => (
<<<<<<< Updated upstream
					<Typography sx={{ mr: 3}}>
						<Link to={page.path} key={page.title}>
							{page.title}
						</Link>
=======
					<Typography sx={{ mr: 3 }} key={page.title}>
						<Link to={page.path}>{page.title}</Link>
>>>>>>> Stashed changes
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
