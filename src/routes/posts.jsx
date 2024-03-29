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
import moment from 'moment';

const Posts = () => {
	const [posts, setPosts] = useState([]);
	const user = useUser();
	const [loading, setLoading] = useState(true);
	const [totalTimeStudied, setTotalTimeStudied] = useState([]);
	const [totalFlashcardsStudied, setTotalFlashcardsStudied] = useState([]);
	const [avgTimeStudied, setAvgTimeStudied] = useState([]);
	const db = getFirestore(app);

	const userStatsCol = user
		? collection(db, `userStats/${user?.uid}/studyStats`)
		: null;

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

	const fetchUserStats = async () => {
		if (!userStatsCol) return;

		const snapshot = await getDocs(userStatsCol);
		var totalCards = 0;
		var totalTime = 0;

		snapshot.forEach(userStat => {
			const data = userStat.data();
			totalCards += data.numCardsStudied;
			totalTime += data.durationMs;
		});

		if (totalCards == 0) {
			totalCards = 1;
		}
		var averageTimePerCard = totalTime / totalCards;
		const totalDuration = moment.duration(totalTime);
		const totalDurationFormat = moment.utc(totalDuration.as('milliseconds')).format('HH[h] mm[m] ss[s]');
		const avgDuration = moment.duration(averageTimePerCard);
		const avgDurationFormat = moment.utc(avgDuration.as('milliseconds')).format('HH[h] mm[m] ss[s]');

		setTotalTimeStudied(totalDurationFormat);
		setTotalFlashcardsStudied(totalCards);
		setAvgTimeStudied(avgDurationFormat);

		console.log('numCardsStudied:', totalCards);
	};

	useEffect(() => {
		fetchPosts();
		fetchUserStats();
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
			<Typography variant='h4' sx={{ mb: 2 }}>
				User's Study Statistics
			</Typography>

			<TableContainer component={Paper} sx={{ mb: 5, maxWidth: 400, marginLeft: 'auto', marginRight: 'auto', mt: 2, borderTop: '1px solid lightgrey' }}>
				<Table sx={{ maxWidth: 400 }}>
					<TableHead>
						<TableRow>
							<TableCell sx={{ fontWeight: 'bold', textAlign: 'center', borderBottom: '2px solid lightgrey', borderRight: '1px solid lightgrey' }}>Statistic</TableCell>
							<TableCell sx={{ fontWeight: 'bold', textAlign: 'center', borderBottom: '2px solid lightgrey' }}>Value</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						<TableRow>
							<TableCell sx={{ borderBottom: '1px solid lightgrey', borderRight: '1px solid lightgrey' }}>Total flashcards studied</TableCell>
							<TableCell sx={{ borderBottom: '1px solid lightgrey' }}>{totalFlashcardsStudied} flashcards</TableCell>
						</TableRow>
						<TableRow>
							<TableCell sx={{ borderBottom: '1px solid lightgrey', borderRight: '1px solid lightgrey' }}>Total time studied</TableCell>
							<TableCell sx={{ borderBottom: '1px solid lightgrey' }}>{totalTimeStudied}</TableCell>
						</TableRow>
						<TableRow>
							<TableCell sx={{ borderBottom: '1px solid lightgrey', borderRight: '1px solid lightgrey' }}>Average time spent per card</TableCell>
							<TableCell sx={{ borderBottom: '1px solid lightgrey' }}>{avgTimeStudied}</TableCell>
						</TableRow>
					</TableBody>
				</Table>
			</TableContainer>


			<Typography variant='h4' sx={{ mb: 2 }}>
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
