import { AppBar, Container, Toolbar, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import React from 'react';
import Logo from './Logo';

const Navbar = () => {
	const pages = [{ title: 'Study Room', path: '/studyroom' }, {title: 'Pomodoro', path: '/pomodoro'}];
	return (
		<AppBar position='fixed' color='secondary'>
			<Toolbar>
				<Typography sx={{ mr: 3 }} color='textPrimary'>
					<Link to='/'>
						<Logo />
					</Link>
				</Typography>
				{pages.map(page => (
					<Typography sx={{ mr: 3}}>
						<Link to={page.path} key={page.title}>
							{page.title}
						</Link>
					</Typography>
				))}
				<Typography
					variant='h6'
					component='div'
					sx={{ flexGrow: 1 }}
				></Typography>
				<Typography sx={{ mr: 2 }} color='textPrimary'>
					<Link to='/signin'>Sign In</Link>
				</Typography>
				<Typography sx={{ mr: 2 }} color='textPrimary'>
					<Link to='/editprofile'>Edit Profile</Link>
				</Typography>
				<Typography color='textPrimary'>
					<Link to='/flashcards'>Flashcards</Link>
				</Typography>
			</Toolbar>
		</AppBar>
	);
};

export default Navbar;
