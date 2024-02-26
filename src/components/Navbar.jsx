import { AppBar, Container, Toolbar, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import React from 'react';

/*
TODO LIST:
	* navbar should have a profile button with a drop down menu
		- profile button should display pfp where applicable
		- drop down should have links to profile page, or if not logged in, sign in page
*/
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
				<Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          		</Typography>
				<Typography color='textPrimary'>
				  <Link to='/signin'>Sign In</Link>
				</Typography>		
			</Toolbar>
		</AppBar>
	);
};

export default Navbar;
