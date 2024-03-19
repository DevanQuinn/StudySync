import React, { useEffect, useState } from 'react';
import CreatePost from '../components/CreatePost';
import {
	Accordion,
	AccordionSummary,
	AccordionDetails,
	CssBaseline,
	Container,
	Typography,
	Box,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
	collection,
	getDocs,
	getFirestore,
	query,
	where,
} from 'firebase/firestore';
import app from '../firebase';
import useUser from '../hooks/useUser';
import Post from '../components/Post';

const Posts = () => {
	const [posts, setPosts] = useState([]);
	const user = useUser();

	const fetchPosts = async () => {
		if (!user) return;
		const db = getFirestore(app);
		const col = collection(db, 'posts');
		const q = query(col, where('user', '==', user.uid));
		const docs = await getDocs(q);
		const newPosts = [];
		docs.forEach(doc => newPosts.push(doc.data()));
		console.log(newPosts);
		setPosts(newPosts);
	};

	useEffect(() => {
		fetchPosts();
	}, [user]);

	return (
		<Container sx={{ mt: 10 }}>
			<CssBaseline />
			<Typography variant='h4'>Your Posts</Typography>
			<Accordion sx={{ mt: 3 }}>
				<AccordionSummary expandIcon={<ExpandMoreIcon />}>
					<Typography variant='h6'>Make a new post</Typography>
				</AccordionSummary>
				<AccordionDetails>
					<CreatePost fetchPosts={fetchPosts} />
				</AccordionDetails>
			</Accordion>
			{posts && (
				<Box>
					{posts.map(post => (
						<Post data={post} />
					))}
				</Box>
			)}
		</Container>
	);
};

export default Posts;
