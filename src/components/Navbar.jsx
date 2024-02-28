import { AppBar, Container, Toolbar, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import React from 'react';
import Logo from './Logo';

const Navbar = () => {
	const pages = [
		{ title: 'Study Room', path: '/studyroom' },
		{ title: 'Timer', path: '/timer' },
	];
	return (
		<AppBar position='fixed' color='secondary'>
			<Toolbar>
				<Typography sx={{ mr: 3 }} color='textPrimary'>
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
				<Typography color='textPrimary'>
				  <Link to='/signin'>Sign In</Link>
				</Typography>	
				<Typography color='textPrimary'>
    				<Link to='/editprofile'>Edit Profile</Link>
				</Typography>
				<Typography color='textPrimary'>
                    <Link to='/flashcard'>Flashcards</Link>
                </Typography>
			</Toolbar>
		</AppBar>
	);
};

export default Navbar;
