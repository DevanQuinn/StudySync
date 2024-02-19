import { AppBar, Container, Toolbar, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import React from 'react';

const Navbar = () => {
	const pages = [{ title: 'Study Room', path: '/studyroom' }, 
				{ title: 'Leaderboard', path: '/leaderboard'},
				{title: 'Dashboard', path: '/dashboard'}];
	return (
		<AppBar position='fixed' color='secondary'>
			<Toolbar>
				<Typography sx={{ mr: 5 }} color='textPrimary'>
					<Link to='/'>StudySync</Link>
				</Typography>

				{pages.map(page => (
					<Typography>
						<Link to={page.path} key={page.title}>
							&nbsp; &nbsp; {page.title} &nbsp; &nbsp;    
						</Link>
					</Typography>
				))}
			</Toolbar>
		</AppBar>
	);
};

export default Navbar;
