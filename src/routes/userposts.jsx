import {
	Box,
	CircularProgress,
	Container,
	CssBaseline,
	Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Post from '../components/Post';
import {
	collection,
	getDocs,
	getFirestore,
	orderBy,
	query,
	where,
} from 'firebase/firestore';
import app from '../firebase';

const UserPosts = () => {
	const [posts, setPosts] = useState([]);
	const [loading, setLoading] = useState(true);
	const { username } = useParams();

	const fetchPosts = async () => {
		const db = getFirestore(app);
		const col = collection(db, 'posts');
		const q = query(
			col,
			where('user', '==', username.toLowerCase()),
			orderBy('created', 'desc')
		);
		const docs = await getDocs(q);
		const newPosts = [];
		docs.forEach(doc => {
			const data = doc.data();
			data.id = doc.id;
			newPosts.push(data);
		});
		setPosts(newPosts);
		setLoading(false);
	};

	useEffect(() => {
		fetchPosts();
	}, [username]);

	if (loading)
		return (
			<Box>
				<CssBaseline />
				<Typography variant='h4' sx={{ mb: 5 }}>
					Fetching posts...
				</Typography>
				<CircularProgress />
			</Box>
		);

	if (!posts?.length)
		return (
			<Box>
				<CssBaseline />
				<Typography variant='h4' sx={{ mb: 5 }}>
					No posts by that user found.
				</Typography>
			</Box>
		);

	return (
		<Container component='main' maxWidth='lg' sx={{ mt: 10 }}>
			<CssBaseline />
			<Typography variant='h4'>{`${username}'s Posts`}</Typography>
			<Box>
				{posts.map(post => (
					<Post data={post} key={post.created} />
				))}
			</Box>
		</Container>
	);
};

export default UserPosts;
