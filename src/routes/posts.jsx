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
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper } from '@mui/material';


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
		<Container component='main' maxWidth='lg' sx={{ mt: 14 }}>
			<CssBaseline />
			<Typography variant='h4' sx={{ mb: 5 }}>
				User's Study Statistics
			</Typography>

			<TableContainer component={Paper} sx={{ mb: 5, maxWidth: 400, marginLeft: 'auto', marginRight: 'auto', mt: 2, borderTop: '1px solid lightgrey' }}>
				<Table sx={{ maxWidth: 400 }}>
					<TableHead>
						<TableRow>
							<TableCell sx={{ fontWeight: 'bold', textAlign: 'center', borderBottom: '3px solid lightgrey', borderRight: '1px solid lightgrey' }}>Statistic</TableCell>
							<TableCell sx={{ fontWeight: 'bold', textAlign: 'center', borderBottom: '3px solid lightgrey' }}>Value</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						<TableRow>
							<TableCell sx={{ borderBottom: '1px solid lightgrey', borderRight: '1px solid lightgrey' }}>Total time studied</TableCell>
							<TableCell sx={{ borderBottom: '1px solid lightgrey' }}>10 hours</TableCell>
						</TableRow>
						<TableRow>
							<TableCell sx={{ borderBottom: '1px solid lightgrey', borderRight: '1px solid lightgrey' }}>Total flashcards studied</TableCell>
							<TableCell sx={{ borderBottom: '1px solid lightgrey' }}>50 cards</TableCell>
						</TableRow>
						<TableRow>
							<TableCell sx={{ borderBottom: '1px solid lightgrey', borderRight: '1px solid lightgrey' }}>Average time spent per card</TableCell>
							<TableCell sx={{ borderBottom: '1px solid lightgrey' }}>12 minutes</TableCell>
						</TableRow>
					</TableBody>
				</Table>
			</TableContainer>


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
