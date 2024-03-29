import { AppBar, Avatar, Button, Container, Toolbar, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import Logo from './Logo';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { deleteDoc, doc, getDoc, getFirestore, updateDoc } from 'firebase/firestore';
import app from '../firebase';
import {
	getDownloadURL,
	getStorage,
	ref,
} from 'firebase/storage';
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
				{ title: 'Leaderboard', path: '/leaderboard'},
				{ title: 'Dashboard', path: '/dashboard'},
				{ title: 'Study Room', path: '/studyroom' },
        		{ title: 'Pomodoro', path: '/pomodoro'},
        {title: 'SpotifyPlaylists', path: '/SpotifyPlaylists'},
        { title: 'Flash Cards', path: '/flashcards' },
		{ title: 'Chat Bot', path: '/chatbot' },
        { title: 'AddFriend', path: '/AddFriend' }
	];
	const [image, setImage] = useState();
	const db = getFirestore(app);
	const storage = getStorage(app);
	const fetchImage = async () => {
		if ( !user ) {
			const pathReference = ref(storage, 'profile-pictures/');
			const url = await getDownloadURL(pathReference);
			setImage(url);
		} 
		else {
		  const docRef = doc(db, "users", user.displayName);
		  const q = await getDoc(docRef);
		  const data = q.data();
		  const pathReference = ref(storage, `profile-pictures/${data.pfpID}`);
		  const url = await getDownloadURL(pathReference);
		  setImage(url);
		}
	};
	useEffect(() => {
		fetchImage();
	}, [user]);
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
				<Avatar
					src={user ? (image) : (null)}
					sx={{mr : 2}}
				/>
				<Typography sx={{ mr: 2 }} color='textPrimary'>
					{user ? (
						<Link to={'/posts'}>{user.displayName}</Link>
					) : (
						<Link to={'/signin'}>Sign In</Link>
					)}
				</Typography>
				<Typography sx={{ mr: 2 }} color='textPrimary'>
					<Link to='/editprofile'>Edit Profile</Link>
				</Typography>
				<Button onClick={ () => signOut(getAuth())} href="/signin">
					Sign out
				</Button>	
			</Toolbar>
		</AppBar>
	);
};

export default Navbar;
