// Navbar.jsx

import {
	AppBar,
	Avatar,
	Button,
	Container,
	Toolbar,
	Typography,
} from '@mui/material';
import { Link } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import Logo from './Logo';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import IconButton from '@mui/material/IconButton';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import {
	deleteDoc,
	doc,
	getDoc,
	getFirestore,
	updateDoc,
} from 'firebase/firestore';
import { Fab, Box, Slide } from '@mui/material';
import app from '../firebase';
import ChatBot from './ChatBot'; // Import the ChatBot component
import { getDownloadURL, getStorage, ref } from 'firebase/storage';
import useUser from '../hooks/useUser';

const Navbar = () => {
	const user = useUser();

	const pages = [
		{ title: 'Leaderboard', path: '/leaderboard' },
		// { title: 'Tasklists', path: '/tasklists'},
		{ title: 'Study Room', path: '/studyroom' },
		{ title: 'Flash Cards', path: '/flashcards' },
		{ title: 'AddFriend', path: '/AddFriend' },
	];
	const [image, setImage] = useState();
	const db = getFirestore(app);
	const storage = getStorage(app);
	const [showBot, setShowBot] = useState(false);
	const toggleBot = () => setShowBot(!showBot);
	const fetchImage = async () => {
		if (!user) {
			const pathReference = ref(storage, 'profile-pictures/');
			const url = await getDownloadURL(pathReference);
			setImage(url);
		} else {
			const docRef = doc(db, 'users', user.displayName);
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
		<div>
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
					<Typography sx={{ mr: 7 }} color='textPrimary'>
						{user ? (
							<Link to={`/${user.displayName}/profile`}>Profile</Link>
						) : (
							<Link to={'/signin'}>Sign In</Link>
						)}
					</Typography>
					<Typography
						variant='h6'
						component='div'
						sx={{ flexGrow: 1 }}
					></Typography>
					<IconButton sx={{ flexGrow: 0.1 }} onClick={toggleBot}>
						<SmartToyIcon />
					</IconButton>
					<Avatar src={user ? image : null} sx={{ mr: 2 }} />
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
					<Button onClick={() => signOut(getAuth())} href='/signin'>
						Sign out
					</Button>
				</Toolbar>
			</AppBar>
			<Slide direction='down' in={showBot} mountOnEnter unmountOnExit>
				<Box sx={{ position: 'fixed', top: 75, right: 100, zIndex: 1100 }}>
					<ChatBot />
				</Box>
			</Slide>
		</div>
	);
};

export default Navbar;
