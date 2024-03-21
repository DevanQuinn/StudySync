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
	CircularProgress,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
	collection,
	getDocs,
	getFirestore,
	orderBy,
	query,
	where,
} from 'firebase/firestore';
import app from '../firebase';
import useUser from '../hooks/useUser';
import Post from '../components/Post';
import TagSearch from '../components/TagSearch';

const Posts = () => {
	const [posts, setPosts] = useState([]);
	const user = useUser();
	const [loading, setLoading] = useState(true);
	const db = getFirestore(app);

	const fetchPosts = async () => {
		if (!user) return;
		const col = collection(db, 'posts');
		const q = query(
			col,
			where('user', '==', user.displayName.toLowerCase()),
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
	}, [user]);

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

	return (
		<Container component='main' maxWidth='lg' sx={{ mt: 10 }}>
			<CssBaseline />
			<Typography variant='h4' sx={{ mb: 5 }}>
				Posts
			</Typography>
			<TagSearch />
			<Accordion sx={{ mt: 3 }}>
				<AccordionSummary expandIcon={<ExpandMoreIcon />}>
					<Typography variant='h6'>Make a new post</Typography>
				</AccordionSummary>
				<AccordionDetails>
					<CreatePost fetchPosts={fetchPosts} />
				</AccordionDetails>
			</Accordion>
			<Accordion sx={{ mt: 3 }}>
				<AccordionSummary expandIcon={<ExpandMoreIcon />}>
					<Typography variant='h6'>{`Your posts (${posts.length})`}</Typography>
				</AccordionSummary>
				<AccordionDetails>
					{posts && (
						<Box>
							{posts.map(post => (
								<Post
									data={post}
									editable
									key={post.created}
									fetchPosts={fetchPosts}
								/>
							))}
						</Box>
					)}
				</AccordionDetails>
			</Accordion>
		</Container>
	);
};

export default Posts;
